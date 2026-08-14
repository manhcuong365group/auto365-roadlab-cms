import assert from "node:assert/strict";
import test from "node:test";

import { CaseLabApiError, apiErrorResponse } from "../server/case-lab-api.ts";

test("API errors retain a supplied request ID and safe error code", async () => {
  const request = new Request("https://case-lab.test/api", { headers: { "x-request-id": "req-case-42" } });
  const response = apiErrorResponse(request, new CaseLabApiError("NOT_FOUND", "Không tìm thấy case.", 404));

  assert.equal(response.status, 404);
  assert.equal(response.headers.get("x-request-id"), "req-case-42");
  assert.deepEqual(await response.json(), {
    error: { code: "NOT_FOUND", message: "Không tìm thấy case.", requestId: "req-case-42" },
  });
});

test("authentication errors map to 401 and 403 without leaking internals", async () => {
  const request = new Request("https://case-lab.test/api");
  const unauthenticatedError = Object.assign(new Error("Thiếu phiên đăng nhập Case Lab."), { code: "UNAUTHENTICATED" });
  const forbiddenError = Object.assign(new Error("Tài khoản chưa có phạm vi làm việc."), { code: "FORBIDDEN_ROLE" });
  const unauthenticated = apiErrorResponse(request, unauthenticatedError);
  const forbidden = apiErrorResponse(request, forbiddenError);

  assert.equal(unauthenticated.status, 401);
  assert.equal(forbidden.status, 403);
  assert.equal((await forbidden.json()).error.code, "FORBIDDEN_ROLE");
});
