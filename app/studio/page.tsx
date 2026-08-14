"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  confirmMediaSet,
  createDraftFromWorkOrder,
  evaluateZeroRekeyDraft,
  formatVnd,
  generateZeroRekeyOutputs,
  patchContent,
  sampleWorkOrders,
  submitDataIssue,
  submitForTechnicalReview,
  WorkOrderQueueStatus,
  WorkOrderSnapshot,
  ZeroRekeyDraft,
  ZeroRekeyGateIssue,
} from "../../lib/zero-rekey";

const queueTabs: Array<{ status: WorkOrderQueueStatus; label: string }> = [
  { status: "ready", label: "Sẵn sàng viết" },
  { status: "missing_media", label: "Thiếu ảnh" },
  { status: "in_review", label: "Chờ duyệt" },
  { status: "changes_requested", label: "Bị trả sửa" },
  { status: "published", label: "Đã xuất bản" },
];

const steps = [
  { id: 1, label: "Xác nhận ca", note: "Phiếu việc tự nạp" },
  { id: 2, label: "Kiểm tra ảnh", note: "6 lõi + 2 bổ sung" },
  { id: 3, label: "Xem & gửi", note: "Preview · 4 gate" },
] as const;

type Step = 1 | 2 | 3;
type SaveState = "saved" | "saving" | "offline" | "error";

export default function StudioPage() {
  const [activeQueue, setActiveQueue] = useState<WorkOrderQueueStatus>("ready");
  const [order, setOrder] = useState<WorkOrderSnapshot>(sampleWorkOrders[0]);
  const [draft, setDraft] = useState<ZeroRekeyDraft>(() => createDraftFromWorkOrder(sampleWorkOrders[0]));
  const [activeStep, setActiveStep] = useState<Step>(1);
  const [saveState, setSaveState] = useState<SaveState>("saved");
  const [issueOpen, setIssueOpen] = useState(false);
  const [issueTarget, setIssueTarget] = useState<"work_order" | "catalog" | "media" | "price">("work_order");
  const [issueMessage, setIssueMessage] = useState("");
  const [previewMode, setPreviewMode] = useState<"desktop" | "mobile">("desktop");
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const gate = useMemo(() => evaluateZeroRekeyDraft(order, draft), [order, draft]);
  const output = useMemo(() => generateZeroRekeyOutputs(order, draft), [order, draft]);
  const visibleOrders = sampleWorkOrders.filter((item) => item.queueStatus === activeQueue);
  const issueCounts = useMemo(() => steps.reduce<Record<number, number>>((result, step) => {
    result[step.id] = gate.issues.filter((issue) => issue.step === step.id && issue.code !== "TECHNICAL_APPROVAL_REQUIRED").length;
    return result;
  }, {}), [gate.issues]);

  useEffect(() => () => {
    if (saveTimer.current) clearTimeout(saveTimer.current);
  }, []);

  const simulateServerSave = (next: ZeroRekeyDraft) => {
    setDraft(next);
    setSaveState("saving");
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => setSaveState("saved"), 650);
  };

  const openOrder = (nextOrder: WorkOrderSnapshot) => {
    setOrder(nextOrder);
    setDraft(createDraftFromWorkOrder(nextOrder));
    setActiveStep(nextOrder.queueStatus === "missing_media" ? 2 : 1);
    setIssueOpen(false);
    setIssueMessage("");
    setSaveState("saved");
  };

  const updateContribution = (key: "customerNeed" | "caseNote", value: string) => {
    simulateServerSave(patchContent(draft, { [key]: value }));
  };

  const toggleMediaConfirmation = (confirmed: boolean) => {
    simulateServerSave(confirmMediaSet(draft, confirmed));
  };

  const sendReview = () => {
    try {
      simulateServerSave(submitForTechnicalReview(order, draft));
    } catch {
      focusIssue(gate.issues.find((issue) => issue.code !== "TECHNICAL_APPROVAL_REQUIRED"));
    }
  };

  const reportIssue = () => {
    if (issueMessage.trim().length < 10) return;
    simulateServerSave(submitDataIssue(draft, {
      target: issueTarget,
      message: issueMessage.trim(),
      status: "submitted",
    }));
    setIssueOpen(false);
  };

  const focusIssue = (issue?: ZeroRekeyGateIssue) => {
    if (!issue) return;
    setActiveStep(issue.step);
    window.setTimeout(() => {
      const id = issue.field === "customerNeed"
        ? "customer-need"
        : issue.field === "caseNote"
          ? "case-note"
          : issue.field === "media"
            ? "media-board"
            : "data-source";
      document.getElementById(id)?.focus();
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 80);
  };

  const actionableIssues = gate.issues.filter((issue) => issue.code !== "TECHNICAL_APPROVAL_REQUIRED");
  const mediaReady = draft.media.filter((asset) => asset.required && asset.url && asset.rightsStatus === "confirmed").length;

  return (
    <main className="zero-page">
      <header className="zero-header">
        <div className="zero-shell zero-header__inner">
          <Link className="zero-brand" href="/">
            <span>A365</span>
            <div><b>CASE LAB STUDIO</b><small>Production Zero‑Rekey · V2.0</small></div>
          </Link>
          <div className="zero-pilot"><i /> Pilot tuyến Đèn</div>
          <nav aria-label="Điều hướng Studio">
            <a href="#queue">Ca xe</a>
            <Link href={`/workspace/cases/${encodeURIComponent(order.id)}/review`}>Kỹ thuật duyệt</Link>
            <Link href="/">Bài V1.4</Link>
          </nav>
          <div className={`zero-save zero-save--${saveState}`} aria-live="polite">
            <span />
            {saveState === "saving" ? "Đang lưu máy chủ" : saveState === "saved" ? `Đã lưu · r${draft.revision}` : saveState === "offline" ? "Mất kết nối" : "Lưu lỗi"}
          </div>
          <button className="zero-user" type="button" aria-label="Tài khoản content Vinh">V</button>
        </div>
      </header>

      <section className="zero-intro zero-shell">
        <div>
          <span className="zero-kicker">AUTO365 CASE LAB · DAILY CONTENT</span>
          <h1>Chọn đúng ca. Thêm 2 ghi chú.<br /><em>Gửi duyệt trong 3–6 phút.</em></h1>
        </div>
        <p>
          Xe, sản phẩm, giá, cấu hình, chi nhánh, nguồn, tác giả, reviewer và SEO
          đều lấy từ phiếu việc cùng catalog. Content không nhập lại và không thể sửa dữ liệu hệ thống.
        </p>
      </section>

      <section className="zero-queue zero-shell" id="queue">
        <div className="zero-queue__head">
          <div>
            <span className="zero-kicker">HÀNG ĐỢI THEO CASE ID</span>
            <h2>Ca xe của hôm nay</h2>
          </div>
          <label className="zero-search">
            <span aria-hidden="true">⌕</span>
            <input aria-label="Tìm Case ID hoặc biển số" placeholder="Tìm Case ID hoặc quét QR" />
          </label>
        </div>
        <div className="zero-tabs" role="tablist" aria-label="Trạng thái ca xe">
          {queueTabs.map((tab) => {
            const count = sampleWorkOrders.filter((item) => item.queueStatus === tab.status).length;
            return (
              <button
                type="button"
                role="tab"
                aria-selected={activeQueue === tab.status}
                className={activeQueue === tab.status ? "active" : ""}
                onClick={() => setActiveQueue(tab.status)}
                key={tab.status}
              >
                {tab.label}<b>{count}</b>
              </button>
            );
          })}
        </div>
        <div className="zero-order-list">
          {visibleOrders.map((item) => (
            <button
              type="button"
              className={`zero-order ${order.id === item.id ? "active" : ""}`}
              onClick={() => openOrder(item)}
              key={item.id}
            >
              <span className="zero-order__status">{queueLabel(item.queueStatus)}</span>
              <div>
                <b>{item.vehicle.make} {item.vehicle.model} {item.vehicle.year} {item.vehicle.trim}</b>
                <small>{item.product.name} · {item.product.configuration}</small>
              </div>
              <dl>
                <div><dt>CASE ID</dt><dd>{item.caseId}</dd></div>
                <div><dt>ẢNH</dt><dd>{item.media.filter((asset) => asset.url).length}/8</dd></div>
                <div><dt>ĐỒNG BỘ</dt><dd>v{item.sourceVersion}</dd></div>
              </dl>
              <i aria-hidden="true">→</i>
            </button>
          ))}
        </div>
      </section>

      <section className="zero-casebar zero-shell" id="data-source" tabIndex={-1}>
        <div><span>CASE ĐANG MỞ</span><b>{draft.caseId}</b></div>
        <div><span>PHIẾU VIỆC</span><b>{order.id} · v{order.sourceVersion}</b></div>
        <div><span>DỮ LIỆU</span><b><i /> Đã đồng bộ</b></div>
        <div><span>NGUỒN</span><b>{order.sourceSystem}</b></div>
        <button type="button" onClick={() => setIssueOpen((value) => !value)}>Báo dữ liệu sai</button>
      </section>

      {issueOpen && (
        <section className="zero-issue zero-shell" aria-label="Báo dữ liệu sai">
          <div><span>ROUTE ĐÚNG CHỦ SỞ HỮU</span><h2>Không tự sửa dữ liệu nguồn</h2><p>Yêu cầu sẽ chuyển đến xưởng, quản trị catalog hoặc kế toán; chỉ lỗi hệ thống mới tạo ticket IT.</p></div>
          <label><span>Nhóm dữ liệu</span><select value={issueTarget} onChange={(event) => setIssueTarget(event.target.value as typeof issueTarget)}><option value="work_order">Phiếu việc</option><option value="catalog">Catalog sản phẩm/xe</option><option value="media">Ảnh đúng ca</option><option value="price">Giá/VAT</option></select></label>
          <label><span>Mô tả ngắn</span><textarea rows={3} value={issueMessage} onChange={(event) => setIssueMessage(event.target.value)} placeholder="Ví dụ: phiên bản xe trên phiếu chưa đúng..." /></label>
          <div><button type="button" onClick={() => setIssueOpen(false)}>Hủy</button><button type="button" disabled={issueMessage.trim().length < 10} onClick={reportIssue}>Gửi đúng bộ phận</button></div>
        </section>
      )}

      <nav className="zero-stepper zero-shell" aria-label="Ba bước tạo bài">
        {steps.map((step) => (
          <button
            type="button"
            className={activeStep === step.id ? "active" : activeStep > step.id ? "done" : ""}
            onClick={() => setActiveStep(step.id)}
            aria-current={activeStep === step.id ? "step" : undefined}
            key={step.id}
          >
            <span>{activeStep > step.id ? "✓" : String(step.id).padStart(2, "0")}</span>
            <div><b>{step.label}{issueCounts[step.id] ? ` · ${issueCounts[step.id]} việc` : ""}</b><small>{step.note}</small></div>
          </button>
        ))}
      </nav>

      <section className="zero-workspace zero-shell">
        <div className="zero-editor">
          {activeStep === 1 && (
            <StepPanel kicker="BƯỚC 01 · 1–2 PHÚT" title="Xác nhận dữ liệu tự nạp và thêm hai ghi chú" note="Trường màu xám thuộc nguồn hệ thống. Nếu sai, dùng “Báo dữ liệu sai”; content không nhập lại.">
              <div className="zero-source-grid">
                <SourceItem label="Xe" value={`${order.vehicle.make} ${order.vehicle.model} ${order.vehicle.year} ${order.vehicle.trim}`} source="Phiếu việc" />
                <SourceItem label="Sản phẩm" value={order.product.name} source={`Catalog ${order.product.catalogVersion}`} />
                <SourceItem label="Cấu hình" value={order.product.configuration} source="Phiếu việc" />
                <SourceItem label="Điểm thi công" value={order.branch.name} source="Danh mục chi nhánh" />
                <SourceItem label="Giá sản phẩm" value={formatVnd(order.price.productAmount)} source={order.price.vatIncluded ? "Đã gồm VAT" : "Chưa VAT"} />
                <SourceItem label="Tác giả · Reviewer" value={`${order.author.name} · ${order.reviewer.name}`} source="Tài khoản + phân công" />
              </div>

              <div className="zero-tech-snapshot">
                <div><span>HIỆN TRẠNG / GIỚI HẠN</span><p>{order.technical.conditionBefore}</p></div>
                <div><span>LÝ DO CẤU HÌNH</span><p>{order.technical.choiceReason}</p></div>
                <div><span>NGHIỆM THU TẠI XƯỞNG</span><p>{order.technical.qc}</p></div>
              </div>

              <div className="zero-content-fields">
                <label htmlFor="customer-need">
                  <span><b>1. Nhu cầu thật của chủ xe</b><small>{draft.content.customerNeed.length}/240</small></span>
                  <textarea
                    id="customer-need"
                    rows={4}
                    maxLength={240}
                    value={draft.content.customerNeed}
                    aria-invalid={draft.content.customerNeed.trim().length < 20}
                    aria-describedby="customer-need-help"
                    onChange={(event) => updateContribution("customerNeed", event.target.value)}
                  />
                  <small id="customer-need-help">Đã lấy từ cố vấn dịch vụ; content chỉ chỉnh câu chữ khi cần.</small>
                </label>
                <label htmlFor="case-note">
                  <span><b>2. Điểm khác biệt của ca xe</b><small>{draft.content.caseNote.length}/320</small></span>
                  <textarea
                    id="case-note"
                    rows={4}
                    maxLength={320}
                    value={draft.content.caseNote}
                    aria-invalid={draft.content.caseNote.trim().length < 20}
                    aria-describedby="case-note-help"
                    onChange={(event) => updateContribution("caseNote", event.target.value)}
                    placeholder="Ví dụ: hốc gầm còn zin, pát lắp trên bộ gá rời, chủ xe ưu tiên đi tỉnh..."
                  />
                  <small id="case-note-help">Chỉ ghi điều quan sát được trong ca; không suy diễn thông số hay hiệu quả.</small>
                </label>
              </div>
            </StepPanel>
          )}

          {activeStep === 2 && (
            <StepPanel kicker="BƯỚC 02 · 1–2 PHÚT" title="Kiểm tra câu chuyện ảnh 6 + 2" note="Xưởng tải ảnh theo Case ID/QR. Hệ thống gợi ý vai trò, kiểm checksum, chất lượng và quyền dùng trước khi ca xuất hiện ở đây.">
              <div className="zero-media-toolbar" id="media-board" tabIndex={-1}>
                <div><b>{mediaReady}/6 ảnh lõi sẵn sàng</b><span>{draft.media.filter((asset) => asset.url).length}/8 ảnh đã nhận từ xưởng</span></div>
                <div className="zero-media-health"><span>✓ Đúng Case ID</span><span>✓ Không trùng checksum</span><span>✓ Quyền dùng đã ghi nhận</span></div>
                <label className="zero-confirm"><input type="checkbox" checked={draft.mediaConfirmed} onChange={(event) => toggleMediaConfirmation(event.target.checked)} /><span>✓</span><b>Tôi đã xem và xác nhận bộ ảnh đúng ca</b></label>
              </div>
              <div className="zero-media-grid">
                {draft.media.map((asset, index) => {
                  const complete = Boolean(asset.url && asset.checksum && asset.rightsStatus === "confirmed" && asset.caseId === draft.caseId);
                  return (
                    <article className={`zero-media-card ${complete ? "complete" : "missing"}`} key={asset.id}>
                      <header><span>{String(index + 1).padStart(2, "0")}</span><div><b>{asset.label}</b><small>{asset.required ? "BẮT BUỘC" : "BỔ SUNG"} · {asset.role}</small></div><i>{complete ? "Đủ" : "Thiếu"}</i></header>
                      <div className="zero-media-image">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        {asset.url ? <img src={asset.url} alt={asset.alt} /> : <div><b>Chưa có ảnh</b><span>Xưởng bổ sung theo Case ID</span></div>}
                      </div>
                      <footer><span>{asset.capturedAt || "Chưa có ngày"}</span><span>{asset.rightsStatus === "confirmed" ? "Quyền dùng: Đã xác nhận" : "Quyền dùng: Chờ"}</span></footer>
                    </article>
                  );
                })}
              </div>
              <p className="zero-media-note">Production: ảnh được tải một lần từ điện thoại, lưu R2/CDN, đọc magic byte, kích thước và checksum; một ảnh lỗi có thể thử lại riêng mà không mất cả bộ.</p>
            </StepPanel>
          )}

          {activeStep === 3 && (
            <StepPanel kicker="BƯỚC 03 · DƯỚI 1 PHÚT" title="Xem đúng bài V1.4 rồi gửi kỹ thuật" note="Preview production dùng cùng CaseRecord và renderer với bài public; draft luôn noindex.">
              <div className="zero-preview-tools">
                <div><button type="button" className={previewMode === "desktop" ? "active" : ""} onClick={() => setPreviewMode("desktop")}>Desktop</button><button type="button" className={previewMode === "mobile" ? "active" : ""} onClick={() => setPreviewMode("mobile")}>Mobile</button></div>
                <span>Preview r{draft.revision} · noindex</span>
              </div>
              <ArticlePreview order={order} draft={draft} output={output} mode={previewMode} />
              <details className="zero-system-details">
                <summary>Chi tiết SEO & AI Search do hệ thống khóa</summary>
                <dl>
                  <div><dt>H1</dt><dd>{output.h1}</dd></div>
                  <div><dt>Title</dt><dd>{output.metaTitle}</dd></div>
                  <div><dt>Canonical</dt><dd>{output.canonical}</dd></div>
                  <div><dt>Meta description</dt><dd>{output.metaDescription}</dd></div>
                  <div><dt>Entity</dt><dd>{order.product.entityId}</dd></div>
                  <div><dt>Internal link</dt><dd>Hub bi gầm → sản phẩm → Case Lab</dd></div>
                </dl>
              </details>
              <div className="zero-submit-card">
                <div><span>KHI BẤM GỬI</span><h3>Kỹ thuật chỉ nhận đúng phần cần xác nhận</h3><p>Cấu hình, pát/bộ gá, mức can thiệp, điện và QC. Reviewer không phải đọc lại SEO hoặc biên tập toàn bài.</p></div>
                <label><input type="checkbox" checked={draft.publishAfterApproval} onChange={(event) => simulateServerSave({ ...draft, publishAfterApproval: event.target.checked, revision: draft.revision + 1 })} /><span>✓</span><b>Tự xuất bản sau khi kỹ thuật duyệt và server chạy lại 4 gate</b></label>
                <button type="button" disabled={!gate.readyForReview || draft.workflowStatus === "in_review"} onClick={sendReview}>{draft.workflowStatus === "in_review" ? "Đã gửi kỹ thuật duyệt" : "Gửi kỹ thuật duyệt →"}</button>
              </div>
            </StepPanel>
          )}

          <div className="zero-step-actions">
            <button type="button" disabled={activeStep === 1} onClick={() => setActiveStep((activeStep - 1) as Step)}>← Bước trước</button>
            <span>Bước {activeStep}/3</span>
            <button type="button" disabled={activeStep === 3} onClick={() => setActiveStep((activeStep + 1) as Step)}>Bước tiếp theo →</button>
          </div>
        </div>

        <aside className="zero-gates" aria-label="Trạng thái bài">
          <div className="zero-gates__head"><span>PUBLISH CONTROL · SERVER</span><b>{gate.publishable ? "Đủ điều kiện xuất bản" : gate.readyForReview ? "Sẵn sàng gửi kỹ thuật" : `Còn ${actionableIssues.length} việc trước khi gửi`}</b><small>Client không thể tự đặt gate xanh.</small></div>
          <GateStatus label="Nguồn đã sẵn sàng" note="Phiếu việc · catalog · revision" ok={gate.gates.source} />
          <GateStatus label="Ghi chú content đủ" note="Nhu cầu · điểm khác biệt" ok={gate.gates.content} />
          <GateStatus label="6–8 ảnh hợp lệ" note="Vai trò · Case ID · checksum · quyền" ok={gate.gates.evidence} />
          <GateStatus label="Hệ thống SEO sẵn sàng" note="Owner · intent · canonical · link map" ok={gate.gates.seo} />
          <GateStatus label="Kỹ thuật duyệt revision" note={`Reviewer: ${order.reviewer.name}`} ok={gate.gates.technical} pendingLabel="Chờ sau khi gửi" />
          {actionableIssues.length > 0 && (
            <div className="zero-issues"><b>VIỆC CẦN LÀM</b>{actionableIssues.map((issue) => <button type="button" onClick={() => focusIssue(issue)} key={issue.code}><span>{ownerLabel(issue.owner)}</span><p>{issue.message}</p><i>→</i></button>)}</div>
          )}
          <div className="zero-no-rekey"><span>CONTENT KHÔNG NHẬP</span><ul><li>Xe · sản phẩm · cấu hình · giá/VAT</li><li>Chi nhánh · tác giả · reviewer · nguồn</li><li>H1 · meta · URL · canonical · schema</li><li>Gate kỹ thuật · sitemap · trạng thái publish</li></ul></div>
        </aside>
      </section>

      <div className="zero-mobile-action">
        <div><span>{activeStep}/3</span><b>{gate.readyForReview ? "Sẵn sàng gửi duyệt" : `${actionableIssues.length} việc cần xử lý`}</b></div>
        {activeStep < 3 ? <button type="button" onClick={() => setActiveStep((activeStep + 1) as Step)}>Tiếp tục →</button> : <button type="button" disabled={!gate.readyForReview || draft.workflowStatus === "in_review"} onClick={sendReview}>Gửi duyệt</button>}
      </div>
    </main>
  );
}

function StepPanel({ kicker, title, note, children }: { kicker: string; title: string; note: string; children: React.ReactNode }) {
  return <section className="zero-step"><header><span>{kicker}</span><h2>{title}</h2><p>{note}</p></header>{children}</section>;
}

function SourceItem({ label, value, source }: { label: string; value: string; source: string }) {
  return <div><span>{label}</span><b>{value}</b><small><i /> {source} · khóa sửa</small></div>;
}

function GateStatus({ label, note, ok, pendingLabel = "Cần xử lý" }: { label: string; note: string; ok: boolean; pendingLabel?: string }) {
  return <div className={`zero-gate ${ok ? "ok" : "pending"}`}><span>{ok ? "✓" : "!"}</span><div><b>{label}</b><small>{note}</small></div><i>{ok ? "Đạt" : pendingLabel}</i></div>;
}

function ArticlePreview({ order, draft, output, mode }: {
  order: WorkOrderSnapshot;
  draft: ZeroRekeyDraft;
  output: ReturnType<typeof generateZeroRekeyOutputs>;
  mode: "desktop" | "mobile";
}) {
  const hero = draft.media.find((asset) => asset.role === "vehicle_after");
  const low = draft.media.find((asset) => asset.role === "beam_low_after");
  const high = draft.media.find((asset) => asset.role === "beam_high_after");
  return (
    <div className={`zero-preview zero-preview--${mode}`}>
      <article>
        <header><b>AUTO365</b><span>XE THẬT · SẢN PHẨM THẬT · TAY NGHỀ THẬT</span></header>
        <section className="zero-preview__hero" style={hero?.url ? { backgroundImage: `linear-gradient(90deg, rgba(6,8,12,.94), rgba(6,8,12,.2)), url(${hero.url})` } : undefined}>
          <span>CASE LAB · {draft.caseId}</span><h2>{output.h1}</h2><p>{draft.content.customerNeed || "Nhu cầu khách hàng sẽ hiển thị tại đây."}</p>
        </section>
        <div className="zero-preview__facts"><div><span>CẤU HÌNH</span><b>{order.product.configuration}</b></div><div><span>SẢN PHẨM</span><b>{order.product.shortName}</b></div><div><span>CHI NHÁNH</span><b>Trụ Sở Chính</b></div><div><span>GIÁ</span><b>{formatVnd(order.price.productAmount)}</b></div></div>
        <section className="zero-preview__body"><span>TRẢ LỜI NHANH · DỮ LIỆU ĐÚNG CA</span><h3>Camry trong bài đã lắp cấu hình nào?</h3><p>{output.answer}</p><blockquote>{draft.content.caseNote || "Điểm khác biệt của ca xe sẽ xuất hiện tại đây."}</blockquote><div>{[low, high].map((asset) => asset?.url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <figure key={asset.id}><img src={asset.url} alt={asset.alt} /><figcaption>{asset.label}</figcaption></figure>
        ) : null)}</div></section>
      </article>
    </div>
  );
}

function queueLabel(status: WorkOrderQueueStatus) {
  return status === "ready" ? "SẴN SÀNG VIẾT" : status === "missing_media" ? "THIẾU ẢNH" : status === "in_review" ? "CHỜ DUYỆT" : status === "changes_requested" ? "BỊ TRẢ SỬA" : "ĐÃ XUẤT BẢN";
}

function ownerLabel(owner: ZeroRekeyGateIssue["owner"]) {
  return owner === "content" ? "CONTENT" : owner === "workshop" ? "XƯỞNG" : owner === "catalog" ? "DATA" : owner === "technical" ? "KỸ THUẬT" : "HỆ THỐNG";
}
