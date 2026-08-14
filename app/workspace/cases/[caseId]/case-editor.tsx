"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

type DraftResponse = {
  case: { id: string; caseCode: string; branchRef: string; vehicleRef: string; productRef: string; workflowStatus: string; currentRevision: number; updatedAt: string };
  draft: { revision: number; content: { title: string; summary: string; body: string }; updatedAt: string };
};
type Feedback = { id: string; revision: number; category: string; message: string; status: string; createdAt: string; author: { displayName: string } };
type Assignment = { id: string; role: string; assignedAt: string; user: { displayName: string; email: string } };
type Audit = { id: string; action: string; revision: number | null; createdAt: string; actor: { displayName: string } };
type ApiError = { error?: { code?: string; message?: string } };

const statusLabels: Record<string, string> = { draft: "Bản nháp", ready_for_review: "Chờ review", in_review: "Đang review", changes_requested: "Cần chỉnh sửa", technical_approved: "Đã qua IT", publishable: "Sẵn sàng xuất bản", published: "Đã xuất bản" };
const categoryLabels: Record<string, string> = { content: "Nội dung", evidence: "Evidence", seo: "SEO", technical: "Kỹ thuật", general: "Chung" };
const formatDate = new Intl.DateTimeFormat("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" });

async function readResponse<T>(response: Response): Promise<T> {
  if (response.ok) return response.json() as Promise<T>;
  const body = await response.json().catch(() => ({})) as ApiError;
  throw new Error(body.error?.code === "UNAUTHENTICATED" ? "SESSION_REQUIRED" : body.error?.message ?? "Không thể tải dữ liệu case.");
}

export default function CaseEditor({ caseId, mode }: { caseId: string; mode: "editor" | "review" }) {
  const [data, setData] = useState<DraftResponse | null>(null);
  const [feedback, setFeedback] = useState<Feedback[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [audit, setAudit] = useState<Audit[]>([]);
  const [form, setForm] = useState({ title: "", summary: "", body: "" });
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState("");
  const [feedbackCategory, setFeedbackCategory] = useState("general");

  const load = useCallback(async () => {
    setLoading(true); setError("");
    try {
      const [draft, feedbackResponse, assignmentsResponse, auditResponse] = await Promise.all([
        fetch(`/api/v1/case-lab/cases/${encodeURIComponent(caseId)}/draft`).then(readResponse<DraftResponse>),
        fetch(`/api/v1/case-lab/cases/${encodeURIComponent(caseId)}/feedback`).then(readResponse<{ items: Feedback[] }>),
        fetch(`/api/v1/case-lab/cases/${encodeURIComponent(caseId)}/assignments`).then(readResponse<{ items: Assignment[] }>),
        fetch(`/api/v1/case-lab/cases/${encodeURIComponent(caseId)}/audit`).then(readResponse<{ items: Audit[] }>),
      ]);
      setData(draft); setForm(draft.draft.content); setFeedback(feedbackResponse.items); setAssignments(assignmentsResponse.items); setAudit(auditResponse.items);
    } catch (reason) { setError(reason instanceof Error ? reason.message : "Không thể tải dữ liệu case."); }
    finally { setLoading(false); }
  }, [caseId]);

  useEffect(() => {
    const task = window.setTimeout(() => { void load(); }, 0);
    return () => window.clearTimeout(task);
  }, [load]);

  async function saveDraft() {
    if (!data) return;
    setSaving(true); setError(""); setNotice("");
    try {
      const saved = await fetch(`/api/v1/case-lab/cases/${encodeURIComponent(caseId)}/draft`, { method: "PUT", headers: { "content-type": "application/json" }, body: JSON.stringify({ ...form, expectedRevision: data.draft.revision }) }).then(readResponse<DraftResponse>);
      setData((current) => current ? { ...saved, case: { ...current.case, ...saved.case, branchRef: current.case.branchRef, vehicleRef: current.case.vehicleRef, productRef: current.case.productRef } } : saved);
      setNotice(`Đã lưu phiên bản r${saved.draft.revision}.`);
      await load();
    } catch (reason) { setError(reason instanceof Error ? reason.message : "Không thể lưu bản nháp."); }
    finally { setSaving(false); }
  }

  async function createFeedback() {
    if (!data || feedbackMessage.trim().length < 3) return;
    setSaving(true); setError(""); setNotice("");
    try {
      await fetch(`/api/v1/case-lab/cases/${encodeURIComponent(caseId)}/feedback`, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ revision: data.draft.revision, category: feedbackCategory, message: feedbackMessage.trim() }) }).then(readResponse);
      setFeedbackMessage(""); setNotice("Đã gửi feedback vào revision hiện tại."); await load();
    } catch (reason) { setError(reason instanceof Error ? reason.message : "Không thể gửi feedback."); }
    finally { setSaving(false); }
  }

  async function resolveFeedback(feedbackId: string) {
    setSaving(true); setError("");
    try {
      await fetch(`/api/v1/case-lab/feedback/${encodeURIComponent(feedbackId)}/resolve`, { method: "POST" }).then(readResponse);
      setNotice("Đã đánh dấu feedback đã xử lý."); await load();
    } catch (reason) { setError(reason instanceof Error ? reason.message : "Không thể cập nhật feedback."); }
    finally { setSaving(false); }
  }

  const title = mode === "review" ? "Review case" : "Soạn bài / case";
  if (loading) return <section className="workspace-shell"><p className="workspace-loading">Đang tải case…</p></section>;
  if (error && !data) return <section className="workspace-shell"><Link className="workspace-back" href="/workspace/cases">← Case / bài viết</Link><div className="workspace-alert" role="alert">{error === "SESSION_REQUIRED" ? <><b>Phiên đăng nhập chưa sẵn sàng</b><Link className="workspace-alert__link" href={`/login?return_to=/workspace/cases/${encodeURIComponent(caseId)}`}>Đăng nhập Case Lab →</Link></> : error}</div></section>;
  if (!data) return null;

  return <section className="workspace-shell workspace-case-page">
    <Link className="workspace-back" href="/workspace/cases">← Case / bài viết</Link>
    <div className="workspace-case-heading"><div><p className="workspace-eyebrow">{data.case.caseCode} · {data.case.branchRef}</p><h1>{title}</h1><p>{data.case.vehicleRef} · {data.case.productRef}</p></div><div className="workspace-case-actions"><span className={`workspace-status-pill workspace-status-pill--${data.case.workflowStatus}`}>{statusLabels[data.case.workflowStatus] ?? data.case.workflowStatus}</span>{mode === "editor" ? <Link className="workspace-button workspace-button--ghost" href={`/workspace/cases/${encodeURIComponent(caseId)}/review`}>Mở review</Link> : <Link className="workspace-button workspace-button--ghost" href={`/workspace/cases/${encodeURIComponent(caseId)}`}>Soạn bài</Link>}</div></div>
    {error ? <div className="workspace-alert" role="alert">{error}</div> : null}{notice ? <div className="workspace-notice">{notice}</div> : null}
    <div className="workspace-case-grid"><section className="workspace-card workspace-editor-card"><div className="workspace-card__head"><div><p className="workspace-eyebrow">Revision r{data.draft.revision}</p><h2>Nội dung bài viết</h2></div><button className="workspace-button" onClick={saveDraft} disabled={saving}>{saving ? "Đang lưu…" : "Lưu revision mới"}</button></div>
      <label className="workspace-field"><span>Tiêu đề</span><input value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} maxLength={180} /></label>
      <label className="workspace-field"><span>Mô tả ngắn</span><textarea value={form.summary} onChange={(event) => setForm({ ...form, summary: event.target.value })} rows={3} maxLength={600} /></label>
      <label className="workspace-field"><span>Nội dung bài viết</span><textarea className="workspace-editor-body" value={form.body} onChange={(event) => setForm({ ...form, body: event.target.value })} rows={14} maxLength={20000} placeholder="Viết nội dung bài review tại đây…" /></label>
      <p className="workspace-editor-note">Mỗi lần lưu tạo revision mới, không ghi đè bản đang review.</p>
    </section>
    <aside className="workspace-case-side"><section className="workspace-card"><p className="workspace-eyebrow">Người phụ trách</p><h2>Phân công hiện tại</h2><div className="workspace-assignment-list">{assignments.length ? assignments.map((item) => <div key={item.id}><b>{item.user.displayName}</b><span>{item.role}</span></div>) : <p>Chưa có phân công.</p>}</div></section><section className="workspace-card"><p className="workspace-eyebrow">Theo revision</p><h2>Lịch sử gần đây</h2><div className="workspace-audit-list">{audit.slice(0, 5).map((item) => <div key={item.id}><span>{formatDate.format(new Date(item.createdAt))}</span><b>{item.actor.displayName}</b><p>{item.action}{item.revision ? ` · r${item.revision}` : ""}</p></div>)}</div></section></aside></div>
    <section className="workspace-card workspace-feedback-panel"><div className="workspace-card__head"><div><p className="workspace-eyebrow">Feedback review</p><h2>{mode === "review" ? "Luồng phản hồi" : "Phản hồi trên case"}</h2></div><span>{feedback.filter((item) => item.status === "open").length} mở</span></div><div className="workspace-feedback-compose"><select aria-label="Loại feedback" value={feedbackCategory} onChange={(event) => setFeedbackCategory(event.target.value)}>{Object.entries(categoryLabels).map(([key, label]) => <option key={key} value={key}>{label}</option>)}</select><textarea value={feedbackMessage} onChange={(event) => setFeedbackMessage(event.target.value)} placeholder="Nhập feedback cụ thể cho revision hiện tại" rows={3} maxLength={2000} /><button className="workspace-button" onClick={createFeedback} disabled={saving || feedbackMessage.trim().length < 3}>Gửi feedback</button></div><div className="workspace-feedback-list">{feedback.length ? feedback.map((item) => <article key={item.id}><div><b>{categoryLabels[item.category] ?? item.category}</b><span>r{item.revision} · {item.author.displayName} · {formatDate.format(new Date(item.createdAt))}</span></div><p>{item.message}</p>{item.status === "open" ? <button className="workspace-text-button" disabled={saving} onClick={() => resolveFeedback(item.id)}>Đánh dấu đã xử lý →</button> : <small>Đã xử lý</small>}</article>) : <div className="workspace-empty"><b>Chưa có feedback.</b><span>Reviewer có thể bắt đầu phản hồi ở revision này.</span></div>}</div></section>
  </section>;
}
