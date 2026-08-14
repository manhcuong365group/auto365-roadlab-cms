import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const root = new URL("../", import.meta.url);

test("login dùng đúng mật khẩu được seed cho tài khoản demo", async () => {
  const loginPage = await readFile(new URL("app/login/page.tsx", root), "utf8");
  const seed = await readFile(new URL("db/seed-test-users.sql", root), "utf8");

  assert.match(seed, /CaseLab-2026!/);
  assert.match(loginPage, /CaseLab-2026!/);
  assert.doesNotMatch(loginPage, /Auto365-(?:Content|OA|SEO|IT|Boss)-2026!/);
});

test("sidebar có thao tác đăng xuất quay về màn hình đăng nhập", async () => {
  const sidebar = await readFile(new URL("app/workspace/sidebar.tsx", root), "utf8");

  assert.match(sidebar, /fetch\("\/api\/auth\/logout", \{ method: "POST" \}\)/);
  assert.match(sidebar, /window\.location\.assign\("\/login"\)/);
  assert.match(sidebar, /className="workspace-sidebar__logout"/);
  assert.match(sidebar, /Đăng xuất <b>→<\/b><\/button>/);
});
