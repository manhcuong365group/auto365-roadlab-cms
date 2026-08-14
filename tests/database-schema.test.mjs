import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const root = new URL("../", import.meta.url);

test("operations schema stores role scopes, assignments, feedback and notifications", async () => {
  const [schema, migration] = await Promise.all([
    readFile(new URL("db/schema.ts", root), "utf8"),
    readFile(new URL("drizzle/0001_operations_workspace.sql", root), "utf8"),
  ]);

  for (const role of ["content", "oa", "seo_lead", "it", "boss"]) {
    assert.match(schema, new RegExp(`"${role}"`), `missing ${role} role`);
  }

  for (const table of ["caseAssignments", "caseFeedback", "notifications"]) {
    assert.match(schema, new RegExp(`export const ${table}`), `missing ${table} schema`);
  }

  for (const table of ["case_assignments", "case_feedback", "notifications"]) {
    assert.ok(migration.includes(`CREATE TABLE \`${table}\``), `missing ${table} migration`);
  }
});
