import CaseEditor from "./case-editor";

export default async function CaseDetailPage({ params }: { params: Promise<{ caseId: string }> }) {
  const { caseId } = await params;
  return <CaseEditor caseId={caseId} mode="editor" />;
}
