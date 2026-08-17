import { createExtendedEditorial, normalizeExtendedEditorial, type ExtendedEditorial } from "./case-extended.ts";

export type ProductSpotlightDraft = {
  templateKey: "product_spotlight";
  publication: {
    title: string;
    summary: string;
    answerFirst: string;
    heroUrl: string;
  };
  productInfo: {
    productName: string;
    keySpecs: string;
    keyFeatures: string;
    useCases: string;
    pricingNote: string;
  };
  comparison: {
    alternativeRef: string;
    advantageNote: string;
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
    productOwnerId: string;
    roadCaseId: string;
    proofLabId: string;
    brandPillarId: string;
  };
  review: {
    productChecked: boolean;
    comparisonChecked: boolean;
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

export function createProductSpotlightDraft(seed: DraftSeed = {}): ProductSpotlightDraft {
  return {
    templateKey: "product_spotlight",
    publication: { title: "", summary: "", answerFirst: "", heroUrl: "" },
    productInfo: { productName: seed.productName ?? "", keySpecs: "", keyFeatures: "", useCases: "", pricingNote: "" },
    comparison: { alternativeRef: "", advantageNote: "" },
    evidence: { measurement: "", resultSummary: "", proofUrls: "", sourceNotes: "" },
    seo: { slug: "", metaTitle: "", metaDescription: "", productOwnerId: "", roadCaseId: "", proofLabId: "", brandPillarId: "" },
    review: { productChecked: false, comparisonChecked: false, evidenceChecked: false, seoChecked: false, reviewNote: "" },
    extended: createExtendedEditorial(),
  };
}

export function normalizeProductSpotlightDraft(value: unknown, seed: DraftSeed = {}): ProductSpotlightDraft {
  const source = record(value);
  const base = createProductSpotlightDraft(seed);
  if (source.templateKey !== "product_spotlight") {
    return {
      ...base,
      publication: { ...base.publication, title: text(source.title), summary: text(source.summary), answerFirst: text(source.body) },
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
    publication: { title: text(publication.title), summary: text(publication.summary), answerFirst: text(publication.answerFirst), heroUrl: text(publication.heroUrl) },
    productInfo: { productName: text(productInfo.productName) || base.productInfo.productName, keySpecs: text(productInfo.keySpecs), keyFeatures: text(productInfo.keyFeatures), useCases: text(productInfo.useCases), pricingNote: text(productInfo.pricingNote) },
    comparison: { alternativeRef: text(comparison.alternativeRef), advantageNote: text(comparison.advantageNote) },
    evidence: { measurement: text(evidence.measurement), resultSummary: text(evidence.resultSummary), proofUrls: text(evidence.proofUrls), sourceNotes: text(evidence.sourceNotes) },
    seo: { slug: text(seo.slug), metaTitle: text(seo.metaTitle), metaDescription: text(seo.metaDescription), productOwnerId: text(seo.productOwnerId), roadCaseId: text(seo.roadCaseId), proofLabId: text(seo.proofLabId), brandPillarId: text(seo.brandPillarId) },
    review: { productChecked: checked(review.productChecked), comparisonChecked: checked(review.comparisonChecked), evidenceChecked: checked(review.evidenceChecked), seoChecked: checked(review.seoChecked), reviewNote: text(review.reviewNote) },
    extended: normalizeExtendedEditorial(source.extended),
  };
}
