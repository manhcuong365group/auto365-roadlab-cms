"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type CaseItem = { id: string; caseCode: string; branchRef: string; workflowStatus: string; currentRevision: number; updatedAt: string };

const labels: Record<string, string> = { draft: "Bản nháp", in_review: "Đang review", changes_requested: "Cần chỉnh sửa", approved: "Đã duyệt", published: "Đã xuất bản" };

export default function CasesPage() {
  const [cases, setCases] = useState<CaseItem[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/v1/case-lab/dashboard")
      .then(async (response) => {
        if (!response.ok) throw new Error("Không thể tải danh sách case.");
        const body = await response.json() as { cases: CaseItem[] };
        setCases(body.cases);
      })
      .catch((reason: Error) => setError(reason.message));
  }, []);

  return <main className="workspace-page"><section className="workspace-shell workspace-list-page">
    <Link className="workspace-back" href="/workspace">← Tổng quan</Link>
    <div className="workspace-heading"><div><p className="workspace-eyebrow">Case Lab · tài nguyên</p><h1>Case / bài viết</h1><p>Danh sách case trong phạm vi quyền của tài khoản.</p></div></div>
    {error ? <div className="workspace-alert" role="alert">{error}</div> : null}
    {!error && cases.length === 0 ? <p className="workspace-empty">Chưa có case hoặc phiên đăng nhập chưa sẵn sàng.</p> : null}
    <div className="workspace-table workspace-table--full" role="table" aria-label="Danh sách case"><div className="workspace-table__head" role="row"><span>Case</span><span>Trạng thái</span><span>Revision</span></div>
      {cases.map((item) => <Link className="workspace-row" role="row" key={item.id} href={`/workspace/cases/${encodeURIComponent(item.id)}`}><span><b>{item.caseCode}</b><small>{item.branchRef}</small></span><span>{labels[item.workflowStatus] ?? item.workflowStatus}</span><span>r{item.currentRevision} · {new Date(item.updatedAt).toLocaleDateString("vi-VN")} →</span></Link>)}
    </div>
  </section></main>;
}
