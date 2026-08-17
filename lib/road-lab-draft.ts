import { createExtendedEditorial, normalizeExtendedEditorial, type ExtendedEditorial } from "./case-extended.ts";

export type RoadLabDraft = {
  templateKey: "road_lab";
  publication: {
    title: string;
    summary: string;
    answerFirst: string;
    heroUrl: string;
  };
  vehicle: {
    vehicleName: string;
    modelYear: string;
    odometer: string;
    usageConditions: string;
    primaryNeed: string;
    installationStage: string;
  };
  configuration: {
    problem: string;
    beforeConfig: string;
    actualConfig: string;
    productName: string;
    materials: string;
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
    roadCaseId: string;
    proofLabId: string;
    brandPillarId: string;
    productOwnerId: string;
  };
  review: {
    contentChecked: boolean;
    evidenceChecked: boolean;
    seoChecked: boolean;
    technicalChecked: boolean;
    reviewNote: string;
  };
  extended: ExtendedEditorial;
};

type DraftSeed = { vehicleName?: string; productName?: string };

const text = (value: unknown) => (typeof value === "string" ? value : "");
const checked = (value: unknown) => value === true;
const record = (value: unknown): Record<string, unknown> =>
  value && typeof value === "object" && !Array.isArray(value) ? (value as Record<string, unknown>) : {};

const videoFilePattern = /\.(?:mp4|webm|mov|m4v)(?:$|[?#])/i;
const videoHosts = new Set(["youtube.com", "www.youtube.com", "youtu.be", "vimeo.com", "www.vimeo.com"]);

export function getRoadLabMediaUrls(value: unknown, limit = 12): string[] {
  if (typeof value !== "string") return [];

  const urls: string[] = [];
  const seen = new Set<string>();
  for (const candidate of value.split(/\r?\n/)) {
    if (urls.length >= limit) break;
    try {
      const parsed = new URL(candidate.trim());
      if ((parsed.protocol !== "https:" && parsed.protocol !== "http:") || seen.has(parsed.href)) continue;
      seen.add(parsed.href);
      urls.push(parsed.href);
    } catch {
      // Ignore incomplete or unsupported URLs; the editor keeps the original text for correction.
    }
  }
  return urls;
}

export function isRoadLabImageUrl(value: string): boolean {
  try {
    const parsed = new URL(value);
    return !videoFilePattern.test(parsed.href) && !videoHosts.has(parsed.hostname.toLowerCase());
  } catch {
    return false;
  }
}

export function createRoadLabDraft(seed: DraftSeed = {}): RoadLabDraft {
  return {
    templateKey: "road_lab",
    publication: { title: "", summary: "", answerFirst: "", heroUrl: "" },
    vehicle: {
      vehicleName: seed.vehicleName ?? "",
      modelYear: "",
      odometer: "",
      usageConditions: "",
      primaryNeed: "",
      installationStage: "",
    },
    configuration: { problem: "", beforeConfig: "", actualConfig: "", productName: seed.productName ?? "", materials: "" },
    evidence: { measurement: "", resultSummary: "", proofUrls: "", sourceNotes: "" },
    seo: { slug: "", metaTitle: "", metaDescription: "", roadCaseId: "", proofLabId: "", brandPillarId: "", productOwnerId: "" },
    review: { contentChecked: false, evidenceChecked: false, seoChecked: false, technicalChecked: false, reviewNote: "" },
    extended: createExtendedEditorial(),
  };
}

export function normalizeRoadLabDraft(value: unknown, seed: DraftSeed = {}): RoadLabDraft {
  const source = record(value);
  const base = createRoadLabDraft(seed);
  if (source.templateKey !== "road_lab") {
    return {
      ...base,
      publication: { ...base.publication, title: text(source.title), summary: text(source.summary), answerFirst: text(source.body) },
    };
  }

  const publication = record(source.publication);
  const vehicle = record(source.vehicle);
  const configuration = record(source.configuration);
  const evidence = record(source.evidence);
  const seo = record(source.seo);
  const review = record(source.review);
  return {
    templateKey: "road_lab",
    publication: { title: text(publication.title), summary: text(publication.summary), answerFirst: text(publication.answerFirst), heroUrl: text(publication.heroUrl) },
    vehicle: { vehicleName: text(vehicle.vehicleName) || base.vehicle.vehicleName, modelYear: text(vehicle.modelYear), odometer: text(vehicle.odometer), usageConditions: text(vehicle.usageConditions), primaryNeed: text(vehicle.primaryNeed), installationStage: text(vehicle.installationStage) },
    configuration: { problem: text(configuration.problem), beforeConfig: text(configuration.beforeConfig), actualConfig: text(configuration.actualConfig), productName: text(configuration.productName) || base.configuration.productName, materials: text(configuration.materials) },
    evidence: { measurement: text(evidence.measurement), resultSummary: text(evidence.resultSummary), proofUrls: text(evidence.proofUrls), sourceNotes: text(evidence.sourceNotes) },
    seo: { slug: text(seo.slug), metaTitle: text(seo.metaTitle), metaDescription: text(seo.metaDescription), roadCaseId: text(seo.roadCaseId), proofLabId: text(seo.proofLabId), brandPillarId: text(seo.brandPillarId), productOwnerId: text(seo.productOwnerId) },
    review: { contentChecked: checked(review.contentChecked), evidenceChecked: checked(review.evidenceChecked), seoChecked: checked(review.seoChecked), technicalChecked: checked(review.technicalChecked), reviewNote: text(review.reviewNote) },
    extended: normalizeExtendedEditorial(source.extended),
  };
}
