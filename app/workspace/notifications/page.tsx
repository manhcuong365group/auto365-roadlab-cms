"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type NotificationItem = { id: string; type: string; title: string; body: string; caseId: string | null; readAt: string | null; createdAt: string };
type ApiError = { error?: { code?: string; message?: string } };
const dateFormatter = new Intl.DateTimeFormat("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" });

export default function NotificationsPage() {
  const [items, setItems] = useState<NotificationItem[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState("");

  useEffect(() => {
    fetch("/api/v1/case-lab/notifications").then(async (response) => {
      if (!response.ok) { const body = await response.json().catch(() => ({})) as ApiError; throw new Error(body.error?.code === "UNAUTHENTICATED" ? "SESSION_REQUIRED" : body.error?.message ?? "Không thể tải thông báo."); }
      return response.json() as Promise<{ items: NotificationItem[] }>;
    }).then((body) => setItems(body.items)).catch((reason: Error) => setError(reason.message)).finally(() => setLoading(false));
  }, []);

  async function markRead(id: string) {
    setSavingId(id);
    try {
      const response = await fetch(`/api/v1/case-lab/notifications/${encodeURIComponent(id)}/read`, { method: "POST" });
      if (!response.ok) throw new Error("Không thể cập nhật thông báo.");
      const result = await response.json() as { readAt: string };
      setItems((current) => current.map((item) => item.id === id ? { ...item, readAt: result.readAt } : item));
    } catch (reason) { setError(reason instanceof Error ? reason.message : "Không thể cập nhật thông báo."); } finally { setSavingId(""); }
  }

  const unreadCount = items.filter((item) => !item.readAt).length;
  return <section className="workspace-shell workspace-list-page">
    <Link className="workspace-back" href="/workspace">← Tổng quan</Link>
    <div className="workspace-heading"><div><p className="workspace-eyebrow">Case Lab · cá nhân</p><h1>Thông báo</h1><p>Feedback, phân công và hoạt động mới trong phạm vi case bạn có quyền truy cập.</p></div><div className="workspace-heading__count"><span>Chưa đọc</span><b>{unreadCount}</b></div></div>
    {error ? <div className="workspace-alert" role="alert">{error === "SESSION_REQUIRED" ? <><b>Phiên đăng nhập chưa sẵn sàng</b><span>Đăng nhập để xem thông báo cá nhân.</span><Link className="workspace-alert__link" href="/login?return_to=/workspace/notifications">Đăng nhập Case Lab →</Link></> : error}</div> : null}
    {loading ? <p className="workspace-loading">Đang tải thông báo…</p> : null}
    {!loading && !error && items.length === 0 ? <div className="workspace-empty workspace-empty--card"><b>Chưa có thông báo mới.</b><span>Thông báo sẽ xuất hiện khi có feedback hoặc phân công liên quan đến bạn.</span></div> : null}
    {!loading && !error && items.length > 0 ? <div className="workspace-notification-list">{items.map((item) => <article className={`workspace-notification${item.readAt ? " is-read" : ""}`} key={item.id}><i aria-label={item.readAt ? "Đã đọc" : "Chưa đọc"} /><div><div className="workspace-notification__title"><h2>{item.title}</h2><time dateTime={item.createdAt}>{dateFormatter.format(new Date(item.createdAt))}</time></div><p>{item.body}</p><div className="workspace-notification__actions">{item.caseId ? <Link href={`/workspace/cases/${encodeURIComponent(item.caseId)}`}>Mở case →</Link> : null}{!item.readAt ? <button type="button" onClick={() => markRead(item.id)} disabled={savingId === item.id}>{savingId === item.id ? "Đang lưu…" : "Đánh dấu đã đọc"}</button> : <span>Đã đọc</span>}</div></div></article>)}</div> : null}
  </section>;
}
