"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import "../../workspace/workspace.css";
import { buildArticleViewModel, buildCaseArticleJsonLd } from "../../../lib/case-article-view";
import { getCaseContentType } from "../../../lib/case-content-types";
import type { CaseDraft } from "../../../lib/case-draft";
import type { CaseContentType } from "../../../lib/case-content-types";
import { CaseArticleView } from "../../tin-tuc/[slug]/CaseArticleView";

type DraftResponse = {
  case: { id: string; caseCode: string; contentType: CaseContentType; branchRef: string; workflowStatus: string; updatedAt: string };
  draft: { revision: number; content: CaseDraft; updatedAt: string };
};
type ApiError = { error?: { code?: string; message?: string } };

const publishedDisplay = new Intl.DateTimeFormat("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" });
const statusLabels: Record<string, string> = { draft: "Bản nháp", ready_for_review: "Chờ review", in_review: "Đang review", changes_requested: "Cần chỉnh sửa", technical_approved: "Đã qua IT", publishable: "Sẵn sàng xuất bản", published: "Đã xuất bản" };

async function readResponse<T>(response: Response): Promise<T> {
  if (response.ok) return response.json() as Promise<T>;
  const body = await response.json().catch(() => ({})) as ApiError;
  throw new Error(body.error?.code === "UNAUTHENTICATED" ? "SESSION_REQUIRED" : body.error?.message ?? "Không thể tải dữ liệu case.");
}

export default function CasePreview({ caseId }: { caseId: string }) {
  const [data, setData] = useState<DraftResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch(`/api/v1/case-lab/cases/${encodeURIComponent(caseId)}/draft`)
      .then(readResponse<DraftResponse>)
      .then((response) => { if (!cancelled) setData(response); })
      .catch((requestError) => { if (!cancelled) setError(requestError instanceof Error ? requestError.message : "Không thể tải dữ liệu case."); });
    return () => { cancelled = true; };
  }, [caseId]);

  const backLink = <Link className="preview-bar__back" href={`/workspace/cases/${encodeURIComponent(caseId)}`}>← Quay lại soạn bài</Link>;

  if (error) {
    return <div className="preview-shell">
      <div className="preview-bar">{backLink}</div>
      <section className="workspace-shell">
        <div className="workspace-alert" role="alert">
          {error === "SESSION_REQUIRED"
            ? <><b>Phiên đăng nhập chưa sẵn sàng</b><Link className="workspace-alert__link" href={`/login?return_to=/case-preview/${encodeURIComponent(caseId)}`}>Đăng nhập Case Lab →</Link></>
            : error}
        </div>
      </section>
    </div>;
  }

  if (!data) {
    return <div className="preview-shell">
      <div className="preview-bar">{backLink}</div>
      <section className="workspace-shell"><p className="workspace-editor-note">Đang tải bản xem trước…</p></section>
    </div>;
  }

  const vm = buildArticleViewModel(data.draft.content);
  const canonical = `https://auto365.vn/tin-tuc/${data.draft.content.seo.slug || caseId}`;
  const jsonLd = buildCaseArticleJsonLd(vm, canonical, data.draft.updatedAt);

  return <>
    <meta name="robots" content="noindex, nofollow" />
    <div className="preview-bar">
      {backLink}
      <div className="preview-bar__meta">
        <span className="preview-bar__flag">XEM TRƯỚC — CHƯA XUẤT BẢN</span>
        <span className="preview-bar__rev">Revision r{data.draft.revision}</span>
        <span className={`preview-bar__status preview-bar__status--${data.case.workflowStatus}`}>{statusLabels[data.case.workflowStatus] ?? data.case.workflowStatus}</span>
      </div>
      <Link className="preview-bar__cta" href={`/workspace/cases/${encodeURIComponent(caseId)}`}>Chỉnh sửa bài →</Link>
    </div>
    <CaseArticleView
      vm={vm}
      contentTypeLabel={getCaseContentType(data.case.contentType).label}
      caseCode={data.case.caseCode}
      branchRef={data.case.branchRef}
      publishedDisplay={publishedDisplay.format(new Date(data.draft.updatedAt))}
      jsonLd={jsonLd}
    />
  </>;
}
