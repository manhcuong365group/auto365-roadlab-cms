import Link from "next/link";

export default function ReportsPage() {
  return <main className="workspace-page"><section className="workspace-shell workspace-list-page"><Link className="workspace-back" href="/workspace">← Tổng quan</Link><p className="workspace-eyebrow">Case Lab · vận hành</p><h1>Báo cáo</h1><p>Báo cáo SLA, feedback và tiến độ review sẽ hiển thị theo quyền tài khoản.</p><div className="workspace-card workspace-card--notice"><b>Đang kết nối dữ liệu vận hành</b><span>API báo cáo đã sẵn sàng tại <code>/api/v1/case-lab/reports/operations</code>.</span></div></section></main>;
}
