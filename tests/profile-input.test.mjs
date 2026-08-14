import test from "node:test";
import assert from "node:assert/strict";

import { parseProfileInput } from "../server/case-lab-input.ts";

test("profile input accepts a revisioned display name and boolean preferences", () => {
  assert.deepEqual(parseProfileInput({
    displayName: "Minh Cường",
    expectedRevision: 2,
    preferences: { emailNotifications: true, compactMode: false },
  }), {
    displayName: "Minh Cường",
    expectedRevision: 2,
    preferences: { emailNotifications: true, compactMode: false },
  });
});

test("profile input rejects a stale-shaped request", () => {
  assert.throws(() => parseProfileInput({ displayName: "M", expectedRevision: 0, preferences: { emailNotifications: "yes" } }), {
    code: "VALIDATION_ERROR",
  });
});
