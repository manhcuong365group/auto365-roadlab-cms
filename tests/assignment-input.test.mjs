import assert from "node:assert/strict";
import test from "node:test";
import { parseAssignmentInput } from "../server/case-lab-input.ts";

test("assignment input accepts an operational reviewer role", () => {
  assert.deepEqual(parseAssignmentInput({ userId: "user-1", role: "it" }), { userId: "user-1", role: "it" });
});

test("assignment input rejects content and empty accounts", () => {
  assert.throws(() => parseAssignmentInput({ userId: "", role: "content" }), /phân công/i);
});
