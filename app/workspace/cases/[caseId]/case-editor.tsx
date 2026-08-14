"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { getRoadLabMediaUrls, isRoadLabImageUrl, type RoadLabDraft } from "../../../../lib/road-lab-draft";

type DraftResponse = {
  case: { id: string; caseCode: string; branchRef: string; vehicleRef: string; productRef: string; workflowStatus: string; currentRevision: number; updatedAt: string };
  draft: { revision: number; content: RoadLabDraft; updatedAt: string };
};
type Feedback = { id: string; revision: number; category: string; message: string; status: string; createdAt: string; author: { displayName: string } };
type Assignment = { id: string; role: string; assignedAt: string; user: { displayName: string; email: string } };
type Audit = { id: string; action: string; revision: number | null; createdAt: string; actor: { displayName: string } };
type ApiError = { error?: { code?: string; message?: string } };
type RoadLabStep = "publication" | "vehicle" | "configuration" | "evidence" | "seo" | "review";

const statusLabels: Record<string, string> = { draft: "Bản nháp", ready_for_review: "Chờ review", in_review: "Đang review", changes_requested: "Cần chỉnh sửa", technical_approved: "Đã qua IT", publishable: "Sẵn sàng xuất bản", published: "Đã xuất bản" };
const categoryLabels: Record<string, string> = { content: "Nội dung", evidence: "Evidence", seo: "SEO", technical: "Kỹ thuật", general: "Chung" };
const roadLabSteps: Array<{ id: RoadLabStep; label: string; description: string }> = [
  { id: "publication", label: "Xuất bản", description: "Thông tin hiển thị của bài Road Lab." },
  { id: "vehicle", label: "Hồ sơ xe", description: "Bối cảnh xe, nhu cầu và điều kiện sử dụng thực tế." },
  { id: "configuration", label: "Cấu hình", description: "Vấn đề, cấu hình trước và giải pháp triển khai." },
  { id: "evidence", label: "Bằng chứng", description: "Đo đạc, ảnh/video và nguồn xác minh." },
  { id: "seo", label: "SEO & liên kết", description: "Metadata và bốn liên kết owner của Road Lab." },
  { id: "review", label: "Kiểm duyệt", description: "Checklist bàn giao trước khi gửi review." },
];
const formatDate = new Intl.DateTimeFormat("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" });

async function readResponse<T>(response: Response): Promise<T> {
  if (response.ok) return response.json() as Promise<T>;
  const body = await response.json().catch(() => ({})) as ApiError;
  throw new Error(body.error?.code === "UNAUTHENTICATED" ? "SESSION_REQUIRED" : body.error?.message ?? "Không thể tải dữ liệu case.");
}

function MediaPreview({
  urls,
  title,
  emptyMessage,
}: {
  urls: string[];
  title: string;
  emptyMessage: string;
}) {
  if (!urls.length) return <p className="road-lab-media-empty">{emptyMessage}</p>;

  return <div className="road-lab-media-grid" aria-label={title}>
    {urls.map((url, index) => <article className="road-lab-media-card" key={url}>
      {isRoadLabImageUrl(url)
        ? <img src={url} alt={`${title} ${index + 1}`} loading="lazy" onError={(event) => { event.currentTarget.style.display = "none"; }} />
        : <div className="road-lab-media-file">Video / liên kết</div>}
      <a className="road-lab-media-link" href={url} target="_blank" rel="noreferrer">Mở tệp ↗</a>
    </article>)}
  </div>;
}

export default function CaseEditor({ caseId, mode }: { caseId: string; mode: "editor" | "review" }) {
  const [data, setData] = useState<DraftResponse | null>(null);
  const [feedback, setFeedback] = useState<Feedback[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [audit, setAudit] = useState<Audit[]>([]);
  const [form, setForm] = useState<RoadLabDraft | null>(null);
  const [activeStep, setActiveStep] = useState<RoadLabStep>("publication");
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

  useEffect(() => { const task = window.setTimeout(() => { void load(); }, 0); return () => window.clearTimeout(task); }, [load]);

  function updateField(section: RoadLabStep, field: string, value: string | boolean) {
    setForm((current) => current ? ({ ...current, [section]: { ...current[section], [field]: value } } as RoadLabDraft) : current);
  }

  async function saveDraft() {
    if (!data || !form) return;
    setSaving(true); setError(""); setNotice("");
    try {
      const saved = await fetch(`/api/v1/case-lab/cases/${encodeURIComponent(caseId)}/draft`, { method: "PUT", headers: { "content-type": "application/json" }, body: JSON.stringify({ content: form, expectedRevision: data.draft.revision }) }).then(readResponse<DraftResponse>);
      setData((current) => current ? { ...saved, case: { ...current.case, ...saved.case, branchRef: current.case.branchRef, vehicleRef: current.case.vehicleRef, productRef: current.case.productRef } } : saved);
      setNotice(`Đã lưu phiên bản r${saved.draft.revision}.`); await load();
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
    try { await fetch(`/api/v1/case-lab/feedback/${encodeURIComponent(feedbackId)}/resolve`, { method: "POST" }).then(readResponse); setNotice("Đã đánh dấu feedback đã xử lý."); await load(); }
    catch (reason) { setError(reason instanceof Error ? reason.message : "Không thể cập nhật feedback."); }
    finally { setSaving(false); }
  }

  const title = mode === "review" ? "Review Road Lab" : "Soạn Road Lab";
  const active = roadLabSteps.find((step) => step.id === activeStep)!;
  if (loading) return <section className="workspace-shell"><p className="workspace-loading">Đang tải case…</p></section>;
  if (error && !data) return <section className="workspace-shell"><Link className="workspace-back" href="/workspace/cases">← Case / bài viết</Link><div className="workspace-alert" role="alert">{error === "SESSION_REQUIRED" ? <><b>Phiên đăng nhập chưa sẵn sàng</b><Link className="workspace-alert__link" href={`/login?return_to=/workspace/cases/${encodeURIComponent(caseId)}`}>Đăng nhập Case Lab →</Link></> : error}</div></section>;
  if (!data || !form) return null;
  const heroMedia = getRoadLabMediaUrls(form.publication.heroUrl, 1);
  const evidenceMedia = getRoadLabMediaUrls(form.evidence.proofUrls);

  return <section className="workspace-shell workspace-case-page">
    <Link className="workspace-back" href="/workspace/cases">← Case / bài viết</Link>
    <div className="workspace-case-heading"><div><p className="workspace-eyebrow">Road Lab · {data.case.caseCode} · {data.case.branchRef}</p><h1>{title}</h1><p>{data.case.vehicleRef} · {data.case.productRef}</p></div><div className="workspace-case-actions"><span className={`workspace-status-pill workspace-status-pill--${data.case.workflowStatus}`}>{statusLabels[data.case.workflowStatus] ?? data.case.workflowStatus}</span>{mode === "editor" ? <Link className="workspace-button workspace-button--ghost" href={`/workspace/cases/${encodeURIComponent(caseId)}/review`}>Mở review</Link> : <Link className="workspace-button workspace-button--ghost" href={`/workspace/cases/${encodeURIComponent(caseId)}`}>Soạn bài</Link>}</div></div>
    {error ? <div className="workspace-alert" role="alert">{error}</div> : null}{notice ? <div className="workspace-notice">{notice}</div> : null}
    <div className="workspace-case-grid"><section className="workspace-card workspace-editor-card"><div className="workspace-card__head"><div><p className="workspace-eyebrow">Revision r{data.draft.revision}</p><h2>Hồ sơ Road Lab</h2></div><button className="workspace-button" onClick={saveDraft} disabled={saving}>{saving ? "Đang lưu…" : "Lưu revision mới"}</button></div>
      <nav className="road-lab-steps" aria-label="Các bước soạn Road Lab">{roadLabSteps.map((step, index) => <button type="button" key={step.id} className="road-lab-step" aria-current={activeStep === step.id ? "step" : undefined} onClick={() => setActiveStep(step.id)}><span>{String(index + 1).padStart(2, "0")}</span>{step.label}</button>)}</nav>
      <div className="road-lab-step-heading"><p className="workspace-eyebrow">Bước {String(roadLabSteps.findIndex((step) => step.id === activeStep) + 1).padStart(2, "0")} / 06</p><h3>{active.label}</h3><p>{active.description}</p></div>
      {activeStep === "publication" ? <div className="workspace-field-grid"><label className="workspace-field workspace-field--wide"><span>Tiêu đề bài Road Lab</span><input value={form.publication.title} onChange={(event) => updateField("publication", "title", event.target.value)} maxLength={180} /></label><label className="workspace-field workspace-field--wide"><span>Tóm tắt</span><textarea value={form.publication.summary} onChange={(event) => updateField("publication", "summary", event.target.value)} rows={3} maxLength={600} /></label><label className="workspace-field workspace-field--wide"><span>Kết luận mở đầu (answer-first)</span><textarea value={form.publication.answerFirst} onChange={(event) => updateField("publication", "answerFirst", event.target.value)} rows={4} maxLength={1200} placeholder="Kết quả chính người đọc cần biết ngay…" /></label><label className="workspace-field workspace-field--wide"><span>Ảnh hero (URL)</span><input type="url" value={form.publication.heroUrl} onChange={(event) => updateField("publication", "heroUrl", event.target.value)} placeholder="https://…" /></label><div className="workspace-field workspace-field--wide"><span>Xem trước ảnh hero</span><MediaPreview urls={heroMedia} title="Ảnh hero" emptyMessage="Nhập URL ảnh công khai để xem trước tại đây." /><p className="road-lab-storage-note">Ảnh được lưu theo URL trong revision. Upload tệp/R2 chưa nằm trong bản này.</p></div></div> : null}
      {activeStep === "vehicle" ? <div className="workspace-field-grid"><label className="workspace-field"><span>Xe thực tế</span><input value={form.vehicle.vehicleName} onChange={(event) => updateField("vehicle", "vehicleName", event.target.value)} /></label><label className="workspace-field"><span>Đời xe</span><input value={form.vehicle.modelYear} onChange={(event) => updateField("vehicle", "modelYear", event.target.value)} /></label><label className="workspace-field"><span>ODO / số km</span><input value={form.vehicle.odometer} onChange={(event) => updateField("vehicle", "odometer", event.target.value)} /></label><label className="workspace-field"><span>Giai đoạn thi công</span><input value={form.vehicle.installationStage} onChange={(event) => updateField("vehicle", "installationStage", event.target.value)} placeholder="Trước, trong hoặc sau thi công" /></label><label className="workspace-field workspace-field--wide"><span>Nhu cầu chính</span><textarea value={form.vehicle.primaryNeed} onChange={(event) => updateField("vehicle", "primaryNeed", event.target.value)} rows={3} /></label><label className="workspace-field workspace-field--wide"><span>Bối cảnh sử dụng</span><textarea value={form.vehicle.usageConditions} onChange={(event) => updateField("vehicle", "usageConditions", event.target.value)} rows={3} /></label></div> : null}
      {activeStep === "configuration" ? <div className="workspace-field-grid"><label className="workspace-field workspace-field--wide"><span>Vấn đề ban đầu</span><textarea value={form.configuration.problem} onChange={(event) => updateField("configuration", "problem", event.target.value)} rows={3} /></label><label className="workspace-field"><span>Cấu hình trước</span><textarea value={form.configuration.beforeConfig} onChange={(event) => updateField("configuration", "beforeConfig", event.target.value)} rows={4} /></label><label className="workspace-field"><span>Cấu hình thực tế</span><textarea value={form.configuration.actualConfig} onChange={(event) => updateField("configuration", "actualConfig", event.target.value)} rows={4} /></label><label className="workspace-field"><span>Sản phẩm chính</span><input value={form.configuration.productName} onChange={(event) => updateField("configuration", "productName", event.target.value)} /></label><label className="workspace-field"><span>Vật tư / phụ kiện</span><input value={form.configuration.materials} onChange={(event) => updateField("configuration", "materials", event.target.value)} /></label></div> : null}
      {activeStep === "evidence" ? <div className="workspace-field-grid"><label className="workspace-field"><span>Đo đạc / thông số</span><textarea value={form.evidence.measurement} onChange={(event) => updateField("evidence", "measurement", event.target.value)} rows={4} /></label><label className="workspace-field"><span>Kết quả thực tế</span><textarea value={form.evidence.resultSummary} onChange={(event) => updateField("evidence", "resultSummary", event.target.value)} rows={4} /></label><label className="workspace-field workspace-field--wide"><span>Danh sách URL ảnh / video</span><textarea value={form.evidence.proofUrls} onChange={(event) => updateField("evidence", "proofUrls", event.target.value)} rows={4} placeholder="Mỗi URL một dòng" /></label><div className="workspace-field workspace-field--wide"><span>Xem trước bằng chứng</span><MediaPreview urls={evidenceMedia} title="Bằng chứng" emptyMessage="Nhập từng URL ảnh hoặc video công khai, mỗi URL một dòng." /></div><label className="workspace-field workspace-field--wide"><span>Nguồn xác minh / ghi chú</span><textarea value={form.evidence.sourceNotes} onChange={(event) => updateField("evidence", "sourceNotes", event.target.value)} rows={4} /></label></div> : null}
      {activeStep === "seo" ? <div className="workspace-field-grid"><label className="workspace-field"><span>Slug</span><input value={form.seo.slug} onChange={(event) => updateField("seo", "slug", event.target.value)} /></label><label className="workspace-field"><span>Meta title</span><input value={form.seo.metaTitle} onChange={(event) => updateField("seo", "metaTitle", event.target.value)} maxLength={180} /></label><label className="workspace-field workspace-field--wide"><span>Meta description</span><textarea value={form.seo.metaDescription} onChange={(event) => updateField("seo", "metaDescription", event.target.value)} rows={3} maxLength={320} /></label><div className="road-lab-linked-owners workspace-field--wide"><p>Liên kết owner</p><span>Road Lab dùng bốn quan hệ cố định, không phải chọn loại bài.</span><div><label className="workspace-field"><span>Road Case ID</span><input value={form.seo.roadCaseId} onChange={(event) => updateField("seo", "roadCaseId", event.target.value)} /></label><label className="workspace-field"><span>Proof Lab ID</span><input value={form.seo.proofLabId} onChange={(event) => updateField("seo", "proofLabId", event.target.value)} /></label><label className="workspace-field"><span>Brand Pillar ID</span><input value={form.seo.brandPillarId} onChange={(event) => updateField("seo", "brandPillarId", event.target.value)} /></label><label className="workspace-field"><span>Product Owner ID</span><input value={form.seo.productOwnerId} onChange={(event) => updateField("seo", "productOwnerId", event.target.value)} /></label></div></div></div> : null}
      {activeStep === "review" ? <div className="road-lab-review"><p>Đánh dấu mục đã chuẩn bị trước khi gửi review. Việc duyệt vẫn đi theo luồng review hiện tại.</p><label><input type="checkbox" checked={form.review.contentChecked} onChange={(event) => updateField("review", "contentChecked", event.target.checked)} /> Nội dung và answer-first đã kiểm tra</label><label><input type="checkbox" checked={form.review.evidenceChecked} onChange={(event) => updateField("review", "evidenceChecked", event.target.checked)} /> Bằng chứng và nguồn xác minh đã đủ</label><label><input type="checkbox" checked={form.review.seoChecked} onChange={(event) => updateField("review", "seoChecked", event.target.checked)} /> Metadata và liên kết owner đã kiểm tra</label><label><input type="checkbox" checked={form.review.technicalChecked} onChange={(event) => updateField("review", "technicalChecked", event.target.checked)} /> Cấu hình kỹ thuật đã sẵn sàng review</label><label className="workspace-field"><span>Ghi chú bàn giao</span><textarea value={form.review.reviewNote} onChange={(event) => updateField("review", "reviewNote", event.target.value)} rows={4} placeholder="Điểm cần reviewer tập trung kiểm tra…" /></label></div> : null}
      <p className="workspace-editor-note">Mỗi lần lưu tạo revision mới, không ghi đè bản đang review.</p>
    </section>
    <aside className="workspace-case-side"><section className="workspace-card"><p className="workspace-eyebrow">Người phụ trách</p><h2>Phân công hiện tại</h2><div className="workspace-assignment-list">{assignments.length ? assignments.map((item) => <div key={item.id}><b>{item.user.displayName}</b><span>{item.role}</span></div>) : <p>Chưa có phân công.</p>}</div></section><section className="workspace-card"><p className="workspace-eyebrow">Theo revision</p><h2>Lịch sử gần đây</h2><div className="workspace-audit-list">{audit.slice(0, 5).map((item) => <div key={item.id}><span>{formatDate.format(new Date(item.createdAt))}</span><b>{item.actor.displayName}</b><p>{item.action}{item.revision ? ` · r${item.revision}` : ""}</p></div>)}</div></section></aside></div>
    <section className="workspace-card workspace-feedback-panel"><div className="workspace-card__head"><div><p className="workspace-eyebrow">Feedback review</p><h2>{mode === "review" ? "Luồng phản hồi" : "Phản hồi trên case"}</h2></div><span>{feedback.filter((item) => item.status === "open").length} mở</span></div><div className="workspace-feedback-compose"><select aria-label="Loại feedback" value={feedbackCategory} onChange={(event) => setFeedbackCategory(event.target.value)}>{Object.entries(categoryLabels).map(([key, label]) => <option key={key} value={key}>{label}</option>)}</select><textarea value={feedbackMessage} onChange={(event) => setFeedbackMessage(event.target.value)} placeholder="Nhập feedback cụ thể cho revision hiện tại" rows={3} maxLength={2000} /><button className="workspace-button" onClick={createFeedback} disabled={saving || feedbackMessage.trim().length < 3}>Gửi feedback</button></div><div className="workspace-feedback-list">{feedback.length ? feedback.map((item) => <article key={item.id}><div><b>{categoryLabels[item.category] ?? item.category}</b><span>r{item.revision} · {item.author.displayName} · {formatDate.format(new Date(item.createdAt))}</span></div><p>{item.message}</p>{item.status === "open" ? <button className="workspace-text-button" disabled={saving} onClick={() => resolveFeedback(item.id)}>Đánh dấu đã xử lý →</button> : <small>Đã xử lý</small>}</article>) : <div className="workspace-empty"><b>Chưa có feedback.</b><span>Reviewer có thể bắt đầu phản hồi ở revision này.</span></div>}</div></section>
  </section>;
}
