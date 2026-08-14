//#region server/case-lab-api.ts
var CaseLabApiError = class extends Error {
	constructor(code, message, status, details) {
		super(message);
		this.code = code;
		this.status = status;
		this.details = details;
	}
};
function requestId(request) {
	return request.headers.get("x-request-id")?.slice(0, 128) || crypto.randomUUID();
}
function apiErrorResponse(request, error) {
	const requestIdentifier = requestId(request);
	const apiError = error instanceof CaseLabApiError ? error : error instanceof Error && "code" in error && error.code === "UNAUTHENTICATED" ? new CaseLabApiError("UNAUTHENTICATED", error.message, 401) : error instanceof Error && "code" in error && error.code === "FORBIDDEN_ROLE" ? new CaseLabApiError("FORBIDDEN_ROLE", error.message, 403) : new CaseLabApiError("VALIDATION_ERROR", "Không thể xử lý yêu cầu Case Lab.", 500);
	const body = { error: {
		code: apiError.code,
		message: apiError.message,
		requestId: requestIdentifier,
		...apiError.details ? { details: apiError.details } : {}
	} };
	return Response.json(body, {
		status: apiError.status,
		headers: { "x-request-id": requestIdentifier }
	});
}
//#endregion
export { apiErrorResponse as n, CaseLabApiError as t };
