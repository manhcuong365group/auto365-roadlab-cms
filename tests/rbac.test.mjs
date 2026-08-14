import assert from "node:assert/strict";
import test from "node:test";

import {
  canManageAssignments,
  canReviewFeedback,
  canReviewFeedbackInBranch,
  canonicalRole,
  hasBranchAccess,
} from "../server/case-lab-rbac.ts";

test("maps legacy accounts to the three-tier operational roles", () => {
  assert.equal(canonicalRole("technical_reviewer"), "it");
  assert.equal(canonicalRole("seo_admin"), "seo_lead");
  assert.equal(canonicalRole("admin"), "boss");
});

test("all operational roles can review feedback within their branch scope", () => {
  for (const role of ["content", "oa", "seo_lead", "it", "boss"]) {
    assert.equal(canReviewFeedback(role), true);
  }
  assert.equal(hasBranchAccess([{ role: "seo_lead", branchRef: "hn" }], "hn"), true);
  assert.equal(hasBranchAccess([{ role: "seo_lead", branchRef: "hn" }], "hcm"), false);
  assert.equal(hasBranchAccess([{ role: "boss", branchRef: "*" }], "hcm"), true);
});

test("only lead and boss roles manage active review assignments", () => {
  assert.equal(canManageAssignments("content"), false);
  assert.equal(canManageAssignments("oa"), true);
  assert.equal(canManageAssignments("seo_lead"), true);
  assert.equal(canManageAssignments("it"), true);
  assert.equal(canManageAssignments("boss"), true);
});

test("feedback permission cannot borrow branch scope from a different role", () => {
  const roles = [
    { role: "content", branchRef: "east" },
    { role: "technical_reviewer", branchRef: "south" },
  ];
  assert.equal(canReviewFeedbackInBranch(roles, "north"), false);
  assert.equal(canReviewFeedbackInBranch(roles, "south"), true);
});
