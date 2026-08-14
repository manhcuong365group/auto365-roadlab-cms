import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

async function request(pathname) {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}-${pathname}`);
  const { default: worker } = await import(workerUrl.href);
  return worker.fetch(
    new Request(`http://localhost${pathname}`, { headers: { accept: "application/json" } }),
    { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } },
    { waitUntil() {}, passThroughOnException() {} },
  );
}

test("GET /api/v1/case-lab/health returns contract version", async () => {
  const response = await request("/api/v1/case-lab/health");

  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), {
    version: "2026-08-11.v2",
    status: "ok",
  });
});

test("dashboard rejects an anonymous request before loading D1 operations", async () => {
  const response = await request("/api/v1/case-lab/dashboard");

  assert.equal(response.status, 401);
  assert.equal((await response.json()).error.code, "UNAUTHENTICATED");
});

test("OpenAPI covers dashboard, review, audit and account operations", async () => {
  const contract = await readFile(new URL("../openapi/case-lab-v2.yaml", import.meta.url), "utf8");
  const requiredOperations = [
    ["/dashboard:", "get:"],
    ["/cases/{caseId}/assignments:", "get:"],
    ["/cases/{caseId}/feedback:", "post:"],
    ["/feedback/{feedbackId}/resolve:", "post:"],
    ["/cases/{caseId}/audit:", "get:"],
    ["/notifications:", "get:"],
    ["/reports/operations:", "get:"],
    ["/me:", "patch:"],
  ];

  for (const [path, operation] of requiredOperations) {
    const section = contract.split(path)[1]?.split("\n  /")[0] ?? "";
    assert.match(section, new RegExp(`\\n    ${operation}`), `${path} must expose ${operation}`);
  }
});
