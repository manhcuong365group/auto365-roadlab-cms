import assert from "node:assert/strict";
import test from "node:test";

import { createCaseDraft, normalizeCaseDraft, templateKeyForContentType, assertCaseDraftWithinLimits } from "../lib/case-draft.ts";

test("maps each Case Lab content type to its own authoring template", () => {
  assert.equal(templateKeyForContentType("case"), "road_lab");
  assert.equal(templateKeyForContentType("proof"), "proof_lab");
  assert.equal(templateKeyForContentType("brand"), "brand_story");
  assert.equal(templateKeyForContentType("product"), "product_spotlight");
});

test("creates a complete draft with every workflow section, per content type", () => {
  const roadLab = createCaseDraft("case", { vehicleName: "Ford Ranger", productName: "Bi Laser X9" });
  assert.deepEqual(Object.keys(roadLab), ["templateKey", "publication", "vehicle", "configuration", "evidence", "seo", "review", "extended"]);
  assert.equal(roadLab.vehicle.vehicleName, "Ford Ranger");
  assert.deepEqual(roadLab.extended, {
    authorName: "", authorRole: "", reviewerName: "", reviewerRole: "", primarySource: "",
    timeline: "", known: "", unknown: "", qc: "", faqs: "",
    metrics: "", priceValue: "", priceNote: "", priceIncludes: "",
    beamCosUrl: "", beamCosCaption: "", beamPhaUrl: "", beamPhaCaption: "",
    followup: "", related: "",
  });

  const proofLab = createCaseDraft("proof", { productName: "Bi Laser X9" });
  assert.deepEqual(Object.keys(proofLab), ["templateKey", "publication", "verification", "findings", "evidence", "seo", "review", "extended"]);
  assert.equal(proofLab.verification.subjectRef, "Bi Laser X9");

  const brandStory = createCaseDraft("brand");
  assert.deepEqual(Object.keys(brandStory), ["templateKey", "publication", "positioning", "support", "evidence", "seo", "review", "extended"]);

  const productSpotlight = createCaseDraft("product", { productName: "Bi Laser X9" });
  assert.deepEqual(Object.keys(productSpotlight), ["templateKey", "publication", "productInfo", "comparison", "evidence", "seo", "review", "extended"]);
  assert.equal(productSpotlight.productInfo.productName, "Bi Laser X9");
});

test("normalizes each content type's own template shape and ignores foreign shapes", () => {
  const proofDraft = normalizeCaseDraft("proof", {
    templateKey: "proof_lab",
    publication: { title: "Nghiệm thu Bi Laser X9", summary: "", answerFirst: "", heroUrl: "" },
    verification: { subjectRef: "Bi Laser X9", testMethod: "Lux kế", standardRef: "", testedAt: "", verifiedBy: "" },
    findings: { beforeResult: "", afterResult: "", conclusion: "Đạt chuẩn", deviationNote: "" },
  });
  assert.equal(proofDraft.templateKey, "proof_lab");
  assert.equal(proofDraft.verification.testMethod, "Lux kế");
  assert.equal(proofDraft.findings.conclusion, "Đạt chuẩn");

  // A road_lab draft fed into the brand normalizer should not leak vehicle-only fields.
  const brandDraft = normalizeCaseDraft("brand", { templateKey: "road_lab", vehicle: { vehicleName: "Should not appear" } });
  assert.equal(brandDraft.templateKey, "brand_story");
  assert.equal(Object.prototype.hasOwnProperty.call(brandDraft, "vehicle"), false);
});

test("falls back legacy generic { title, summary, body } content into the publication step of any template", () => {
  const legacy = { title: "Bài cũ", summary: "Tóm tắt cũ", body: "Nội dung cũ" };
  for (const contentType of ["case", "proof", "brand", "product"]) {
    const draft = normalizeCaseDraft(contentType, legacy);
    assert.equal(draft.publication.title, "Bài cũ");
    assert.equal(draft.publication.summary, "Tóm tắt cũ");
    assert.equal(draft.publication.answerFirst, "Nội dung cũ");
  }
});

test("enforces the shared publication/evidence length limits across every template", () => {
  const valid = createCaseDraft("brand");
  valid.publication.title = "Định vị thương hiệu Auto365";
  assert.doesNotThrow(() => assertCaseDraftWithinLimits(valid));

  const tooShortTitle = createCaseDraft("product");
  tooShortTitle.publication.title = "ab";
  assert.throws(() => assertCaseDraftWithinLimits(tooShortTitle));

  const tooLongSummary = createCaseDraft("proof");
  tooLongSummary.publication.title = "Nghiệm thu hợp lệ";
  tooLongSummary.publication.summary = "a".repeat(601);
  assert.throws(() => assertCaseDraftWithinLimits(tooLongSummary));
});
