import Link from "next/link";

const guides = [
  ["01", "Chuẩn bị case trước khi viết", "Kiểm tra nguồn, ảnh nghiệm thu và revision đang làm việc trước khi gửi review.", "/workspace/cases"],
  ["02", "Review feedback theo revision", "Mỗi phản hồi gắn với revision để Content, OA/SEO Lead và IT cùng theo dõi một ngữ cảnh.", "/workspace/review"],
  ["03", "Theo dõi SLA và khối lượng", "Dùng báo cáo vận hành để phát hiện case quá hạn hoặc hàng chờ tăng bất thường.", "/workspace/reports"],
  ["04", "Xử lý thông báo", "Đọc và đánh dấu thông báo sau khi đã xử lý để không bỏ sót phản hồi mới.", "/workspace/notifications"],
] as const;

export default function GuidesPage() {
  return <main className="workspace-page"><section className="workspace-shell workspace-list-page">
    <Link className="workspace-back" href="/workspace">← Tổng quan</Link>
    <div className="workspace-heading"><div><p className="workspace-eyebrow">Case Lab · tài liệu nội bộ</p><h1>Kho hướng dẫn</h1><p>Các quy tắc ngắn để vận hành luồng bài viết, review và báo cáo trong Case Lab.</p></div></div>
    <div className="workspace-guide-grid">{guides.map(([number, title, description, href]) => <Link className="workspace-guide" key={number} href={href}><span>{number}</span><div><h2>{title}</h2><p>{description}</p></div><b aria-hidden="true">→</b></Link>)}</div>
  </section></main>;
}
