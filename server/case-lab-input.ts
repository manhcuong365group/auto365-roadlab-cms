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

export type UserUpdateInput = {
  displayName?: string;
  status?: "active" | "suspended";
  password?: string;
  roles?: UserRoleInput[];
};

const updateRoleValues = new Set(["content", "oa", "seo_lead", "it", "boss"]);

export function parseUserUpdateInput(input: unknown): UserUpdateInput {
  if (!input || typeof input !== "object") {
    throw new CaseLabApiError("VALIDATION_ERROR", "Dữ liệu cập nhật tài khoản không hợp lệ.", 400);
  }
  const value = input as Record<string, unknown>;
  const result: UserUpdateInput = {};

  if (value.displayName !== undefined) {
    const displayName = typeof value.displayName === "string" ? value.displayName.trim() : "";
    if (displayName.length < 2 || displayName.length > 100) {
      throw new CaseLabApiError("VALIDATION_ERROR", "Tên hiển thị cần từ 2 đến 100 ký tự.", 400);
    }
    result.displayName = displayName;
  }
  if (value.status !== undefined) {
    if (value.status !== "active" && value.status !== "suspended") {
      throw new CaseLabApiError("VALIDATION_ERROR", "Trạng thái tài khoản không hợp lệ.", 400);
    }
    result.status = value.status;
  }
  if (value.password !== undefined) {
    const password = typeof value.password === "string" ? value.password : "";
    if (password.length < 8 || password.length > 200) {
      throw new CaseLabApiError("VALIDATION_ERROR", "Mật khẩu mới cần tối thiểu 8 ký tự.", 400);
    }
    result.password = password;
  }
  if (value.roles !== undefined) {
    if (!Array.isArray(value.roles) || !value.roles.length) {
      throw new CaseLabApiError("VALIDATION_ERROR", "Cần gán ít nhất một vai trò.", 400);
    }
    result.roles = value.roles.map((entry) => {
      if (!entry || typeof entry !== "object") throw new CaseLabApiError("VALIDATION_ERROR", "Vai trò không hợp lệ.", 400);
      const roleEntry = entry as Record<string, unknown>;
      const role = roleEntry.role;
      const branchRef = typeof roleEntry.branchRef === "string" ? roleEntry.branchRef.trim() : "";
      if (typeof role !== "string" || !updateRoleValues.has(role)) throw new CaseLabApiError("VALIDATION_ERROR", "Vai trò không hợp lệ.", 400);
      if (!branchRef || branchRef.length > 40) throw new CaseLabApiError("VALIDATION_ERROR", "Phạm vi chi nhánh không hợp lệ.", 400);
      return { role: role as UserRoleInput["role"], branchRef };
    });
  }
  return result;
}

export type PasswordChangeInput = { currentPassword: string; newPassword: string };

export function parsePasswordChangeInput(input: unknown): PasswordChangeInput {
  if (!input || typeof input !== "object") {
    throw new CaseLabApiError("VALIDATION_ERROR", "Dữ liệu đổi mật khẩu không hợp lệ.", 400);
  }
  const value = input as Record<string, unknown>;
  const currentPassword = typeof value.currentPassword === "string" ? value.currentPassword : "";
  const newPassword = typeof value.newPassword === "string" ? value.newPassword : "";
  if (!currentPassword) {
    throw new CaseLabApiError("VALIDATION_ERROR", "Cần nhập mật khẩu hiện tại.", 400);
  }
  if (newPassword.length < 8 || newPassword.length > 200) {
    throw new CaseLabApiError("VALIDATION_ERROR", "Mật khẩu mới cần tối thiểu 8 ký tự.", 400);
  }
  return { currentPassword, newPassword };
}

export type CaseCreateInput = {
  contentType: "case" | "proof" | "brand" | "product";
  branchRef: string;
  vehicleRef: string;
  productRef: string;
};

const caseCreateContentTypes = new Set<CaseCreateInput["contentType"]>(["case", "proof", "brand", "product"]);

export type UserRoleInput = { role: "content" | "oa" | "seo_lead" | "it" | "boss"; branchRef: string };

export type UserCreateInput = {
  email: string;
  displayName: string;
  password: string;
  roles: UserRoleInput[];
};

const userRoleValues = new Set<UserRoleInput["role"]>(["content", "oa", "seo_lead", "it", "boss"]);
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function parseUserCreateInput(input: unknown): UserCreateInput {
  if (!input || typeof input !== "object") {
    throw new CaseLabApiError("VALIDATION_ERROR", "Dữ liệu tài khoản không hợp lệ.", 400);
  }
  const value = input as Record<string, unknown>;
  const email = typeof value.email === "string" ? value.email.trim().toLowerCase() : "";
  const displayName = typeof value.displayName === "string" ? value.displayName.trim() : "";
  const password = typeof value.password === "string" ? value.password : "";
  const rolesRaw = Array.isArray(value.roles) ? value.roles : [];

  if (!emailPattern.test(email)) {
    throw new CaseLabApiError("VALIDATION_ERROR", "Email không hợp lệ.", 400);
  }
  if (displayName.length < 2 || displayName.length > 100) {
    throw new CaseLabApiError("VALIDATION_ERROR", "Tên hiển thị cần từ 2 đến 100 ký tự.", 400);
  }
  if (password.length < 8 || password.length > 200) {
    throw new CaseLabApiError("VALIDATION_ERROR", "Mật khẩu cần tối thiểu 8 ký tự.", 400);
  }
  const roles = rolesRaw.map((entry) => {
    if (!entry || typeof entry !== "object") throw new CaseLabApiError("VALIDATION_ERROR", "Vai trò không hợp lệ.", 400);
    const roleEntry = entry as Record<string, unknown>;
    const role = roleEntry.role;
    const branchRef = typeof roleEntry.branchRef === "string" ? roleEntry.branchRef.trim() : "";
    if (typeof role !== "string" || !userRoleValues.has(role as UserRoleInput["role"])) {
      throw new CaseLabApiError("VALIDATION_ERROR", "Vai trò không hợp lệ.", 400);
    }
    if (!branchRef || branchRef.length > 40) {
      throw new CaseLabApiError("VALIDATION_ERROR", "Phạm vi chi nhánh không hợp lệ.", 400);
    }
    return { role: role as UserRoleInput["role"], branchRef };
  });
  if (!roles.length) {
    throw new CaseLabApiError("VALIDATION_ERROR", "Cần gán ít nhất một vai trò.", 400);
  }
  return { email, displayName, password, roles };
}

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
