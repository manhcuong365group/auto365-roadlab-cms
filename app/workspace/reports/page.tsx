"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type Report = { generatedAt: string; scope: string[]; byWorkflowStatus: Record<string, number>; summary: { totalCases: number; assignedToMe: number; openFeedback: number; unreadNotifications: number } };
type ApiError = { error?: { code?: string; message?: string } };
const labels: Record<string, string> = { draft: "Bản nháp", ready_for_review: "Chờ review", in_review: "Đang review", changes_requested: "Cần chỉnh sửa", technical_approved: "Đã qua IT", publishable: "Sẵn sàng xuất bản", published: "Đã xuất bản", archived: "Đã lưu trữ" };
const formatter = new Intl.DateTimeFormat("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" });

export default function ReportsPage() {
  const [report, setReport] = useState<Report | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  useEffect(() => { fetch("/api/v1/case-lab/reports/operations").then(async (response) => { if (!response.ok) { const body = await response.json().catch(() => ({})) as ApiError; throw new Error(body.error?.code === "UNAUTHENTICATED" ? "SESSION_REQUIRED" : body.error?.message ?? "Không thể tải báo cáo."); } return response.json() as Promise<Report>; }).then(setReport).catch((reason: Error) => setError(reason.message)).finally(() => setLoading(false)); }, []);
  const statuses = useMemo(() => Object.entries(report?.byWorkflowStatus ?? {}).sort(([, a], [, b]) => b - a), [report]);
  const max = Math.max(1, ...statuses.map(([, value]) => value));
  return <section className="workspace-shell workspace-list-page"><Link className="workspace-back" href="/workspace">← Tổng quan</Link><div className="workspace-heading"><div><p className="workspace-eyebrow">Case Lab · vận hành</p><h1>Báo cáo</h1><p>Tổng hợp tiến độ case, feedback và khối lượng xử lý trong phạm vi quyền hiện tại.</p></div>{report ? <time className="workspace-report-time" dateTime={report.generatedAt}>Cập nhật {formatter.format(new Date(report.generatedAt))}</time> : null}</div>{error ? <div className="workspace-alert" role="alert">{error === "SESSION_REQUIRED" ? <><b>Phiên đăng nhập chưa sẵn sàng</b><span>Đăng nhập để xem báo cáo vận hành.</span><Link className="workspace-alert__link" href="/login?return_to=/workspace/reports">Đăng nhập Case Lab →</Link></> : error}</div> : null}{loading ? <p className="workspace-loading">Đang tổng hợp dữ liệu vận hành…</p> : null}{!loading && !error && report ? <><div className="workspace-list-summary workspace-list-summary--four"><div><span>Tổng case</span><b>{report.summary.totalCases}</b></div><div><span>Được giao</span><b>{report.summary.assignedToMe}</b></div><div><span>Feedback mở</span><b>{report.summary.openFeedback}</b></div><div><span>Thông báo chưa đọc</span><b>{report.summary.unreadNotifications}</b></div></div><article className="workspace-card workspace-report-card"><header><div><p className="workspace-eyebrow">Theo workflow</p><h2>Phân bổ trạng thái case</h2></div><span>{report.scope.join(", ") === "*" ? "Toàn bộ chi nhánh" : report.scope.join(", ")}</span></header>{statuses.length ? <div className="workspace-report-bars">{statuses.map(([status, count]) => <div key={status}><div><b>{labels[status] ?? status}</b><span>{count} case</span></div><i><em style={{ width: `${Math.max(8, count / max * 100)}%` }} /></i></div>)}</div> : <p className="workspace-empty">Chưa có case để tổng hợp.</p>}</article></> : null}</section>;
}
