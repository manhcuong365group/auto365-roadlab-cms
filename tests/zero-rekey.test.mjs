import assert from "node:assert/strict";
import test from "node:test";

import {
  confirmMediaSet,
  createDraftFromWorkOrder,
  evaluateZeroRekeyDraft,
  generateZeroRekeyOutputs,
  lightingMediaPolicy,
  patchContent,
  recordTechnicalDecision,
  sampleWorkOrders,
  submitDataIssue,
  submitForTechnicalReview,
} from "../lib/zero-rekey.ts";

const order = sampleWorkOrders[0];
const clone = (value) => structuredClone(value);

function readyDraft() {
  let draft = createDraftFromWorkOrder(clone(order));
  draft = patchContent(draft, { caseNote: "Hốc gầm còn zin, bộ gá rời và dây nguồn có cầu chì bảo vệ riêng." });
  draft = confirmMediaSet(draft, true);
  return draft;
}

test("lighting pilot is locked to six required and two optional media roles", () => {
  assert.equal(lightingMediaPolicy.length, 8);
  assert.equal(lightingMediaPolicy.filter((item) => item.required).length, 6);
  assert.deepEqual(
    lightingMediaPolicy.filter((item) => item.required).map((item) => item.role),
    ["vehicle_after", "lamp_stock_before", "lamp_after", "product_identity", "beam_low_after", "beam_high_after"],
  );
});

test("creating from a work order imports system data without rekeying", () => {
  const draft = createDraftFromWorkOrder(clone(order));
  assert.equal(draft.templateVersion, "2.0");
  assert.equal(draft.workOrderId, order.id);
  assert.equal(draft.caseId, order.caseId);
  assert.equal(draft.sourceVersion, order.sourceVersion);
  assert.equal(draft.sourceHash, order.sourceHash);
  assert.equal(draft.content.customerNeed, order.customerNeedRaw);
  assert.equal(draft.media.length, 8);
});

test("content patch accepts only content-owned fields", () => {
  const draft = createDraftFromWorkOrder(clone(order));
  assert.throws(
    () => patchContent(draft, { product: "Fake product" }),
    /SYSTEM_OWNED_FIELD:product/,
  );
  const changed = patchContent(draft, { caseNote: "Điểm khác biệt đúng ca đủ dài để biên tập và kiểm chứng." });
  assert.equal(changed.revision, draft.revision + 1);
  assert.equal(changed.content.caseNote.includes("đúng ca"), true);
});

test("draft is reviewable only after two notes and the six-core media confirmation", () => {
  const initial = createDraftFromWorkOrder(clone(order));
  assert.equal(evaluateZeroRekeyDraft(order, initial).readyForReview, false);
  const withNote = patchContent(initial, { caseNote: "Ca xe dùng bộ gá rời và không ghi nhận cắt chi tiết zin." });
  assert.equal(evaluateZeroRekeyDraft(order, withNote).gates.content, true);
  assert.equal(evaluateZeroRekeyDraft(order, withNote).gates.evidence, false);
  const confirmed = confirmMediaSet(withNote, true);
  const gate = evaluateZeroRekeyDraft(order, confirmed);
  assert.equal(gate.readyForReview, true);
  assert.equal(gate.publishable, false);
});

test("server policy rejects missing roles, duplicate checksums and forged required flags", () => {
  const missing = readyDraft();
  missing.media.find((asset) => asset.role === "product_identity").url = "";
  assert.equal(evaluateZeroRekeyDraft(order, missing).gates.evidence, false);

  const duplicate = readyDraft();
  duplicate.media[1].checksum = duplicate.media[0].checksum;
  const duplicateGate = evaluateZeroRekeyDraft(order, duplicate);
  assert.equal(duplicateGate.gates.evidence, false);
  assert.ok(duplicateGate.issues.some((issue) => issue.code === "DUPLICATE_MEDIA"));

  const forged = readyDraft();
  forged.media.find((asset) => asset.role === "beam_high_after").required = false;
  forged.media.find((asset) => asset.role === "beam_high_after").url = "";
  assert.equal(evaluateZeroRekeyDraft(order, forged).gates.evidence, false, "required roles are server policy, not client flags");
});

test("wrong source data is routed and blocks review instead of becoming a silent edit", () => {
  const draft = submitDataIssue(readyDraft(), { target: "catalog", message: "Phiên bản xe trên catalog chưa đúng.", status: "draft" });
  const gate = evaluateZeroRekeyDraft(order, draft);
  assert.equal(gate.gates.source, false);
  assert.ok(gate.issues.some((issue) => issue.code === "SOURCE_NOT_READY" && issue.owner === "catalog"));
});

test("only the assigned technical reviewer can approve the exact revision", () => {
  const inReview = submitForTechnicalReview(order, readyDraft());
  assert.throws(() => recordTechnicalDecision(order, inReview, {
    actorRole: "content",
    reviewerRef: order.reviewer.ref,
    expectedRevision: inReview.revision,
    decision: "approved",
  }), /FORBIDDEN_ROLE/);
  assert.throws(() => recordTechnicalDecision(order, inReview, {
    actorRole: "technical_reviewer",
    reviewerRef: order.reviewer.ref,
    expectedRevision: inReview.revision - 1,
    decision: "approved",
  }), /REVISION_CONFLICT/);
  const approved = recordTechnicalDecision(order, inReview, {
    actorRole: "technical_reviewer",
    reviewerRef: order.reviewer.ref,
    expectedRevision: inReview.revision,
    decision: "approved",
  });
  assert.equal(approved.workflowStatus, "publishable");
  assert.equal(evaluateZeroRekeyDraft(order, approved).publishable, true);
});

test("editing after approval creates a revision and invalidates approval", () => {
  const inReview = submitForTechnicalReview(order, readyDraft());
  const approved = recordTechnicalDecision(order, inReview, {
    actorRole: "technical_reviewer",
    reviewerRef: order.reviewer.ref,
    expectedRevision: inReview.revision,
    decision: "approved",
  });
  const changed = patchContent(approved, { caseNote: "Ghi chú mới sau duyệt tạo revision mới và buộc kỹ thuật duyệt lại." });
  assert.equal(changed.revision, approved.revision + 1);
  assert.equal(changed.technicalApproval, null);
  assert.equal(evaluateZeroRekeyDraft(order, changed).gates.technical, false);
});

test("legacy Camry canonical stays locked", () => {
  const draft = readyDraft();
  const output = generateZeroRekeyOutputs(order, draft);
  assert.equal(output.canonical, "https://auto365.vn/toyota-camry-2014-25q-lap-bi-gam-x-light-f10-turbo-v2-gia-cau-hinh");
  assert.equal(output.slug, "toyota-camry-2014-25q-lap-bi-gam-x-light-f10-turbo-v2-gia-cau-hinh");
});
