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

test("renders Studio V2.0 Zero-Rekey with a three-step queue and server gates", async () => {
  const { response, html } = await render("/studio");
  assert.equal(response.status, 200);
  assert.match(html, /CASE LAB STUDIO/);
  assert.match(html, /Production Zero/i);
  assert.match(html, /Sẵn sàng viết/);
  assert.match(html, /Xác nhận ca/);
  assert.match(html, /Kiểm tra ảnh/);
  assert.match(html, /Xem &amp; gửi/);
  assert.match(html, /Nguồn đã sẵn sàng/);
  assert.match(html, /Ghi chú content đủ/);
  assert.match(html, /6–8 ảnh hợp lệ/);
  assert.match(html, /Kỹ thuật duyệt revision/);
  assert.match(html, /Hệ thống SEO sẵn sàng/);
  assert.match(html, /ACL-260810-LGT-001/);
  assert.match(html, /noindex/);
  assert.doesNotMatch(html, /Chọn sản phẩm đúng tuyến/i);
});

test("renders a separate technical review surface", async () => {
  const { response, html } = await render("/studio/review");
  assert.equal(response.status, 200);
  assert.match(html, /TECHNICAL REVIEW/);
  assert.match(html, /Revision khóa/i);
  assert.match(html, /Duyệt kỹ thuật revision này/);
  assert.match(html, /Nguyễn Quang Đạo/);
  assert.match(html, /noindex/);
});

test("normalizes Studio to one slashless route without looping", async () => {
  const canonical = await render("/studio");
  assert.equal(canonical.response.status, 200);
  const trailing = await render("/studio/");
  assert.equal(trailing.response.status, 308);
  assert.equal(trailing.response.headers.get("location"), "/studio");
});
