import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

const workspace = new URL("../app/workspace/", import.meta.url);

test("workspace sidebar links every operating area to its own route", async () => {
  const sidebar = await readFile(new URL("sidebar.tsx", workspace), "utf8");
  const expectedLinks = [
    ["Trung tâm review", "/workspace/review"],
    ["Kho hướng dẫn", "/workspace/guides"],
    ["Thông báo", "/workspace/notifications"],
  ];

  for (const [label, href] of expectedLinks) {
    assert.match(sidebar, new RegExp(`\\["${label}", "${href}"`));
  }
});

test("workspace exposes dedicated review, guides and notification pages", async () => {
  for (const route of ["review/page.tsx", "guides/page.tsx", "notifications/page.tsx"]) {
    await access(new URL(route, workspace));
  }
});

test("case detail and review use the D1 workspace instead of the legacy studio demo", async () => {
  const detail = await readFile(new URL("cases/[caseId]/page.tsx", workspace), "utf8");
  const review = await readFile(new URL("cases/[caseId]/review/page.tsx", workspace), "utf8");

  assert.doesNotMatch(detail, /studio\/page/);
  assert.doesNotMatch(review, /studio\/review\/page/);
  await access(new URL("cases/[caseId]/case-editor.tsx", workspace));
  await access(new URL("../api/v1/case-lab/cases/[caseId]/draft/route.ts", workspace));
});
