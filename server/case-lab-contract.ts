import type {
  DataIssue,
  LightingMediaRole,
  WorkOrderSnapshot,
  ZeroRekeyDraft,
  ZeroRekeyGate,
} from "../lib/zero-rekey";

export type ActorRole = "content" | "technical_reviewer" | "publisher" | "seo_admin" | "admin";

export type AuthenticatedActor = {
  id: string;
  email: string;
  displayName: string;
  roles: Array<{ role: ActorRole; branchRef: string }>;
};

export type CasePatchRequest = {
  expectedRevision: number;
  customerNeed?: string;
  caseNote?: string;
  publishAfterApproval?: boolean;
};

export type CasePatchResponse = {
  caseId: string;
  revision: number;
  workflowStatus: ZeroRekeyDraft["workflowStatus"];
  updatedAt: string;
};

export type UploadIntentRequest = {
  expectedRevision: number;
  fileName: string;
  byteSize: number;
  declaredMimeType: string;
  role: LightingMediaRole;
  capturedAt: string;
};

export type UploadIntentResponse = {
  uploadId: string;
  uploadUrl: string;
  requiredHeaders: Record<string, string>;
  expiresAt: string;
};

export type TechnicalReviewRequest = {
  expectedRevision: number;
  decision: "approved" | "changes_requested";
  note: string;
};

export type PublishRequest = {
  expectedRevision: number;
  scheduledAt?: string;
};

export type ApiErrorCode =
  | "UNAUTHENTICATED"
  | "FORBIDDEN_ROLE"
  | "BRANCH_SCOPE_DENIED"
  | "NOT_FOUND"
  | "REVISION_CONFLICT"
  | "INVALID_TRANSITION"
  | "GATES_NOT_READY"
  | "SOURCE_NOT_READY"
  | "MEDIA_POLICY_FAILED"
  | "URL_OWNER_CONFLICT"
  | "IDEMPOTENCY_CONFLICT"
  | "VALIDATION_ERROR";

export type ApiError = {
  error: {
    code: ApiErrorCode;
    message: string;
    requestId: string;
    details?: Record<string, unknown>;
  };
};

export interface WorkOrderGateway {
  listReady(input: { branchRefs: string[]; cursor?: string; limit: number }): Promise<{ items: WorkOrderSnapshot[]; nextCursor?: string }>;
  getByExternalId(externalId: string): Promise<WorkOrderSnapshot | null>;
}

export interface CaseRepository {
  createFromWorkOrder(input: { order: WorkOrderSnapshot; actor: AuthenticatedActor; idempotencyKey: string }): Promise<ZeroRekeyDraft>;
  get(caseId: string): Promise<ZeroRekeyDraft | null>;
  saveContent(input: { caseId: string; actor: AuthenticatedActor; patch: CasePatchRequest }): Promise<CasePatchResponse>;
  saveMediaAssignment(input: { caseId: string; actor: AuthenticatedActor; expectedRevision: number; assetId: string; role: LightingMediaRole }): Promise<CasePatchResponse>;
  submitReview(input: { caseId: string; actor: AuthenticatedActor; expectedRevision: number }): Promise<CasePatchResponse>;
  recordTechnicalReview(input: { caseId: string; actor: AuthenticatedActor; request: TechnicalReviewRequest }): Promise<CasePatchResponse>;
  publish(input: { caseId: string; actor: AuthenticatedActor; request: PublishRequest; idempotencyKey: string }): Promise<{ publicationId: string; state: string; publicUrl?: string }>;
  rollback(input: { caseId: string; actor: AuthenticatedActor; targetRevision: number; idempotencyKey: string }): Promise<{ publicationId: string; state: string; publicUrl: string }>;
  createDataIssue(input: { caseId: string; actor: AuthenticatedActor; issue: DataIssue }): Promise<{ issueId: string; ownerTeam: string; status: string }>;
}

export interface MediaGateway {
  createUploadIntent(input: { caseId: string; actor: AuthenticatedActor; request: UploadIntentRequest }): Promise<UploadIntentResponse>;
  finalizeUpload(input: { caseId: string; actor: AuthenticatedActor; uploadId: string; expectedRevision: number }): Promise<{ assetId: string; checksum: string; status: "processing" | "ready" | "rejected" }>;
}

export interface GateService {
  evaluate(input: { caseId: string; revision: number; actor: AuthenticatedActor }): Promise<ZeroRekeyGate>;
}

export interface PublishedRenderer {
  renderPreview(input: { caseId: string; revision: number; actor: AuthenticatedActor }): Promise<{ html: string; metadata: Record<string, unknown>; robots: "noindex, nofollow" }>;
  renderPublished(input: { caseId: string; revision: number }): Promise<{ html: string; metadata: Record<string, unknown>; jsonLd: Record<string, unknown>; renderedHash: string }>;
}

export const apiContractVersion = "2026-08-11.v2";

export const mediaLimits = {
  acceptedMagicTypes: ["image/jpeg", "image/png", "image/webp", "image/heic"],
  maxBytes: 20 * 1024 * 1024,
  minWidth: 1280,
  minHeight: 720,
  maxAssetsPerCase: 8,
  coreAssets: 6,
} as const;
