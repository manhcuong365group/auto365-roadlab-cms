import { and, desc, eq, inArray, isNull } from "drizzle-orm";
import { getDb } from "../db";
import { auditEvents, caseAssignments, caseFeedback, caseRevisions, cases, notifications, userRoles, users } from "../db/schema";
import { normalizeCaseContentType } from "../lib/case-content-types";
import { assertCaseDraftWithinLimits, normalizeCaseDraft, type CaseDraft } from "../lib/case-draft";
import type { AuthenticatedActor, OperationalRole } from "./case-lab-contract";
import { CaseLabApiError } from "./case-lab-api";
import type { AssignmentInput, FeedbackInput, ProfileInput } from "./case-lab-input";
import { canManageAssignments, canReviewFeedbackInBranch, canonicalRole, hasBranchAccess } from "./case-lab-rbac";

type ScopedCase = typeof cases.$inferSelect;

function now(): string {
  return new Date().toISOString();
}

function actorCanReview(actor: AuthenticatedActor, branchRef: string): boolean {
  return canReviewFeedbackInBranch(actor.roles, branchRef);
}

async function requireScopedCase(caseId: string, actor: AuthenticatedActor): Promise<ScopedCase> {
  const db = getDb();
  const [caseItem] = await db.select().from(cases).where(eq(cases.id, caseId)).limit(1);
  if (!caseItem) {
    throw new CaseLabApiError("NOT_FOUND", "Không tìm thấy case.", 404);
  }
  if (!hasBranchAccess(actor.roles, caseItem.branchRef)) {
    throw new CaseLabApiError("BRANCH_SCOPE_DENIED", "Bạn không có quyền truy cập chi nhánh của case này.", 403);
  }
  return caseItem;
}

async function writeAudit(input: {
  caseId: string;
  actor: AuthenticatedActor;
  action: string;
  entityType: string;
  entityId: string;
  revision?: number;
  details: Record<string, unknown>;
}): Promise<void> {
  const role = input.actor.roles[0]?.role ?? "content";
  await getDb().insert(auditEvents).values({
    id: crypto.randomUUID(),
    caseId: input.caseId,
    actorId: input.actor.id,
    actorRole: role,
    action: input.action,
    entityType: input.entityType,
    entityId: input.entityId,
    revision: input.revision,
    detailJson: JSON.stringify(input.details),
    createdAt: now(),
  });
}

export async function listCaseFeedback(caseId: string, actor: AuthenticatedActor) {
  await requireScopedCase(caseId, actor);
  const rows = await getDb()
    .select({
      id: caseFeedback.id,
      revision: caseFeedback.revision,
      parentFeedbackId: caseFeedback.parentFeedbackId,
      category: caseFeedback.category,
      message: caseFeedback.message,
      status: caseFeedback.status,
      createdAt: caseFeedback.createdAt,
      resolvedAt: caseFeedback.resolvedAt,
      author: { id: users.id, displayName: users.displayName },
    })
    .from(caseFeedback)
    .innerJoin(users, eq(caseFeedback.authorId, users.id))
    .where(eq(caseFeedback.caseId, caseId))
    .orderBy(desc(caseFeedback.createdAt));
  return { items: rows };
}

export async function listCaseAssignments(caseId: string, actor: AuthenticatedActor) {
  await requireScopedCase(caseId, actor);
  const items = await getDb().select({
    id: caseAssignments.id, role: caseAssignments.role, assignedAt: caseAssignments.assignedAt,
    user: { id: users.id, displayName: users.displayName, email: users.email },
  }).from(caseAssignments).innerJoin(users, eq(caseAssignments.userId, users.id))
    .where(and(eq(caseAssignments.caseId, caseId), isNull(caseAssignments.unassignedAt)))
    .orderBy(caseAssignments.role, desc(caseAssignments.assignedAt));
  return { items };
}

export async function assignCaseReviewer(caseId: string, actor: AuthenticatedActor, input: AssignmentInput) {
  const caseItem = await requireScopedCase(caseId, actor);
  if (!actor.roles.some(({ role }) => canManageAssignments(role))) {
    throw new CaseLabApiError("FORBIDDEN_ROLE", "Vai trò hiện tại không được phân công reviewer.", 403);
  }
  const [assignee] = await getDb().select({ id: users.id, status: users.status }).from(users).where(eq(users.id, input.userId)).limit(1);
  if (!assignee || assignee.status !== "active") {
    throw new CaseLabApiError("NOT_FOUND", "Không tìm thấy tài khoản hoạt động để phân công.", 404);
  }
  const assigneeRoles = await getDb().select({ role: userRoles.role, branchRef: userRoles.branchRef }).from(userRoles)
    .where(eq(userRoles.userId, input.userId));
  const canFillRole = assigneeRoles.some(({ role, branchRef }) =>
    (canonicalRole(role) === canonicalRole(input.role) || (input.role === "technical_reviewer" && canonicalRole(role) === "it"))
    && (branchRef === "*" || branchRef === caseItem.branchRef),
  );
  if (!canFillRole) {
    throw new CaseLabApiError("FORBIDDEN_ROLE", "Tài khoản không có vai trò hoặc phạm vi chi nhánh phù hợp để nhận phân công.", 403);
  }

  const assignedAt = now();
  await getDb().update(caseAssignments).set({ unassignedAt: assignedAt }).where(and(
    eq(caseAssignments.caseId, caseId), eq(caseAssignments.role, input.role), isNull(caseAssignments.unassignedAt),
  ));
  const id = crypto.randomUUID();
  await getDb().insert(caseAssignments).values({
    id, caseId, userId: input.userId, role: input.role, assignedBy: actor.id, assignedAt,
  });
  await writeAudit({
    caseId, actor, action: "assignment.updated", entityType: "case_assignment", entityId: id,
    revision: caseItem.currentRevision, details: { assigneeId: input.userId, role: input.role },
  });
  if (input.userId !== actor.id) {
    await getDb().insert(notifications).values({
      id: crypto.randomUUID(), userId: input.userId, type: "assignment.updated", title: `Bạn được phân công ${caseItem.caseCode}`,
      body: `Vai trò: ${input.role}`, caseId, payloadJson: JSON.stringify({ assignmentId: id, role: input.role }), createdAt: assignedAt,
    });
  }
  return { id, caseId, userId: input.userId, role: input.role, assignedAt };
}

export async function createCaseFeedback(caseId: string, actor: AuthenticatedActor, input: FeedbackInput) {
  const caseItem = await requireScopedCase(caseId, actor);
  if (!actorCanReview(actor, caseItem.branchRef)) {
    throw new CaseLabApiError("FORBIDDEN_ROLE", "Vai trò hiện tại không được tạo feedback review.", 403);
  }
  const revision = input.revision ?? caseItem.currentRevision;
  if (revision > caseItem.currentRevision) {
    throw new CaseLabApiError("REVISION_CONFLICT", "Revision feedback vượt quá revision hiện tại của case.", 409);
  }
  if (input.parentFeedbackId) {
    const [parent] = await getDb().select({ id: caseFeedback.id }).from(caseFeedback)
      .where(and(eq(caseFeedback.id, input.parentFeedbackId), eq(caseFeedback.caseId, caseId))).limit(1);
    if (!parent) throw new CaseLabApiError("NOT_FOUND", "Không tìm thấy feedback gốc trong case.", 404);
  }

  const feedbackId = crypto.randomUUID();
  const createdAt = now();
  await getDb().insert(caseFeedback).values({
    id: feedbackId,
    caseId,
    revision,
    parentFeedbackId: input.parentFeedbackId,
    authorId: actor.id,
    category: input.category,
    message: input.message,
    status: "open",
    createdAt,
  });
  await writeAudit({
    caseId,
    actor,
    action: "feedback.created",
    entityType: "case_feedback",
    entityId: feedbackId,
    revision,
    details: { category: input.category, parentFeedbackId: input.parentFeedbackId ?? null },
  });

  const recipients = await getDb().select({ userId: caseAssignments.userId }).from(caseAssignments)
    .where(and(eq(caseAssignments.caseId, caseId), isNull(caseAssignments.unassignedAt)));
  const recipientIds = [...new Set(recipients.map((item) => item.userId).filter((id) => id !== actor.id))];
  if (recipientIds.length) {
    await getDb().insert(notifications).values(recipientIds.map((userId) => ({
      id: crypto.randomUUID(), userId, type: "feedback.created", title: `Feedback mới cho ${caseItem.caseCode}`,
      body: input.message.slice(0, 240), caseId, payloadJson: JSON.stringify({ feedbackId, revision }), createdAt,
    })));
  }
  return { id: feedbackId, caseId, revision, category: input.category, message: input.message, status: "open", createdAt };
}

export async function resolveCaseFeedback(feedbackId: string, actor: AuthenticatedActor) {
  const [feedback] = await getDb().select().from(caseFeedback).where(eq(caseFeedback.id, feedbackId)).limit(1);
  if (!feedback) throw new CaseLabApiError("NOT_FOUND", "Không tìm thấy feedback.", 404);
  const caseItem = await requireScopedCase(feedback.caseId, actor);
  if (!actorCanReview(actor, caseItem.branchRef)) {
    throw new CaseLabApiError("FORBIDDEN_ROLE", "Vai trò hiện tại không được resolve feedback.", 403);
  }
  if (feedback.status === "resolved") return { id: feedback.id, status: feedback.status, resolvedAt: feedback.resolvedAt };
  const resolvedAt = now();
  await getDb().update(caseFeedback).set({ status: "resolved", resolvedBy: actor.id, resolvedAt }).where(eq(caseFeedback.id, feedbackId));
  await writeAudit({
    caseId: feedback.caseId, actor, action: "feedback.resolved", entityType: "case_feedback", entityId: feedbackId,
    revision: feedback.revision, details: {},
  });
  return { id: feedbackId, status: "resolved", resolvedAt };
}

export async function listCaseAudit(caseId: string, actor: AuthenticatedActor) {
  await requireScopedCase(caseId, actor);
  const items = await getDb().select({
    id: auditEvents.id, action: auditEvents.action, entityType: auditEvents.entityType, entityId: auditEvents.entityId,
    revision: auditEvents.revision, detailJson: auditEvents.detailJson, createdAt: auditEvents.createdAt,
    actor: { id: users.id, displayName: users.displayName },
  }).from(auditEvents).innerJoin(users, eq(auditEvents.actorId, users.id))
    .where(eq(auditEvents.caseId, caseId)).orderBy(desc(auditEvents.createdAt));
  return { items };
}

type CaseDraftInput = {
  expectedRevision: number;
  content: unknown;
};

function contentFromRevision(contentJson: string, caseItem: Pick<ScopedCase, "vehicleRef" | "productRef" | "contentType">): CaseDraft {
  const contentType = normalizeCaseContentType(caseItem.contentType);
  const seed = { vehicleName: caseItem.vehicleRef, productName: caseItem.productRef };
  try {
    return normalizeCaseDraft(contentType, JSON.parse(contentJson), seed);
  } catch {
    return normalizeCaseDraft(contentType, null, seed);
  }
}

async function latestCaseRevision(caseId: string) {
  const [revision] = await getDb().select().from(caseRevisions)
    .where(eq(caseRevisions.caseId, caseId)).orderBy(desc(caseRevisions.revision)).limit(1);
  if (!revision) throw new CaseLabApiError("NOT_FOUND", "Case chưa có bản nháp để chỉnh sửa.", 404);
  return revision;
}

export async function getCaseDraft(caseId: string, actor: AuthenticatedActor) {
  const caseItem = await requireScopedCase(caseId, actor);
  const revision = await latestCaseRevision(caseId);
  return {
    case: {
      id: caseItem.id, caseCode: caseItem.caseCode, contentType: normalizeCaseContentType(caseItem.contentType), branchRef: caseItem.branchRef,
      vehicleRef: caseItem.vehicleRef, productRef: caseItem.productRef,
      workflowStatus: caseItem.workflowStatus, currentRevision: caseItem.currentRevision, updatedAt: caseItem.updatedAt,
    },
    draft: { revision: revision.revision, content: contentFromRevision(revision.contentJson, caseItem), updatedAt: revision.createdAt },
  };
}

export async function saveCaseDraft(caseId: string, actor: AuthenticatedActor, input: CaseDraftInput) {
  const caseItem = await requireScopedCase(caseId, actor);
  if (!actorCanReview(actor, caseItem.branchRef)) {
    throw new CaseLabApiError("FORBIDDEN_ROLE", "Vai trò hiện tại không được chỉnh sửa nội dung case.", 403);
  }
  const latest = await latestCaseRevision(caseId);
  if (input.expectedRevision !== latest.revision) {
    throw new CaseLabApiError("REVISION_CONFLICT", "Bản nháp đã được cập nhật bởi người khác. Hãy tải lại trước khi lưu.", 409);
  }
  const savedAt = now();
  const revision = latest.revision + 1;
  const revisionId = crypto.randomUUID();
  const content = normalizeCaseDraft(normalizeCaseContentType(caseItem.contentType), input.content, { vehicleName: caseItem.vehicleRef, productName: caseItem.productRef });
  try {
    assertCaseDraftWithinLimits(content);
  } catch (validationError) {
    throw new CaseLabApiError("VALIDATION_ERROR", validationError instanceof Error ? validationError.message : "Dữ liệu bản nháp không hợp lệ.", 400);
  }
  await getDb().insert(caseRevisions).values({
    id: revisionId, caseId, revision, sourceVersion: latest.sourceVersion, sourceHash: latest.sourceHash,
    contentJson: JSON.stringify(content), technicalSnapshotJson: latest.technicalSnapshotJson,
    catalogSnapshotJson: latest.catalogSnapshotJson, seoSnapshotJson: latest.seoSnapshotJson,
    technicalDigest: latest.technicalDigest, createdBy: actor.id, createdAt: savedAt,
  });
  await getDb().update(cases).set({ currentRevision: revision, workflowStatus: "draft", updatedAt: savedAt }).where(eq(cases.id, caseId));
  await writeAudit({
    caseId, actor, action: "draft.saved", entityType: "case_revision", entityId: revisionId, revision,
    details: { previousRevision: latest.revision },
  });
  return {
    case: { id: caseItem.id, caseCode: caseItem.caseCode, contentType: normalizeCaseContentType(caseItem.contentType), workflowStatus: "draft", currentRevision: revision, updatedAt: savedAt },
    draft: { revision, content, updatedAt: savedAt },
  };
}

export type CaseWorkflowAction = "submit_review" | "approve_technical" | "approve_seo" | "request_changes" | "publish";

type TransitionRule = { from: ScopedCase["workflowStatus"][]; to: ScopedCase["workflowStatus"]; roles: OperationalRole[] };

const WORKFLOW_TRANSITIONS: Record<CaseWorkflowAction, TransitionRule> = {
  submit_review: { from: ["draft", "changes_requested"], to: "in_review", roles: ["content", "oa", "boss"] },
  approve_technical: { from: ["in_review"], to: "technical_approved", roles: ["it", "boss"] },
  approve_seo: { from: ["technical_approved"], to: "publishable", roles: ["seo_lead", "boss"] },
  request_changes: { from: ["in_review", "technical_approved", "publishable"], to: "changes_requested", roles: ["it", "seo_lead", "oa", "boss"] },
  publish: { from: ["publishable"], to: "published", roles: ["oa", "boss"] },
};

export async function transitionCaseStatus(
  caseId: string,
  actor: AuthenticatedActor,
  input: { action: CaseWorkflowAction; expectedRevision: number; note?: string },
) {
  const caseItem = await requireScopedCase(caseId, actor);
  const rule = WORKFLOW_TRANSITIONS[input.action];
  if (!rule) {
    throw new CaseLabApiError("VALIDATION_ERROR", "Hành động không hợp lệ.", 400);
  }
  const actorRoles = new Set(actor.roles.map((entry) => canonicalRole(entry.role)));
  if (!rule.roles.some((role) => actorRoles.has(role))) {
    throw new CaseLabApiError("FORBIDDEN_ROLE", "Vai trò hiện tại không được thực hiện hành động này.", 403);
  }
  if (input.expectedRevision !== caseItem.currentRevision) {
    throw new CaseLabApiError("REVISION_CONFLICT", "Case đã được cập nhật bởi người khác. Hãy tải lại trước khi thao tác.", 409);
  }
  if (!rule.from.includes(caseItem.workflowStatus)) {
    throw new CaseLabApiError("INVALID_TRANSITION", `Không thể thực hiện hành động này khi case đang ở trạng thái "${caseItem.workflowStatus}".`, 409);
  }

  const updatedAt = now();
  const publishedRevision = input.action === "publish" ? caseItem.currentRevision : caseItem.publishedRevision;
  await getDb().update(cases).set({ workflowStatus: rule.to, publishedRevision, updatedAt }).where(eq(cases.id, caseId));
  await writeAudit({
    caseId, actor, action: `case.${input.action}`, entityType: "case", entityId: caseId, revision: caseItem.currentRevision,
    details: { from: caseItem.workflowStatus, to: rule.to, note: input.note ?? null },
  });

  return {
    case: {
      id: caseItem.id, workflowStatus: rule.to, currentRevision: caseItem.currentRevision,
      publishedRevision, updatedAt,
    },
  };
}

export async function listMyNotifications(actor: AuthenticatedActor) {
  const items = await getDb().select().from(notifications).where(eq(notifications.userId, actor.id)).orderBy(desc(notifications.createdAt)).limit(100);
  return { items };
}

export async function markNotificationRead(notificationId: string, actor: AuthenticatedActor) {
  const [notification] = await getDb().select().from(notifications).where(eq(notifications.id, notificationId)).limit(1);
  if (!notification) throw new CaseLabApiError("NOT_FOUND", "Không tìm thấy thông báo.", 404);
  if (notification.userId !== actor.id) throw new CaseLabApiError("FORBIDDEN_ROLE", "Bạn không thể cập nhật thông báo của người khác.", 403);
  const readAt = notification.readAt ?? now();
  if (!notification.readAt) await getDb().update(notifications).set({ readAt }).where(eq(notifications.id, notificationId));
  return { id: notificationId, readAt };
}

function accessibleBranchRefs(actor: AuthenticatedActor): string[] | null {
  return actor.roles.some(({ role, branchRef }) => role === "boss" || role === "admin" || branchRef === "*")
    ? null
    : [...new Set(actor.roles.map(({ branchRef }) => branchRef))];
}

export async function getDashboard(actor: AuthenticatedActor) {
  const branchRefs = accessibleBranchRefs(actor);
  const scopedCases = await getDb().select({
    id: cases.id,
    caseCode: cases.caseCode,
    contentType: cases.contentType,
    branchRef: cases.branchRef,
    workflowStatus: cases.workflowStatus,
    currentRevision: cases.currentRevision,
    updatedAt: cases.updatedAt,
  }).from(cases).where(branchRefs ? inArray(cases.branchRef, branchRefs) : undefined).orderBy(desc(cases.updatedAt));
  const caseRows = scopedCases.slice(0, 30).map((item) => ({ ...item, contentType: normalizeCaseContentType(item.contentType) }));
  const scopedCaseIds = scopedCases.map((item) => item.id);
  const assignedCaseIds = (await getDb().select({ caseId: caseAssignments.caseId }).from(caseAssignments)
    .where(and(eq(caseAssignments.userId, actor.id), isNull(caseAssignments.unassignedAt)))).map((item) => item.caseId);
  const openFeedback = scopedCaseIds.length
    ? await getDb().select({ id: caseFeedback.id, caseId: caseFeedback.caseId }).from(caseFeedback)
      .where(and(inArray(caseFeedback.caseId, scopedCaseIds), eq(caseFeedback.status, "open")))
    : [];
  const unreadNotifications = await getDb().select({ id: notifications.id }).from(notifications)
    .where(and(eq(notifications.userId, actor.id), isNull(notifications.readAt)));
  const activity = await getDb().select({
    id: auditEvents.id, action: auditEvents.action, caseId: auditEvents.caseId, createdAt: auditEvents.createdAt,
  }).from(auditEvents).where(eq(auditEvents.actorId, actor.id)).orderBy(desc(auditEvents.createdAt)).limit(8);
  const assigned = new Set(assignedCaseIds);
  return {
    summary: {
      totalCases: scopedCases.length,
      assignedToMe: scopedCaseIds.filter((caseId) => assigned.has(caseId)).length,
      openFeedback: openFeedback.length,
      unreadNotifications: unreadNotifications.length,
    },
    cases: caseRows,
    activity,
  };
}

export async function getOperationsReport(actor: AuthenticatedActor) {
  const dashboard = await getDashboard(actor);
  const branchRefs = accessibleBranchRefs(actor);
  const scopedCases = await getDb().select({ workflowStatus: cases.workflowStatus }).from(cases)
    .where(branchRefs ? inArray(cases.branchRef, branchRefs) : undefined);
  const byWorkflowStatus = scopedCases.reduce<Record<string, number>>((result, item) => {
    result[item.workflowStatus] = (result[item.workflowStatus] ?? 0) + 1;
    return result;
  }, {});
  return { generatedAt: now(), scope: branchRefs ?? ["*"], byWorkflowStatus, summary: dashboard.summary };
}

export async function getMyProfile(actor: AuthenticatedActor) {
  const [user] = await getDb().select({
    id: users.id, email: users.email, displayName: users.displayName, profileRevision: users.profileRevision,
    preferencesJson: users.preferencesJson,
  }).from(users).where(eq(users.id, actor.id)).limit(1);
  if (!user) throw new CaseLabApiError("UNAUTHENTICATED", "Không tìm thấy tài khoản đang đăng nhập.", 401);
  return { ...user, preferences: JSON.parse(user.preferencesJson) as Record<string, boolean> };
}

export async function updateMyProfile(actor: AuthenticatedActor, input: ProfileInput) {
  const profile = await getMyProfile(actor);
  if (profile.profileRevision !== input.expectedRevision) {
    throw new CaseLabApiError("REVISION_CONFLICT", "Hồ sơ đã được cập nhật ở nơi khác. Hãy tải lại trước khi lưu.", 409, {
      currentRevision: profile.profileRevision,
    });
  }
  const updatedAt = now();
  const profileRevision = profile.profileRevision + 1;
  await getDb().update(users).set({
    displayName: input.displayName, preferencesJson: JSON.stringify(input.preferences), profileRevision, updatedAt,
  }).where(eq(users.id, actor.id));
  await getDb().insert(auditEvents).values({
    id: crypto.randomUUID(), actorId: actor.id, actorRole: actor.roles[0]?.role ?? "content", action: "profile.updated",
    entityType: "user", entityId: actor.id, detailJson: JSON.stringify({ profileRevision }), createdAt: updatedAt,
  });
  return { id: actor.id, displayName: input.displayName, preferences: input.preferences, profileRevision, updatedAt };
}
