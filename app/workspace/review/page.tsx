"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type CaseItem = { id: string; caseCode: string; branchRef: string; workflowStatus: string; currentRevision: number; updatedAt: string };
type ApiError = { error?: { code?: string; message?: string } };

const labels: Record<string, string> = { ready_for_review: "Chờ review", in_review: "Đang review", changes_requested: "Cần chỉnh sửa" };
const dateFormatter = new Intl.DateTimeFormat("vi-VN", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" });

export default function ReviewPage() {
  const [cases, setCases] = useState<CaseItem[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/v1/case-lab/dashboard")
      .then(async (response) => {
        if (!response.ok) { const body = await response.json().catch(() => ({})) as ApiError; throw new Error(body.error?.code === "UNAUTHENTICATED" ? "SESSION_REQUIRED" : body.error?.message ?? "Không thể tải hàng chờ review."); }
        return response.json() as Promise<{ cases: CaseItem[] }>;
      })
      .then((body) => setCases(body.cases))
      .catch((reason: Error) => setError(reason.message))
      .finally(() => setLoading(false));
  }, []);

  const reviewCases = useMemo(() => cases.filter((item) => ["ready_for_review", "in_review", "changes_requested"].includes(item.workflowStatus)), [cases]);
  const changesRequested = reviewCases.filter((item) => item.workflowStatus === "changes_requested").length;

  return <main className="workspace-page"><section className="workspace-shell workspace-list-page">
    <Link className="workspace-back" href="/workspace">← Tổng quan</Link>
    <div className="workspace-heading"><div><p className="workspace-eyebrow">Case Lab · kiểm duyệt</p><h1>Trung tâm review</h1><p>Theo dõi các case đang chờ phản hồi, cần chỉnh sửa hoặc đang được kiểm duyệt.</p></div></div>
    {error ? <div className="workspace-alert" role="alert">{error === "SESSION_REQUIRED" ? <><b>Phiên đăng nhập chưa sẵn sàng</b><span>Đăng nhập để xem hàng chờ review theo quyền.</span><Link className="workspace-alert__link" href="/login?return_to=/workspace/review">Đăng nhập Case Lab →</Link></> : error}</div> : null}
    {loading ? <p className="workspace-loading">Đang tải hàng chờ review…</p> : null}
    {!loading && !error ? <>
      <div className="workspace-list-summary" aria-label="Tổng quan review"><div><span>Chờ xử lý</span><b>{reviewCases.length}</b></div><div><span>Cần sửa</span><b>{changesRequested}</b></div><div><span>Đang review</span><b>{reviewCases.filter((item) => item.workflowStatus === "in_review").length}</b></div></div>
      {reviewCases.length === 0 ? <div className="workspace-empty workspace-empty--card"><b>Không có case nào trong hàng chờ review.</b><span>Các case chuyển sang “Chờ review” sẽ hiện tại đây.</span></div> : <div className="workspace-table workspace-table--full" role="table" aria-label="Hàng chờ review"><div className="workspace-table__head" role="row"><span>Case / chi nhánh</span><span>Trạng thái</span><span>Revision / cập nhật</span></div>{reviewCases.map((item) => <Link className="workspace-row" role="row" key={item.id} href={`/workspace/cases/${encodeURIComponent(item.id)}/review`}><span><b>{item.caseCode}</b><small>{item.branchRef}</small></span><span className="workspace-row__status"><i className={`status status--${item.workflowStatus}`} />{labels[item.workflowStatus]}</span><span><b>r{item.currentRevision}</b>{dateFormatter.format(new Date(item.updatedAt))} <em>→</em></span></Link>)}</div>}
    </> : null}
  </section></main>;
}
