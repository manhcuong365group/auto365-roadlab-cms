import type { ApiError, ApiErrorCode } from "./case-lab-contract";

export class CaseLabApiError extends Error {
  readonly code: ApiErrorCode;
  readonly status: number;
  readonly details?: Record<string, unknown>;

  constructor(
    code: ApiErrorCode,
    message: string,
    status: number,
    details?: Record<string, unknown>,
  ) {
    super(message);
    this.code = code;
    this.status = status;
    this.details = details;
  }
}

export function requestId(request: Request): string {
  return request.headers.get("x-request-id")?.slice(0, 128) || crypto.randomUUID();
}

export function apiErrorResponse(request: Request, error: unknown): Response {
  const requestIdentifier = requestId(request);
  const apiError = error instanceof CaseLabApiError
    ? error
    : error instanceof Error && "code" in error && (error as { code?: string }).code === "UNAUTHENTICATED"
      ? new CaseLabApiError("UNAUTHENTICATED", error.message, 401)
      : error instanceof Error && "code" in error && (error as { code?: string }).code === "FORBIDDEN_ROLE"
        ? new CaseLabApiError("FORBIDDEN_ROLE", error.message, 403)
        : new CaseLabApiError("VALIDATION_ERROR", "Không thể xử lý yêu cầu Case Lab.", 500);
  const body: ApiError = {
    error: {
      code: apiError.code,
      message: apiError.message,
      requestId: requestIdentifier,
      ...(apiError.details ? { details: apiError.details } : {}),
    },
  };
  return Response.json(body, { status: apiError.status, headers: { "x-request-id": requestIdentifier } });
}
