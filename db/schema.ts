import { type AnySQLiteColumn, index, integer, primaryKey, sqliteTable, text, uniqueIndex } from "drizzle-orm/sqlite-core";

export const users = sqliteTable("users", {
  id: text("id").primaryKey(),
  email: text("email").notNull(),
  displayName: text("display_name").notNull(),
  passwordHash: text("password_hash"),
  profileRevision: integer("profile_revision").notNull().default(1),
  preferencesJson: text("preferences_json").notNull().default("{}"),
  status: text("status", { enum: ["active", "suspended"] }).notNull().default("active"),
  createdAt: text("created_at").notNull(),
  updatedAt: text("updated_at").notNull(),
}, (table) => [uniqueIndex("users_email_uq").on(table.email)]);

export const userRoles = sqliteTable("user_roles", {
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  role: text("role", { enum: ["content", "oa", "seo_lead", "it", "boss", "technical_reviewer", "publisher", "seo_admin", "admin"] }).notNull(),
  branchRef: text("branch_ref").notNull().default("*"),
  grantedAt: text("granted_at").notNull(),
  grantedBy: text("granted_by").notNull(),
}, (table) => [
  primaryKey({ columns: [table.userId, table.role, table.branchRef] }),
  index("user_roles_role_idx").on(table.role),
]);

export const workOrders = sqliteTable("work_orders", {
  id: text("id").primaryKey(),
  externalId: text("external_id").notNull(),
  sourceSystem: text("source_system").notNull(),
  sourceVersion: integer("source_version").notNull(),
  sourceHash: text("source_hash").notNull(),
  vertical: text("vertical", { enum: ["lighting"] }).notNull(),
  branchRef: text("branch_ref").notNull(),
  readiness: text("readiness", { enum: ["ready", "missing_media", "blocked", "imported"] }).notNull(),
  payloadJson: text("payload_json").notNull(),
  syncedAt: text("synced_at").notNull(),
}, (table) => [
  uniqueIndex("work_orders_source_id_uq").on(table.sourceSystem, table.externalId),
  uniqueIndex("work_orders_source_version_uq").on(table.sourceSystem, table.externalId, table.sourceVersion),
  index("work_orders_readiness_idx").on(table.readiness, table.syncedAt),
]);

export const cases = sqliteTable("cases", {
  id: text("id").primaryKey(),
  caseCode: text("case_code").notNull(),
  contentType: text("content_type", { enum: ["case", "proof", "brand", "product"] }).notNull().default("case"),
  workOrderId: text("work_order_id").notNull().references(() => workOrders.id),
  vertical: text("vertical", { enum: ["lighting"] }).notNull(),
  branchRef: text("branch_ref").notNull(),
  vehicleRef: text("vehicle_ref").notNull(),
  productRef: text("product_ref").notNull(),
  currentRevision: integer("current_revision").notNull().default(0),
  publishedRevision: integer("published_revision"),
  workflowStatus: text("workflow_status", {
    enum: ["draft", "ready_for_review", "in_review", "changes_requested", "technical_approved", "publishable", "published", "archived"],
  }).notNull().default("draft"),
  lockOwnerId: text("lock_owner_id").references(() => users.id),
  lockExpiresAt: text("lock_expires_at"),
  createdAt: text("created_at").notNull(),
  updatedAt: text("updated_at").notNull(),
}, (table) => [
  uniqueIndex("cases_case_code_uq").on(table.caseCode),
  uniqueIndex("cases_work_order_uq").on(table.workOrderId),
  index("cases_content_type_status_idx").on(table.contentType, table.workflowStatus, table.updatedAt),
  index("cases_status_branch_idx").on(table.workflowStatus, table.branchRef, table.updatedAt),
]);

export const authSessions = sqliteTable("auth_sessions", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  tokenHash: text("token_hash").notNull(),
  expiresAt: text("expires_at").notNull(),
  createdAt: text("created_at").notNull(),
  lastUsedAt: text("last_used_at").notNull(),
}, (table) => [
  uniqueIndex("auth_sessions_token_uq").on(table.tokenHash),
  index("auth_sessions_user_idx").on(table.userId, table.expiresAt),
]);

export const caseAssignments = sqliteTable("case_assignments", {
  id: text("id").primaryKey(),
  caseId: text("case_id").notNull().references(() => cases.id, { onDelete: "cascade" }),
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  role: text("role", { enum: ["oa", "seo_lead", "it", "technical_reviewer"] }).notNull(),
  assignedBy: text("assigned_by").notNull().references(() => users.id),
  assignedAt: text("assigned_at").notNull(),
  unassignedAt: text("unassigned_at"),
}, (table) => [
  index("case_assignments_case_active_idx").on(table.caseId, table.role, table.unassignedAt),
  index("case_assignments_user_active_idx").on(table.userId, table.unassignedAt),
]);

export const caseRevisions = sqliteTable("case_revisions", {
  id: text("id").primaryKey(),
  caseId: text("case_id").notNull().references(() => cases.id, { onDelete: "cascade" }),
  revision: integer("revision").notNull(),
  sourceVersion: integer("source_version").notNull(),
  sourceHash: text("source_hash").notNull(),
  contentJson: text("content_json").notNull(),
  technicalSnapshotJson: text("technical_snapshot_json").notNull(),
  catalogSnapshotJson: text("catalog_snapshot_json").notNull(),
  seoSnapshotJson: text("seo_snapshot_json").notNull(),
  technicalDigest: text("technical_digest").notNull(),
  createdBy: text("created_by").notNull().references(() => users.id),
  createdAt: text("created_at").notNull(),
}, (table) => [
  uniqueIndex("case_revisions_case_revision_uq").on(table.caseId, table.revision),
  index("case_revisions_created_idx").on(table.caseId, table.createdAt),
]);

export const mediaAssets = sqliteTable("media_assets", {
  id: text("id").primaryKey(),
  caseId: text("case_id").notNull().references(() => cases.id, { onDelete: "cascade" }),
  r2KeyOriginal: text("r2_key_original").notNull(),
  r2KeyWebp: text("r2_key_webp"),
  r2KeyAvif: text("r2_key_avif"),
  mimeType: text("mime_type").notNull(),
  byteSize: integer("byte_size").notNull(),
  width: integer("width").notNull(),
  height: integer("height").notNull(),
  sha256: text("sha256").notNull(),
  perceptualHash: text("perceptual_hash"),
  processingStatus: text("processing_status", { enum: ["pending", "processing", "ready", "rejected", "failed"] }).notNull(),
  rejectionCode: text("rejection_code"),
  uploadedBy: text("uploaded_by").notNull().references(() => users.id),
  uploadedAt: text("uploaded_at").notNull(),
}, (table) => [
  uniqueIndex("media_assets_r2_key_uq").on(table.r2KeyOriginal),
  uniqueIndex("media_assets_case_sha_uq").on(table.caseId, table.sha256),
  index("media_assets_processing_idx").on(table.processingStatus, table.uploadedAt),
]);

export const caseRevisionMedia = sqliteTable("case_revision_media", {
  revisionId: text("revision_id").notNull().references(() => caseRevisions.id, { onDelete: "cascade" }),
  mediaAssetId: text("media_asset_id").notNull().references(() => mediaAssets.id),
  role: text("role", {
    enum: ["vehicle_after", "lamp_stock_before", "lamp_after", "product_identity", "beam_low_after", "beam_high_after", "installation_qc", "handover_detail"],
  }).notNull(),
  caption: text("caption").notNull(),
  altText: text("alt_text").notNull(),
  capturedAt: text("captured_at").notNull(),
  proofState: text("proof_state", { enum: ["CASE_OBSERVED", "CASE_MEASURED", "FOLLOWUP_CONFIRMED"] }).notNull(),
  focalPointDesktopJson: text("focal_point_desktop_json"),
  focalPointMobileJson: text("focal_point_mobile_json"),
  sortOrder: integer("sort_order").notNull(),
}, (table) => [
  primaryKey({ columns: [table.revisionId, table.role] }),
  uniqueIndex("case_revision_media_asset_uq").on(table.revisionId, table.mediaAssetId),
]);

export const rightsAttestations = sqliteTable("rights_attestations", {
  id: text("id").primaryKey(),
  caseId: text("case_id").notNull().references(() => cases.id, { onDelete: "cascade" }),
  mediaAssetId: text("media_asset_id").notNull().references(() => mediaAssets.id, { onDelete: "cascade" }),
  status: text("status", { enum: ["confirmed", "rejected", "revoked"] }).notNull(),
  policyVersion: text("policy_version").notNull(),
  attestedBy: text("attested_by").notNull().references(() => users.id),
  attestedAt: text("attested_at").notNull(),
}, (table) => [
  index("rights_attestations_asset_idx").on(table.mediaAssetId, table.attestedAt),
]);

export const technicalReviews = sqliteTable("technical_reviews", {
  id: text("id").primaryKey(),
  caseId: text("case_id").notNull().references(() => cases.id, { onDelete: "cascade" }),
  revisionId: text("revision_id").notNull().references(() => caseRevisions.id, { onDelete: "cascade" }),
  technicalDigest: text("technical_digest").notNull(),
  reviewerId: text("reviewer_id").notNull().references(() => users.id),
  decision: text("decision", { enum: ["approved", "changes_requested"] }).notNull(),
  note: text("note").notNull().default(""),
  decidedAt: text("decided_at").notNull(),
}, (table) => [
  uniqueIndex("technical_reviews_revision_reviewer_uq").on(table.revisionId, table.reviewerId),
  index("technical_reviews_case_idx").on(table.caseId, table.decidedAt),
]);

export const caseFeedback = sqliteTable("case_feedback", {
  id: text("id").primaryKey(),
  caseId: text("case_id").notNull().references(() => cases.id, { onDelete: "cascade" }),
  revision: integer("revision").notNull(),
  parentFeedbackId: text("parent_feedback_id").references((): AnySQLiteColumn => caseFeedback.id, { onDelete: "set null" }),
  authorId: text("author_id").notNull().references(() => users.id),
  category: text("category", { enum: ["content", "evidence", "seo", "technical", "general"] }).notNull().default("general"),
  message: text("message").notNull(),
  status: text("status", { enum: ["open", "resolved"] }).notNull().default("open"),
  resolvedBy: text("resolved_by").references(() => users.id),
  resolvedAt: text("resolved_at"),
  createdAt: text("created_at").notNull(),
}, (table) => [
  index("case_feedback_case_revision_idx").on(table.caseId, table.revision, table.createdAt),
  index("case_feedback_status_idx").on(table.status, table.createdAt),
]);

export const gateEvaluations = sqliteTable("gate_evaluations", {
  id: text("id").primaryKey(),
  caseId: text("case_id").notNull().references(() => cases.id, { onDelete: "cascade" }),
  revisionId: text("revision_id").notNull().references(() => caseRevisions.id, { onDelete: "cascade" }),
  rulesetVersion: text("ruleset_version").notNull(),
  sourcePassed: integer("source_passed", { mode: "boolean" }).notNull(),
  contentPassed: integer("content_passed", { mode: "boolean" }).notNull(),
  evidencePassed: integer("evidence_passed", { mode: "boolean" }).notNull(),
  technicalPassed: integer("technical_passed", { mode: "boolean" }).notNull(),
  seoPassed: integer("seo_passed", { mode: "boolean" }).notNull(),
  issuesJson: text("issues_json").notNull(),
  evaluatedAt: text("evaluated_at").notNull(),
}, (table) => [
  index("gate_evaluations_revision_idx").on(table.revisionId, table.evaluatedAt),
]);

export const urlRegistry = sqliteTable("url_registry", {
  id: text("id").primaryKey(),
  caseId: text("case_id").notNull().references(() => cases.id, { onDelete: "cascade" }),
  slug: text("slug").notNull(),
  canonicalUrl: text("canonical_url").notNull(),
  intentKey: text("intent_key").notNull(),
  ownerType: text("owner_type", { enum: ["case", "product", "hub"] }).notNull(),
  lockedAt: text("locked_at"),
  createdAt: text("created_at").notNull(),
}, (table) => [
  uniqueIndex("url_registry_slug_uq").on(table.slug),
  uniqueIndex("url_registry_canonical_uq").on(table.canonicalUrl),
  uniqueIndex("url_registry_intent_uq").on(table.intentKey),
  uniqueIndex("url_registry_case_uq").on(table.caseId),
]);

export const publications = sqliteTable("publications", {
  id: text("id").primaryKey(),
  caseId: text("case_id").notNull().references(() => cases.id, { onDelete: "cascade" }),
  revisionId: text("revision_id").notNull().references(() => caseRevisions.id),
  idempotencyKey: text("idempotency_key").notNull(),
  state: text("state", { enum: ["pending", "rendered", "published", "failed", "rolled_back"] }).notNull(),
  publicUrl: text("public_url"),
  renderedHash: text("rendered_hash"),
  errorCode: text("error_code"),
  publishedBy: text("published_by").references(() => users.id),
  createdAt: text("created_at").notNull(),
  completedAt: text("completed_at"),
}, (table) => [
  uniqueIndex("publications_idempotency_uq").on(table.idempotencyKey),
  index("publications_case_state_idx").on(table.caseId, table.state, table.createdAt),
]);

export const dataIssues = sqliteTable("data_issues", {
  id: text("id").primaryKey(),
  caseId: text("case_id").notNull().references(() => cases.id, { onDelete: "cascade" }),
  target: text("target", { enum: ["work_order", "catalog", "media", "price"] }).notNull(),
  ownerTeam: text("owner_team", { enum: ["workshop", "catalog", "media", "accounting"] }).notNull(),
  status: text("status", { enum: ["open", "resolved", "rejected"] }).notNull().default("open"),
  message: text("message").notNull(),
  openedBy: text("opened_by").notNull().references(() => users.id),
  openedAt: text("opened_at").notNull(),
  resolvedBy: text("resolved_by").references(() => users.id),
  resolvedAt: text("resolved_at"),
}, (table) => [
  index("data_issues_owner_status_idx").on(table.ownerTeam, table.status, table.openedAt),
]);

export const auditEvents = sqliteTable("audit_events", {
  id: text("id").primaryKey(),
  caseId: text("case_id").references(() => cases.id, { onDelete: "set null" }),
  actorId: text("actor_id").notNull().references(() => users.id),
  actorRole: text("actor_role").notNull(),
  action: text("action").notNull(),
  entityType: text("entity_type").notNull(),
  entityId: text("entity_id").notNull(),
  revision: integer("revision"),
  detailJson: text("detail_json").notNull(),
  ipHash: text("ip_hash"),
  createdAt: text("created_at").notNull(),
}, (table) => [
  index("audit_events_case_idx").on(table.caseId, table.createdAt),
  index("audit_events_actor_idx").on(table.actorId, table.createdAt),
]);

export const notifications = sqliteTable("notifications", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  type: text("type").notNull(),
  title: text("title").notNull(),
  body: text("body").notNull().default(""),
  caseId: text("case_id").references(() => cases.id, { onDelete: "set null" }),
  payloadJson: text("payload_json").notNull().default("{}"),
  readAt: text("read_at"),
  createdAt: text("created_at").notNull(),
}, (table) => [
  index("notifications_user_read_idx").on(table.userId, table.readAt, table.createdAt),
]);

export const outboxEvents = sqliteTable("outbox_events", {
  id: text("id").primaryKey(),
  aggregateType: text("aggregate_type").notNull(),
  aggregateId: text("aggregate_id").notNull(),
  eventType: text("event_type").notNull(),
  payloadJson: text("payload_json").notNull(),
  status: text("status", { enum: ["pending", "processing", "completed", "failed"] }).notNull().default("pending"),
  attemptCount: integer("attempt_count").notNull().default(0),
  availableAt: text("available_at").notNull(),
  processedAt: text("processed_at"),
  lastError: text("last_error"),
  createdAt: text("created_at").notNull(),
}, (table) => [
  index("outbox_status_available_idx").on(table.status, table.availableAt),
]);
