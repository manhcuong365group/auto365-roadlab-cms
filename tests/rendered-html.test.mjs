import assert from "node:assert/strict";
import test from "node:test";

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

test("redirects the public root to the Case Lab workspace", async () => {
  const { response } = await render("/");
  assert.equal(response.status, 307);
  assert.equal(new URL(response.headers.get("location")).pathname, "/workspace");
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
