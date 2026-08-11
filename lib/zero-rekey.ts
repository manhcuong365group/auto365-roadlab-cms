export type LightingMediaRole =
  | "vehicle_after"
  | "lamp_stock_before"
  | "lamp_after"
  | "product_identity"
  | "beam_low_after"
  | "beam_high_after"
  | "installation_qc"
  | "handover_detail";

export type WorkOrderQueueStatus =
  | "ready"
  | "missing_media"
  | "in_review"
  | "changes_requested"
  | "published";

export type ZeroRekeyWorkflowStatus =
  | "draft"
  | "ready_for_review"
  | "in_review"
  | "changes_requested"
  | "technical_approved"
  | "publishable"
  | "published";

export type RightsStatus = "confirmed" | "pending" | "rejected";

export type WorkOrderMedia = {
  id: string;
  role: LightingMediaRole;
  label: string;
  required: boolean;
  url: string;
  alt: string;
  caption: string;
  capturedAt: string;
  caseId: string;
  checksum: string;
  rightsStatus: RightsStatus;
  qualityStatus: "pass" | "warning" | "rejected";
};

export type WorkOrderSnapshot = {
  id: string;
  caseId: string;
  sourceSystem: "AUTO365_WORK_ORDER";
  sourceVersion: number;
  sourceHash: string;
  queueStatus: WorkOrderQueueStatus;
  vertical: "lighting";
  syncedAt: string;
  vehicle: {
    ref: string;
    make: string;
    model: string;
    year: string;
    trim: string;
  };
  product: {
    ref: string;
    name: string;
    shortName: string;
    configuration: string;
    catalogVersion: string;
    sourceName: string;
    productUrl: string;
    entityId: string;
    urlOwnerReady: boolean;
  };
  branch: {
    ref: string;
    name: string;
    phone: string;
  };
  workDate: string;
  author: { ref: string; name: string };
  reviewer: { ref: string; name: string };
  price: {
    status: "product_only" | "complete" | "from" | "not_published";
    productAmount: number | null;
    totalAmount: number | null;
    currency: "VND";
    vatIncluded: boolean | null;
  };
  technical: {
    conditionBefore: string;
    choiceReason: string;
    removedBumper: "yes" | "no" | "unknown";
    originalCut: "yes" | "no" | "unknown";
    bracket: string;
    relay: "yes" | "no" | "unknown";
    fuse: "yes" | "no" | "unknown";
    qc: string;
  };
  customerNeedRaw: string;
  media: WorkOrderMedia[];
  seo: {
    hubUrl: string;
    legacyCanonical?: string;
    intentOwnerReady: boolean;
    collisionCheckedAt: string;
  };
};

export type ContentContribution = {
  customerNeed: string;
  caseNote: string;
};

export type DataIssue = {
  target: "work_order" | "catalog" | "media" | "price";
  message: string;
  status: "draft" | "submitted";
};

export type TechnicalApproval = {
  revision: number;
  reviewerRef: string;
  decision: "approved" | "changes_requested";
  note: string;
  decidedAt: string;
} | null;

export type ZeroRekeyDraft = {
  templateVersion: "2.0";
  id: string;
  workOrderId: string;
  caseId: string;
  sourceVersion: number;
  sourceHash: string;
  revision: number;
  workflowStatus: ZeroRekeyWorkflowStatus;
  content: ContentContribution;
  mediaConfirmed: boolean;
  media: WorkOrderMedia[];
  dataIssue: DataIssue | null;
  technicalApproval: TechnicalApproval;
  publishAfterApproval: boolean;
  updatedAt: string;
};

export type ZeroRekeyGateIssue = {
  code: string;
  step: 1 | 2 | 3;
  owner: "content" | "workshop" | "catalog" | "technical" | "seo_system";
  message: string;
  field?: "customerNeed" | "caseNote" | "media" | "dataIssue";
};

export type ZeroRekeyGate = {
  gates: {
    source: boolean;
    content: boolean;
    evidence: boolean;
    technical: boolean;
    seo: boolean;
  };
  issues: ZeroRekeyGateIssue[];
  readyForReview: boolean;
  publishable: boolean;
};

export const lightingMediaPolicy: ReadonlyArray<{
  role: LightingMediaRole;
  label: string;
  required: boolean;
}> = [
  { role: "vehicle_after", label: "Toàn xe sau hoàn thiện", required: true },
  { role: "lamp_stock_before", label: "Đèn zin trước khi làm", required: true },
  { role: "lamp_after", label: "Đèn sau nâng cấp", required: true },
  { role: "product_identity", label: "Sản phẩm / tem nhận diện", required: true },
  { role: "beam_low_after", label: "Cos sau căn chỉnh", required: true },
  { role: "beam_high_after", label: "Pha sau căn chỉnh", required: true },
  { role: "installation_qc", label: "Thi công / QC", required: false },
  { role: "handover_detail", label: "Góc xe / bàn giao", required: false },
] as const;

const camryMediaUrls = [
  "https://auto365.vn/uploads/images/pages/auto365vn-toyota-camry-2014-2-5-q-lap-bi-gam-x-light-f10-turbo-v2-3-img_6a76e42ca2ae17.28365604.jpg",
  "https://auto365.vn/uploads/images/pages/auto365vn-toyota-camry-2014-2-5-q-lap-bi-gam-x-light-f10-turbo-v2-5-img_6a76e3a30c1f30.24597607.jpg",
  "https://auto365.vn/uploads/images/pages/auto365vn-toyota-camry-2014-2-5-q-lap-bi-gam-x-light-f10-turbo-v2-1-img_6a76e47a764051.86525682.jpg",
  "https://auto365.vn/uploads/images/pages/auto365vn-toyota-camry-2014-2-5-q-lap-bi-gam-x-light-f10-turbo-v2-6-img_6a76e3ef05fbe1.86984057.jpg",
  "https://auto365.vn/uploads/images/pages/auto365vn-toyota-camry-2014-2-5-q-lap-bi-gam-x-light-f10-turbo-v2-7-img_6a76e4078402a9.23620130.jpg",
  "https://auto365.vn/uploads/images/pages/auto365vn-toyota-camry-2014-2-5-q-lap-bi-gam-x-light-f10-turbo-v2-2-img_6a76e3bc5a7db0.38488086.jpg",
  "https://auto365.vn/uploads/images/pages/auto365vn-toyota-camry-2014-2-5-q-lap-bi-gam-x-light-f10-turbo-v2-4-img_6a76e3d65eee07.05310183.jpg",
  "https://auto365.vn/uploads/images/pages/auto365vn-toyota-camry-2014-2-5-q-lap-bi-gam-x-light-f10-turbo-v2-8-img_6a76e45bb52471.49479397.jpg",
] as const;

function sampleMedia(caseId: string, complete = true): WorkOrderMedia[] {
  return lightingMediaPolicy.map((item, index) => ({
    id: `asset-${caseId}-${index + 1}`,
    role: item.role,
    label: item.label,
    required: item.required,
    url: complete || index < 4 ? camryMediaUrls[index] : "",
    alt: `${item.label} Toyota Camry 2014 lắp X-Light F10 Turbo V2`,
    caption: `${item.label} thuộc đúng hồ sơ ${caseId}`,
    capturedAt: "2026-08-10",
    caseId,
    checksum: complete || index < 4 ? `sha256:${caseId}:${index + 1}` : "",
    rightsStatus: complete || index < 4 ? "confirmed" : "pending",
    qualityStatus: "pass",
  }));
}

const camryReady: WorkOrderSnapshot = {
  id: "WO-260810-1842",
  caseId: "ACL-260810-LGT-001",
  sourceSystem: "AUTO365_WORK_ORDER",
  sourceVersion: 7,
  sourceHash: "sha256:wo-260810-1842:v7",
  queueStatus: "ready",
  vertical: "lighting",
  syncedAt: "2026-08-11T09:21:00+07:00",
  vehicle: { ref: "veh-toyota-camry-xv50", make: "Toyota", model: "Camry", year: "2014", trim: "2.5Q" },
  product: {
    ref: "prd-xlight-f10-turbo-v2",
    name: "X-Light F10 Turbo V2",
    shortName: "F10 Turbo V2",
    configuration: "4300K · 01 cặp",
    catalogVersion: "2026.08.10",
    sourceName: "Tài liệu sản phẩm X-Light / 365Group",
    productUrl: "https://auto365.vn/den-bi-gam-x-light-f10-turbo-v2",
    entityId: "https://auto365.vn/#product-x-light-f10-turbo-v2",
    urlOwnerReady: true,
  },
  branch: { ref: "branch-auto365-hq", name: "Auto365.vn - Trụ Sở Chính", phone: "0365 365 911" },
  workDate: "2026-08-10",
  author: { ref: "person-vinh", name: "Vinh" },
  reviewer: { ref: "person-nguyen-quang-dao", name: "Nguyễn Quang Đạo" },
  price: { status: "product_only", productAmount: 6000000, totalAmount: null, currency: "VND", vatIncluded: false },
  technical: {
    conditionBefore: "Chưa có phép đo lux chuẩn hóa cho hệ thống đèn zin; hồ sơ chỉ ghi nhận hiện trạng bằng ảnh trước thi công.",
    choiceReason: "Chủ xe chọn ánh sáng 4300K để bổ sung vùng sáng thấp khi đi tỉnh và đường ẩm.",
    removedBumper: "yes",
    originalCut: "no",
    bracket: "Pát kèm sản phẩm, gia công trên bộ gá rời",
    relay: "yes",
    fuse: "yes",
    qc: "Cos/Pha hoạt động sau căn chỉnh; không ghi nhận cảnh báo điện tại thời điểm bàn giao.",
  },
  customerNeedRaw: "Thường đi tỉnh, di chuyển ban đêm trên đường thiếu sáng và đường ẩm.",
  media: sampleMedia("ACL-260810-LGT-001"),
  seo: {
    hubUrl: "https://auto365.vn/nang-cap-anh-sang-bi-gam",
    legacyCanonical: "https://auto365.vn/toyota-camry-2014-25q-lap-bi-gam-x-light-f10-turbo-v2-gia-cau-hinh",
    intentOwnerReady: true,
    collisionCheckedAt: "2026-08-11T09:20:00+07:00",
  },
};

function cloneOrder(base: WorkOrderSnapshot, patch: Partial<WorkOrderSnapshot>): WorkOrderSnapshot {
  return { ...base, ...patch };
}

export const sampleWorkOrders: WorkOrderSnapshot[] = [
  camryReady,
  cloneOrder(camryReady, {
    id: "WO-260811-1907",
    caseId: "ACL-260811-LGT-002",
    sourceVersion: 2,
    sourceHash: "sha256:wo-260811-1907:v2",
    queueStatus: "missing_media",
    vehicle: { ref: "veh-hyundai-creta-su2id", make: "Hyundai", model: "Creta", year: "2022", trim: "Đặc biệt" },
    workDate: "2026-08-11",
    media: sampleMedia("ACL-260811-LGT-002", false),
  }),
  cloneOrder(camryReady, {
    id: "WO-260809-1765",
    caseId: "ACL-260809-LGT-003",
    sourceVersion: 5,
    sourceHash: "sha256:wo-260809-1765:v5",
    queueStatus: "in_review",
    vehicle: { ref: "veh-ford-everest-u704", make: "Ford", model: "Everest", year: "2021", trim: "Titanium" },
    workDate: "2026-08-09",
    media: sampleMedia("ACL-260809-LGT-003"),
  }),
  cloneOrder(camryReady, {
    id: "WO-260808-1688",
    caseId: "ACL-260808-LGT-004",
    sourceVersion: 6,
    sourceHash: "sha256:wo-260808-1688:v6",
    queueStatus: "changes_requested",
    vehicle: { ref: "veh-mazda-cx5-kf", make: "Mazda", model: "CX-5", year: "2023", trim: "Premium" },
    workDate: "2026-08-08",
    media: sampleMedia("ACL-260808-LGT-004"),
  }),
  cloneOrder(camryReady, {
    id: "WO-260807-1590",
    caseId: "ACL-260807-LGT-005",
    sourceVersion: 8,
    sourceHash: "sha256:wo-260807-1590:v8",
    queueStatus: "published",
    vehicle: { ref: "veh-vinfast-vf8", make: "VinFast", model: "VF 8", year: "2024", trim: "Plus" },
    workDate: "2026-08-07",
    media: sampleMedia("ACL-260807-LGT-005"),
  }),
];

export function createDraftFromWorkOrder(order: WorkOrderSnapshot, now = "2026-08-11T10:00:00+07:00"): ZeroRekeyDraft {
  return {
    templateVersion: "2.0",
    id: `draft-${order.caseId.toLowerCase()}`,
    workOrderId: order.id,
    caseId: order.caseId,
    sourceVersion: order.sourceVersion,
    sourceHash: order.sourceHash,
    revision: 1,
    workflowStatus: order.queueStatus === "changes_requested" ? "changes_requested" : order.queueStatus === "in_review" ? "in_review" : order.queueStatus === "published" ? "published" : "draft",
    content: { customerNeed: order.customerNeedRaw, caseNote: "" },
    mediaConfirmed: false,
    media: order.media.map((asset) => ({ ...asset })),
    dataIssue: null,
    technicalApproval: null,
    publishAfterApproval: true,
    updatedAt: now,
  };
}

export function patchContent(
  draft: ZeroRekeyDraft,
  patch: Partial<ContentContribution>,
  now = "2026-08-11T10:01:00+07:00",
): ZeroRekeyDraft {
  const allowed = new Set(["customerNeed", "caseNote"]);
  for (const key of Object.keys(patch)) {
    if (!allowed.has(key)) throw new Error(`SYSTEM_OWNED_FIELD:${key}`);
  }
  const changed = Object.entries(patch).some(([key, value]) => draft.content[key as keyof ContentContribution] !== value);
  if (!changed) return draft;
  return {
    ...draft,
    content: { ...draft.content, ...patch },
    revision: draft.revision + 1,
    workflowStatus: "draft",
    technicalApproval: null,
    updatedAt: now,
  };
}

export function confirmMediaSet(
  draft: ZeroRekeyDraft,
  confirmed: boolean,
  now = "2026-08-11T10:02:00+07:00",
): ZeroRekeyDraft {
  if (draft.mediaConfirmed === confirmed) return draft;
  return {
    ...draft,
    mediaConfirmed: confirmed,
    revision: draft.revision + 1,
    workflowStatus: "draft",
    technicalApproval: null,
    updatedAt: now,
  };
}

export function submitDataIssue(draft: ZeroRekeyDraft, issue: DataIssue): ZeroRekeyDraft {
  return {
    ...draft,
    dataIssue: { ...issue, status: "submitted" },
    workflowStatus: "draft",
    technicalApproval: null,
    revision: draft.revision + 1,
  };
}

export function evaluateZeroRekeyDraft(order: WorkOrderSnapshot, draft: ZeroRekeyDraft): ZeroRekeyGate {
  const issues: ZeroRekeyGateIssue[] = [];
  const sourceReady = order.queueStatus !== "missing_media"
    && order.id === draft.workOrderId
    && order.caseId === draft.caseId
    && order.sourceVersion === draft.sourceVersion
    && order.sourceHash === draft.sourceHash
    && !draft.dataIssue;
  if (!sourceReady) {
    issues.push({ code: "SOURCE_NOT_READY", step: 1, owner: draft.dataIssue ? "catalog" : "workshop", field: "dataIssue", message: draft.dataIssue ? "Đang chờ xử lý báo dữ liệu sai." : "Phiếu việc chưa đạt trạng thái sẵn sàng viết." });
  }

  const needReady = draft.content.customerNeed.trim().length >= 20;
  const noteReady = draft.content.caseNote.trim().length >= 20;
  if (!needReady) issues.push({ code: "CUSTOMER_NEED_REQUIRED", step: 1, owner: "content", field: "customerNeed", message: "Bổ sung nhu cầu thật của chủ xe, tối thiểu 20 ký tự." });
  if (!noteReady) issues.push({ code: "CASE_NOTE_REQUIRED", step: 1, owner: "content", field: "caseNote", message: "Bổ sung điểm khác biệt của ca xe, tối thiểu 20 ký tự." });

  const requiredRoles = lightingMediaPolicy.filter((item) => item.required).map((item) => item.role);
  const requiredRoleReady = requiredRoles.every((role) => {
    const assets = draft.media.filter((item) => item.role === role);
    return assets.length === 1
      && Boolean(assets[0].url && assets[0].checksum && assets[0].capturedAt)
      && assets[0].caseId === draft.caseId
      && assets[0].rightsStatus === "confirmed"
      && assets[0].qualityStatus !== "rejected";
  });
  const populated = draft.media.filter((asset) => asset.url);
  const checksums = populated.map((asset) => asset.checksum).filter(Boolean);
  const uniqueEvidence = new Set(checksums).size === checksums.length;
  const evidenceReady = requiredRoleReady && uniqueEvidence && draft.mediaConfirmed && populated.length >= 6 && populated.length <= 8;
  if (!requiredRoleReady) issues.push({ code: "SIX_CORE_MEDIA_REQUIRED", step: 2, owner: "workshop", field: "media", message: "Chưa đủ 6 ảnh lõi đúng Case ID, vai trò và quyền sử dụng." });
  if (!uniqueEvidence) issues.push({ code: "DUPLICATE_MEDIA", step: 2, owner: "workshop", field: "media", message: "Có ảnh trùng checksum giữa các vai trò bằng chứng." });
  if (!draft.mediaConfirmed) issues.push({ code: "MEDIA_CONFIRMATION_REQUIRED", step: 2, owner: "content", field: "media", message: "Content cần xác nhận bộ ảnh đúng ca trước khi gửi duyệt." });

  const seoReady = order.product.urlOwnerReady && order.seo.intentOwnerReady && Boolean(order.seo.collisionCheckedAt && order.seo.hubUrl);
  if (!seoReady) issues.push({ code: "SEO_OWNER_NOT_READY", step: 3, owner: "seo_system", message: "URL owner hoặc kiểm tra va chạm intent chưa sẵn sàng." });

  const technicalReady = Boolean(
    draft.technicalApproval?.decision === "approved"
    && draft.technicalApproval.revision === draft.revision,
  );
  if (!technicalReady) issues.push({ code: "TECHNICAL_APPROVAL_REQUIRED", step: 3, owner: "technical", message: "Kỹ thuật chưa duyệt đúng revision hiện tại." });

  const gates = {
    source: sourceReady,
    content: needReady && noteReady,
    evidence: evidenceReady,
    technical: technicalReady,
    seo: seoReady,
  };
  return {
    gates,
    issues,
    readyForReview: gates.source && gates.content && gates.evidence && gates.seo,
    publishable: gates.source && gates.content && gates.evidence && gates.technical && gates.seo,
  };
}

export function submitForTechnicalReview(order: WorkOrderSnapshot, draft: ZeroRekeyDraft): ZeroRekeyDraft {
  const gate = evaluateZeroRekeyDraft(order, draft);
  if (!gate.readyForReview) throw new Error("GATES_NOT_READY");
  return { ...draft, workflowStatus: "in_review" };
}

export function recordTechnicalDecision(
  order: WorkOrderSnapshot,
  draft: ZeroRekeyDraft,
  input: { actorRole: "technical_reviewer" | "content"; reviewerRef: string; expectedRevision: number; decision: "approved" | "changes_requested"; note?: string },
): ZeroRekeyDraft {
  if (input.actorRole !== "technical_reviewer") throw new Error("FORBIDDEN_ROLE");
  if (input.reviewerRef !== order.reviewer.ref) throw new Error("FORBIDDEN_REVIEWER");
  if (input.expectedRevision !== draft.revision) throw new Error("REVISION_CONFLICT");
  const approval: NonNullable<TechnicalApproval> = {
    revision: draft.revision,
    reviewerRef: input.reviewerRef,
    decision: input.decision,
    note: input.note ?? "",
    decidedAt: "2026-08-11T10:05:00+07:00",
  };
  const next = {
    ...draft,
    technicalApproval: approval,
    workflowStatus: input.decision === "approved" ? "technical_approved" as const : "changes_requested" as const,
  };
  const gate = evaluateZeroRekeyDraft(order, next);
  return gate.publishable ? { ...next, workflowStatus: "publishable" } : next;
}

export function generateZeroRekeyOutputs(order: WorkOrderSnapshot, draft: ZeroRekeyDraft) {
  const vehicle = `${order.vehicle.make} ${order.vehicle.model} ${order.vehicle.year} ${order.vehicle.trim}`;
  const h1 = `${vehicle} lắp bi gầm ${order.product.name} ${order.product.configuration}: cấu hình và nghiệm thu`;
  const slug = order.seo.legacyCanonical?.split("/").filter(Boolean).at(-1)
    ?? `${order.vehicle.make}-${order.vehicle.model}-${order.vehicle.year}-${order.product.shortName}`
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
  const canonical = order.seo.legacyCanonical ?? `https://auto365.vn/${slug}`;
  const answer = `${vehicle} trong hồ sơ ${order.caseId} đã lắp ${order.product.name} ${order.product.configuration}. ${order.technical.choiceReason} ${order.technical.qc}`;
  const metaTitle = `${order.vehicle.model} ${order.vehicle.year} lắp ${order.product.shortName} ${order.product.configuration} | Auto365`.slice(0, 64);
  const metaDescription = `${vehicle} lắp ${order.product.name}: nhu cầu thật, 6–8 ảnh đúng ca, cấu hình, mức can thiệp và nghiệm thu kỹ thuật.`.slice(0, 158);
  return { vehicle, h1, slug, canonical, answer, metaTitle, metaDescription, revision: draft.revision };
}

export function formatVnd(amount: number | null) {
  return amount === null ? "Chưa công bố" : `${new Intl.NumberFormat("vi-VN").format(amount)}đ`;
}
