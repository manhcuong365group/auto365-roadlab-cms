import type { ActorRole, OperationalRole } from "./case-lab-contract";

export type ScopedRole = {
  role: ActorRole;
  branchRef: string;
};

const legacyRoleMap: Record<Exclude<ActorRole, OperationalRole>, OperationalRole> = {
  technical_reviewer: "it",
  publisher: "seo_lead",
  seo_admin: "seo_lead",
  admin: "boss",
};

export function canonicalRole(role: ActorRole): OperationalRole {
  return legacyRoleMap[role as keyof typeof legacyRoleMap] ?? role as OperationalRole;
}

export function hasBranchAccess(roles: ScopedRole[], branchRef: string): boolean {
  return roles.some(({ role, branchRef: scope }) => canonicalRole(role) === "boss" || scope === "*" || scope === branchRef);
}

export function canReviewFeedback(role: ActorRole): boolean {
  return ["content", "oa", "seo_lead", "it", "boss"].includes(canonicalRole(role));
}

export function canReviewFeedbackInBranch(roles: ScopedRole[], branchRef: string): boolean {
  return roles.some(({ role, branchRef: scope }) =>
    canReviewFeedback(role)
      && (canonicalRole(role) === "boss" || scope === "*" || scope === branchRef),
  );
}

export function canManageAssignments(role: ActorRole): boolean {
  return ["oa", "seo_lead", "it", "boss"].includes(canonicalRole(role));
}
