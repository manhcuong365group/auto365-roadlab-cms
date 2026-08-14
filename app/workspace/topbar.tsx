"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const links = [
  ["Tổng quan", "/workspace"],
  ["Case / bài viết", "/workspace/cases"],
  ["Review", "/workspace/review"],
  ["Báo cáo", "/workspace/reports"],
] as const;

type Profile = { displayName: string };
type DashboardSummary = { summary: { unreadNotifications: number } };

function Icon({ name }: { name: "bell" }) {
  return <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M18 9a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" /><path d="M10 22h4" /></svg>;
}

export default function WorkspaceTopbar() {
  const pathname = usePathname();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    fetch("/api/v1/case-lab/me").then((response) => response.ok ? response.json() as Promise<Profile> : null).then(setProfile).catch(() => setProfile(null));
    fetch("/api/v1/case-lab/dashboard").then((response) => response.ok ? response.json() as Promise<DashboardSummary> : null).then((body) => setUnreadCount(body?.summary.unreadNotifications ?? 0)).catch(() => setUnreadCount(0));
  }, []);

  return (
    <header className="workspace-topbar">
      <Link className="workspace-brand" href="/workspace" aria-label="Case Lab Workspace">
        <span>365</span><b>CASE LAB</b>
      </Link>
      <nav aria-label="Điều hướng workspace">
        {links.map(([label, href]) => {
          const active = href === "/workspace" ? pathname === href : pathname?.startsWith(href);
          return <Link key={href} className={active ? "is-active" : ""} href={href}>{label}</Link>;
        })}
      </nav>
      <div className="workspace-profile">
        <Link className="workspace-notification-link" href="/workspace/notifications" aria-label={`Thông báo chưa đọc: ${unreadCount}`}>
          <Icon name="bell" />{unreadCount ? <b>{unreadCount}</b> : null}
        </Link>
        <span>{profile?.displayName ?? "Tài khoản"}</span>
      </div>
    </header>
  );
}
