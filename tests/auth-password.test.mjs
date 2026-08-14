import assert from "node:assert/strict";
import test from "node:test";

import { hashPassword, verifyPassword } from "../server/password-auth.ts";

test("hashes a password and verifies only the original password", async () => {
  const encoded = await hashPassword("CaseLab-2026!");

  assert.notEqual(encoded, "CaseLab-2026!");
  assert.equal(await verifyPassword("CaseLab-2026!", encoded), true);
  assert.equal(await verifyPassword("wrong-password", encoded), false);
});
