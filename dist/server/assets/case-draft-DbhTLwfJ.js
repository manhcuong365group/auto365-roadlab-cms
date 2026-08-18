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
var contentTypeByValue = new Map([
	{
		value: "case",
		label: "Ca thực tế",
		description: "Ca vận hành thực tế"
	},
	{
		value: "proof",
		label: "Bằng chứng & nghiệm thu",
		description: "Bằng chứng, đo kiểm và nghiệm thu"
	},
	{
		value: "brand",
		label: "Nội dung thương hiệu",
		description: "Nội dung định vị thương hiệu"
	},
	{
		value: "product",
		label: "Nội dung sản phẩm",
		description: "Nội dung trọng tâm sản phẩm"
	}
].map((item) => [item.value, item]));
function normalizeCaseContentType(value) {
	return typeof value === "string" && contentTypeByValue.has(value) ? value : "case";
}
function getCaseContentType(value) {
	return contentTypeByValue.get(normalizeCaseContentType(value));
}
//#endregion
//#region lib/case-extended.ts
var text$4 = (value) => typeof value === "string" ? value : "";
var record$4 = (value) => value && typeof value === "object" && !Array.isArray(value) ? value : {};
function createExtendedEditorial() {
	return {
		authorName: "",
		authorRole: "",
		reviewerName: "",
		reviewerRole: "",
		primarySource: "",
		timeline: "",
		known: "",
		unknown: "",
		qc: "",
		faqs: "",
		metrics: "",
		priceValue: "",
		priceNote: "",
		priceIncludes: "",
		beamCosUrl: "",
		beamCosCaption: "",
		beamPhaUrl: "",
		beamPhaCaption: "",
		followup: "",
		related: ""
	};
}
function normalizeExtendedEditorial(value) {
	const source = record$4(value);
	return {
		authorName: text$4(source.authorName),
		authorRole: text$4(source.authorRole),
		reviewerName: text$4(source.reviewerName),
		reviewerRole: text$4(source.reviewerRole),
		primarySource: text$4(source.primarySource),
		timeline: text$4(source.timeline),
		known: text$4(source.known),
		unknown: text$4(source.unknown),
		qc: text$4(source.qc),
		faqs: text$4(source.faqs),
		metrics: text$4(source.metrics),
		priceValue: text$4(source.priceValue),
		priceNote: text$4(source.priceNote),
		priceIncludes: text$4(source.priceIncludes),
		beamCosUrl: text$4(source.beamCosUrl),
		beamCosCaption: text$4(source.beamCosCaption),
		beamPhaUrl: text$4(source.beamPhaUrl),
		beamPhaCaption: text$4(source.beamPhaCaption),
		followup: text$4(source.followup),
		related: text$4(source.related)
	};
}
var lines = (value) => value.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
var SEPARATOR = /\s*[—–]\s*|\s+-{1,2}\s+/;
var splitDash = (line) => line.split(SEPARATOR).map((part) => part.trim());
/** Parses "Tiêu đề — Mô tả" lines (em dash or double hyphen separator). */
function parseTimeline(value) {
	return lines(value).map((line) => {
		const [title, ...rest] = line.split(SEPARATOR);
		return {
			title: (title ?? line).trim(),
			text: rest.join(" — ").trim()
		};
	});
}
/** Parses "Hạng mục — Kết quả" lines the same way as the timeline. */
function parseQc(value) {
	return lines(value).map((line) => {
		const [label, ...rest] = line.split(SEPARATOR);
		return {
			label: (label ?? line).trim(),
			result: rest.join(" — ").trim() || "Đã kiểm tra"
		};
	});
}
function parseListLines(value) {
	return lines(value);
}
/** Parses "Q: ...\nA: ...\n\nQ: ...\nA: ..." blocks separated by a blank line. */
function parseFaqs(value) {
	return value.split(/\r?\n\s*\r?\n/).map((block) => block.trim()).filter(Boolean).map((block) => {
		const qMatch = block.match(/^Q:\s*(.+)$/im);
		const aMatch = block.match(/^A:\s*([\s\S]+)$/im);
		return {
			q: (qMatch?.[1] ?? "").trim(),
			a: (aMatch?.[1] ?? "").trim()
		};
	}).filter((item) => item.q && item.a);
}
/** Parses "Nhãn — Giá trị — Ghi chú" lines into product spec rows. */
function parseMetrics(value) {
	return lines(value).map((line) => {
		const [label, val, note] = splitDash(line);
		return {
			label: label ?? line,
			value: val ?? "",
			note: note ?? ""
		};
	});
}
/** Parses "Mốc — Ngày — done|pending" lines into a post-service follow-up track. */
function parseFollowup(value) {
	return lines(value).map((line) => {
		const [label, date, status] = splitDash(line);
		return {
			label: label ?? line,
			date: date ?? "",
			done: (status ?? "").toLowerCase().startsWith("done")
		};
	});
}
/** Parses "Nhãn — URL" lines into related-content links. */
function parseRelated(value) {
	return lines(value).map((line) => {
		const [label, url] = splitDash(line);
		return {
			label: label ?? line,
			url: url ?? ""
		};
	}).filter((item) => item.url);
}
//#endregion
//#region lib/road-lab-draft.ts
var text$3 = (value) => typeof value === "string" ? value : "";
var checked$3 = (value) => value === true;
var record$3 = (value) => value && typeof value === "object" && !Array.isArray(value) ? value : {};
function getRoadLabMediaUrls(value, limit = 12) {
	if (typeof value !== "string") return [];
	const urls = [];
	const seen = /* @__PURE__ */ new Set();
	for (const candidate of value.split(/\r?\n/)) {
		if (urls.length >= limit) break;
		try {
			const parsed = new URL(candidate.trim());
			if (parsed.protocol !== "https:" && parsed.protocol !== "http:" || seen.has(parsed.href)) continue;
			seen.add(parsed.href);
			urls.push(parsed.href);
		} catch {}
	}
	return urls;
}
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
		},
		extended: createExtendedEditorial()
	};
}
function normalizeRoadLabDraft(value, seed = {}) {
	const source = record$3(value);
	const base = createRoadLabDraft(seed);
	if (source.templateKey !== "road_lab") return {
		...base,
		publication: {
			...base.publication,
			title: text$3(source.title),
			summary: text$3(source.summary),
			answerFirst: text$3(source.body)
		}
	};
	const publication = record$3(source.publication);
	const vehicle = record$3(source.vehicle);
	const configuration = record$3(source.configuration);
	const evidence = record$3(source.evidence);
	const seo = record$3(source.seo);
	const review = record$3(source.review);
	return {
		templateKey: "road_lab",
		publication: {
			title: text$3(publication.title),
			summary: text$3(publication.summary),
			answerFirst: text$3(publication.answerFirst),
			heroUrl: text$3(publication.heroUrl)
		},
		vehicle: {
			vehicleName: text$3(vehicle.vehicleName) || base.vehicle.vehicleName,
			modelYear: text$3(vehicle.modelYear),
			odometer: text$3(vehicle.odometer),
			usageConditions: text$3(vehicle.usageConditions),
			primaryNeed: text$3(vehicle.primaryNeed),
			installationStage: text$3(vehicle.installationStage)
		},
		configuration: {
			problem: text$3(configuration.problem),
			beforeConfig: text$3(configuration.beforeConfig),
			actualConfig: text$3(configuration.actualConfig),
			productName: text$3(configuration.productName) || base.configuration.productName,
			materials: text$3(configuration.materials)
		},
		evidence: {
			measurement: text$3(evidence.measurement),
			resultSummary: text$3(evidence.resultSummary),
			proofUrls: text$3(evidence.proofUrls),
			sourceNotes: text$3(evidence.sourceNotes)
		},
		seo: {
			slug: text$3(seo.slug),
			metaTitle: text$3(seo.metaTitle),
			metaDescription: text$3(seo.metaDescription),
			roadCaseId: text$3(seo.roadCaseId),
			proofLabId: text$3(seo.proofLabId),
			brandPillarId: text$3(seo.brandPillarId),
			productOwnerId: text$3(seo.productOwnerId)
		},
		review: {
			contentChecked: checked$3(review.contentChecked),
			evidenceChecked: checked$3(review.evidenceChecked),
			seoChecked: checked$3(review.seoChecked),
			technicalChecked: checked$3(review.technicalChecked),
			reviewNote: text$3(review.reviewNote)
		},
		extended: normalizeExtendedEditorial(source.extended)
	};
}
//#endregion
//#region lib/proof-lab-draft.ts
var text$2 = (value) => typeof value === "string" ? value : "";
var checked$2 = (value) => value === true;
var record$2 = (value) => value && typeof value === "object" && !Array.isArray(value) ? value : {};
function createProofLabDraft(seed = {}) {
	return {
		templateKey: "proof_lab",
		publication: {
			title: "",
			summary: "",
			answerFirst: "",
			heroUrl: ""
		},
		verification: {
			subjectRef: seed.productName ?? "",
			testMethod: "",
			standardRef: "",
			testedAt: "",
			verifiedBy: ""
		},
		findings: {
			beforeResult: "",
			afterResult: "",
			conclusion: "",
			deviationNote: ""
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
			proofLabId: "",
			roadCaseId: "",
			brandPillarId: "",
			productOwnerId: ""
		},
		review: {
			verificationChecked: false,
			findingsChecked: false,
			evidenceChecked: false,
			seoChecked: false,
			reviewNote: ""
		},
		extended: createExtendedEditorial()
	};
}
function normalizeProofLabDraft(value, seed = {}) {
	const source = record$2(value);
	const base = createProofLabDraft(seed);
	if (source.templateKey !== "proof_lab") {
		const legacyPublication = record$2(source.publication);
		const legacyEvidence = record$2(source.evidence);
		return {
			...base,
			publication: {
				...base.publication,
				title: text$2(legacyPublication.title) || text$2(source.title),
				summary: text$2(legacyPublication.summary) || text$2(source.summary),
				answerFirst: text$2(legacyPublication.answerFirst) || text$2(source.body),
				heroUrl: text$2(legacyPublication.heroUrl) || base.publication.heroUrl
			},
			evidence: {
				measurement: text$2(legacyEvidence.measurement),
				resultSummary: text$2(legacyEvidence.resultSummary),
				proofUrls: text$2(legacyEvidence.proofUrls),
				sourceNotes: text$2(legacyEvidence.sourceNotes)
			}
		};
	}
	const publication = record$2(source.publication);
	const verification = record$2(source.verification);
	const findings = record$2(source.findings);
	const evidence = record$2(source.evidence);
	const seo = record$2(source.seo);
	const review = record$2(source.review);
	return {
		templateKey: "proof_lab",
		publication: {
			title: text$2(publication.title),
			summary: text$2(publication.summary),
			answerFirst: text$2(publication.answerFirst),
			heroUrl: text$2(publication.heroUrl)
		},
		verification: {
			subjectRef: text$2(verification.subjectRef) || base.verification.subjectRef,
			testMethod: text$2(verification.testMethod),
			standardRef: text$2(verification.standardRef),
			testedAt: text$2(verification.testedAt),
			verifiedBy: text$2(verification.verifiedBy)
		},
		findings: {
			beforeResult: text$2(findings.beforeResult),
			afterResult: text$2(findings.afterResult),
			conclusion: text$2(findings.conclusion),
			deviationNote: text$2(findings.deviationNote)
		},
		evidence: {
			measurement: text$2(evidence.measurement),
			resultSummary: text$2(evidence.resultSummary),
			proofUrls: text$2(evidence.proofUrls),
			sourceNotes: text$2(evidence.sourceNotes)
		},
		seo: {
			slug: text$2(seo.slug),
			metaTitle: text$2(seo.metaTitle),
			metaDescription: text$2(seo.metaDescription),
			proofLabId: text$2(seo.proofLabId),
			roadCaseId: text$2(seo.roadCaseId),
			brandPillarId: text$2(seo.brandPillarId),
			productOwnerId: text$2(seo.productOwnerId)
		},
		review: {
			verificationChecked: checked$2(review.verificationChecked),
			findingsChecked: checked$2(review.findingsChecked),
			evidenceChecked: checked$2(review.evidenceChecked),
			seoChecked: checked$2(review.seoChecked),
			reviewNote: text$2(review.reviewNote)
		},
		extended: normalizeExtendedEditorial(source.extended)
	};
}
//#endregion
//#region lib/brand-story-draft.ts
var text$1 = (value) => typeof value === "string" ? value : "";
var checked$1 = (value) => value === true;
var record$1 = (value) => value && typeof value === "object" && !Array.isArray(value) ? value : {};
function createBrandStoryDraft(seed = {}) {
	return {
		templateKey: "brand_story",
		publication: {
			title: "",
			summary: "",
			answerFirst: "",
			heroUrl: ""
		},
		positioning: {
			targetAudience: "",
			positioningStatement: "",
			toneOfVoice: "",
			keyMessages: "",
			differentiators: ""
		},
		support: {
			supportingFacts: "",
			socialProof: ""
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
			brandPillarId: "",
			roadCaseId: "",
			proofLabId: "",
			productOwnerId: ""
		},
		review: {
			positioningChecked: false,
			supportChecked: false,
			evidenceChecked: false,
			seoChecked: false,
			reviewNote: ""
		},
		extended: createExtendedEditorial()
	};
}
function normalizeBrandStoryDraft(value, seed = {}) {
	const source = record$1(value);
	const base = createBrandStoryDraft(seed);
	if (source.templateKey !== "brand_story") {
		const legacyPublication = record$1(source.publication);
		const legacyEvidence = record$1(source.evidence);
		return {
			...base,
			publication: {
				...base.publication,
				title: text$1(legacyPublication.title) || text$1(source.title),
				summary: text$1(legacyPublication.summary) || text$1(source.summary),
				answerFirst: text$1(legacyPublication.answerFirst) || text$1(source.body),
				heroUrl: text$1(legacyPublication.heroUrl) || base.publication.heroUrl
			},
			evidence: {
				measurement: text$1(legacyEvidence.measurement),
				resultSummary: text$1(legacyEvidence.resultSummary),
				proofUrls: text$1(legacyEvidence.proofUrls),
				sourceNotes: text$1(legacyEvidence.sourceNotes)
			}
		};
	}
	const publication = record$1(source.publication);
	const positioning = record$1(source.positioning);
	const support = record$1(source.support);
	const evidence = record$1(source.evidence);
	const seo = record$1(source.seo);
	const review = record$1(source.review);
	return {
		templateKey: "brand_story",
		publication: {
			title: text$1(publication.title),
			summary: text$1(publication.summary),
			answerFirst: text$1(publication.answerFirst),
			heroUrl: text$1(publication.heroUrl)
		},
		positioning: {
			targetAudience: text$1(positioning.targetAudience),
			positioningStatement: text$1(positioning.positioningStatement),
			toneOfVoice: text$1(positioning.toneOfVoice),
			keyMessages: text$1(positioning.keyMessages),
			differentiators: text$1(positioning.differentiators)
		},
		support: {
			supportingFacts: text$1(support.supportingFacts),
			socialProof: text$1(support.socialProof)
		},
		evidence: {
			measurement: text$1(evidence.measurement),
			resultSummary: text$1(evidence.resultSummary),
			proofUrls: text$1(evidence.proofUrls),
			sourceNotes: text$1(evidence.sourceNotes)
		},
		seo: {
			slug: text$1(seo.slug),
			metaTitle: text$1(seo.metaTitle),
			metaDescription: text$1(seo.metaDescription),
			brandPillarId: text$1(seo.brandPillarId),
			roadCaseId: text$1(seo.roadCaseId),
			proofLabId: text$1(seo.proofLabId),
			productOwnerId: text$1(seo.productOwnerId)
		},
		review: {
			positioningChecked: checked$1(review.positioningChecked),
			supportChecked: checked$1(review.supportChecked),
			evidenceChecked: checked$1(review.evidenceChecked),
			seoChecked: checked$1(review.seoChecked),
			reviewNote: text$1(review.reviewNote)
		},
		extended: normalizeExtendedEditorial(source.extended)
	};
}
//#endregion
//#region lib/product-spotlight-draft.ts
var text = (value) => typeof value === "string" ? value : "";
var checked = (value) => value === true;
var record = (value) => value && typeof value === "object" && !Array.isArray(value) ? value : {};
function createProductSpotlightDraft(seed = {}) {
	return {
		templateKey: "product_spotlight",
		publication: {
			title: "",
			summary: "",
			answerFirst: "",
			heroUrl: ""
		},
		productInfo: {
			productName: seed.productName ?? "",
			keySpecs: "",
			keyFeatures: "",
			useCases: "",
			pricingNote: ""
		},
		comparison: {
			alternativeRef: "",
			advantageNote: ""
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
			productOwnerId: "",
			roadCaseId: "",
			proofLabId: "",
			brandPillarId: ""
		},
		review: {
			productChecked: false,
			comparisonChecked: false,
			evidenceChecked: false,
			seoChecked: false,
			reviewNote: ""
		},
		extended: createExtendedEditorial()
	};
}
function normalizeProductSpotlightDraft(value, seed = {}) {
	const source = record(value);
	const base = createProductSpotlightDraft(seed);
	if (source.templateKey !== "product_spotlight") {
		const legacyPublication = record(source.publication);
		const legacyEvidence = record(source.evidence);
		return {
			...base,
			publication: {
				...base.publication,
				title: text(legacyPublication.title) || text(source.title),
				summary: text(legacyPublication.summary) || text(source.summary),
				answerFirst: text(legacyPublication.answerFirst) || text(source.body),
				heroUrl: text(legacyPublication.heroUrl) || base.publication.heroUrl
			},
			evidence: {
				measurement: text(legacyEvidence.measurement),
				resultSummary: text(legacyEvidence.resultSummary),
				proofUrls: text(legacyEvidence.proofUrls),
				sourceNotes: text(legacyEvidence.sourceNotes)
			}
		};
	}
	const publication = record(source.publication);
	const productInfo = record(source.productInfo);
	const comparison = record(source.comparison);
	const evidence = record(source.evidence);
	const seo = record(source.seo);
	const review = record(source.review);
	return {
		templateKey: "product_spotlight",
		publication: {
			title: text(publication.title),
			summary: text(publication.summary),
			answerFirst: text(publication.answerFirst),
			heroUrl: text(publication.heroUrl)
		},
		productInfo: {
			productName: text(productInfo.productName) || base.productInfo.productName,
			keySpecs: text(productInfo.keySpecs),
			keyFeatures: text(productInfo.keyFeatures),
			useCases: text(productInfo.useCases),
			pricingNote: text(productInfo.pricingNote)
		},
		comparison: {
			alternativeRef: text(comparison.alternativeRef),
			advantageNote: text(comparison.advantageNote)
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
			productOwnerId: text(seo.productOwnerId),
			roadCaseId: text(seo.roadCaseId),
			proofLabId: text(seo.proofLabId),
			brandPillarId: text(seo.brandPillarId)
		},
		review: {
			productChecked: checked(review.productChecked),
			comparisonChecked: checked(review.comparisonChecked),
			evidenceChecked: checked(review.evidenceChecked),
			seoChecked: checked(review.seoChecked),
			reviewNote: text(review.reviewNote)
		},
		extended: normalizeExtendedEditorial(source.extended)
	};
}
//#endregion
//#region lib/case-draft.ts
/**
* Each Case Lab content type gets its own authoring template — the fields a
* "Nội dung thương hiệu" case needs (positioning, key messages) are not the
* fields a "Ca thực tế" vehicle case needs (odometer, installation stage).
*/
function createCaseDraft(contentType, seed = {}) {
	switch (contentType) {
		case "proof": return createProofLabDraft(seed);
		case "brand": return createBrandStoryDraft(seed);
		case "product": return createProductSpotlightDraft(seed);
		default: return createRoadLabDraft(seed);
	}
}
function normalizeCaseDraft(contentType, value, seed = {}) {
	switch (contentType) {
		case "proof": return normalizeProofLabDraft(value, seed);
		case "brand": return normalizeBrandStoryDraft(value, seed);
		case "product": return normalizeProductSpotlightDraft(value, seed);
		default: return normalizeRoadLabDraft(value, seed);
	}
}
/**
* Every content type's draft shares the same `publication` and `evidence`
* length limits, so the API route validates them once here after
* normalizing, instead of duplicating the same checks per type.
*/
function assertCaseDraftWithinLimits(draft) {
	if (draft.publication.title.trim().length < 3 || draft.publication.title.length > 180) throw new RangeError("Tiêu đề cần từ 3 đến 180 ký tự.");
	if (draft.publication.summary.length > 600 || draft.publication.answerFirst.length > 5e3) throw new RangeError("Nội dung vượt giới hạn cho phép.");
	if (draft.evidence.resultSummary.length > 5e3) throw new RangeError("Nội dung bằng chứng vượt giới hạn cho phép.");
}
//#endregion
export { parseFaqs as a, parseMetrics as c, parseTimeline as d, getCaseContentType as f, apiErrorResponse as h, getRoadLabMediaUrls as i, parseQc as l, CaseLabApiError as m, createCaseDraft as n, parseFollowup as o, normalizeCaseContentType as p, normalizeCaseDraft as r, parseListLines as s, assertCaseDraftWithinLimits as t, parseRelated as u };
