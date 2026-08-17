import { createExtendedEditorial, normalizeExtendedEditorial, type ExtendedEditorial } from "./case-extended.ts";

export type BrandStoryDraft = {
  templateKey: "brand_story";
  publication: {
    title: string;
    summary: string;
    answerFirst: string;
    heroUrl: string;
  };
  positioning: {
    targetAudience: string;
    positioningStatement: string;
    toneOfVoice: string;
    keyMessages: string;
    differentiators: string;
  };
  support: {
    supportingFacts: string;
    socialProof: string;
  };
  evidence: {
    measurement: string;
    resultSummary: string;
    proofUrls: string;
    sourceNotes: string;
  };
  seo: {
    slug: string;
    metaTitle: string;
    metaDescription: string;
    brandPillarId: string;
    roadCaseId: string;
    proofLabId: string;
    productOwnerId: string;
  };
  review: {
    positioningChecked: boolean;
    supportChecked: boolean;
    evidenceChecked: boolean;
    seoChecked: boolean;
    reviewNote: string;
  };
  extended: ExtendedEditorial;
};

type DraftSeed = { vehicleName?: string; productName?: string };

const text = (value: unknown) => (typeof value === "string" ? value : "");
const checked = (value: unknown) => value === true;
const record = (value: unknown): Record<string, unknown> =>
  value && typeof value === "object" && !Array.isArray(value) ? (value as Record<string, unknown>) : {};

// eslint-disable-next-line @typescript-eslint/no-unused-vars -- seed kept for signature parity with the other draft types' create*Draft functions
export function createBrandStoryDraft(seed: DraftSeed = {}): BrandStoryDraft {
  return {
    templateKey: "brand_story",
    publication: { title: "", summary: "", answerFirst: "", heroUrl: "" },
    positioning: { targetAudience: "", positioningStatement: "", toneOfVoice: "", keyMessages: "", differentiators: "" },
    support: { supportingFacts: "", socialProof: "" },
    evidence: { measurement: "", resultSummary: "", proofUrls: "", sourceNotes: "" },
    seo: { slug: "", metaTitle: "", metaDescription: "", brandPillarId: "", roadCaseId: "", proofLabId: "", productOwnerId: "" },
    review: { positioningChecked: false, supportChecked: false, evidenceChecked: false, seoChecked: false, reviewNote: "" },
    extended: createExtendedEditorial(),
  };
}

export function normalizeBrandStoryDraft(value: unknown, seed: DraftSeed = {}): BrandStoryDraft {
  const source = record(value);
  const base = createBrandStoryDraft(seed);
  if (source.templateKey !== "brand_story") {
    return {
      ...base,
      publication: { ...base.publication, title: text(source.title), summary: text(source.summary), answerFirst: text(source.body) },
    };
  }

  const publication = record(source.publication);
  const positioning = record(source.positioning);
  const support = record(source.support);
  const evidence = record(source.evidence);
  const seo = record(source.seo);
  const review = record(source.review);
  return {
    templateKey: "brand_story",
    publication: { title: text(publication.title), summary: text(publication.summary), answerFirst: text(publication.answerFirst), heroUrl: text(publication.heroUrl) },
    positioning: { targetAudience: text(positioning.targetAudience), positioningStatement: text(positioning.positioningStatement), toneOfVoice: text(positioning.toneOfVoice), keyMessages: text(positioning.keyMessages), differentiators: text(positioning.differentiators) },
    support: { supportingFacts: text(support.supportingFacts), socialProof: text(support.socialProof) },
    evidence: { measurement: text(evidence.measurement), resultSummary: text(evidence.resultSummary), proofUrls: text(evidence.proofUrls), sourceNotes: text(evidence.sourceNotes) },
    seo: { slug: text(seo.slug), metaTitle: text(seo.metaTitle), metaDescription: text(seo.metaDescription), brandPillarId: text(seo.brandPillarId), roadCaseId: text(seo.roadCaseId), proofLabId: text(seo.proofLabId), productOwnerId: text(seo.productOwnerId) },
    review: { positioningChecked: checked(review.positioningChecked), supportChecked: checked(review.supportChecked), evidenceChecked: checked(review.evidenceChecked), seoChecked: checked(review.seoChecked), reviewNote: text(review.reviewNote) },
    extended: normalizeExtendedEditorial(source.extended),
  };
}
