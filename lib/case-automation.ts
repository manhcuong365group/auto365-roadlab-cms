export type Vertical = "lighting" | "film" | "camera" | "ppf";
export type PriceStatus = "product_only" | "complete" | "from" | "not_published";
export type WorkflowStatus =
  | "draft"
  | "ready_for_review"
  | "changes_requested"
  | "technical_approved"
  | "publishable"
  | "published"
  | "followup_due";

export type StudioMedia = {
  id: string;
  role:
    | "hero"
    | "vehicle"
    | "detail"
    | "result_primary"
    | "result_secondary"
    | "product"
    | "qc"
    | "follow_up";
  label: string;
  required: boolean;
  url: string;
  caption: string;
  alt: string;
  capturedAt: string;
  rightsConfirmed: boolean;
};

export type StudioModules = {
  gallery: boolean;
  timeline: boolean;
  productSpecs: boolean;
  price: boolean;
  measurement: boolean;
  followUp: boolean;
  faq: boolean;
};

export type StudioCase = {
  templateVersion: "1.3";
  draftId: string;
  workflowStatus: WorkflowStatus;
  vertical: Vertical;
  make: string;
  model: string;
  year: string;
  trim: string;
  product: string;
  configuration: string;
  conditionBefore: string;
  need: string;
  reason: string;
  branch: string;
  workDate: string;
  author: string;
  reviewer: string;
  removedBumper: "yes" | "no" | "unknown";
  bracket: string;
  originalCut: "yes" | "no" | "unknown";
  relay: "yes" | "no" | "unknown";
  fuse: "yes" | "no" | "unknown";
  qc: string;
  priceStatus: PriceStatus;
  productPrice: string;
  totalPrice: string;
  vatIncluded: "yes" | "no" | "unknown";
  sourceConfirmed: boolean;
  sourceName: string;
  sourceDate: string;
  measuredClaim: boolean;
  measurementMethod: string;
  followUp: boolean;
  hubUrl: string;
  productUrl: string;
  intentChecked: boolean;
  technicalApproved: boolean;
  filmGlassMap: string;
  filmEdgeTreatment: string;
  cameraFirmware: string;
  cameraPower: string;
  cameraParkingMode: string;
  cameraOriginalVideo: boolean;
  ppfCoverage: string;
  ppfBatch: string;
  ppfCutMethod: string;
  ppfEdgeWrap: string;
  modules: StudioModules;
  media: StudioMedia[];
};

export type GateResult = {
  errors: string[];
  warnings: string[];
  issues: GateIssue[];
  gates: {
    content: boolean;
    evidence: boolean;
    technical: boolean;
    seo: boolean;
  };
  readyForReview: boolean;
  publishable: boolean;
};

export type GateIssue = {
  code: string;
  field: string;
  step: 1 | 2 | 3;
  owner: "content" | "technical" | "system";
  severity: "error" | "warning";
  message: string;
};

export type CatalogProduct = {
  ref: string;
  name: string;
  shortName: string;
  url: string;
  entityId: string;
  urlOwner: "product" | "hub";
  source?: { name: string; date: string };
  defaultPrice?: { value: string; vatIncluded: StudioCase["vatIncluded"] };
};

export const verticalLabels: Record<Vertical, string> = {
  lighting: "Đèn / Bi gầm",
  film: "Phim cách nhiệt",
  camera: "Camera hành trình",
  ppf: "PPF",
};

export const vehicleCatalog = [
  { make: "Toyota", model: "Camry", years: ["2014", "2019", "2024"], trims: ["2.5Q", "2.0Q", "Hybrid"] },
  { make: "Hyundai", model: "Santa Fe", years: ["2022", "2024", "2025"], trims: ["Premium", "Prestige", "Calligraphy"] },
  { make: "VinFast", model: "VF 3", years: ["2024", "2025", "2026"], trims: ["Base", "Plus"] },
  { make: "Mazda", model: "CX-5", years: ["2021", "2023", "2025"], trims: ["Luxury", "Premium", "Signature"] },
];

export const productCatalog: Record<Vertical, CatalogProduct[]> = {
  lighting: [
    {
      ref: "xlight-f10-turbo-v2", name: "X-Light F10 Turbo V2", shortName: "F10 Turbo V2",
      url: "https://auto365.vn/den-bi-gam-x-light-f10-turbo-v2",
      entityId: "https://auto365.vn/#product-x-light-f10-turbo-v2", urlOwner: "product",
      source: { name: "Tài liệu sản phẩm X-Light / 365Group", date: "2026-08-10" },
      defaultPrice: { value: "6.000.000 VNĐ/cặp", vatIncluded: "no" },
    },
    {
      ref: "xlight-f10-hyper-2", name: "X-Light F10 Hyper 2.0", shortName: "F10 Hyper 2.0",
      url: "https://auto365.vn/den-bi-gam-x-light-f10-hyper-2-0",
      entityId: "https://auto365.vn/#product-x-light-f10-hyper-2", urlOwner: "product",
    },
    {
      ref: "titan-m301", name: "Titan M301", shortName: "Titan M301",
      url: "https://auto365.vn/den-gam-dang-roi",
      entityId: "https://auto365.vn/#product-titan-m301", urlOwner: "hub",
    },
  ],
  film: [
    {
      ref: "3m-crystalline-cr-blk", name: "3M Crystalline CR BLK", shortName: "3M CR BLK",
      url: "https://auto365.vn/phim-cach-nhiet-3m-crystalline-cr-blk",
      entityId: "https://auto365.vn/#product-3m-crystalline-cr-blk", urlOwner: "product",
      source: { name: "Tài liệu kỹ thuật 3M, 3M Việt Nam", date: "2026-06" },
    },
    {
      ref: "3m-ceramic-ir", name: "3M Ceramic IR", shortName: "3M Ceramic IR",
      url: "https://auto365.vn/phim-cach-nhiet-o-to-3m-ceramic-ir",
      entityId: "https://auto365.vn/#product-3m-ceramic-ir", urlOwner: "product",
      source: { name: "Tài liệu kỹ thuật 3M, 3M Việt Nam", date: "2026-06" },
    },
    {
      ref: "3m-ceramic-nr", name: "3M Ceramic NR", shortName: "3M Ceramic NR",
      url: "https://auto365.vn/phim-cach-nhiet-3m-ceramic-nr",
      entityId: "https://auto365.vn/#product-3m-ceramic-nr", urlOwner: "product",
      source: { name: "Tài liệu kỹ thuật 3M, 3M Việt Nam", date: "2026-06" },
    },
  ],
  camera: [
    { ref: "vietmap-m1", name: "Vietmap M1", shortName: "Vietmap M1", url: "https://auto365.vn/camera-hanh-trinh-o-to", entityId: "https://auto365.vn/#product-vietmap-m1", urlOwner: "hub" },
    { ref: "70mai-a810", name: "70mai A810", shortName: "70mai A810", url: "https://auto365.vn/camera-hanh-trinh-o-to", entityId: "https://auto365.vn/#product-70mai-a810", urlOwner: "hub" },
    { ref: "blackvue-dr970x", name: "BlackVue DR970X", shortName: "BlackVue DR970X", url: "https://auto365.vn/camera-hanh-trinh-o-to", entityId: "https://auto365.vn/#product-blackvue-dr970x", urlOwner: "hub" },
  ],
  ppf: [
    { ref: "3m-ppf-series-100", name: "3M PPF Series 100", shortName: "3M PPF Series 100", url: "https://auto365.vn/ppf-3m", entityId: "https://auto365.vn/#product-3m-ppf-series-100", urlOwner: "hub", source: { name: "Tài liệu kỹ thuật 3M, 3M Việt Nam", date: "2026-06" } },
    { ref: "3m-ppf-series-150", name: "3M PPF Series 150", shortName: "3M PPF Series 150", url: "https://auto365.vn/ppf-3m", entityId: "https://auto365.vn/#product-3m-ppf-series-150", urlOwner: "hub", source: { name: "Tài liệu kỹ thuật 3M, 3M Việt Nam", date: "2026-06" } },
  ],
};

export const branchCatalog = [
  "Auto365.vn - Trụ Sở Chính",
  "Auto365 Biên Hòa",
  "Auto365 Nha Trang",
  "Auto365 Hà Nội",
];

export const authorCatalog = ["Vinh", "Vàng", "Phương", "Thảo", "Nhiên", "Mai Trinh"];
export const reviewerCatalog = ["Nguyễn Quang Đạo", "Đặng Minh Hoàng"];

export const hubByVertical: Record<Vertical, string> = {
  lighting: "https://auto365.vn/nang-cap-anh-sang-bi-gam",
  film: "https://auto365.vn/phim-cach-nhiet",
  camera: "https://auto365.vn/camera-hanh-trinh-o-to",
  ppf: "https://auto365.vn/ppf-o-to",
};

const mediaLabels: Record<Vertical, Array<[StudioMedia["role"], string, boolean]>> = {
  lighting: [
    ["hero", "Ảnh hero toàn xe", true],
    ["vehicle", "Ảnh xe / hiện trạng", true],
    ["detail", "Ảnh chi tiết lắp đặt", true],
    ["result_primary", "Ảnh kết quả Cos", true],
    ["result_secondary", "Ảnh kết quả Pha", true],
    ["product", "Ảnh sản phẩm / tem hộp", false],
    ["qc", "Ảnh QC / kỹ thuật viên", false],
    ["follow_up", "Ảnh hậu kiểm", false],
  ],
  film: [
    ["hero", "Ảnh hero toàn xe", true],
    ["vehicle", "Ảnh kính / hiện trạng", true],
    ["detail", "Ảnh mã phim hoặc thi công", true],
    ["result_primary", "Ảnh nhìn từ trong xe", true],
    ["result_secondary", "Ảnh hoàn thiện bên ngoài", true],
    ["product", "Ảnh mã phim / tem cuộn", false],
    ["qc", "Ảnh đo hoặc kiểm tra mép", false],
    ["follow_up", "Ảnh hậu kiểm ổn định phim", false],
  ],
  camera: [
    ["hero", "Ảnh hero toàn xe", true],
    ["vehicle", "Ảnh vị trí lắp camera", true],
    ["detail", "Ảnh nguồn / đi dây", true],
    ["result_primary", "Khung hình ban ngày", true],
    ["result_secondary", "Khung hình ban đêm", true],
    ["product", "Ảnh thiết bị / serial", false],
    ["qc", "Ảnh app / GPS / firmware", false],
    ["follow_up", "Ảnh hậu kiểm lưu trữ", false],
  ],
  ppf: [
    ["hero", "Ảnh hero toàn xe", true],
    ["vehicle", "Ảnh bề mặt sơn trước thi công", true],
    ["detail", "Ảnh mã lô / mép thi công", true],
    ["result_primary", "Ảnh hoàn thiện góc 1", true],
    ["result_secondary", "Ảnh hoàn thiện góc 2", true],
    ["product", "Ảnh tem cuộn / mã lô", false],
    ["qc", "Ảnh QC bọt, mép và panel", false],
    ["follow_up", "Ảnh hậu kiểm sau curing", false],
  ],
};

export function createMediaSlots(vertical: Vertical): StudioMedia[] {
  return mediaLabels[vertical].map(([role, label, required], index) => ({
    id: `${vertical}-${role}-${index + 1}`,
    role,
    label,
    required,
    url: "",
    caption: "",
    alt: "",
    capturedAt: "",
    rightsConfirmed: false,
  }));
}

export function applyProfileDefaults(
  data: StudioCase,
  defaults: { branch?: string; author?: string; reviewer?: string; workDate?: string },
): StudioCase {
  return {
    ...data,
    branch: data.branch || defaults.branch || "",
    author: data.author || defaults.author || "",
    reviewer: data.reviewer || defaults.reviewer || "",
    workDate: data.workDate || defaults.workDate || "",
  };
}

export function applyMediaBatchDefaults(data: StudioCase, confirmRights: boolean): StudioCase {
  const vehicle = [data.make, data.model, data.year, data.trim].filter(Boolean).join(" ") || "ca xe";
  const product = data.product || "sản phẩm";
  return {
    ...data,
    media: data.media.map((asset) => {
      if (!asset.url.trim()) return asset;
      return {
        ...asset,
        caption: asset.caption || `${asset.label} thuộc đúng hồ sơ ${vehicle} lắp ${product}.`,
        alt: asset.alt || `${asset.label} ${vehicle} ${product}`,
        capturedAt: asset.capturedAt || data.workDate,
        rightsConfirmed: confirmRights ? true : asset.rightsConfirmed,
      };
    }),
  };
}

const requiredLabels: Array<[keyof StudioCase, string]> = [
  ["make", "hãng xe"],
  ["model", "mẫu xe"],
  ["year", "đời xe"],
  ["trim", "phiên bản"],
  ["product", "sản phẩm"],
  ["configuration", "cấu hình"],
  ["conditionBefore", "hiện trạng trước thi công"],
  ["need", "nhu cầu thật"],
  ["reason", "lý do chọn cấu hình"],
  ["branch", "điểm thi công"],
  ["workDate", "ngày thi công/dữ liệu"],
  ["author", "tác giả"],
  ["reviewer", "người duyệt kỹ thuật"],
  ["qc", "kết quả nghiệm thu"],
];

const requiredMediaRoles: StudioMedia["role"][] = [
  "hero",
  "vehicle",
  "detail",
  "result_primary",
  "result_secondary",
];

function makeGateIssue(message: string, severity: GateIssue["severity"]): GateIssue {
  const normalized = message.toLowerCase();
  const isSystem = /catalog|url owner|hub url|ánh xạ sản phẩm|trùng url|intent/.test(normalized);
  const isTechnical = /kỹ thuật|pát|bộ gá|firmware|cấp nguồn|vùng phủ|mã phim|mã lô|phương pháp cắt|nghiệm thu|đo lường/.test(normalized);
  const isMedia = /ảnh|media|quyền dùng|chú thích|ngày ghi nhận|bằng chứng/.test(normalized);
  const isFinal = /tác giả|người duyệt|giá|vat|hóa đơn/.test(normalized) || isSystem;
  return {
    code: cleanSlug(message).slice(0, 48) || "case-issue",
    field: isMedia ? "media" : isTechnical ? "technical" : isFinal ? "review" : "identity",
    step: isMedia || isTechnical ? 2 : isFinal ? 3 : 1,
    owner: isSystem ? "system" : isTechnical ? "technical" : "content",
    severity,
    message,
  };
}

export function validateCase(data: StudioCase): GateResult {
  const contentErrors: string[] = [];
  const evidenceErrors: string[] = [];
  const seoErrors: string[] = [];
  const warnings: string[] = [];

  requiredLabels.forEach(([key, label]) => {
    if (!String(data[key] ?? "").trim()) contentErrors.push(`Thiếu ${label}.`);
  });

  const matchedVehicle = vehicleCatalog.find((item) =>
    item.make === data.make
    && item.model === data.model
    && item.years.includes(data.year)
    && item.trims.includes(data.trim));
  if (!matchedVehicle && data.make && data.model && data.year && data.trim) {
    contentErrors.push("Xe, đời xe hoặc phiên bản không thuộc catalog đã duyệt.");
  }
  const matchedProduct = productCatalog[data.vertical]?.find((item) =>
    item.name === data.product && item.url === data.productUrl);
  if (!matchedProduct && data.product) contentErrors.push("Sản phẩm hoặc URL sản phẩm không khớp catalog đúng tuyến.");
  if (data.branch && !branchCatalog.includes(data.branch)) contentErrors.push("Chi nhánh không thuộc catalog đã duyệt.");
  if (data.author && !authorCatalog.includes(data.author)) contentErrors.push("Tác giả không thuộc catalog đã duyệt.");
  if (data.reviewer && !reviewerCatalog.includes(data.reviewer)) contentErrors.push("Người duyệt không thuộc catalog đã duyệt.");

  if (data.vertical === "lighting") {
    if (!data.bracket.trim()) contentErrors.push("Thiếu phương án pát/bộ gá của ca đèn.");
    if ([data.removedBumper, data.originalCut, data.relay, data.fuse].includes("unknown")) {
      warnings.push("Một số chi tiết thi công đèn chưa được kỹ thuật xác nhận.");
    }
  }
  if (data.vertical === "film") {
    if (!data.filmGlassMap.trim()) contentErrors.push("Thiếu mã phim theo từng vị trí kính.");
    if (!data.filmEdgeTreatment.trim()) warnings.push("Chưa ghi nhận xử lý mép phim.");
  }
  if (data.vertical === "camera") {
    if (!data.cameraFirmware.trim()) contentErrors.push("Thiếu phiên bản firmware camera.");
    if (!data.cameraPower.trim()) contentErrors.push("Thiếu phương án cấp nguồn camera.");
    if (!data.cameraOriginalVideo) warnings.push("Chưa có video ngày/đêm gốc.");
  }
  if (data.vertical === "ppf") {
    if (!data.ppfCoverage.trim()) contentErrors.push("Thiếu sơ đồ vùng phủ PPF.");
    if (!data.ppfBatch.trim()) contentErrors.push("Thiếu mã phim/mã lô PPF.");
    if (!data.ppfCutMethod.trim()) contentErrors.push("Thiếu phương pháp cắt PPF.");
    if (!data.ppfEdgeWrap.trim()) warnings.push("Chưa ghi nhận phương án bo mép PPF.");
  }

  const catalogSourceReady = Boolean(
    matchedProduct?.source
    && matchedProduct.source.name === data.sourceName
    && matchedProduct.source.date === data.sourceDate,
  );
  if (!catalogSourceReady) evidenceErrors.push("Catalog sản phẩm chưa có nguồn chuẩn hoặc phiên bản nguồn không khớp.");
  const media = Array.isArray(data.media) ? data.media : [];
  requiredMediaRoles.forEach((role) => {
    const count = media.filter((asset) => asset.role === role).length;
    if (count !== 1) evidenceErrors.push(`Media phải có đúng một vai trò ${role}.`);
  });
  const populatedUrls = media.map((asset) => asset.url.trim()).filter(Boolean);
  if (new Set(populatedUrls).size !== populatedUrls.length) {
    evidenceErrors.push("Không được dùng trùng một ảnh cho nhiều vai trò bằng chứng.");
  }
  media.forEach((asset) => {
    const started = Boolean(asset.url.trim() || asset.caption.trim() || asset.capturedAt || asset.rightsConfirmed);
    const isCoreRole = requiredMediaRoles.includes(asset.role);
    if (!isCoreRole && !started) return;
    if (!asset.url.trim()) evidenceErrors.push(`Thiếu ${asset.label.toLowerCase()}.`);
    if (!asset.caption.trim()) evidenceErrors.push(`Thiếu chú thích cho ${asset.label.toLowerCase()}.`);
    if (!asset.capturedAt.trim()) evidenceErrors.push(`Thiếu ngày ghi nhận cho ${asset.label.toLowerCase()}.`);
    if (!asset.rightsConfirmed) evidenceErrors.push(`Chưa xác nhận quyền dùng ${asset.label.toLowerCase()}.`);
  });

  if (data.measuredClaim && data.measurementMethod.trim().length < 30) {
    evidenceErrors.push("Có tuyên bố đo lường nhưng thiếu thiết bị, phương pháp và điều kiện đo.");
  }
  if (data.followUp) {
    const followUpAsset = media.find((asset) => asset.role === "follow_up");
    if (!followUpAsset?.url.trim() || !followUpAsset.caption.trim() || !followUpAsset.capturedAt.trim()) {
      evidenceErrors.push("Đã bật hậu kiểm nhưng chưa có ngày, kết quả và ảnh bằng chứng hậu kiểm.");
    }
  }
  if (data.priceStatus === "complete" && !data.totalPrice.trim()) {
    contentErrors.push("Đang chọn giá hoàn thiện nhưng chưa nhập tổng tiền.");
  }
  if (["product_only", "from"].includes(data.priceStatus) && !data.productPrice.trim()) {
    contentErrors.push("Trạng thái giá đang chọn yêu cầu nhập mức giá.");
  }
  if (data.priceStatus === "product_only") warnings.push("Chưa công bố tổng hóa đơn hoàn thiện.");
  if (data.priceStatus === "not_published") warnings.push("Bài không công bố giá.");
  if (!data.measuredClaim) warnings.push("Chưa có phép đo chuẩn hóa; bài sẽ hiển thị giới hạn dữ liệu.");
  if (!data.followUp) warnings.push("Chưa có hậu kiểm 7–30 ngày.");

  if (data.hubUrl !== hubByVertical[data.vertical]) seoErrors.push("Hub URL không khớp link map đúng tuyến.");
  if (!matchedProduct) seoErrors.push("Thiếu ánh xạ sản phẩm hợp lệ từ catalog.");
  if (matchedProduct?.urlOwner !== "product") seoErrors.push("Sản phẩm chưa có URL owner riêng; hệ thống SEO phải xử lý trước khi đăng.");

  const gates = {
    content: contentErrors.length === 0,
    evidence: evidenceErrors.length === 0,
    technical: data.technicalApproved,
    seo: seoErrors.length === 0,
  };
  const errors = [...contentErrors, ...evidenceErrors, ...seoErrors];
  const issues = [...errors.map((message) => makeGateIssue(message, "error")), ...warnings.map((message) => makeGateIssue(message, "warning"))];
  return {
    errors,
    warnings,
    issues,
    gates,
    readyForReview: gates.content && gates.evidence && gates.seo,
    publishable: gates.content && gates.evidence && gates.technical && gates.seo,
  };
}

function cleanSlug(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 90);
}

function truncateAtWord(value: string, limit: number) {
  if (value.length <= limit) return value;
  const cut = value.slice(0, limit + 1).replace(/\s+\S*$/, "").trim();
  return cut || value.slice(0, limit).trim();
}

export function generateOutputs(data: StudioCase) {
  const vehicle = [data.make, data.model, data.year, data.trim].filter(Boolean).join(" ");
  const action = data.vertical === "film" || data.vertical === "ppf" ? "dán" : "lắp";
  const product = productCatalog[data.vertical].find((item) => item.name === data.product);
  const productName = product?.shortName || data.product || "[Sản phẩm]";
  const h1 = `${vehicle || "[Xe]"} ${action} ${data.product || "[Sản phẩm]"}${data.configuration ? ` ${data.configuration}` : ""}: cấu hình và nghiệm thu`;
  const generatedSlug = cleanSlug(`${vehicle} ${action} ${data.product} ${data.configuration}`);
  const legacyKey = cleanSlug(`${vehicle}|${data.product}|${data.configuration}`);
  const legacySlugMap: Record<string, string> = {
    "toyota-camry-2014-2-5q-x-light-f10-turbo-v2-4300k": "toyota-camry-2014-25q-lap-bi-gam-x-light-f10-turbo-v2-gia-cau-hinh",
  };
  const slug = legacySlugMap[legacyKey] ?? generatedSlug;
  const priceText = data.priceStatus === "product_only" && data.productPrice
    ? ` Giá sản phẩm ${data.productPrice}, ${data.vatIncluded === "yes" ? "đã gồm VAT" : data.vatIncluded === "no" ? "chưa VAT" : "VAT chưa xác nhận"}.`
    : data.priceStatus === "from" && data.productPrice
      ? ` Giá tham khảo từ ${data.productPrice}.`
      : data.priceStatus === "complete" && data.totalPrice
        ? ` Tổng chi phí hoàn thiện ${data.totalPrice}.`
        : "";
  const sentence = (value: string, fallback: string) => {
    const text = (value || fallback).trim().replace(/[.!?]+$/, "");
    return `${text}.`;
  };
  const answer = [
    sentence(`${vehicle || "Ca xe"} trong hồ sơ đã ${action} ${data.product || "sản phẩm"}${data.configuration ? ` ${data.configuration}` : ""}`, "Ca xe đang được bổ sung"),
    sentence(data.reason, "Lý do lựa chọn đang được bổ sung"),
    sentence(data.qc, "Kết quả nghiệm thu đang được bổ sung"),
    priceText.trim(),
  ].filter(Boolean).join(" ");
  const metaTitle = truncateAtWord(`${data.model || data.make || "Case xe"} ${data.year} ${data.trim} ${action} ${productName}${data.configuration ? ` ${data.configuration}` : ""} | Auto365`, 64);
  const metaDescription = truncateAtWord(`${vehicle} ${action} ${data.product} ${data.configuration}: nhu cầu, mức can thiệp, hình ảnh đúng ca, nghiệm thu và phần chi phí đã xác minh.`, 158);
  const evidenceLabels = [
    { label: data.sourceConfirmed ? "Nguồn sản phẩm đã xác nhận" : "Chưa xác nhận nguồn", ok: data.sourceConfirmed },
    {
      label: data.media.filter((item) => item.required).every((item) => item.url && item.rightsConfirmed) ? "Đủ 5 vai trò ảnh lõi" : "Media lõi chưa hoàn chỉnh",
      ok: data.media.filter((item) => item.required).every((item) => item.url && item.rightsConfirmed),
    },
    { label: data.measuredClaim ? "Có dữ liệu đo" : "Chưa đo chuẩn hóa", ok: data.measuredClaim },
    { label: data.followUp ? "Đã hậu kiểm" : "Chưa hậu kiểm", ok: data.followUp },
  ];
  return {
    vehicle,
    h1,
    slug,
    canonical: slug ? `https://auto365.vn/${slug}` : "",
    answer,
    metaTitle,
    metaDescription,
    evidenceLabels,
    usedLegacyCanonical: Boolean(legacySlugMap[legacyKey]),
  };
}

const emptyModules: StudioModules = {
  gallery: true,
  timeline: true,
  productSpecs: true,
  price: true,
  measurement: false,
  followUp: false,
  faq: true,
};

export const blankStudioCase: StudioCase = {
  templateVersion: "1.3",
  draftId: "CL-DRAFT-NEW",
  workflowStatus: "draft",
  vertical: "lighting",
  make: "",
  model: "",
  year: "",
  trim: "",
  product: "",
  configuration: "",
  conditionBefore: "",
  need: "",
  reason: "",
  branch: "",
  workDate: "",
  author: "",
  reviewer: "",
  removedBumper: "unknown",
  bracket: "",
  originalCut: "unknown",
  relay: "unknown",
  fuse: "unknown",
  qc: "",
  priceStatus: "product_only",
  productPrice: "",
  totalPrice: "",
  vatIncluded: "unknown",
  sourceConfirmed: false,
  sourceName: "",
  sourceDate: "",
  measuredClaim: false,
  measurementMethod: "",
  followUp: false,
  hubUrl: hubByVertical.lighting,
  productUrl: "",
  intentChecked: false,
  technicalApproved: false,
  filmGlassMap: "",
  filmEdgeTreatment: "",
  cameraFirmware: "",
  cameraPower: "",
  cameraParkingMode: "",
  cameraOriginalVideo: false,
  ppfCoverage: "",
  ppfBatch: "",
  ppfCutMethod: "",
  ppfEdgeWrap: "",
  modules: { ...emptyModules },
  media: createMediaSlots("lighting"),
};

const camryMedia = [
  "https://auto365.vn/uploads/images/pages/auto365vn-toyota-camry-2014-2-5-q-lap-bi-gam-x-light-f10-turbo-v2-3-img_6a76e42ca2ae17.28365604.jpg",
  "https://auto365.vn/uploads/images/pages/auto365vn-toyota-camry-2014-2-5-q-lap-bi-gam-x-light-f10-turbo-v2-5-img_6a76e3a30c1f30.24597607.jpg",
  "https://auto365.vn/uploads/images/pages/auto365vn-toyota-camry-2014-2-5-q-lap-bi-gam-x-light-f10-turbo-v2-1-img_6a76e47a764051.86525682.jpg",
  "https://auto365.vn/uploads/images/pages/auto365vn-toyota-camry-2014-2-5-q-lap-bi-gam-x-light-f10-turbo-v2-6-img_6a76e3ef05fbe1.86984057.jpg",
  "https://auto365.vn/uploads/images/pages/auto365vn-toyota-camry-2014-2-5-q-lap-bi-gam-x-light-f10-turbo-v2-7-img_6a76e4078402a9.23620130.jpg",
  "https://auto365.vn/uploads/images/pages/auto365vn-toyota-camry-2014-2-5-q-lap-bi-gam-x-light-f10-turbo-v2-2-img_6a76e3bc5a7db0.38488086.jpg",
  "https://auto365.vn/uploads/images/pages/auto365vn-toyota-camry-2014-2-5-q-lap-bi-gam-x-light-f10-turbo-v2-4-img_6a76e3d65eee07.05310183.jpg",
  "https://auto365.vn/uploads/images/pages/auto365vn-toyota-camry-2014-2-5-q-lap-bi-gam-x-light-f10-turbo-v2-8-img_6a76e45bb52471.49479397.jpg",
];

export const sampleStudioCase: StudioCase = {
  ...blankStudioCase,
  draftId: "ACL-260810-LGT-001",
  workflowStatus: "technical_approved",
  make: "Toyota",
  model: "Camry",
  year: "2014",
  trim: "2.5Q",
  product: "X-Light F10 Turbo V2",
  configuration: "4300K",
  conditionBefore: "Hồ sơ chưa đủ dữ liệu để mô tả cấu hình đèn gầm trước nâng cấp",
  need: "Thường đi tỉnh và di chuyển ban đêm trên đường thiếu sáng",
  reason: "Chủ xe chọn 4300K vì muốn màu sáng trung tính và bổ sung vùng sáng thấp phía trước",
  branch: "Auto365.vn - Trụ Sở Chính",
  workDate: "2026-08-10",
  author: "Vinh",
  reviewer: "Nguyễn Quang Đạo",
  removedBumper: "yes",
  bracket: "Pát kèm sản phẩm, gia công trên bộ gá rời",
  originalCut: "no",
  relay: "yes",
  fuse: "yes",
  qc: "Cos/Pha hoạt động sau căn chỉnh; không ghi nhận cảnh báo điện tại bàn giao",
  productPrice: "6.000.000 VNĐ/cặp",
  vatIncluded: "no",
  sourceConfirmed: true,
  sourceName: "Tài liệu sản phẩm X-Light / 365Group",
  sourceDate: "2026-08-10",
  productUrl: productCatalog.lighting[0].url,
  intentChecked: true,
  technicalApproved: true,
  media: createMediaSlots("lighting").map((item, index) => ({
    ...item,
    url: camryMedia[index],
    caption: `${item.label} thuộc đúng hồ sơ Toyota Camry 2014 2.5Q`,
    alt: `${item.label} Toyota Camry 2014 lắp X-Light F10 Turbo V2`,
    capturedAt: "2026-08-10",
    rightsConfirmed: true,
  })),
};

function clearDependentEvidence(data: StudioCase): StudioCase {
  return {
    ...data,
    configuration: "",
    technicalApproved: false,
    workflowStatus: "draft",
    sourceConfirmed: false,
    sourceName: "",
    sourceDate: "",
    intentChecked: false,
    qc: "",
    priceStatus: "product_only",
    productPrice: "",
    totalPrice: "",
    vatIncluded: "unknown",
    media: createMediaSlots(data.vertical),
    measuredClaim: false,
    measurementMethod: "",
    followUp: false,
    removedBumper: "unknown",
    bracket: "",
    originalCut: "unknown",
    relay: "unknown",
    fuse: "unknown",
    filmGlassMap: "",
    filmEdgeTreatment: "",
    cameraFirmware: "",
    cameraPower: "",
    cameraParkingMode: "",
    cameraOriginalVideo: false,
    ppfCoverage: "",
    ppfBatch: "",
    ppfCutMethod: "",
    ppfEdgeWrap: "",
    modules: { ...emptyModules },
  };
}

export function selectVehicle(data: StudioCase, make: string, model: string): StudioCase {
  return {
    ...clearDependentEvidence(data),
    make,
    model,
    year: "",
    trim: "",
    conditionBefore: "",
    need: "",
    reason: "",
  };
}

export function selectProduct(data: StudioCase, productName: string): StudioCase {
  const product = productCatalog[data.vertical].find((item) => item.name === productName);
  const cleared = clearDependentEvidence(data);
  return {
    ...cleared,
    product: product?.name ?? "",
    productUrl: product?.url ?? "",
    sourceConfirmed: Boolean(product?.source),
    sourceName: product?.source?.name ?? "",
    sourceDate: product?.source?.date ?? "",
    intentChecked: product?.urlOwner === "product",
    productPrice: product?.defaultPrice?.value ?? "",
    vatIncluded: product?.defaultPrice?.vatIncluded ?? "unknown",
    reason: "",
  };
}

export function switchVertical(data: StudioCase, vertical: Vertical): StudioCase {
  const cleared = clearDependentEvidence({ ...data, vertical });
  return {
    ...cleared,
    vertical,
    product: "",
    productUrl: "",
    conditionBefore: "",
    need: "",
    reason: "",
    hubUrl: hubByVertical[vertical],
  };
}

export function restoreStudioDraft(raw: unknown): StudioCase {
  if (!raw || typeof raw !== "object") return {
    ...blankStudioCase,
    modules: { ...blankStudioCase.modules },
    media: createMediaSlots(blankStudioCase.vertical),
  };

  const source = raw as Record<string, unknown>;
  if (!["1.2", "1.3"].includes(String(source.templateVersion))) return {
    ...blankStudioCase,
    modules: { ...blankStudioCase.modules },
    media: createMediaSlots(blankStudioCase.vertical),
  };

  const vertical = typeof source.vertical === "string" && source.vertical in verticalLabels
    ? source.vertical as Vertical
    : blankStudioCase.vertical;
  const restored: StudioCase = {
    ...blankStudioCase,
    vertical,
    hubUrl: hubByVertical[vertical],
    modules: { ...blankStudioCase.modules },
    media: createMediaSlots(vertical),
  };
  const restoredRecord = restored as unknown as Record<string, unknown>;
  const blankRecord = blankStudioCase as unknown as Record<string, unknown>;

  Object.keys(blankRecord).forEach((key) => {
    if (["templateVersion", "vertical", "hubUrl", "productUrl", "workflowStatus", "technicalApproved", "intentChecked", "modules", "media"].includes(key)) return;
    const candidate = source[key];
    if (typeof candidate === typeof blankRecord[key]) restoredRecord[key] = candidate;
  });

  const rawModules = source.modules && typeof source.modules === "object"
    ? source.modules as Record<string, unknown>
    : {};
  (Object.keys(restored.modules) as Array<keyof StudioModules>).forEach((key) => {
    if (typeof rawModules[key] === "boolean") restored.modules[key] = rawModules[key] as boolean;
  });

  const rawMedia = Array.isArray(source.media) ? source.media : [];
  restored.media = createMediaSlots(vertical).map((slot) => {
    const saved = rawMedia.find((item) => item && typeof item === "object" && (item as Record<string, unknown>).role === slot.role) as Record<string, unknown> | undefined;
    if (!saved) return slot;
    return {
      ...slot,
      url: typeof saved.url === "string" ? saved.url : "",
      caption: typeof saved.caption === "string" ? saved.caption : "",
      alt: typeof saved.alt === "string" ? saved.alt : "",
      capturedAt: typeof saved.capturedAt === "string" ? saved.capturedAt : "",
      rightsConfirmed: saved.rightsConfirmed === true,
    };
  });

  const matchedProduct = productCatalog[vertical].find((item) => item.name === restored.product);
  restored.product = matchedProduct?.name ?? "";
  restored.productUrl = matchedProduct?.url ?? "";
  restored.sourceConfirmed = Boolean(matchedProduct?.source);
  restored.sourceName = matchedProduct?.source?.name ?? "";
  restored.sourceDate = matchedProduct?.source?.date ?? "";
  restored.workflowStatus = "draft";
  restored.technicalApproved = false;
  restored.intentChecked = matchedProduct?.urlOwner === "product";
  return restored;
}

export const defaultStudioCase = blankStudioCase;
