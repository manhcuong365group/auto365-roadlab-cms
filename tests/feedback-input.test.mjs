import assert from "node:assert/strict";
import test from "node:test";

import { parseFeedbackInput } from "../server/case-lab-input.ts";

test("feedback input trims the message and rejects unsafe revisions", () => {
  assert.deepEqual(parseFeedbackInput({ message: "  Cần thêm ảnh beam low. ", category: "evidence", revision: 7 }), {
    message: "Cần thêm ảnh beam low.",
    category: "evidence",
    revision: 7,
    parentFeedbackId: undefined,
  });
  assert.throws(() => parseFeedbackInput({ message: " ", revision: 0 }), { code: "VALIDATION_ERROR" });
  assert.throws(() => parseFeedbackInput({ message: "ok", category: "unsafe" }), { code: "VALIDATION_ERROR" });
});
