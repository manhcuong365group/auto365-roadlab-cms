import { CaseLabApiError } from "./case-lab-api.ts";

export type FeedbackInput = {
  message: string;
  category: "content" | "evidence" | "seo" | "technical" | "general";
  revision?: number;
  parentFeedbackId?: string;
};

export type ProfileInput = {
  displayName: string;
  expectedRevision: number;
  preferences: Record<string, boolean>;
};

export type AssignmentInput = {
  userId: string;
  role: "oa" | "seo_lead" | "it" | "technical_reviewer";
};

export type CaseCreateInput = {
  contentType: "case" | "proof" | "brand" | "product";
  branchRef: string;
  vehicleRef: string;
  productRef: string;
};

const caseCreateContentTypes = new Set<CaseCreateInput["contentType"]>(["case", "proof", "brand", "product"]);

export function parseCaseCreateInput(input: unknown): CaseCreateInput {
  if (!input || typeof input !== "object") {
    throw new CaseLabApiError("VALIDATION_ERROR", "Dữ liệu tạo case không hợp lệ.", 400);
  }
  const value = input as Record<string, unknown>;
  const contentType = value.contentType;
  const branchRef = typeof value.branchRef === "string" ? value.branchRef.trim() : "";
  const vehicleRef = typeof value.vehicleRef === "string" ? value.vehicleRef.trim() : "";
  const productRef = typeof value.productRef === "string" ? value.productRef.trim() : "";
  if (typeof contentType !== "string" || !caseCreateContentTypes.has(contentType as CaseCreateInput["contentType"])) {
    throw new CaseLabApiError("VALIDATION_ERROR", "Loại nội dung không hợp lệ.", 400);
  }
  if (!branchRef || branchRef.length > 40) {
    throw new CaseLabApiError("VALIDATION_ERROR", "Chi nhánh cần có từ 1 đến 40 ký tự.", 400);
  }
  if (!vehicleRef || vehicleRef.length > 120) {
    throw new CaseLabApiError("VALIDATION_ERROR", "Tên xe cần có từ 1 đến 120 ký tự.", 400);
  }
  if (!productRef || productRef.length > 120) {
    throw new CaseLabApiError("VALIDATION_ERROR", "Tên sản phẩm cần có từ 1 đến 120 ký tự.", 400);
  }
  return { contentType: contentType as CaseCreateInput["contentType"], branchRef, vehicleRef, productRef };
}

const feedbackCategories = new Set<FeedbackInput["category"]>(["content", "evidence", "seo", "technical", "general"]);

export function parseFeedbackInput(input: unknown): FeedbackInput {
  if (!input || typeof input !== "object") {
    throw new CaseLabApiError("VALIDATION_ERROR", "Dữ liệu feedback không hợp lệ.", 400);
  }

  const value = input as Record<string, unknown>;
  const message = typeof value.message === "string" ? value.message.trim() : "";
  const category = value.category === undefined ? "general" : value.category;
  const revision = value.revision;
  const parentFeedbackId = typeof value.parentFeedbackId === "string" ? value.parentFeedbackId.trim() || undefined : undefined;

  if (!message || message.length > 4_000) {
    throw new CaseLabApiError("VALIDATION_ERROR", "Feedback cần có nội dung từ 1 đến 4000 ký tự.", 400);
  }
  if (typeof category !== "string" || !feedbackCategories.has(category as FeedbackInput["category"])) {
    throw new CaseLabApiError("VALIDATION_ERROR", "Nhóm feedback không hợp lệ.", 400);
  }
  if (revision !== undefined && (!Number.isInteger(revision) || revision < 1)) {
    throw new CaseLabApiError("VALIDATION_ERROR", "Revision feedback không hợp lệ.", 400);
  }

  return { message, category: category as FeedbackInput["category"], revision: revision as number | undefined, parentFeedbackId };
}

export function parseProfileInput(input: unknown): ProfileInput {
  if (!input || typeof input !== "object") {
    throw new CaseLabApiError("VALIDATION_ERROR", "Dữ liệu hồ sơ không hợp lệ.", 400);
  }
  const value = input as Record<string, unknown>;
  const displayName = typeof value.displayName === "string" ? value.displayName.trim() : "";
  const expectedRevision = value.expectedRevision;
  const preferences = value.preferences ?? {};
  if (displayName.length < 2 || displayName.length > 100) {
    throw new CaseLabApiError("VALIDATION_ERROR", "Tên hiển thị phải có từ 2 đến 100 ký tự.", 400);
  }
  if (!Number.isInteger(expectedRevision) || (expectedRevision as number) < 1) {
    throw new CaseLabApiError("VALIDATION_ERROR", "expectedRevision không hợp lệ.", 400);
  }
  if (!preferences || typeof preferences !== "object" || Array.isArray(preferences)
    || Object.values(preferences).some((item) => typeof item !== "boolean")) {
    throw new CaseLabApiError("VALIDATION_ERROR", "preferences phải là đối tượng gồm các giá trị boolean.", 400);
  }
  return { displayName, expectedRevision: expectedRevision as number, preferences: preferences as Record<string, boolean> };
}

export function parseAssignmentInput(input: unknown): AssignmentInput {
  if (!input || typeof input !== "object") {
    throw new CaseLabApiError("VALIDATION_ERROR", "Dữ liệu phân công không hợp lệ.", 400);
  }
  const value = input as Record<string, unknown>;
  const userId = typeof value.userId === "string" ? value.userId.trim() : "";
  const role = value.role;
  if (!userId || typeof role !== "string" || !["oa", "seo_lead", "it", "technical_reviewer"].includes(role)) {
    throw new CaseLabApiError("VALIDATION_ERROR", "Dữ liệu phân công không hợp lệ.", 400);
  }
  return { userId, role: role as AssignmentInput["role"] };
}
