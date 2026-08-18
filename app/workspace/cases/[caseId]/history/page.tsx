import CaseHistory from "./case-history";

export default async function CaseHistoryPage({ params }: { params: Promise<{ caseId: string }> }) {
  const { caseId } = await params;
  return <CaseHistory caseId={caseId} />;
}
