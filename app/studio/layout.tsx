import type { Metadata } from "next";
import "./studio-v2.css";

export const metadata: Metadata = {
  title: "Auto365 Case Lab Studio V2.0 – Production Zero-Rekey",
  description: "Studio ba bước lấy dữ liệu từ phiếu việc, quản lý 6–8 ảnh đúng vai trò và gửi kỹ thuật duyệt mà content không nhập lại SEO hay dữ liệu hệ thống.",
  robots: { index: false, follow: false },
};

export default function StudioLayout({ children }: { children: React.ReactNode }) {
  return children;
}
