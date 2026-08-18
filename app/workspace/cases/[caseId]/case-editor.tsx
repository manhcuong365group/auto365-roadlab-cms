"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { getRoadLabMediaUrls, isRoadLabImageUrl } from "../../../../lib/road-lab-draft";
import type { CaseDraft, CaseTemplateKey } from "../../../../lib/case-draft";
import { templateKeyForContentType } from "../../../../lib/case-draft";
import type { CaseContentType } from "../../../../lib/case-content-types";

type DraftResponse = {
  case: { id: string; caseCode: string; contentType: CaseContentType; branchRef: string; vehicleRef: string; productRef: string; workflowStatus: string; currentRevision: number; updatedAt: string };
  draft: { revision: number; content: CaseDraft; updatedAt: string };
};
type Feedback = { id: string; revision: number; category: string; message: string; status: string; createdAt: string; author: { displayName: string } };
type Assignment = { id: string; role: string; assignedAt: string; user: { displayName: string; email: string } };
type Audit = { id: string; action: string; revision: number | null; createdAt: string; actor: { displayName: string } };
type ApiError = { error?: { code?: string; message?: string } };

const statusLabels: Record<string, string> = { draft: "Bản nháp", ready_for_review: "Chờ review", in_review: "Đang review", changes_requested: "Cần chỉnh sửa", technical_approved: "Đã qua IT", publishable: "Sẵn sàng xuất bản", published: "Đã xuất bản", archived: "Đã huỷ / lưu trữ" };
const categoryLabels: Record<string, string> = { content: "Nội dung", evidence: "Evidence", seo: "SEO", technical: "Kỹ thuật", general: "Chung" };
const formatDate = new Intl.DateTimeFormat("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" });

type Step = { id: string; number: string; label: string; hint: string };

const templateLabels: Record<CaseTemplateKey, string> = {
  road_lab: "Road Lab",
  proof_lab: "Proof Lab",
  brand_story: "Brand Story",
  product_spotlight: "Product Spotlight",
};

const stepsByTemplate: Record<CaseTemplateKey, Step[]> = {
  road_lab: [
    { id: "publication", number: "01", label: "Xuất bản", hint: "Thông tin hiển thị của bài Road Lab." },
    { id: "vehicle", number: "02", label: "Hồ sơ xe", hint: "Bối cảnh xe, nhu cầu và điều kiện sử dụng thực tế." },
    { id: "configuration", number: "03", label: "Cấu hình", hint: "Vấn đề, cấu hình trước và giải pháp triển khai." },
    { id: "evidence", number: "04", label: "Bằng chứng", hint: "Đo đạc, ảnh/video và nguồn xác minh." },
    { id: "seo", number: "05", label: "SEO & liên kết", hint: "Metadata và bốn liên kết owner." },
    { id: "extended", number: "06", label: "Mở rộng biên tập", hint: "Tác giả, nguồn, timeline, known/unknown, QC và FAQ." },
    { id: "review", number: "07", label: "Kiểm duyệt", hint: "Checklist bàn giao trước khi gửi review." },
  ],
  proof_lab: [
    { id: "publication", number: "01", label: "Xuất bản", hint: "Thông tin hiển thị của bài Proof Lab." },
    { id: "verification", number: "02", label: "Đối tượng nghiệm thu", hint: "Phương pháp đo, tiêu chuẩn đối chiếu và người xác minh." },
    { id: "findings", number: "03", label: "Kết quả đo", hint: "Số liệu trước/sau, kết luận và sai lệch." },
    { id: "evidence", number: "04", label: "Bằng chứng", hint: "Đo đạc, ảnh/video và nguồn xác minh." },
    { id: "seo", number: "05", label: "SEO & liên kết", hint: "Metadata và bốn liên kết owner." },
    { id: "extended", number: "06", label: "Mở rộng biên tập", hint: "Tác giả, nguồn, timeline, known/unknown, QC và FAQ." },
    { id: "review", number: "07", label: "Kiểm duyệt", hint: "Checklist bàn giao trước khi gửi review." },
  ],
  brand_story: [
    { id: "publication", number: "01", label: "Xuất bản", hint: "Thông tin hiển thị của bài thương hiệu." },
    { id: "positioning", number: "02", label: "Định vị thương hiệu", hint: "Đối tượng, thông điệp chính và điểm khác biệt." },
    { id: "support", number: "03", label: "Luận cứ hỗ trợ", hint: "Số liệu và bằng chứng xã hội hỗ trợ định vị." },
    { id: "evidence", number: "04", label: "Bằng chứng", hint: "Ảnh/video và nguồn xác minh." },
    { id: "seo", number: "05", label: "SEO & liên kết", hint: "Metadata và bốn liên kết owner." },
    { id: "extended", number: "06", label: "Mở rộng biên tập", hint: "Tác giả, nguồn, timeline, known/unknown, QC và FAQ." },
    { id: "review", number: "07", label: "Kiểm duyệt", hint: "Checklist bàn giao trước khi gửi review." },
  ],
  product_spotlight: [
    { id: "publication", number: "01", label: "Xuất bản", hint: "Thông tin hiển thị của bài sản phẩm." },
    { id: "productInfo", number: "02", label: "Thông tin sản phẩm", hint: "Thông số, tính năng nổi bật và trường hợp sử dụng." },
    { id: "comparison", number: "03", label: "So sánh", hint: "Lựa chọn thay thế và lợi thế cạnh tranh." },
    { id: "evidence", number: "04", label: "Bằng chứng", hint: "Ảnh/video và nguồn xác minh." },
    { id: "seo", number: "05", label: "SEO & liên kết", hint: "Metadata và bốn liên kết owner." },
    { id: "extended", number: "06", label: "Mở rộng biên tập", hint: "Tác giả, nguồn, timeline, known/unknown, QC và FAQ." },
    { id: "review", number: "07", label: "Kiểm duyệt", hint: "Checklist bàn giao trước khi gửi review." },
  ],
};

async function readResponse<T>(response: Response): Promise<T> {
  if (response.ok) return response.json() as Promise<T>;
  const body = await response.json().catch(() => ({})) as ApiError;
  throw new Error(body.error?.code === "UNAUTHENTICATED" ? "SESSION_REQUIRED" : body.error?.message ?? "Không thể tải dữ liệu case.");
}

async function readUploadResponse(response: Response): Promise<{ url: string }> {
  const body = await response.json().catch(() => ({})) as { url?: string; error?: { message?: string } };
  if (!response.ok || !body.url) throw new Error(body.error?.message ?? "Tải ảnh thất bại.");
  return { url: body.url };
}

function ImageUploadButton({ onUploaded, multiple }: { onUploaded: (url: string) => void; multiple?: boolean }) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFiles = useCallback(async (files: FileList | null) => {
    if (!files || !files.length) return;
    setUploading(true);
    setError(null);
    try {
      for (const file of Array.from(files)) {
        const body = new FormData();
        body.append("file", file);
        const response = await fetch("/api/v1/case-lab/uploads", { method: "POST", body });
        const { url } = await readUploadResponse(response);
        onUploaded(url);
      }
    } catch (uploadError) {
      setError(uploadError instanceof Error ? uploadError.message : "Tải ảnh thất bại.");
    } finally {
      setUploading(false);
    }
  }, [onUploaded]);

  return <div className="road-lab-upload">
    <label className="workspace-button workspace-button--ghost road-lab-upload-button">
      {uploading ? "Đang tải…" : "Tải ảnh lên"}
      <input type="file" accept="image/*" multiple={multiple} hidden disabled={uploading} onChange={(event) => { void handleFiles(event.target.files); event.target.value = ""; }} />
    </label>
    {error ? <span className="road-lab-upload-error">{error}</span> : null}
  </div>;
}

function MediaPreview({ urls, title, emptyMessage }: { urls: string[]; title: string; emptyMessage: string }) {
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

// Every template shares the same publication/evidence/seo/review shape —
// only the two "subject" sections in the middle differ per content type.
function PublicationStep({ form, updateField, onManageMedia }: { form: CaseDraft; updateField: (section: string, field: string, value: string | boolean) => void; onManageMedia: () => void }) {
  const heroMedia = getRoadLabMediaUrls(form.publication.heroUrl, 1);
  return <div className="workspace-field-grid">
    <label className="workspace-field workspace-field--wide"><span>Tiêu đề bài</span><input value={form.publication.title} onChange={(event) => updateField("publication", "title", event.target.value)} maxLength={180} /></label>
    <label className="workspace-field workspace-field--wide"><span>Tóm tắt</span><textarea value={form.publication.summary} onChange={(event) => updateField("publication", "summary", event.target.value)} rows={3} maxLength={600} /></label>
    <label className="workspace-field workspace-field--wide"><span>Kết luận mở đầu (answer-first)</span><textarea value={form.publication.answerFirst} onChange={(event) => updateField("publication", "answerFirst", event.target.value)} rows={4} maxLength={1200} placeholder="Kết quả chính người đọc cần biết ngay…" /></label>
    <label className="workspace-field workspace-field--wide"><span>Ảnh hero (URL)</span><input type="url" value={form.publication.heroUrl} onChange={(event) => updateField("publication", "heroUrl", event.target.value)} placeholder="https://…" /></label>
    <div className="workspace-field workspace-field--wide"><span>Hoặc tải ảnh lên trực tiếp</span><ImageUploadButton onUploaded={(url) => updateField("publication", "heroUrl", url)} /></div>
    <div className="workspace-field workspace-field--wide"><span>Xem trước ảnh hero</span><MediaPreview urls={heroMedia} title="Ảnh hero" emptyMessage="Nhập URL ảnh công khai để xem trước tại đây." /></div>
    <button type="button" className="workspace-text-button" onClick={onManageMedia}>Quản lý ảnh ở bước Bằng chứng →</button>
  </div>;
}

function EvidenceStep({ form, updateField }: { form: CaseDraft; updateField: (section: string, field: string, value: string | boolean) => void }) {
  const evidenceMedia = getRoadLabMediaUrls(form.evidence.proofUrls);
  return <div className="workspace-field-grid">
    <label className="workspace-field"><span>Đo đạc / thông số</span><textarea value={form.evidence.measurement} onChange={(event) => updateField("evidence", "measurement", event.target.value)} rows={4} /></label>
    <label className="workspace-field"><span>Kết quả thực tế</span><textarea value={form.evidence.resultSummary} onChange={(event) => updateField("evidence", "resultSummary", event.target.value)} rows={4} /></label>
    <label className="workspace-field workspace-field--wide"><span>Danh sách URL ảnh / video</span><textarea value={form.evidence.proofUrls} onChange={(event) => updateField("evidence", "proofUrls", event.target.value)} rows={4} placeholder="Mỗi URL một dòng" /></label>
    <div className="workspace-field workspace-field--wide">
      <span>Hoặc tải ảnh lên trực tiếp</span>
      <ImageUploadButton multiple onUploaded={(url) => updateField("evidence", "proofUrls", form.evidence.proofUrls.trim() ? `${form.evidence.proofUrls}\n${url}` : url)} />
    </div>
    <div className="workspace-field workspace-field--wide"><span>Xem trước bằng chứng</span><MediaPreview urls={evidenceMedia} title="Bằng chứng" emptyMessage="Nhập từng URL ảnh hoặc video công khai, mỗi URL một dòng." /></div>
    <label className="workspace-field workspace-field--wide"><span>Nguồn xác minh / ghi chú</span><textarea value={form.evidence.sourceNotes} onChange={(event) => updateField("evidence", "sourceNotes", event.target.value)} rows={4} /></label>
  </div>;
}

function SeoStep({ form, updateField, ownerLabels }: { form: CaseDraft; updateField: (section: string, field: string, value: string | boolean) => void; ownerLabels: Array<[keyof CaseDraft["seo"], string]> }) {
  return <div className="workspace-field-grid">
    <label className="workspace-field"><span>Slug</span><input value={form.seo.slug} onChange={(event) => updateField("seo", "slug", event.target.value)} /></label>
    <label className="workspace-field"><span>Meta title</span><input value={form.seo.metaTitle} onChange={(event) => updateField("seo", "metaTitle", event.target.value)} maxLength={180} /></label>
    <label className="workspace-field workspace-field--wide"><span>Meta description</span><textarea value={form.seo.metaDescription} onChange={(event) => updateField("seo", "metaDescription", event.target.value)} rows={3} maxLength={320} /></label>
    <div className="road-lab-linked-owners workspace-field--wide">
      <p>Liên kết owner</p>
      <span>Mỗi bài dùng bốn quan hệ cố định, không phải chọn loại bài.</span>
      <div>
        {ownerLabels.map(([field, label]) => (
          <label className="workspace-field" key={field as string}>
            <span>{label}</span>
            <input value={form.seo[field] as string} onChange={(event) => updateField("seo", field as string, event.target.value)} />
          </label>
        ))}
      </div>
    </div>
  </div>;
}

// Shared by all four templates — author/reviewer attribution, primary
// source, build timeline, known/unknown ledger, QC checklist and FAQ.
// One line per entry; "Tiêu đề — Mô tả" pairs for timeline/QC, "Q: ...\nA:
// ..." blocks (blank line between) for FAQ. Parsed on the public page,
// not here — the editor just collects raw text.
function ExtendedStep({ form, updateField }: { form: CaseDraft; updateField: (section: string, field: string, value: string | boolean) => void }) {
  return <div className="workspace-field-grid">
    <label className="workspace-field"><span>Tên tác giả</span><input value={form.extended.authorName} onChange={(event) => updateField("extended", "authorName", event.target.value)} /></label>
    <label className="workspace-field"><span>Vai trò tác giả</span><input value={form.extended.authorRole} onChange={(event) => updateField("extended", "authorRole", event.target.value)} placeholder="Content Writer" /></label>
    <label className="workspace-field"><span>Tên reviewer</span><input value={form.extended.reviewerName} onChange={(event) => updateField("extended", "reviewerName", event.target.value)} /></label>
    <label className="workspace-field"><span>Vai trò reviewer</span><input value={form.extended.reviewerRole} onChange={(event) => updateField("extended", "reviewerRole", event.target.value)} placeholder="Kỹ thuật viên Auto365" /></label>
    <label className="workspace-field workspace-field--wide"><span>Nguồn chính</span><input value={form.extended.primarySource} onChange={(event) => updateField("extended", "primarySource", event.target.value)} placeholder="Tài liệu sản phẩm / hồ sơ thi công…" /></label>
    <label className="workspace-field workspace-field--wide"><span>Timeline — mỗi dòng “Tiêu đề — Mô tả”</span><textarea value={form.extended.timeline} onChange={(event) => updateField("extended", "timeline", event.target.value)} rows={4} placeholder={"Kiểm tra hiện trạng — Đối chiếu hốc đèn, nguồn điện...\nKhóa cấu hình — Chốt sản phẩm theo nhu cầu..."} /></label>
    <label className="workspace-field"><span>Đã xác nhận (known) — mỗi dòng một ý</span><textarea value={form.extended.known} onChange={(event) => updateField("extended", "known", event.target.value)} rows={4} /></label>
    <label className="workspace-field"><span>Chưa xác nhận (unknown) — mỗi dòng một ý</span><textarea value={form.extended.unknown} onChange={(event) => updateField("extended", "unknown", event.target.value)} rows={4} /></label>
    <label className="workspace-field workspace-field--wide"><span>QC — mỗi dòng “Hạng mục — Kết quả”</span><textarea value={form.extended.qc} onChange={(event) => updateField("extended", "qc", event.target.value)} rows={4} placeholder={"Cos — Hoạt động sau căn chỉnh\nPha — Hoạt động sau căn chỉnh"} /></label>
    <label className="workspace-field workspace-field--wide"><span>FAQ — dạng “Q: ...”, dòng dưới “A: ...”, cách nhau 1 dòng trống</span><textarea value={form.extended.faqs} onChange={(event) => updateField("extended", "faqs", event.target.value)} rows={6} placeholder={"Q: Câu hỏi thứ nhất?\nA: Câu trả lời.\n\nQ: Câu hỏi thứ hai?\nA: Câu trả lời."} /></label>
    <label className="workspace-field workspace-field--wide"><span>Thông số sản phẩm — mỗi dòng “Nhãn — Giá trị — Ghi chú”</span><textarea value={form.extended.metrics} onChange={(event) => updateField("extended", "metrics", event.target.value)} rows={4} placeholder={"Công suất Cos — Khoảng 45W — Theo tài liệu sản phẩm\nCông suất Pha — Khoảng 55W — Theo tài liệu sản phẩm"} /></label>
    <label className="workspace-field"><span>Giá tham khảo</span><input value={form.extended.priceValue} onChange={(event) => updateField("extended", "priceValue", event.target.value)} placeholder="4.500.000 VNĐ/bộ" /></label>
    <label className="workspace-field"><span>Ghi chú giá</span><input value={form.extended.priceNote} onChange={(event) => updateField("extended", "priceNote", event.target.value)} placeholder="Chưa VAT · chưa phải tổng bill" /></label>
    <label className="workspace-field workspace-field--wide"><span>Giá bao gồm — mỗi dòng một ý</span><textarea value={form.extended.priceIncludes} onChange={(event) => updateField("extended", "priceIncludes", event.target.value)} rows={3} placeholder={"01 bộ = 01 cặp = 02 đèn\nBảo hành 24 tháng"} /></label>
    <label className="workspace-field"><span>Ảnh vùng sáng Cos</span><input value={form.extended.beamCosUrl} onChange={(event) => updateField("extended", "beamCosUrl", event.target.value)} placeholder="https://…" /></label>
    <label className="workspace-field"><span>Chú thích ảnh Cos</span><input value={form.extended.beamCosCaption} onChange={(event) => updateField("extended", "beamCosCaption", event.target.value)} /></label>
    <label className="workspace-field"><span>Ảnh vùng sáng Pha</span><input value={form.extended.beamPhaUrl} onChange={(event) => updateField("extended", "beamPhaUrl", event.target.value)} placeholder="https://…" /></label>
    <label className="workspace-field"><span>Chú thích ảnh Pha</span><input value={form.extended.beamPhaCaption} onChange={(event) => updateField("extended", "beamPhaCaption", event.target.value)} /></label>
    <label className="workspace-field workspace-field--wide"><span>Theo dõi hậu kiểm — mỗi dòng “Mốc — Ngày — done/pending”</span><textarea value={form.extended.followup} onChange={(event) => updateField("extended", "followup", event.target.value)} rows={3} placeholder={"Bàn giao — Ngày 0 — done\nHậu kiểm 7 ngày — +7 ngày — pending"} /></label>
    <label className="workspace-field workspace-field--wide"><span>Bài liên quan — mỗi dòng “Nhãn — URL”</span><textarea value={form.extended.related} onChange={(event) => updateField("extended", "related", event.target.value)} rows={3} placeholder={"Checklist kiểm tra sau khi lắp — https://auto365.vn/…"} /></label>
  </div>;
}

function ReviewStep({ form, updateField, items }: { form: CaseDraft; updateField: (section: string, field: string, value: string | boolean) => void; items: Array<[keyof CaseDraft["review"], string]> }) {
  return <div className="road-lab-review">
    <p>Đánh dấu mục đã chuẩn bị trước khi gửi review. Việc duyệt vẫn đi theo luồng review hiện tại.</p>
    {items.map(([field, label]) => (
      <label key={field as string}>
        <input type="checkbox" checked={form.review[field] as boolean} onChange={(event) => updateField("review", field as string, event.target.checked)} /> {label}
      </label>
    ))}
    <label className="workspace-field"><span>Ghi chú bàn giao</span><textarea value={form.review.reviewNote} onChange={(event) => updateField("review", "reviewNote", event.target.value)} rows={4} placeholder="Điểm cần reviewer tập trung kiểm tra…" /></label>
  </div>;
}

const workflowActionsByStatus: Record<string, Array<{ action: string; label: string; ghost?: boolean }>> = {
  draft: [{ action: "submit_review", label: "Gửi duyệt" }],
  changes_requested: [{ action: "submit_review", label: "Gửi duyệt lại" }],
  in_review: [{ action: "approve_technical", label: "Duyệt kỹ thuật (IT)" }, { action: "request_changes", label: "Yêu cầu sửa", ghost: true }],
  technical_approved: [{ action: "approve_seo", label: "Duyệt SEO" }, { action: "request_changes", label: "Yêu cầu sửa", ghost: true }],
  publishable: [{ action: "publish", label: "Xuất bản" }, { action: "request_changes", label: "Yêu cầu sửa", ghost: true }],
};

function WorkflowActions({ workflowStatus, saving, onAction }: { workflowStatus: string; saving: boolean; onAction: (action: string) => void }) {
  const actions = workflowActionsByStatus[workflowStatus];
  if (!actions?.length) {
    return <p className="workspace-editor-note">Case đang ở trạng thái &quot;{statusLabels[workflowStatus] ?? workflowStatus}&quot; — không có thao tác chuyển trạng thái nào ở đây.</p>;
  }
  return <div className="road-lab-workflow-actions">
    {actions.map((item) => (
      <button key={item.action} type="button" className={`workspace-button${item.ghost ? " workspace-button--ghost" : ""}`} disabled={saving} onClick={() => onAction(item.action)}>{item.label}</button>
    ))}
  </div>;
}

const ownerLabelsByTemplate: Record<CaseTemplateKey, Array<[string, string]>> = {
  road_lab: [["roadCaseId", "Road Case ID"], ["proofLabId", "Proof Lab ID"], ["brandPillarId", "Brand Pillar ID"], ["productOwnerId", "Product Owner ID"]],
  proof_lab: [["proofLabId", "Proof Lab ID"], ["roadCaseId", "Road Case ID"], ["brandPillarId", "Brand Pillar ID"], ["productOwnerId", "Product Owner ID"]],
  brand_story: [["brandPillarId", "Brand Pillar ID"], ["roadCaseId", "Road Case ID"], ["proofLabId", "Proof Lab ID"], ["productOwnerId", "Product Owner ID"]],
  product_spotlight: [["productOwnerId", "Product Owner ID"], ["roadCaseId", "Road Case ID"], ["proofLabId", "Proof Lab ID"], ["brandPillarId", "Brand Pillar ID"]],
};

const reviewItemsByTemplate: Record<CaseTemplateKey, Array<[string, string]>> = {
  road_lab: [["contentChecked", "Nội dung và answer-first đã kiểm tra"], ["evidenceChecked", "Bằng chứng và nguồn xác minh đã đủ"], ["seoChecked", "Metadata và liên kết owner đã kiểm tra"], ["technicalChecked", "Cấu hình kỹ thuật đã sẵn sàng review"]],
  proof_lab: [["verificationChecked", "Đối tượng và phương pháp nghiệm thu đã kiểm tra"], ["findingsChecked", "Kết quả đo và kết luận đã đủ"], ["evidenceChecked", "Bằng chứng và nguồn xác minh đã đủ"], ["seoChecked", "Metadata và liên kết owner đã kiểm tra"]],
  brand_story: [["positioningChecked", "Định vị và thông điệp chính đã kiểm tra"], ["supportChecked", "Luận cứ hỗ trợ đã đủ"], ["evidenceChecked", "Bằng chứng và nguồn xác minh đã đủ"], ["seoChecked", "Metadata và liên kết owner đã kiểm tra"]],
  product_spotlight: [["productChecked", "Thông tin sản phẩm đã kiểm tra"], ["comparisonChecked", "So sánh và lợi thế đã đủ"], ["evidenceChecked", "Bằng chứng và nguồn xác minh đã đủ"], ["seoChecked", "Metadata và liên kết owner đã kiểm tra"]],
};

function SubjectSteps({ templateKey, activeStep, form, updateField }: { templateKey: CaseTemplateKey; activeStep: string; form: CaseDraft; updateField: (section: string, field: string, value: string | boolean) => void }) {
  if (templateKey === "road_lab" && form.templateKey === "road_lab") {
    if (activeStep === "vehicle") return <div className="workspace-field-grid">
      <label className="workspace-field"><span>Xe thực tế</span><input value={form.vehicle.vehicleName} onChange={(event) => updateField("vehicle", "vehicleName", event.target.value)} /></label>
      <label className="workspace-field"><span>Đời xe</span><input value={form.vehicle.modelYear} onChange={(event) => updateField("vehicle", "modelYear", event.target.value)} /></label>
      <label className="workspace-field"><span>ODO / số km</span><input value={form.vehicle.odometer} onChange={(event) => updateField("vehicle", "odometer", event.target.value)} /></label>
      <label className="workspace-field"><span>Giai đoạn thi công</span><input value={form.vehicle.installationStage} onChange={(event) => updateField("vehicle", "installationStage", event.target.value)} placeholder="Trước, trong hoặc sau thi công" /></label>
      <label className="workspace-field workspace-field--wide"><span>Nhu cầu chính</span><textarea value={form.vehicle.primaryNeed} onChange={(event) => updateField("vehicle", "primaryNeed", event.target.value)} rows={3} /></label>
      <label className="workspace-field workspace-field--wide"><span>Bối cảnh sử dụng</span><textarea value={form.vehicle.usageConditions} onChange={(event) => updateField("vehicle", "usageConditions", event.target.value)} rows={3} /></label>
    </div>;
    if (activeStep === "configuration") return <div className="workspace-field-grid">
      <label className="workspace-field workspace-field--wide"><span>Vấn đề ban đầu</span><textarea value={form.configuration.problem} onChange={(event) => updateField("configuration", "problem", event.target.value)} rows={3} /></label>
      <label className="workspace-field"><span>Cấu hình trước</span><textarea value={form.configuration.beforeConfig} onChange={(event) => updateField("configuration", "beforeConfig", event.target.value)} rows={4} /></label>
      <label className="workspace-field"><span>Cấu hình thực tế</span><textarea value={form.configuration.actualConfig} onChange={(event) => updateField("configuration", "actualConfig", event.target.value)} rows={4} /></label>
      <label className="workspace-field"><span>Sản phẩm chính</span><input value={form.configuration.productName} onChange={(event) => updateField("configuration", "productName", event.target.value)} /></label>
      <label className="workspace-field"><span>Vật tư / phụ kiện</span><input value={form.configuration.materials} onChange={(event) => updateField("configuration", "materials", event.target.value)} /></label>
    </div>;
  }
  if (templateKey === "proof_lab" && form.templateKey === "proof_lab") {
    if (activeStep === "verification") return <div className="workspace-field-grid">
      <label className="workspace-field"><span>Đối tượng nghiệm thu</span><input value={form.verification.subjectRef} onChange={(event) => updateField("verification", "subjectRef", event.target.value)} placeholder="Sản phẩm / case liên quan" /></label>
      <label className="workspace-field"><span>Ngày đo / nghiệm thu</span><input type="date" value={form.verification.testedAt} onChange={(event) => updateField("verification", "testedAt", event.target.value)} /></label>
      <label className="workspace-field"><span>Phương pháp đo/kiểm</span><input value={form.verification.testMethod} onChange={(event) => updateField("verification", "testMethod", event.target.value)} /></label>
      <label className="workspace-field"><span>Tiêu chuẩn / mốc đối chiếu</span><input value={form.verification.standardRef} onChange={(event) => updateField("verification", "standardRef", event.target.value)} /></label>
      <label className="workspace-field workspace-field--wide"><span>Người / đơn vị xác minh</span><input value={form.verification.verifiedBy} onChange={(event) => updateField("verification", "verifiedBy", event.target.value)} /></label>
    </div>;
    if (activeStep === "findings") return <div className="workspace-field-grid">
      <label className="workspace-field"><span>Kết quả trước</span><textarea value={form.findings.beforeResult} onChange={(event) => updateField("findings", "beforeResult", event.target.value)} rows={4} /></label>
      <label className="workspace-field"><span>Kết quả sau</span><textarea value={form.findings.afterResult} onChange={(event) => updateField("findings", "afterResult", event.target.value)} rows={4} /></label>
      <label className="workspace-field workspace-field--wide"><span>Kết luận</span><textarea value={form.findings.conclusion} onChange={(event) => updateField("findings", "conclusion", event.target.value)} rows={3} /></label>
      <label className="workspace-field workspace-field--wide"><span>Sai lệch / lưu ý</span><textarea value={form.findings.deviationNote} onChange={(event) => updateField("findings", "deviationNote", event.target.value)} rows={3} /></label>
    </div>;
  }
  if (templateKey === "brand_story" && form.templateKey === "brand_story") {
    if (activeStep === "positioning") return <div className="workspace-field-grid">
      <label className="workspace-field"><span>Đối tượng mục tiêu</span><input value={form.positioning.targetAudience} onChange={(event) => updateField("positioning", "targetAudience", event.target.value)} /></label>
      <label className="workspace-field"><span>Tông giọng (tone of voice)</span><input value={form.positioning.toneOfVoice} onChange={(event) => updateField("positioning", "toneOfVoice", event.target.value)} /></label>
      <label className="workspace-field workspace-field--wide"><span>Tuyên bố định vị</span><textarea value={form.positioning.positioningStatement} onChange={(event) => updateField("positioning", "positioningStatement", event.target.value)} rows={3} /></label>
      <label className="workspace-field workspace-field--wide"><span>Thông điệp chính — mỗi dòng một ý</span><textarea value={form.positioning.keyMessages} onChange={(event) => updateField("positioning", "keyMessages", event.target.value)} rows={4} /></label>
      <label className="workspace-field workspace-field--wide"><span>Điểm khác biệt — mỗi dòng một ý</span><textarea value={form.positioning.differentiators} onChange={(event) => updateField("positioning", "differentiators", event.target.value)} rows={4} /></label>
    </div>;
    if (activeStep === "support") return <div className="workspace-field-grid">
      <label className="workspace-field workspace-field--wide"><span>Số liệu / luận cứ hỗ trợ</span><textarea value={form.support.supportingFacts} onChange={(event) => updateField("support", "supportingFacts", event.target.value)} rows={4} /></label>
      <label className="workspace-field workspace-field--wide"><span>Bằng chứng xã hội (đánh giá, khách hàng tiêu biểu)</span><textarea value={form.support.socialProof} onChange={(event) => updateField("support", "socialProof", event.target.value)} rows={4} /></label>
    </div>;
  }
  if (templateKey === "product_spotlight" && form.templateKey === "product_spotlight") {
    if (activeStep === "productInfo") return <div className="workspace-field-grid">
      <label className="workspace-field"><span>Tên sản phẩm</span><input value={form.productInfo.productName} onChange={(event) => updateField("productInfo", "productName", event.target.value)} /></label>
      <label className="workspace-field"><span>Giá / khuyến mãi</span><input value={form.productInfo.pricingNote} onChange={(event) => updateField("productInfo", "pricingNote", event.target.value)} /></label>
      <label className="workspace-field workspace-field--wide"><span>Thông số kỹ thuật chính</span><textarea value={form.productInfo.keySpecs} onChange={(event) => updateField("productInfo", "keySpecs", event.target.value)} rows={3} /></label>
      <label className="workspace-field workspace-field--wide"><span>Tính năng nổi bật — mỗi dòng một ý</span><textarea value={form.productInfo.keyFeatures} onChange={(event) => updateField("productInfo", "keyFeatures", event.target.value)} rows={4} /></label>
      <label className="workspace-field workspace-field--wide"><span>Trường hợp sử dụng — mỗi dòng một ý</span><textarea value={form.productInfo.useCases} onChange={(event) => updateField("productInfo", "useCases", event.target.value)} rows={4} /></label>
    </div>;
    if (activeStep === "comparison") return <div className="workspace-field-grid">
      <label className="workspace-field workspace-field--wide"><span>Lựa chọn thay thế / đối thủ</span><textarea value={form.comparison.alternativeRef} onChange={(event) => updateField("comparison", "alternativeRef", event.target.value)} rows={3} /></label>
      <label className="workspace-field workspace-field--wide"><span>Lợi thế so với lựa chọn khác</span><textarea value={form.comparison.advantageNote} onChange={(event) => updateField("comparison", "advantageNote", event.target.value)} rows={4} /></label>
    </div>;
  }
  return null;
}

export default function CaseEditor({ caseId, mode }: { caseId: string; mode: "editor" | "review" }) {
  const [data, setData] = useState<DraftResponse | null>(null);
  const [feedback, setFeedback] = useState<Feedback[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [audit, setAudit] = useState<Audit[]>([]);
  const [form, setForm] = useState<CaseDraft | null>(null);
  const [activeStep, setActiveStep] = useState<string>("publication");
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

  function updateField(section: string, field: string, value: string | boolean) {
    setForm((current) => current ? ({ ...current, [section]: { ...(current as unknown as Record<string, object>)[section], [field]: value } } as CaseDraft) : current);
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

  async function transitionStatus(action: string) {
    if (!data) return;
    setSaving(true); setError(""); setNotice("");
    try {
      const result = await fetch(`/api/v1/case-lab/cases/${encodeURIComponent(caseId)}/status`, { method: "PUT", headers: { "content-type": "application/json" }, body: JSON.stringify({ action, expectedRevision: data.case.currentRevision }) }).then(readResponse<{ case: { workflowStatus: string } }>);
      setNotice(`Đã chuyển trạng thái sang "${statusLabels[result.case.workflowStatus] ?? result.case.workflowStatus}".`); await load();
    } catch (reason) { setError(reason instanceof Error ? reason.message : "Không thể thực hiện thao tác này."); }
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

  if (loading) return <section className="workspace-shell"><p className="workspace-loading">Đang tải case…</p></section>;
  if (error && !data) return <section className="workspace-shell"><Link className="workspace-back" href="/workspace/cases">← Case / bài viết</Link><div className="workspace-alert" role="alert">{error === "SESSION_REQUIRED" ? <><b>Phiên đăng nhập chưa sẵn sàng</b><Link className="workspace-alert__link" href={`/login?return_to=/workspace/cases/${encodeURIComponent(caseId)}`}>Đăng nhập Case Lab →</Link></> : error}</div></section>;
  if (!data || !form) return null;

  const templateKey = templateKeyForContentType(data.case.contentType);
  const steps = stepsByTemplate[templateKey];
  const active = steps.find((step) => step.id === activeStep) ?? steps[0];
  const title = mode === "review" ? `Review ${templateLabels[templateKey]}` : `Soạn ${templateLabels[templateKey]}`;

  return <section className="workspace-shell workspace-case-page">
    <Link className="workspace-back" href="/workspace/cases">← Case / bài viết</Link>
    <div className="workspace-case-heading"><div><p className="workspace-eyebrow">{templateLabels[templateKey]} · {data.case.caseCode} · {data.case.branchRef}</p><h1>{title}</h1><p>{data.case.vehicleRef} · {data.case.productRef}</p></div><div className="workspace-case-actions"><span className={`workspace-status-pill workspace-status-pill--${data.case.workflowStatus}`}>{statusLabels[data.case.workflowStatus] ?? data.case.workflowStatus}</span>{mode === "editor" ? <Link className="workspace-button workspace-button--ghost" href={`/workspace/cases/${encodeURIComponent(caseId)}/review`}>Mở review</Link> : <Link className="workspace-button workspace-button--ghost" href={`/workspace/cases/${encodeURIComponent(caseId)}`}>Soạn bài</Link>}<Link className="workspace-button workspace-button--ghost" href={`/case-preview/${encodeURIComponent(caseId)}`} target="_blank" rel="noreferrer">Xem trước bài →</Link><Link className="workspace-button workspace-button--ghost" href={`/workspace/cases/${encodeURIComponent(caseId)}/history`}>Lịch sử revision</Link>{data.case.workflowStatus === "archived" ? <button type="button" className="workspace-button workspace-button--ghost" disabled={saving} onClick={() => void transitionStatus("restore")}>Khôi phục</button> : <button type="button" className="workspace-button workspace-button--ghost" disabled={saving} onClick={() => { if (window.confirm("Huỷ case này? Case sẽ chuyển sang lưu trữ và ẩn khỏi bài đã xuất bản (nếu có), có thể khôi phục sau.")) void transitionStatus("archive"); }}>Huỷ case</button>}</div></div>
    {error ? <div className="workspace-alert" role="alert">{error}</div> : null}{notice ? <div className="workspace-notice">{notice}</div> : null}
    <div className="workspace-case-grid"><section className="workspace-card workspace-editor-card"><div className="workspace-card__head"><div><p className="workspace-eyebrow">Revision r{data.draft.revision}</p><h2>Hồ sơ {templateLabels[templateKey]}</h2></div><button className="workspace-button" onClick={saveDraft} disabled={saving}>{saving ? "Đang lưu…" : "Lưu revision mới"}</button></div>
      <nav className="road-lab-steps" aria-label={`Các bước soạn ${templateLabels[templateKey]}`}>{steps.map((step) => <button type="button" key={step.id} className="road-lab-step" aria-current={activeStep === step.id ? "step" : undefined} onClick={() => setActiveStep(step.id)}><span>{step.number}</span>{step.label}</button>)}</nav>
      <div className="road-lab-step-heading"><p className="workspace-eyebrow">Bước {String(steps.findIndex((step) => step.id === activeStep) + 1).padStart(2, "0")} / {String(steps.length).padStart(2, "0")}</p><h3>{active.label}</h3><p>{active.hint}</p></div>
      {activeStep === "publication" ? <PublicationStep form={form} updateField={updateField} onManageMedia={() => setActiveStep("evidence")} /> : null}
      <SubjectSteps templateKey={templateKey} activeStep={activeStep} form={form} updateField={updateField} />
      {activeStep === "evidence" ? <EvidenceStep form={form} updateField={updateField} /> : null}
      {activeStep === "seo" ? <SeoStep form={form} updateField={updateField} ownerLabels={ownerLabelsByTemplate[templateKey] as Array<[keyof CaseDraft["seo"], string]>} /> : null}
      {activeStep === "extended" ? <ExtendedStep form={form} updateField={updateField} /> : null}
      {activeStep === "review" ? <>
        <ReviewStep form={form} updateField={updateField} items={reviewItemsByTemplate[templateKey] as Array<[keyof CaseDraft["review"], string]>} />
        <WorkflowActions workflowStatus={data.case.workflowStatus} saving={saving} onAction={(action) => void transitionStatus(action)} />
      </> : null}
      <p className="workspace-editor-note">Mỗi lần lưu tạo revision mới, không ghi đè bản đang review.</p>
    </section>
    <aside className="workspace-case-side"><section className="workspace-card"><p className="workspace-eyebrow">Người phụ trách</p><h2>Phân công hiện tại</h2><div className="workspace-assignment-list">{assignments.length ? assignments.map((item) => <div key={item.id}><b>{item.user.displayName}</b><span>{item.role}</span></div>) : <p>Chưa có phân công.</p>}</div></section><section className="workspace-card"><p className="workspace-eyebrow">Theo revision</p><h2>Lịch sử gần đây</h2><div className="workspace-audit-list">{audit.slice(0, 5).map((item) => <div key={item.id}><span>{formatDate.format(new Date(item.createdAt))}</span><b>{item.actor.displayName}</b><p>{item.action}{item.revision ? ` · r${item.revision}` : ""}</p></div>)}</div></section></aside></div>
    <section className="workspace-card workspace-feedback-panel"><div className="workspace-card__head"><div><p className="workspace-eyebrow">Feedback review</p><h2>{mode === "review" ? "Luồng phản hồi" : "Phản hồi trên case"}</h2></div><span>{feedback.filter((item) => item.status === "open").length} mở</span></div><div className="workspace-feedback-compose"><select aria-label="Loại feedback" value={feedbackCategory} onChange={(event) => setFeedbackCategory(event.target.value)}>{Object.entries(categoryLabels).map(([key, label]) => <option key={key} value={key}>{label}</option>)}</select><textarea value={feedbackMessage} onChange={(event) => setFeedbackMessage(event.target.value)} placeholder="Nhập feedback cụ thể cho revision hiện tại" rows={3} maxLength={2000} /><button className="workspace-button" onClick={createFeedback} disabled={saving || feedbackMessage.trim().length < 3}>Gửi feedback</button></div><div className="workspace-feedback-list">{feedback.length ? feedback.map((item) => <article key={item.id}><div><b>{categoryLabels[item.category] ?? item.category}</b><span>r{item.revision} · {item.author.displayName} · {formatDate.format(new Date(item.createdAt))}</span></div><p>{item.message}</p>{item.status === "open" ? <button className="workspace-text-button" disabled={saving} onClick={() => resolveFeedback(item.id)}>Đánh dấu đã xử lý →</button> : <small>Đã xử lý</small>}</article>) : <div className="workspace-empty"><b>Chưa có feedback.</b><span>Reviewer có thể bắt đầu phản hồi ở revision này.</span></div>}</div></section>
  </section>;
}
