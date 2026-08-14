import CaseEditor from "../case-editor";

export default async function CaseReviewPage({ params }: { params: Promise<{ caseId: string }> }) {
  const { caseId } = await params;
  return <CaseEditor caseId={caseId} mode="review" />;
}
