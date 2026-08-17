import { and, eq } from "drizzle-orm";
import { getDb } from "../db";
import { cases, caseRevisions, urlRegistry } from "../db/schema";
import { normalizeCaseContentType, type CaseContentType } from "../lib/case-content-types";
import { normalizeCaseDraft, type CaseDraft } from "../lib/case-draft";

export type PublishedCase = {
  caseCode: string;
  contentType: CaseContentType;
  branchRef: string;
  vehicleRef: string;
  productRef: string;
  publishedAt: string;
  canonicalUrl: string;
  content: CaseDraft;
};

/**
 * `url_registry` is the locked slug → case mapping (see db/schema.ts):
 * content authors never own the public URL directly, it's registered
 * separately. A case is only publicly visible once its workflow reaches
 * `published` — draft/review revisions never resolve here.
 */
export async function getPublishedCaseBySlug(slug: string): Promise<PublishedCase | null> {
  const [entry] = await getDb().select().from(urlRegistry).where(eq(urlRegistry.slug, slug)).limit(1);
  if (!entry) return null;

  const [caseItem] = await getDb().select().from(cases).where(eq(cases.id, entry.caseId)).limit(1);
  if (!caseItem || caseItem.workflowStatus !== "published") return null;

  const revisionNumber = caseItem.publishedRevision ?? caseItem.currentRevision;
  const [revision] = await getDb().select().from(caseRevisions)
    .where(and(eq(caseRevisions.caseId, caseItem.id), eq(caseRevisions.revision, revisionNumber)))
    .limit(1);
  if (!revision) return null;

  const contentType = normalizeCaseContentType(caseItem.contentType);
  const content = normalizeCaseDraft(contentType, JSON.parse(revision.contentJson), {
    vehicleName: caseItem.vehicleRef,
    productName: caseItem.productRef,
  });

  return {
    caseCode: caseItem.caseCode,
    contentType,
    branchRef: caseItem.branchRef,
    vehicleRef: caseItem.vehicleRef,
    productRef: caseItem.productRef,
    publishedAt: revision.createdAt,
    canonicalUrl: entry.canonicalUrl,
    content,
  };
}
