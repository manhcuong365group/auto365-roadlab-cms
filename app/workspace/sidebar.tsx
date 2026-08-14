"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const items = [
  ["Tổng quan", "/workspace", "01"],
  ["Case / bài viết", "/workspace/cases", "02"],
  ["Trung tâm review", "/workspace/review", "03"],
  ["Kho hướng dẫn", "/workspace/guides", "04"],
  ["Báo cáo", "/workspace/reports", "05"],
  ["Thông báo", "/workspace/notifications", "06"],
] as const;

export default function WorkspaceSidebar() {
  const pathname = usePathname();
  return <aside className="workspace-sidebar" aria-label="Điều hướng Case Lab">
    <Link className="workspace-sidebar__brand" href="/workspace"><span>365</span><div><b>CASE LAB</b><small>EDITORIAL OPS</small></div></Link>
    <nav className="workspace-sidebar__nav">
      {items.map(([label, href, number]) => {
        const active = href === "/workspace" ? pathname === href : pathname.startsWith(href);
        return <Link className={active ? "is-active" : ""} href={href} key={label}><i>{number}</i><span>{label}</span></Link>;
      })}
    </nav>
    <div className="workspace-sidebar__bottom"><p>KHÔNG GIAN LÀM VIỆC</p><Link href="/workspace/cases">Việc của tôi <b>→</b></Link><Link href="/workspace/review">Được giao <b>→</b></Link><div className="workspace-sidebar__user"><span>MC</span><div><b>Minh Cường</b><small>Content · Pilot tuyến Đen</small></div></div></div>
  </aside>;
}
