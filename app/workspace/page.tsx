"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type Dashboard = {
  summary: { totalCases: number; assignedToMe: number; openFeedback: number; unreadNotifications: number };
  cases: Array<{ id: string; caseCode: string; branchRef: string; workflowStatus: string; currentRevision: number; updatedAt: string }>;
  activity: Array<{ id: string; action: string; caseId: string | null; createdAt: string }>;
};

type Profile = { displayName: string };

type ApiError = { error?: { code?: string; message?: string; requestId?: string } };

const statusLabels: Record<string, string> = {
  draft: "Bản nháp",
  ready_for_review: "Chờ review",
  in_review: "Đang review",
  changes_requested: "Cần chỉnh sửa",
  technical_approved: "Đã qua IT",
  publishable: "Sẵn sàng xuất bản",
  published: "Đã xuất bản",
};

function formatDate(value: string): string {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "Chưa có thời gian" : new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit",
  }).format(date);
}

function Icon({ name }: { name: "grid" | "arrow" | "bell" | "refresh" }) {
  const paths = {
    grid: <><rect x="4" y="4" width="6" height="6" rx="1" /><rect x="14" y="4" width="6" height="6" rx="1" /><rect x="4" y="14" width="6" height="6" rx="1" /><rect x="14" y="14" width="6" height="6" rx="1" /></>,
    arrow: <><path d="M5 12h14" /><path d="m13 6 6 6-6 6" /></>,
    bell: <><path d="M18 9a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" /><path d="M10 22h4" /></>,
    refresh: <><path d="M20 11a8 8 0 0 0-14.9-3L3 10" /><path d="M3 4v6h6" /><path d="M4 13a8 8 0 0 0 14.9 3L21 14" /><path d="M21 20v-6h-6" /></>,
  };
  return <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">{paths[name]}</svg>;
}

export default function WorkspacePage() {
  const [dashboard, setDashboard] = useState<Dashboard | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const [dashboardResponse, profileResponse] = await Promise.all([fetch("/api/v1/case-lab/dashboard"), fetch("/api/v1/case-lab/me")]);
      if (!dashboardResponse.ok || !profileResponse.ok) {
        const body = await (dashboardResponse.ok ? profileResponse : dashboardResponse).json().catch(() => ({})) as ApiError;
        setError(body.error?.code === "UNAUTHENTICATED" ? "SESSION_REQUIRED" : body.error?.message ?? "Không thể tải dữ liệu vận hành. Hãy thử lại.");
        return;
      }
      setDashboard(await dashboardResponse.json() as Dashboard);
      setProfile(await profileResponse.json() as Profile);
    } catch {
        setError("Không thể kết nối tới Case Lab. Hãy kiểm tra phiên đăng nhập rồi thử lại.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const task = window.setTimeout(() => { void load(); }, 0);
    return () => window.clearTimeout(task);
  }, []);

  const metrics = useMemo(() => [
    ["Tổng case", dashboard?.summary.totalCases],
    ["Được giao cho tôi", dashboard?.summary.assignedToMe],
    ["Feedback đang mở", dashboard?.summary.openFeedback],
    ["Thông báo chưa đọc", dashboard?.summary.unreadNotifications],
  ], [dashboard]);

  return (
    <main className="workspace-page">
      <header className="workspace-topbar">
        <Link className="workspace-brand" href="/workspace" aria-label="Case Lab Workspace">
          <span>365</span><b>CASE LAB</b>
        </Link>
        <nav aria-label="Điều hướng workspace">
          <Link className="is-active" href="/workspace"><Icon name="grid" />Tổng quan</Link>
          <Link href="/workspace/cases">Case / bài viết</Link>
          <Link href="/workspace/review">Review</Link>
          <Link href="/workspace/reports">Báo cáo</Link>
        </nav>
        <div className="workspace-profile"><Link className="workspace-notification-link" href="/workspace/notifications" aria-label={`Thông báo chưa đọc: ${dashboard?.summary.unreadNotifications ?? 0}`}><Icon name="bell" />{dashboard?.summary.unreadNotifications ? <b>{dashboard.summary.unreadNotifications}</b> : null}</Link><span>{profile?.displayName ?? "Tài khoản"}</span></div>
      </header>

      <section className="workspace-shell" aria-labelledby="workspace-title">
        <div className="workspace-heading">
          <div>
            <p className="workspace-eyebrow">Vận hành nội dung · dữ liệu thật</p>
            <h1 id="workspace-title">Case Lab Workspace</h1>
            <p>Dữ liệu vận hành theo thời gian thực, phân theo quyền và chi nhánh của bạn.</p>
          </div>
          <button className="workspace-refresh" type="button" onClick={() => void load()} disabled={loading}>
            <Icon name="refresh" />{loading ? "Đang tải" : "Làm mới"}
          </button>
        </div>

        {error ? <div className="workspace-alert" role="alert"><b>{error === "SESSION_REQUIRED" ? "Phiên đăng nhập chưa sẵn sàng" : "Không thể tải workspace"}</b><span>{error === "SESSION_REQUIRED" ? "Đăng nhập để xem số liệu và các case theo quyền tài khoản." : error}</span>{error === "SESSION_REQUIRED" ? <Link className="workspace-alert__link" href="/login?return_to=/workspace">Đăng nhập Case Lab →</Link> : null}</div> : null}

        <section className="workspace-metrics" aria-label="Tóm tắt vận hành">
          {metrics.map(([label, value]) => <article key={label as string} className="workspace-metric">
            <p>{label}</p><strong>{loading ? "—" : value}</strong><span>{loading ? "Đang tải dữ liệu vận hành" : "Cập nhật từ Case Lab"}</span>
          </article>)}
        </section>

        <section className="workspace-grid">
          <article className="workspace-card workspace-card--cases">
            <header><div><p className="workspace-eyebrow">Ưu tiên hiện tại</p><h2>Case theo dõi</h2></div><Link href="/workspace/cases">Xem tất cả <Icon name="arrow" /></Link></header>
            {loading ? <p className="workspace-loading">Đang tải dữ liệu vận hành…</p> : null}
            {!loading && !error && dashboard?.cases.length === 0 ? <p className="workspace-empty">Chưa có case nào trong phạm vi quyền hiện tại.</p> : null}
            {!loading && dashboard?.cases.length ? <div className="workspace-table" role="table" aria-label="Danh sách case">
              <div className="workspace-table__head" role="row"><span>Case</span><span>Trạng thái</span><span>Cập nhật</span></div>
              {dashboard.cases.map((item) => <Link href={`/workspace/cases/${encodeURIComponent(item.id)}`} className="workspace-row" role="row" key={item.id}>
                <span><b>{item.caseCode}</b><small>{item.branchRef} · Revision {item.currentRevision}</small></span><span><i className={`status status--${item.workflowStatus}`} />{statusLabels[item.workflowStatus] ?? item.workflowStatus}</span><span>{formatDate(item.updatedAt)}<Icon name="arrow" /></span>
              </Link>)}
            </div> : null}
          </article>

          <aside className="workspace-card workspace-card--activity">
            <header><div><p className="workspace-eyebrow">Theo revision</p><h2>Lịch sử của bạn</h2></div></header>
            {loading ? <p className="workspace-loading">Đang tải dữ liệu vận hành…</p> : null}
            {!loading && !error && dashboard?.activity.length === 0 ? <p className="workspace-empty">Chưa có thao tác nào được ghi nhận.</p> : null}
            {!loading && dashboard?.activity.length ? <ol className="workspace-activity">{dashboard.activity.map((item) => <li key={item.id}><i /><div><b>{item.action.replaceAll(".", " · ")}</b><span>{item.caseId ?? "Tài khoản"} · {formatDate(item.createdAt)}</span></div></li>)}</ol> : null}
          </aside>
        </section>

        <section className="workspace-grid workspace-grid--secondary">
          <article className="workspace-card workspace-card--guide">
            <header><div><p className="workspace-eyebrow">Quy trình dùng thật</p><h2>Bắt đầu đúng luồng</h2></div><Link href="/workspace/guides">Kho hướng dẫn <Icon name="arrow" /></Link></header>
            <ol className="workspace-steps"><li><b>01</b><div><strong>Tạo và kiểm tra case</strong><span>Kiểm tra nguồn, chi nhánh và revision đang thực hiện.</span></div></li><li><b>02</b><div><strong>Gửi review theo revision</strong><span>Content, OA/SEO Lead và IT cùng để lại feedback có ngữ cảnh.</span></div></li><li><b>03</b><div><strong>Theo dõi và chốt xuất bản</strong><span>Dùng báo cáo và thông báo để không bỏ sót case đang chờ.</span></div></li></ol>
          </article>
          <article className="workspace-card workspace-card--attention">
            <header><div><p className="workspace-eyebrow">Cần chú ý</p><h2>Việc cần xử lý</h2></div><Link href="/workspace/review">Mở review <Icon name="arrow" /></Link></header>
            <div className="workspace-attention"><div><span>Feedback đang mở</span><b>{loading ? "—" : dashboard?.summary.openFeedback}</b><p>Phản hồi chưa được xử lý trong các case bạn có quyền.</p></div><div><span>Thông báo chưa đọc</span><b>{loading ? "—" : dashboard?.summary.unreadNotifications}</b><p>Nhắc việc, phân công và feedback mới dành cho tài khoản của bạn.</p></div></div>
          </article>
        </section>
      </section>
    </main>
  );
}
