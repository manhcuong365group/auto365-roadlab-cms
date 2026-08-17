// Editorial fields shared by all four Case Lab templates: author/reviewer
// attribution, a primary source, a build timeline, a known/unknown ledger,
// a QC checklist and FAQ — the parts of the public article page that don't
// vary by content type. Stored as plain multi-line text in the editor (one
// entry per line, using an em dash to separate a two-part entry) and parsed
// into structured rows only when rendering the public page.
export type ExtendedEditorial = {
  authorName: string;
  authorRole: string;
  reviewerName: string;
  reviewerRole: string;
  primarySource: string;
  timeline: string;
  known: string;
  unknown: string;
  qc: string;
  faqs: string;
  metrics: string;
  priceValue: string;
  priceNote: string;
  priceIncludes: string;
  beamCosUrl: string;
  beamCosCaption: string;
  beamPhaUrl: string;
  beamPhaCaption: string;
  followup: string;
  related: string;
};

const text = (value: unknown) => (typeof value === "string" ? value : "");
const record = (value: unknown): Record<string, unknown> =>
  value && typeof value === "object" && !Array.isArray(value) ? (value as Record<string, unknown>) : {};

export function createExtendedEditorial(): ExtendedEditorial {
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
    related: "",
  };
}

export function normalizeExtendedEditorial(value: unknown): ExtendedEditorial {
  const source = record(value);
  return {
    authorName: text(source.authorName),
    authorRole: text(source.authorRole),
    reviewerName: text(source.reviewerName),
    reviewerRole: text(source.reviewerRole),
    primarySource: text(source.primarySource),
    timeline: text(source.timeline),
    known: text(source.known),
    unknown: text(source.unknown),
    qc: text(source.qc),
    faqs: text(source.faqs),
    metrics: text(source.metrics),
    priceValue: text(source.priceValue),
    priceNote: text(source.priceNote),
    priceIncludes: text(source.priceIncludes),
    beamCosUrl: text(source.beamCosUrl),
    beamCosCaption: text(source.beamCosCaption),
    beamPhaUrl: text(source.beamPhaUrl),
    beamPhaCaption: text(source.beamPhaCaption),
    followup: text(source.followup),
    related: text(source.related),
  };
}

export type TimelineStep = { title: string; text: string };
export type QcItem = { label: string; result: string };
export type FaqItem = { q: string; a: string };
export type MetricItem = { label: string; value: string; note: string };
export type FollowupStep = { label: string; date: string; done: boolean };
export type RelatedLink = { label: string; url: string };

const lines = (value: string): string[] => value.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
// An em/en dash separates fields on its own; a plain hyphen only counts as a
// separator when surrounded by whitespace, so hyphenated names like
// "X-Light" or "bộ-gá" are never mistaken for a field split.
const SEPARATOR = /\s*[—–]\s*|\s+-{1,2}\s+/;
const splitDash = (line: string): string[] => line.split(SEPARATOR).map((part) => part.trim());

/** Parses "Tiêu đề — Mô tả" lines (em dash or double hyphen separator). */
export function parseTimeline(value: string): TimelineStep[] {
  return lines(value).map((line) => {
    const [title, ...rest] = line.split(SEPARATOR);
    return { title: (title ?? line).trim(), text: rest.join(" — ").trim() };
  });
}

/** Parses "Hạng mục — Kết quả" lines the same way as the timeline. */
export function parseQc(value: string): QcItem[] {
  return lines(value).map((line) => {
    const [label, ...rest] = line.split(SEPARATOR);
    return { label: (label ?? line).trim(), result: rest.join(" — ").trim() || "Đã kiểm tra" };
  });
}

export function parseListLines(value: string): string[] {
  return lines(value);
}

/** Parses "Q: ...\nA: ...\n\nQ: ...\nA: ..." blocks separated by a blank line. */
export function parseFaqs(value: string): FaqItem[] {
  return value
    .split(/\r?\n\s*\r?\n/)
    .map((block) => block.trim())
    .filter(Boolean)
    .map((block) => {
      const qMatch = block.match(/^Q:\s*(.+)$/im);
      const aMatch = block.match(/^A:\s*([\s\S]+)$/im);
      return { q: (qMatch?.[1] ?? "").trim(), a: (aMatch?.[1] ?? "").trim() };
    })
    .filter((item) => item.q && item.a);
}

/** Parses "Nhãn — Giá trị — Ghi chú" lines into product spec rows. */
export function parseMetrics(value: string): MetricItem[] {
  return lines(value).map((line) => {
    const [label, val, note] = splitDash(line);
    return { label: label ?? line, value: val ?? "", note: note ?? "" };
  });
}

/** Parses "Mốc — Ngày — done|pending" lines into a post-service follow-up track. */
export function parseFollowup(value: string): FollowupStep[] {
  return lines(value).map((line) => {
    const [label, date, status] = splitDash(line);
    return { label: label ?? line, date: date ?? "", done: (status ?? "").toLowerCase().startsWith("done") };
  });
}

/** Parses "Nhãn — URL" lines into related-content links. */
export function parseRelated(value: string): RelatedLink[] {
  return lines(value)
    .map((line) => {
      const [label, url] = splitDash(line);
      return { label: label ?? line, url: url ?? "" };
    })
    .filter((item) => item.url);
}
