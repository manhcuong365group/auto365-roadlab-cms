"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type Activity = { id: string; action: string; caseId: string | null; createdAt: string };

export default function CaseActivityPage() {
  const [items, setItems] = useState<Activity[]>([]);
  useEffect(() => { fetch("/api/v1/case-lab/dashboard").then((r) => r.json()).then((body: { activity?: Activity[] }) => setItems(body.activity ?? [])); }, []);
  return <section className="workspace-shell workspace-list-page"><Link className="workspace-back" href="/workspace">← Tổng quan</Link><p className="workspace-eyebrow">Case Lab · audit</p><h1>Lịch sử thao tác</h1><p>Audit trail theo tài khoản và revision.</p><ol className="workspace-activity workspace-activity--page">{items.map((item) => <li key={item.id}><i /><div><b>{item.action.replaceAll(".", " · ")}</b><span>{item.caseId ?? "Tài khoản"} · {new Date(item.createdAt).toLocaleString("vi-VN")}</span></div></li>)}</ol></section>;
}
