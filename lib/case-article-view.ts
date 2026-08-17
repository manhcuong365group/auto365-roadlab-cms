import type { CaseDraft } from "./case-draft.ts";
import { getRoadLabMediaUrls } from "./road-lab-draft.ts";
import {
  parseFaqs,
  parseFollowup,
  parseListLines,
  parseMetrics,
  parseQc,
  parseRelated,
  parseTimeline,
  type ExtendedEditorial,
  type FaqItem,
  type FollowupStep,
  type MetricItem,
  type QcItem,
  type RelatedLink,
  type TimelineStep,
} from "./case-extended.ts";

export type ArticleFact = { label: string; value: string; note?: string };
export type ArticleEntry = { label: string; value: string };

export type ArticleViewModel = {
  title: string;
  summary: string;
  answerFirst: string;
  heroUrl: string;
  facts: ArticleFact[];
  profileHeading: string;
  profileLead: string;
  profileEntries: ArticleEntry[];
  editorialHeading: string;
  editorialLead: string;
  editorialParagraphs: string[];
  editorialNoteLabel: string;
  editorialNoteText: string;
  methodHeading: string;
  methodLead: string;
  methodEntries: ArticleEntry[];
  evidenceImages: string[];
  sourceNote: string;
  slug: string;
  metaTitle: string;
  metaDescription: string;
  authorName: string;
  authorRole: string;
  reviewerName: string;
  reviewerRole: string;
  primarySource: string;
  timelineSteps: TimelineStep[];
  known: string[];
  unknown: string[];
  qcItems: QcItem[];
  faqs: FaqItem[];
  metrics: MetricItem[];
  priceValue: string;
  priceNote: string;
  priceIncludes: string[];
  beamCosUrl: string;
  beamCosCaption: string;
  beamPhaUrl: string;
  beamPhaCaption: string;
  followupSteps: FollowupStep[];
  relatedLinks: RelatedLink[];
};

const lines = (value: string): string[] => value.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
const firstLine = (value: string): string => lines(value)[0] ?? "";
const fallback = (value: string, whenEmpty: string): string => (value.trim() ? value : whenEmpty);

function buildExtendedFields(extended: ExtendedEditorial) {
  return {
    authorName: fallback(extended.authorName, "Auto365.vn"),
    authorRole: fallback(extended.authorRole, "Content Writer"),
    reviewerName: extended.reviewerName,
    reviewerRole: extended.reviewerRole,
    primarySource: extended.primarySource,
    timelineSteps: parseTimeline(extended.timeline),
    known: parseListLines(extended.known),
    unknown: parseListLines(extended.unknown),
    qcItems: parseQc(extended.qc),
    faqs: parseFaqs(extended.faqs),
    metrics: parseMetrics(extended.metrics),
    priceValue: extended.priceValue,
    priceNote: extended.priceNote,
    priceIncludes: parseListLines(extended.priceIncludes),
    beamCosUrl: extended.beamCosUrl,
    beamCosCaption: extended.beamCosCaption,
    beamPhaUrl: extended.beamPhaUrl,
    beamPhaCaption: extended.beamPhaCaption,
    followupSteps: parseFollowup(extended.followup),
    relatedLinks: parseRelated(extended.related),
  };
}

function buildRoadLabView(draft: Extract<CaseDraft, { templateKey: "road_lab" }>): ArticleViewModel {
  return {
    title: draft.publication.title,
    summary: draft.publication.summary,
    answerFirst: draft.publication.answerFirst,
    heroUrl: draft.publication.heroUrl,
    facts: [
      { label: "Xe thực tế", value: fallback(draft.vehicle.vehicleName, "Chưa cập nhật") },
      { label: "Đời xe", value: fallback(draft.vehicle.modelYear, "—") },
      { label: "ODO", value: fallback(draft.vehicle.odometer, "—") },
      { label: "Giai đoạn thi công", value: fallback(draft.vehicle.installationStage, "—") },
    ],
    profileHeading: "Hồ sơ xe",
    profileLead: "Bối cảnh sử dụng thực tế trước khi triển khai giải pháp.",
    profileEntries: [
      { label: "Nhu cầu chính", value: fallback(draft.vehicle.primaryNeed, "Chưa cập nhật") },
      { label: "Bối cảnh sử dụng", value: fallback(draft.vehicle.usageConditions, "Chưa cập nhật") },
    ],
    editorialHeading: "Vấn đề & cấu hình trước",
    editorialLead: "Vấn đề ban đầu và hiện trạng trước khi triển khai giải pháp.",
    editorialParagraphs: lines(draft.configuration.problem),
    editorialNoteLabel: "CẤU HÌNH TRƯỚC",
    editorialNoteText: fallback(draft.configuration.beforeConfig, "Chưa cập nhật."),
    methodHeading: "Cấu hình triển khai",
    methodLead: "Giải pháp thực tế đã lắp đặt cho ca này.",
    methodEntries: [
      { label: "Sản phẩm chính", value: fallback(draft.configuration.productName, "Chưa cập nhật") },
      { label: "Cấu hình thực tế", value: fallback(draft.configuration.actualConfig, "Chưa cập nhật") },
      { label: "Vật tư / phụ kiện", value: fallback(draft.configuration.materials, "Chưa cập nhật") },
    ],
    evidenceImages: getRoadLabMediaUrls(draft.evidence.proofUrls),
    sourceNote: draft.evidence.sourceNotes,
    slug: draft.seo.slug,
    metaTitle: draft.seo.metaTitle,
    metaDescription: draft.seo.metaDescription,
    ...buildExtendedFields(draft.extended),
  };
}

function buildProofLabView(draft: Extract<CaseDraft, { templateKey: "proof_lab" }>): ArticleViewModel {
  return {
    title: draft.publication.title,
    summary: draft.publication.summary,
    answerFirst: draft.publication.answerFirst,
    heroUrl: draft.publication.heroUrl,
    facts: [
      { label: "Đối tượng nghiệm thu", value: fallback(draft.verification.subjectRef, "Chưa cập nhật") },
      { label: "Phương pháp đo", value: fallback(draft.verification.testMethod, "—") },
      { label: "Tiêu chuẩn đối chiếu", value: fallback(draft.verification.standardRef, "—") },
      { label: "Người xác minh", value: fallback(draft.verification.verifiedBy, "—") },
    ],
    profileHeading: "Đối tượng nghiệm thu",
    profileLead: "Thông tin đối tượng và thời điểm thực hiện đo kiểm.",
    profileEntries: [
      { label: "Ngày đo / nghiệm thu", value: fallback(draft.verification.testedAt, "Chưa cập nhật") },
      { label: "Tiêu chuẩn / mốc đối chiếu", value: fallback(draft.verification.standardRef, "Chưa cập nhật") },
    ],
    editorialHeading: "Kết luận",
    editorialLead: "Kết luận rút ra từ kết quả đo kiểm.",
    editorialParagraphs: lines(draft.findings.conclusion),
    editorialNoteLabel: "SAI LỆCH / LƯU Ý",
    editorialNoteText: fallback(draft.findings.deviationNote, "Không ghi nhận sai lệch đáng chú ý."),
    methodHeading: "Kết quả trước & sau",
    methodLead: "So sánh trực tiếp kết quả đo trước và sau khi thực hiện.",
    methodEntries: [
      { label: "Kết quả trước", value: fallback(draft.findings.beforeResult, "Chưa cập nhật") },
      { label: "Kết quả sau", value: fallback(draft.findings.afterResult, "Chưa cập nhật") },
    ],
    evidenceImages: getRoadLabMediaUrls(draft.evidence.proofUrls),
    sourceNote: draft.evidence.sourceNotes,
    slug: draft.seo.slug,
    metaTitle: draft.seo.metaTitle,
    metaDescription: draft.seo.metaDescription,
    ...buildExtendedFields(draft.extended),
  };
}

function buildBrandStoryView(draft: Extract<CaseDraft, { templateKey: "brand_story" }>): ArticleViewModel {
  return {
    title: draft.publication.title,
    summary: draft.publication.summary,
    answerFirst: draft.publication.answerFirst,
    heroUrl: draft.publication.heroUrl,
    facts: [
      { label: "Đối tượng mục tiêu", value: fallback(draft.positioning.targetAudience, "Chưa cập nhật") },
      { label: "Tông giọng", value: fallback(draft.positioning.toneOfVoice, "—") },
      { label: "Thông điệp chính", value: fallback(firstLine(draft.positioning.keyMessages), "—") },
      { label: "Điểm khác biệt", value: fallback(firstLine(draft.positioning.differentiators), "—") },
    ],
    profileHeading: "Định vị thương hiệu",
    profileLead: "Tuyên bố định vị và đối tượng mà nội dung này hướng tới.",
    profileEntries: [
      { label: "Tuyên bố định vị", value: fallback(draft.positioning.positioningStatement, "Chưa cập nhật") },
    ],
    editorialHeading: "Thông điệp chính",
    editorialLead: "Những thông điệp cốt lõi cần truyền tải.",
    editorialParagraphs: lines(draft.positioning.keyMessages),
    editorialNoteLabel: "ĐIỂM KHÁC BIỆT",
    editorialNoteText: fallback(draft.positioning.differentiators, "Chưa cập nhật."),
    methodHeading: "Luận cứ hỗ trợ",
    methodLead: "Số liệu và bằng chứng xã hội hỗ trợ định vị.",
    methodEntries: [
      { label: "Số liệu / luận cứ hỗ trợ", value: fallback(draft.support.supportingFacts, "Chưa cập nhật") },
      { label: "Bằng chứng xã hội", value: fallback(draft.support.socialProof, "Chưa cập nhật") },
    ],
    evidenceImages: getRoadLabMediaUrls(draft.evidence.proofUrls),
    sourceNote: draft.evidence.sourceNotes,
    slug: draft.seo.slug,
    metaTitle: draft.seo.metaTitle,
    metaDescription: draft.seo.metaDescription,
    ...buildExtendedFields(draft.extended),
  };
}

function buildProductSpotlightView(draft: Extract<CaseDraft, { templateKey: "product_spotlight" }>): ArticleViewModel {
  return {
    title: draft.publication.title,
    summary: draft.publication.summary,
    answerFirst: draft.publication.answerFirst,
    heroUrl: draft.publication.heroUrl,
    facts: [
      { label: "Sản phẩm", value: fallback(draft.productInfo.productName, "Chưa cập nhật") },
      { label: "Giá / khuyến mãi", value: fallback(draft.productInfo.pricingNote, "—") },
      { label: "Thông số chính", value: fallback(firstLine(draft.productInfo.keySpecs), "—") },
      { label: "Lựa chọn thay thế", value: fallback(draft.comparison.alternativeRef, "—") },
    ],
    profileHeading: "Thông tin sản phẩm",
    profileLead: "Thông số và định vị giá của sản phẩm được giới thiệu.",
    profileEntries: [
      { label: "Thông số kỹ thuật chính", value: fallback(draft.productInfo.keySpecs, "Chưa cập nhật") },
    ],
    editorialHeading: "Tính năng nổi bật",
    editorialLead: "Những tính năng chính người đọc cần biết.",
    editorialParagraphs: lines(draft.productInfo.keyFeatures),
    editorialNoteLabel: "TRƯỜNG HỢP SỬ DỤNG",
    editorialNoteText: fallback(draft.productInfo.useCases, "Chưa cập nhật."),
    methodHeading: "So sánh lựa chọn",
    methodLead: "Đối chiếu với lựa chọn thay thế để làm rõ lợi thế.",
    methodEntries: [
      { label: "Lựa chọn thay thế", value: fallback(draft.comparison.alternativeRef, "Chưa cập nhật") },
      { label: "Lợi thế so với lựa chọn khác", value: fallback(draft.comparison.advantageNote, "Chưa cập nhật") },
    ],
    evidenceImages: getRoadLabMediaUrls(draft.evidence.proofUrls),
    sourceNote: draft.evidence.sourceNotes,
    slug: draft.seo.slug,
    metaTitle: draft.seo.metaTitle,
    metaDescription: draft.seo.metaDescription,
    ...buildExtendedFields(draft.extended),
  };
}

export function buildArticleViewModel(draft: CaseDraft): ArticleViewModel {
  switch (draft.templateKey) {
    case "proof_lab":
      return buildProofLabView(draft);
    case "brand_story":
      return buildBrandStoryView(draft);
    case "product_spotlight":
      return buildProductSpotlightView(draft);
    case "road_lab":
    default:
      return buildRoadLabView(draft as Extract<CaseDraft, { templateKey: "road_lab" }>);
  }
}

const SITE_URL = "https://auto365.vn";
const PUBLISHER_ID = `${SITE_URL}/#organization`;

const personId = (canonicalUrl: string, role: "author" | "reviewer") => `${canonicalUrl}#${role}`;

export function buildCaseArticleJsonLd(vm: ArticleViewModel, canonicalUrl: string, publishedAt: string) {
  const pageId = `${canonicalUrl}#webpage`;
  const articleId = `${canonicalUrl}#article`;
  const breadcrumbId = `${canonicalUrl}#breadcrumb`;
  const authorId = personId(canonicalUrl, "author");
  const reviewerId = vm.reviewerName ? personId(canonicalUrl, "reviewer") : undefined;

  const graph: Record<string, unknown>[] = [
    {
      "@type": "Article",
      "@id": articleId,
      headline: vm.title,
      description: vm.metaDescription || vm.summary,
      image: vm.heroUrl ? [vm.heroUrl] : undefined,
      datePublished: publishedAt,
      dateModified: publishedAt,
      inLanguage: "vi-VN",
      mainEntityOfPage: { "@id": pageId },
      publisher: { "@id": PUBLISHER_ID },
      author: { "@id": authorId },
      ...(reviewerId ? { reviewedBy: { "@id": reviewerId } } : {}),
      ...(vm.primarySource ? { citation: [{ "@type": "CreativeWork", name: vm.primarySource }] } : {}),
    },
    {
      "@type": "WebPage",
      "@id": pageId,
      url: canonicalUrl,
      name: vm.metaTitle || vm.title,
      description: vm.metaDescription || vm.summary,
      inLanguage: "vi-VN",
      breadcrumb: { "@id": breadcrumbId },
      mainEntity: { "@id": articleId },
    },
    {
      "@type": "BreadcrumbList",
      "@id": breadcrumbId,
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Auto365", item: `${SITE_URL}/` },
        { "@type": "ListItem", position: 2, name: vm.title, item: canonicalUrl },
      ],
    },
    {
      "@type": "Organization",
      "@id": PUBLISHER_ID,
      name: "Auto365.vn",
      url: `${SITE_URL}/`,
    },
    {
      "@type": "Person",
      "@id": authorId,
      name: vm.authorName,
      ...(vm.authorRole ? { jobTitle: vm.authorRole } : {}),
    },
  ];

  if (reviewerId) {
    graph.push({
      "@type": "Person",
      "@id": reviewerId,
      name: vm.reviewerName,
      ...(vm.reviewerRole ? { jobTitle: vm.reviewerRole } : {}),
    });
  }

  if (vm.priceValue) {
    graph.push({
      "@type": "Product",
      "@id": `${canonicalUrl}#product`,
      name: vm.title,
      offers: {
        "@type": "Offer",
        price: vm.priceValue.replace(/[^\d]/g, "") || undefined,
        priceCurrency: "VND",
        availability: "https://schema.org/InStock",
        url: canonicalUrl,
      },
    });
  }

  if (vm.faqs.length) {
    graph.push({
      "@type": "FAQPage",
      "@id": `${canonicalUrl}#faq`,
      mainEntity: vm.faqs.map((item) => ({
        "@type": "Question",
        name: item.q,
        acceptedAnswer: { "@type": "Answer", text: item.a },
      })),
    });
  }

  return { "@context": "https://schema.org", "@graph": graph };
}
