import CasePreview from "./case-preview";

export default async function CasePreviewPage({ params }: { params: Promise<{ caseId: string }> }) {
  const { caseId } = await params;
  return <CasePreview caseId={caseId} />;
}
