import { createExtendedEditorial, normalizeExtendedEditorial, type ExtendedEditorial } from "./case-extended.ts";

export type ProofLabDraft = {
  templateKey: "proof_lab";
  publication: {
    title: string;
    summary: string;
    answerFirst: string;
    heroUrl: string;
  };
  verification: {
    subjectRef: string;
    testMethod: string;
    standardRef: string;
    testedAt: string;
    verifiedBy: string;
  };
  findings: {
    beforeResult: string;
    afterResult: string;
    conclusion: string;
    deviationNote: string;
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
    proofLabId: string;
    roadCaseId: string;
    brandPillarId: string;
    productOwnerId: string;
  };
  review: {
    verificationChecked: boolean;
    findingsChecked: boolean;
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

export function createProofLabDraft(seed: DraftSeed = {}): ProofLabDraft {
  return {
    templateKey: "proof_lab",
    publication: { title: "", summary: "", answerFirst: "", heroUrl: "" },
    verification: { subjectRef: seed.productName ?? "", testMethod: "", standardRef: "", testedAt: "", verifiedBy: "" },
    findings: { beforeResult: "", afterResult: "", conclusion: "", deviationNote: "" },
    evidence: { measurement: "", resultSummary: "", proofUrls: "", sourceNotes: "" },
    seo: { slug: "", metaTitle: "", metaDescription: "", proofLabId: "", roadCaseId: "", brandPillarId: "", productOwnerId: "" },
    review: { verificationChecked: false, findingsChecked: false, evidenceChecked: false, seoChecked: false, reviewNote: "" },
    extended: createExtendedEditorial(),
  };
}

export function normalizeProofLabDraft(value: unknown, seed: DraftSeed = {}): ProofLabDraft {
  const source = record(value);
  const base = createProofLabDraft(seed);
  if (source.templateKey !== "proof_lab") {
    return {
      ...base,
      publication: { ...base.publication, title: text(source.title), summary: text(source.summary), answerFirst: text(source.body) },
    };
  }

  const publication = record(source.publication);
  const verification = record(source.verification);
  const findings = record(source.findings);
  const evidence = record(source.evidence);
  const seo = record(source.seo);
  const review = record(source.review);
  return {
    templateKey: "proof_lab",
    publication: { title: text(publication.title), summary: text(publication.summary), answerFirst: text(publication.answerFirst), heroUrl: text(publication.heroUrl) },
    verification: { subjectRef: text(verification.subjectRef) || base.verification.subjectRef, testMethod: text(verification.testMethod), standardRef: text(verification.standardRef), testedAt: text(verification.testedAt), verifiedBy: text(verification.verifiedBy) },
    findings: { beforeResult: text(findings.beforeResult), afterResult: text(findings.afterResult), conclusion: text(findings.conclusion), deviationNote: text(findings.deviationNote) },
    evidence: { measurement: text(evidence.measurement), resultSummary: text(evidence.resultSummary), proofUrls: text(evidence.proofUrls), sourceNotes: text(evidence.sourceNotes) },
    seo: { slug: text(seo.slug), metaTitle: text(seo.metaTitle), metaDescription: text(seo.metaDescription), proofLabId: text(seo.proofLabId), roadCaseId: text(seo.roadCaseId), brandPillarId: text(seo.brandPillarId), productOwnerId: text(seo.productOwnerId) },
    review: { verificationChecked: checked(review.verificationChecked), findingsChecked: checked(review.findingsChecked), evidenceChecked: checked(review.evidenceChecked), seoChecked: checked(review.seoChecked), reviewNote: text(review.reviewNote) },
    extended: normalizeExtendedEditorial(source.extended),
  };
}
