import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("root route sends users to the Case Lab workspace", async () => {
  const rootPage = await readFile(new URL("../app/page.tsx", import.meta.url), "utf8");

  assert.match(rootPage, /redirect\(["']\/workspace["']\)/);
});
