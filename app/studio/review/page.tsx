"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  confirmMediaSet,
  createDraftFromWorkOrder,
  evaluateZeroRekeyDraft,
  patchContent,
  recordTechnicalDecision,
  sampleWorkOrders,
  submitForTechnicalReview,
  ZeroRekeyDraft,
} from "../../../lib/zero-rekey";

const order = sampleWorkOrders[0];

function readyReviewDraft(): ZeroRekeyDraft {
  let draft = createDraftFromWorkOrder(order);
  draft = patchContent(draft, {
    caseNote: "Hốc gầm còn nguyên trạng, bộ gá rời được dùng để hạn chế can thiệp vào chi tiết zin.",
  });
  draft = confirmMediaSet(draft, true);
  return submitForTechnicalReview(order, draft);
}

export default function TechnicalReviewPage() {
  const [draft, setDraft] = useState<ZeroRekeyDraft>(readyReviewDraft);
  const [note, setNote] = useState("");
  const gate = useMemo(() => evaluateZeroRekeyDraft(order, draft), [draft]);

  const decide = (decision: "approved" | "changes_requested") => {
    try {
      setDraft(recordTechnicalDecision(order, draft, {
        actorRole: "technical_reviewer",
        reviewerRef: order.reviewer.ref,
        expectedRevision: draft.revision,
        decision,
        note,
      }));
    } catch {
      setNote("Revision đã thay đổi. Vui lòng tải lại bản mới trước khi duyệt.");
    }
  };

  return (
    <main className="review-page">
      <header className="zero-header">
        <div className="zero-shell zero-header__inner">
          <Link className="zero-brand" href={`/workspace/cases/${encodeURIComponent(order.id)}`}>
            <span>A365</span>
            <div><b>TECHNICAL REVIEW</b><small>Case Lab Studio · V2.0</small></div>
          </Link>
          <div className="zero-pilot"><i /> Reviewer: {order.reviewer.name}</div>
          <nav><Link href={`/workspace/cases/${encodeURIComponent(order.id)}`}>← Về Content Studio</Link></nav>
          <div className="zero-save zero-save--saved"><span /> Revision r{draft.revision}</div>
          <button className="zero-user" type="button">Đ</button>
        </div>
      </header>

      <section className="review-hero zero-shell">
        <div><span className="zero-kicker">HÀNG ĐỢI KỸ THUẬT · 1–2 PHÚT/CASE</span><h1>Chỉ xác nhận điều kỹ thuật.<br /><em>Không đọc lại toàn bài SEO.</em></h1></div>
        <div className="review-counter"><span>CHỜ DUYỆT</span><b>01</b><small>Đúng reviewer · đúng chi nhánh</small></div>
      </section>

      <section className="review-case zero-shell">
        <header>
          <div><span>CASE ID · {order.caseId}</span><h2>{order.vehicle.make} {order.vehicle.model} {order.vehicle.year} {order.vehicle.trim}</h2><p>{order.product.name} · {order.product.configuration}</p></div>
          <div className="review-revision"><span>REVISION KHÓA</span><b>r{draft.revision}</b><small>Approval chỉ hợp lệ cho revision này</small></div>
        </header>

        <div className="review-grid">
          <section>
            <div className="review-section-title"><span>01</span><div><b>Cấu hình & phương án thi công</b><small>Từ phiếu việc và catalog</small></div></div>
            <dl className="review-facts">
              <div><dt>Sản phẩm</dt><dd>{order.product.name}</dd></div>
              <div><dt>Cấu hình</dt><dd>{order.product.configuration}</dd></div>
              <div><dt>Tháo cản</dt><dd>{factLabel(order.technical.removedBumper)}</dd></div>
              <div><dt>Cắt chi tiết zin</dt><dd>{factLabel(order.technical.originalCut)}</dd></div>
              <div><dt>Pát / bộ gá</dt><dd>{order.technical.bracket}</dd></div>
              <div><dt>Relay · cầu chì</dt><dd>{factLabel(order.technical.relay)} · {factLabel(order.technical.fuse)}</dd></div>
            </dl>

            <div className="review-section-title"><span>02</span><div><b>Kết quả QC & giới hạn claim</b><small>Phần reviewer chịu trách nhiệm</small></div></div>
            <div className="review-claim"><span>NGHIỆM THU</span><p>{order.technical.qc}</p></div>
            <div className="review-claim warning"><span>GIỚI HẠN DỮ LIỆU</span><p>{order.technical.conditionBefore}</p></div>

            <div className="review-section-title"><span>03</span><div><b>Ảnh bằng chứng lõi</b><small>6 vai trò · đúng Case ID</small></div></div>
            <div className="review-media">
              {draft.media.filter((asset) => asset.required).map((asset) => (
                <figure key={asset.id}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={asset.url} alt={asset.alt} />
                  <figcaption><b>{asset.label}</b><span>✓ {asset.caseId}</span></figcaption>
                </figure>
              ))}
            </div>
          </section>

          <aside>
            <div className="review-gate"><span>{gate.gates.source && gate.gates.content && gate.gates.evidence && gate.gates.seo ? "✓" : "!"}</span><div><b>4 gate trước kỹ thuật đã đạt</b><small>Nguồn · content · media · SEO</small></div></div>
            <div className="review-owner"><span>REVIEWER ĐƯỢC PHÂN CÔNG</span><b>{order.reviewer.name}</b><small>Người khác không thể duyệt qua API.</small></div>
            <label className="review-note"><span>Ghi chú duyệt / yêu cầu sửa</span><textarea rows={5} value={note} onChange={(event) => setNote(event.target.value)} placeholder="Chỉ ghi phần kỹ thuật cần điều chỉnh..." /></label>
            <button className="review-return" type="button" disabled={draft.workflowStatus !== "in_review"} onClick={() => decide("changes_requested")}>Yêu cầu content sửa</button>
            <button className="review-approve" type="button" disabled={draft.workflowStatus !== "in_review"} onClick={() => decide("approved")}>{draft.workflowStatus === "publishable" ? "✓ Đã duyệt · Sẵn sàng xuất bản" : "Duyệt kỹ thuật revision này"}</button>
            <p>Production ghi actor, revision digest, quyết định và thời gian vào audit log; client không gửi được `technicalApproved=true`.</p>
          </aside>
        </div>
      </section>
    </main>
  );
}

function factLabel(value: "yes" | "no" | "unknown") {
  return value === "yes" ? "Có" : value === "no" ? "Không" : "Chưa xác nhận";
}
