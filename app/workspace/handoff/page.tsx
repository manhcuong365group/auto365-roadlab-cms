import Link from "next/link";

const flow = [
  ["01", "Tạo case", "Content"],
  ["02", "Soạn nội dung + ảnh", "Content"],
  ["03", "Gửi duyệt", "Content"],
  ["04", "Duyệt kỹ thuật", "IT"],
  ["05", "Duyệt SEO", "SEO Lead"],
  ["06", "Xuất bản", "OA / Sếp"],
  ["07", "Lên bài thật", "auto365.vn"],
] as const;

const features: Array<[string, string, string?]> = [
  ["4 layout bài viết riêng biệt", "Road Lab, Proof Lab, Brand Story, Product Spotlight — mỗi loại một bố cục khác nhau thật sự, khung ngoài khớp brand auto365.vn.", "/tin-tuc/review-auto365-demo-11"],
  ["Upload ảnh thật", "Tải ảnh từ máy lên thẳng trong lúc soạn bài (tối đa 15MB), không cần host ảnh ở nơi khác."],
  ["Tạo case mới trong app", "Không cần can thiệp database — content tự tạo case, chọn loại bài, chi nhánh, xe/sản phẩm."],
  ["Quy trình duyệt nhiều vai trò", "Gửi duyệt → IT duyệt kỹ thuật → SEO Lead duyệt → OA/Sếp xuất bản. Sai vai trò bị chặn đúng."],
  ["Huỷ / khôi phục case", "Huỷ case đang xuất bản → bài công khai gỡ ngay lập tức. Khôi phục lại được, không mất dữ liệu."],
  ["Quản lý tài khoản", "Sếp tạo tài khoản thật cho nhân sự, đổi vai trò, khoá tài khoản, đặt lại mật khẩu."],
  ["Đổi mật khẩu", "Mỗi người tự đổi mật khẩu sau khi nhận tài khoản, không cần nhờ ai."],
  ["Thông báo trong app", "Người duyệt tiếp theo (IT/SEO/OA) nhận thông báo ngay khi tới lượt mình xử lý."],
  ["Lịch sử & so sánh revision", "Xem mọi bản chỉnh sửa trước đây, so sánh 2 bản để biết chính xác chỗ nào đã đổi."],
  ["Xem trước trước khi xuất bản", "Xem đúng như bài thật sẽ hiển thị, trước khi gửi duyệt hay xuất bản."],
];

const accounts = [
  ["Sếp", "boss@auto365.test", "Toàn quyền — tạo tài khoản, duyệt mọi bước, xuất bản"],
  ["Content", "content@auto365.test", "Tạo case, soạn bài, upload ảnh, gửi duyệt"],
  ["IT", "it@auto365.test", "Duyệt kỹ thuật"],
  ["SEO Lead", "seo-lead@auto365.test", "Duyệt SEO"],
  ["OA", "oa@auto365.test", "Xuất bản bài"],
] as const;

const gaps: Array<[string, string, string]> = [
  ["Cần thêm", "Thông báo Zalo / email", "Hiện chỉ thông báo trong app. Muốn báo qua Zalo hoặc email cần Sếp cung cấp API Zalo OA hoặc dịch vụ gửi email — chưa có sẵn để tự làm."],
  ["Cân nhắc", "Nén ảnh phía server", "Ảnh lưu nguyên dung lượng (tối đa 15MB/ảnh). Tự động nén cần dịch vụ trả phí của Cloudflare hoặc thêm thư viện riêng."],
  ["Không cần", "Sitemap / trang mục lục công khai", "Bỏ qua theo yêu cầu — bài xuất bản cuối cùng nằm trên auto365.vn thật, SEO xử lý ở đó."],
];

const decisions = [
  "Duyệt cho phép tạo tài khoản thật cho nhân sự content (cần tên + email từng người).",
  "Xác nhận ai giữ vai trò IT / SEO Lead / OA trong quy trình duyệt — có thể là người đang làm việc đó ngoài đời, hoặc gộp vào 1 người tạm thời.",
  "Quyết định có cần thông báo Zalo/email ngay bây giờ, hay dùng thông báo trong app trước rồi bổ sung sau.",
];

export default function HandoffPage() {
  return <section className="workspace-shell workspace-list-page">
    <Link className="workspace-back" href="/workspace">← Tổng quan</Link>
    <div className="workspace-heading">
      <div>
        <p className="workspace-eyebrow">Case Lab · báo cáo bàn giao</p>
        <h1>Case Lab CMS đã sẵn sàng để Sếp duyệt</h1>
        <p>Toàn bộ tính năng bên dưới đã được gọi thật lên server production để kiểm chứng, không chỉ đọc code.</p>
      </div>
      <span className="workspace-status-pill workspace-status-pill--published">Sẵn sàng đưa content thật vào dùng</span>
    </div>

    <div className="workspace-card handoff-section">
      <h2>Vòng vận hành — 7 bước</h2>
      <div className="workspace-flow">
        {flow.map(([number, label, who]) => <div className="workspace-flow-step" key={number}>
          <span className="workspace-flow-step__num">{number}</span>
          <b>{label}</b>
          <small>{who}</small>
        </div>)}
      </div>
    </div>

    <div className="workspace-card handoff-section">
      <h2>Đã build &amp; test thật</h2>
      <div className="handoff-feature-grid">
        {features.map(([title, description, href]) => <div className="handoff-feature" key={title}>
          <div className="handoff-feature__head"><h3>{title}</h3><span className="handoff-tested">✓ đã test</span></div>
          <p>{description}</p>
          {href ? <Link href={href} target="_blank" rel="noreferrer">Xem ví dụ →</Link> : null}
        </div>)}
      </div>
    </div>

    <div className="workspace-card handoff-section">
      <h2>Thử ngay</h2>
      <p className="workspace-editor-note">Tài khoản demo để tự trải nghiệm — mật khẩu chung: <code>CaseLab-2026!</code></p>
      <div className="workspace-table workspace-table--full workspace-table--handoff" role="table" aria-label="Tài khoản demo">
        <div className="workspace-table__head" role="row"><span>Vai trò</span><span>Email</span><span>Làm được gì</span></div>
        {accounts.map(([role, email, does]) => <div className="workspace-row" role="row" key={email}>
          <span><b>{role}</b></span><span><code>{email}</code></span><span>{does}</span>
        </div>)}
      </div>
    </div>

    <div className="workspace-card handoff-section">
      <h2>Thành thật — giới hạn hiện tại</h2>
      <div className="handoff-gap-list">
        {gaps.map(([badge, title, description]) => <div className="handoff-gap-item" key={title}>
          <span className={`handoff-gap-badge handoff-gap-badge--${badge === "Không cần" ? "ok" : "need"}`}>{badge}</span>
          <div><b>{title}</b><p>{description}</p></div>
        </div>)}
      </div>
    </div>

    <div className="workspace-card handoff-section handoff-decision">
      <h2>Cần Sếp quyết định</h2>
      <ul className="handoff-decision-list">
        {decisions.map((item) => <li key={item}><span className="handoff-decision-box" />{item}</li>)}
      </ul>
    </div>
  </section>;
}
