import assert from "node:assert/strict";
import test from "node:test";

const developmentPreviewMeta =
  /<meta(?=[^>]*\bname=["']codex-preview["'])(?=[^>]*\bcontent=["']development["'])[^>]*>/i;

async function render(pathname) {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}-${pathname}`);
  const { default: worker } = await import(workerUrl.href);
  const response = await worker.fetch(
    new Request(`http://localhost${pathname}`, { headers: { accept: "text/html" } }),
    { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } },
    { waitUntil() {}, passThroughOnException() {} },
  );
  return { response, html: await response.text() };
}

test("renders Case Lab V1.4 article as server HTML", async () => {
  const { response, html } = await render("/");
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);
  assert.match(html, developmentPreviewMeta);
  assert.match(html, /CASE LAB · V1\.4/);
  assert.match(html, /ALBUM ĐÚNG CA XE/);
  assert.match(html, /EVIDENCE LEDGER/);
  assert.equal((html.match(/<h1\b/gi) ?? []).length, 1);
  assert.ok((html.match(/<img\b/gi) ?? []).length >= 7, "article should render at least seven image placements");
  assert.doesNotMatch(html, /href=["']\/studio["']/i, "public article must not expose the Studio link");
  assert.match(html, /application\/ld\+json/);
  assert.match(html, /ImageObject/);
  assert.match(html, /WebPage/);
  assert.match(html, /AutomotiveBusiness/);
  assert.match(html, /FAQPage/);
  assert.match(html, /Nguyễn Quang Đạo/);
});

test("redirects the retired Studio route to the operations workspace", async () => {
  const { response } = await render("/studio");
  assert.equal(response.status, 307);
  assert.equal(new URL(response.headers.get("location")).pathname, "/workspace");
});

test("redirects the retired Studio review route to workspace review", async () => {
  const { response } = await render("/studio/review");
  assert.equal(response.status, 307);
  assert.equal(new URL(response.headers.get("location")).pathname, "/workspace/review");
});

test("renders the operations workspace shell without exposing mock case data", async () => {
  const { response, html } = await render("/workspace");
  assert.equal(response.status, 200);
  assert.match(html, /Case Lab Workspace/);
  assert.match(html, /Dữ liệu vận hành theo thời gian thực/);
  assert.match(html, /Đang tải dữ liệu vận hành/);
  assert.doesNotMatch(html, /Mazda CX-5/i);
  assert.doesNotMatch(html, /Ford Ranger/i);
});

test("redirects both Studio spellings to the workspace without looping", async () => {
  const canonical = await render("/studio");
  assert.equal(canonical.response.status, 307);
  assert.equal(new URL(canonical.response.headers.get("location")).pathname, "/workspace");
  const trailing = await render("/studio/");
  assert.ok([307, 308].includes(trailing.response.status));
  assert.equal(trailing.response.headers.get("location"), "/studio");
});
