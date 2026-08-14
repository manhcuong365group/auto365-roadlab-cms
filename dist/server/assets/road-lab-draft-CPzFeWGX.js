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
//#region lib/road-lab-draft.ts
var text = (value) => typeof value === "string" ? value : "";
var checked = (value) => value === true;
var record = (value) => value && typeof value === "object" && !Array.isArray(value) ? value : {};
function createRoadLabDraft(seed = {}) {
	return {
		templateKey: "road_lab",
		publication: {
			title: "",
			summary: "",
			answerFirst: "",
			heroUrl: ""
		},
		vehicle: {
			vehicleName: seed.vehicleName ?? "",
			modelYear: "",
			odometer: "",
			usageConditions: "",
			primaryNeed: "",
			installationStage: ""
		},
		configuration: {
			problem: "",
			beforeConfig: "",
			actualConfig: "",
			productName: seed.productName ?? "",
			materials: ""
		},
		evidence: {
			measurement: "",
			resultSummary: "",
			proofUrls: "",
			sourceNotes: ""
		},
		seo: {
			slug: "",
			metaTitle: "",
			metaDescription: "",
			roadCaseId: "",
			proofLabId: "",
			brandPillarId: "",
			productOwnerId: ""
		},
		review: {
			contentChecked: false,
			evidenceChecked: false,
			seoChecked: false,
			technicalChecked: false,
			reviewNote: ""
		}
	};
}
function normalizeRoadLabDraft(value, seed = {}) {
	const source = record(value);
	const base = createRoadLabDraft(seed);
	if (source.templateKey !== "road_lab") return {
		...base,
		publication: {
			...base.publication,
			title: text(source.title),
			summary: text(source.summary),
			answerFirst: text(source.body)
		}
	};
	const publication = record(source.publication);
	const vehicle = record(source.vehicle);
	const configuration = record(source.configuration);
	const evidence = record(source.evidence);
	const seo = record(source.seo);
	const review = record(source.review);
	return {
		templateKey: "road_lab",
		publication: {
			title: text(publication.title),
			summary: text(publication.summary),
			answerFirst: text(publication.answerFirst),
			heroUrl: text(publication.heroUrl)
		},
		vehicle: {
			vehicleName: text(vehicle.vehicleName) || base.vehicle.vehicleName,
			modelYear: text(vehicle.modelYear),
			odometer: text(vehicle.odometer),
			usageConditions: text(vehicle.usageConditions),
			primaryNeed: text(vehicle.primaryNeed),
			installationStage: text(vehicle.installationStage)
		},
		configuration: {
			problem: text(configuration.problem),
			beforeConfig: text(configuration.beforeConfig),
			actualConfig: text(configuration.actualConfig),
			productName: text(configuration.productName) || base.configuration.productName,
			materials: text(configuration.materials)
		},
		evidence: {
			measurement: text(evidence.measurement),
			resultSummary: text(evidence.resultSummary),
			proofUrls: text(evidence.proofUrls),
			sourceNotes: text(evidence.sourceNotes)
		},
		seo: {
			slug: text(seo.slug),
			metaTitle: text(seo.metaTitle),
			metaDescription: text(seo.metaDescription),
			roadCaseId: text(seo.roadCaseId),
			proofLabId: text(seo.proofLabId),
			brandPillarId: text(seo.brandPillarId),
			productOwnerId: text(seo.productOwnerId)
		},
		review: {
			contentChecked: checked(review.contentChecked),
			evidenceChecked: checked(review.evidenceChecked),
			seoChecked: checked(review.seoChecked),
			technicalChecked: checked(review.technicalChecked),
			reviewNote: text(review.reviewNote)
		}
	};
}
//#endregion
export { CaseLabApiError as n, apiErrorResponse as r, normalizeRoadLabDraft as t };
