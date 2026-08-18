"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { caseContentTypeOptions, getCaseContentType, type CaseContentType } from "../../../lib/case-content-types";

type CaseItem = { id: string; caseCode: string; contentType: CaseContentType; branchRef: string; workflowStatus: string; currentRevision: number; updatedAt: string };
type ApiError = { error?: { code?: string; message?: string } };

function NewCaseForm({ onClose, onCreated }: { onClose: () => void; onCreated: (caseId: string) => void }) {
  const [contentType, setContentType] = useState<CaseContentType>("case");
  const [branchRef, setBranchRef] = useState("");
  const [vehicleRef, setVehicleRef] = useState("");
  const [productRef, setProductRef] = useState("");
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState("");

  async function submit() {
    setCreating(true); setCreateError("");
    try {
      const response = await fetch("/api/v1/case-lab/cases", {
        method: "POST", headers: { "content-type": "application/json" },
        body: JSON.stringify({ contentType, branchRef: branchRef.trim(), vehicleRef: vehicleRef.trim(), productRef: productRef.trim() }),
      });
      const body = await response.json().catch(() => ({})) as { case?: { id: string }; error?: { message?: string } };
      if (!response.ok || !body.case) throw new Error(body.error?.message ?? "Không thể tạo case.");
      onCreated(body.case.id);
    } catch (reason) { setCreateError(reason instanceof Error ? reason.message : "Không thể tạo case."); }
    finally { setCreating(false); }
  }

  return <div className="workspace-card workspace-new-case">
    <div className="workspace-card__head"><h2>Tạo case mới</h2><button type="button" className="workspace-button workspace-button--ghost" onClick={onClose}>Đóng</button></div>
    {createError ? <div className="workspace-alert" role="alert">{createError}</div> : null}
    <div className="workspace-field-grid">
      <label className="workspace-field"><span>Loại nội dung</span><select value={contentType} onChange={(event) => setContentType(event.target.value as CaseContentType)}>{caseContentTypeOptions.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}</select></label>
      <label className="workspace-field"><span>Chi nhánh</span><input value={branchRef} onChange={(event) => setBranchRef(event.target.value)} placeholder="VD: HCM-01" /></label>
      <label className="workspace-field"><span>Xe</span><input value={vehicleRef} onChange={(event) => setVehicleRef(event.target.value)} placeholder="VD: Ford Ranger" /></label>
      <label className="workspace-field"><span>Sản phẩm</span><input value={productRef} onChange={(event) => setProductRef(event.target.value)} placeholder="VD: Bi Laser X9" /></label>
    </div>
    <button type="button" className="workspace-button" disabled={creating || !branchRef.trim() || !vehicleRef.trim() || !productRef.trim()} onClick={submit}>{creating ? "Đang tạo…" : "Tạo case"}</button>
  </div>;
}

const labels: Record<string, string> = {
  draft: "Bản nháp", ready_for_review: "Chờ review", in_review: "Đang review",
  changes_requested: "Cần chỉnh sửa", technical_approved: "Đã qua IT",
  publishable: "Sẵn sàng xuất bản", published: "Đã xuất bản", archived: "Đã lưu trữ",
};

const dateFormatter = new Intl.DateTimeFormat("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" });

export default function CasesPage() {
  const router = useRouter();
  const [cases, setCases] = useState<CaseItem[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [contentType, setContentType] = useState("all");
  const [status, setStatus] = useState("all");
  const [showNewCase, setShowNewCase] = useState(false);

  useEffect(() => {
    fetch("/api/v1/case-lab/dashboard")
      .then(async (response) => {
        if (!response.ok) { const body = await response.json().catch(() => ({})) as ApiError; if (body.error?.code === "UNAUTHENTICATED") throw new Error("SESSION_REQUIRED"); throw new Error(body.error?.message ?? "Không thể tải danh sách case."); }
        const body = await response.json() as { cases: CaseItem[] };
        setCases(body.cases);
      })
    .catch((reason: Error) => setError(reason.message))
    .finally(() => setLoading(false));
  }, []);

  const openCases = cases.filter((item) => !["published", "archived"].includes(item.workflowStatus)).length;
  const needsAttention = cases.filter((item) => ["changes_requested", "in_review", "ready_for_review"].includes(item.workflowStatus)).length;
  const visibleCases = useMemo(() => cases.filter((item) => {
    const matchesQuery = `${item.caseCode} ${item.branchRef} ${getCaseContentType(item.contentType).label}`.toLocaleLowerCase("vi-VN").includes(query.trim().toLocaleLowerCase("vi-VN"));
    return matchesQuery && (contentType === "all" || item.contentType === contentType) && (status === "all" || item.workflowStatus === status);
  }), [cases, contentType, query, status]);

  return <section className="workspace-shell workspace-list-page">
    <Link className="workspace-back" href="/workspace">← Tổng quan</Link>
    <div className="workspace-heading"><div><p className="workspace-eyebrow">Case Lab · tài nguyên</p><h1>Case / bài viết</h1><p>Danh sách case trong phạm vi quyền của tài khoản.</p></div>{!showNewCase ? <button type="button" className="workspace-button" onClick={() => setShowNewCase(true)}>+ Tạo case mới</button> : null}</div>
    {showNewCase ? <NewCaseForm onClose={() => setShowNewCase(false)} onCreated={(caseId) => router.push(`/workspace/cases/${encodeURIComponent(caseId)}`)} /> : null}
    {error ? <div className="workspace-alert" role="alert">{error === "SESSION_REQUIRED" ? <><b>Phiên đăng nhập chưa sẵn sàng</b><span>Đăng nhập để xem danh sách case theo quyền tài khoản.</span><Link className="workspace-alert__link" href="/login?return_to=/workspace/cases">Đăng nhập Case Lab →</Link></> : error}</div> : null}
    {loading ? <p className="workspace-loading">Đang tải danh sách case…</p> : null}
    {!loading && !error && cases.length === 0 ? <div className="workspace-empty workspace-empty--card"><b>Chưa có case trong phạm vi quyền hiện tại.</b><span>Dữ liệu sẽ xuất hiện sau khi tạo case hoặc import từ nguồn vận hành.</span></div> : null}
    {!loading && !error && cases.length > 0 ? <>
      <div className="workspace-list-summary" aria-label="Tổng quan danh sách case">
        <div><span>Tổng case</span><b>{cases.length}</b></div><div><span>Đang xử lý</span><b>{openCases}</b></div><div><span>Cần review</span><b>{needsAttention}</b></div>
      </div>
      <div className="workspace-list-controls workspace-list-controls--cases"><label><span>Tìm case</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Mã case hoặc chi nhánh" /></label><label><span>Loại bài</span><select value={contentType} onChange={(event) => setContentType(event.target.value)}><option value="all">Tất cả loại bài</option>{caseContentTypeOptions.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}</select></label><label><span>Trạng thái</span><select value={status} onChange={(event) => setStatus(event.target.value)}><option value="all">Tất cả trạng thái</option>{Object.entries(labels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label><b>{visibleCases.length} kết quả</b></div>
      {visibleCases.length === 0 ? <div className="workspace-empty workspace-empty--card"><b>Không tìm thấy case phù hợp.</b><span>Thử đổi từ khóa, loại bài hoặc trạng thái lọc.</span></div> : <div className="workspace-table workspace-table--full workspace-table--cases" role="table" aria-label="Danh sách case"><div className="workspace-table__head" role="row"><span>Case / chi nhánh</span><span>Loại bài</span><span>Trạng thái</span><span>Cập nhật</span></div>
        {visibleCases.map((item) => <Link className="workspace-row" role="row" key={item.id} href={`/workspace/cases/${encodeURIComponent(item.id)}`}><span><b>{item.caseCode}</b><small>{item.branchRef}</small></span><span><i className={`workspace-content-type workspace-content-type--${item.contentType}`}>{getCaseContentType(item.contentType).label}</i></span><span className="workspace-row__status"><i className={`status status--${item.workflowStatus}`} />{labels[item.workflowStatus] ?? item.workflowStatus}</span><span><b>r{item.currentRevision}</b>{dateFormatter.format(new Date(item.updatedAt))} <em>→</em></span></Link>)}
      </div>}
    </> : null}
  </section>;
}
