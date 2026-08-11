import assert from "node:assert/strict";
import test from "node:test";

import {
  applyMediaBatchDefaults,
  blankStudioCase,
  generateOutputs,
  productCatalog,
  restoreStudioDraft,
  sampleStudioCase,
  selectProduct,
  switchVertical,
  validateCase,
} from "../lib/case-automation.ts";
import { serializeJsonLd } from "../lib/case-lab.ts";

function clone(value) {
  return structuredClone(value);
}

test("blank drafts cannot be reviewed or published", () => {
  const gate = validateCase(clone(blankStudioCase));
  assert.equal(gate.readyForReview, false);
  assert.equal(gate.publishable, false);
  assert.equal(gate.gates.content, false);
  assert.equal(gate.gates.evidence, false);
  assert.equal(gate.gates.technical, false);
});

test("the complete sample passes all four gates", () => {
  const gate = validateCase(clone(sampleStudioCase));
  assert.deepEqual(gate.gates, { content: true, evidence: true, technical: true, seo: true });
  assert.equal(gate.publishable, true);
});

test("media gate rejects missing roles and duplicate evidence", () => {
  const emptyMedia = { ...clone(sampleStudioCase), media: [] };
  assert.equal(validateCase(emptyMedia).gates.evidence, false);

  const duplicateMedia = clone(sampleStudioCase);
  duplicateMedia.media[1].url = duplicateMedia.media[0].url;
  const duplicateGate = validateCase(duplicateMedia);
  assert.equal(duplicateGate.gates.evidence, false);
  assert.ok(duplicateGate.errors.some((error) => error.includes("trùng một ảnh")));

  const forgedRequired = clone(sampleStudioCase);
  forgedRequired.media.find((asset) => asset.role === "hero").required = false;
  forgedRequired.media.find((asset) => asset.role === "hero").url = "";
  assert.equal(validateCase(forgedRequired).gates.evidence, false, "core roles are server-derived");
});

test("catalog and link-map values are server-derived, not accepted as free text", () => {
  const poisoned = {
    ...clone(sampleStudioCase),
    make: "Fake Motors",
    branch: "Chi nhánh giả",
    author: "Không tồn tại",
    reviewer: "Không tồn tại",
    hubUrl: "javascript:alert(1)",
    productUrl: "https://example.com/fake",
  };
  const gate = validateCase(poisoned);
  assert.equal(gate.gates.content, false);
  assert.equal(gate.gates.seo, false);
  assert.equal(gate.publishable, false);
});

test("switching vertical or product clears dependent evidence and approvals", () => {
  const film = switchVertical(clone(sampleStudioCase), "film");
  assert.equal(film.sourceConfirmed, false);
  assert.equal(film.sourceName, "");
  assert.equal(film.qc, "");
  assert.equal(film.productPrice, "");
  assert.equal(film.bracket, "");
  assert.equal(film.technicalApproved, false);
  assert.equal(film.workflowStatus, "draft");
  assert.equal(film.media.length, 8);
  assert.equal(film.media.filter((asset) => asset.required).length, 5);

  const changedProduct = selectProduct(clone(sampleStudioCase), "X-Light F10 Hyper 2.0");
  assert.equal(changedProduct.product, "X-Light F10 Hyper 2.0");
  assert.equal(changedProduct.sourceConfirmed, false);
  assert.equal(changedProduct.qc, "");
  assert.equal(changedProduct.priceStatus, "product_only");
  assert.equal(changedProduct.productPrice, "");
});

test("restored browser drafts never retain trusted workflow flags or foreign URLs", () => {
  const restored = restoreStudioDraft({
    ...clone(sampleStudioCase),
    workflowStatus: "published",
    technicalApproved: true,
    intentChecked: true,
    hubUrl: "javascript:alert(1)",
    productUrl: "https://example.com/fake",
  });
  assert.equal(restored.workflowStatus, "draft");
  assert.equal(restored.technicalApproved, false);
  assert.equal(restored.intentChecked, true, "intent readiness is re-derived from the product catalog");
  assert.equal(restored.hubUrl, "https://auto365.vn/nang-cap-anh-sang-bi-gam");
  assert.equal(restored.productUrl, "https://auto365.vn/den-bi-gam-x-light-f10-turbo-v2");
});

test("legacy canonical wins over a newly generated slug", () => {
  const output = generateOutputs(clone(sampleStudioCase));
  assert.equal(output.usedLegacyCanonical, true);
  assert.equal(output.slug, "toyota-camry-2014-25q-lap-bi-gam-x-light-f10-turbo-v2-gia-cau-hinh");
  assert.equal(output.canonical, "https://auto365.vn/toyota-camry-2014-25q-lap-bi-gam-x-light-f10-turbo-v2-gia-cau-hinh");
  assert.doesNotMatch(output.metaTitle, /cấu hình thực$/i);
});

test("shared category URLs do not collapse product entity identities", () => {
  const cameraIds = productCatalog.camera.map((product) => product.entityId);
  assert.equal(new Set(cameraIds).size, cameraIds.length);
  const cameraDraft = switchVertical(clone(sampleStudioCase), "camera");
  cameraDraft.product = productCatalog.camera[0].name;
  cameraDraft.productUrl = productCatalog.camera[0].url;
  assert.equal(validateCase(cameraDraft).gates.seo, false, "a hub URL cannot masquerade as a product owner URL");
});

test("batch media metadata fills repetitive fields but requires one explicit rights attestation", () => {
  const draft = clone(sampleStudioCase);
  draft.media.forEach((asset) => {
    asset.caption = "";
    asset.alt = "";
    asset.capturedAt = "";
    asset.rightsConfirmed = false;
  });
  const withoutRights = applyMediaBatchDefaults(draft, false);
  assert.ok(withoutRights.media.every((asset) => asset.caption && asset.alt && asset.capturedAt));
  assert.ok(withoutRights.media.every((asset) => !asset.rightsConfirmed));
  const withRights = applyMediaBatchDefaults(draft, true);
  assert.ok(withRights.media.every((asset) => asset.rightsConfirmed));
});

test("JSON-LD serialization cannot close the script element", () => {
  const serialized = serializeJsonLd({ claim: "</script><script>alert(1)</script>" });
  assert.doesNotMatch(serialized, /<\/script>/i);
  assert.match(serialized, /\\u003c\/script>/i);
});
