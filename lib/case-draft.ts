import type { CaseContentType } from "./case-content-types.ts";
import { createRoadLabDraft, normalizeRoadLabDraft, type RoadLabDraft } from "./road-lab-draft.ts";
import { createProofLabDraft, normalizeProofLabDraft, type ProofLabDraft } from "./proof-lab-draft.ts";
import { createBrandStoryDraft, normalizeBrandStoryDraft, type BrandStoryDraft } from "./brand-story-draft.ts";
import { createProductSpotlightDraft, normalizeProductSpotlightDraft, type ProductSpotlightDraft } from "./product-spotlight-draft.ts";

export type CaseDraft = RoadLabDraft | ProofLabDraft | BrandStoryDraft | ProductSpotlightDraft;
export type CaseTemplateKey = CaseDraft["templateKey"];

type DraftSeed = { vehicleName?: string; productName?: string };

export function templateKeyForContentType(contentType: CaseContentType): CaseTemplateKey {
  switch (contentType) {
    case "proof":
      return "proof_lab";
    case "brand":
      return "brand_story";
    case "product":
      return "product_spotlight";
    case "case":
    default:
      return "road_lab";
  }
}

/**
 * Each Case Lab content type gets its own authoring template — the fields a
 * "Nội dung thương hiệu" case needs (positioning, key messages) are not the
 * fields a "Ca thực tế" vehicle case needs (odometer, installation stage).
 */
export function createCaseDraft(contentType: CaseContentType, seed: DraftSeed = {}): CaseDraft {
  switch (contentType) {
    case "proof":
      return createProofLabDraft(seed);
    case "brand":
      return createBrandStoryDraft(seed);
    case "product":
      return createProductSpotlightDraft(seed);
    case "case":
    default:
      return createRoadLabDraft(seed);
  }
}

export function normalizeCaseDraft(contentType: CaseContentType, value: unknown, seed: DraftSeed = {}): CaseDraft {
  switch (contentType) {
    case "proof":
      return normalizeProofLabDraft(value, seed);
    case "brand":
      return normalizeBrandStoryDraft(value, seed);
    case "product":
      return normalizeProductSpotlightDraft(value, seed);
    case "case":
    default:
      return normalizeRoadLabDraft(value, seed);
  }
}

/**
 * Every content type's draft shares the same `publication` and `evidence`
 * length limits, so the API route validates them once here after
 * normalizing, instead of duplicating the same checks per type.
 */
export function assertCaseDraftWithinLimits(draft: CaseDraft): void {
  if (draft.publication.title.trim().length < 3 || draft.publication.title.length > 180) {
    throw new RangeError("Tiêu đề cần từ 3 đến 180 ký tự.");
  }
  if (draft.publication.summary.length > 600 || draft.publication.answerFirst.length > 5_000) {
    throw new RangeError("Nội dung vượt giới hạn cho phép.");
  }
  if (draft.evidence.resultSummary.length > 5_000) {
    throw new RangeError("Nội dung bằng chứng vượt giới hạn cho phép.");
  }
}
