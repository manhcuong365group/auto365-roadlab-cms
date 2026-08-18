"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type RevisionSummary = { revision: number; createdAt: string; createdBy: string };
type RevisionDetail = { revision: number; createdAt: string; content: Record<string, unknown> };
type ApiError = { error?: { code?: string; message?: string } };

const dateFormatter = new Intl.DateTimeFormat("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" });

function flatten(value: unknown, prefix = ""): Record<string, string> {
  const out: Record<string, string> = {};
  if (value && typeof value === "object" && !Array.isArray(value)) {
    for (const [key, entryValue] of Object.entries(value as Record<string, unknown>)) {
      const path = prefix ? `${prefix}.${key}` : key;
      if (entryValue && typeof entryValue === "object" && !Array.isArray(entryValue)) {
        Object.assign(out, flatten(entryValue, path));
      } else {
        out[path] = typeof entryValue === "boolean" ? (entryValue ? "true" : "false") : String(entryValue ?? "");
      }
    }
  }
  return out;
}

async function fetchJson<T>(url: string): Promise<T> {
  const response = await fetch(url);
  if (!response.ok) {
    const body = await response.json().catch(() => ({})) as ApiError;
    throw new Error(body.error?.code === "UNAUTHENTICATED" ? "SESSION_REQUIRED" : body.error?.message ?? "Không thể tải dữ liệu.");
  }
  return response.json() as Promise<T>;
}

export default function CaseHistory({ caseId }: { caseId: string }) {
  const [revisions, setRevisions] = useState<RevisionSummary[]>([]);
  const [fromRevision, setFromRevision] = useState<number | null>(null);
  const [toRevision, setToRevision] = useState<number | null>(null);
  const [fromContent, setFromContent] = useState<RevisionDetail | null>(null);
  const [toContent, setToContent] = useState<RevisionDetail | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchJson<{ items: RevisionSummary[] }>(`/api/v1/case-lab/cases/${encodeURIComponent(caseId)}/revisions`)
      .then((body) => {
        setRevisions(body.items);
        if (body.items.length >= 2) { setToRevision(body.items[0].revision); setFromRevision(body.items[1].revision); }
        else if (body.items.length === 1) { setToRevision(body.items[0].revision); setFromRevision(body.items[0].revision); }
      })
      .catch((reason: Error) => setError(reason.message))
      .finally(() => setLoading(false));
  }, [caseId]);

  useEffect(() => {
    if (fromRevision === null || toRevision === null) return;
    setFromContent(null); setToContent(null);
    Promise.all([
      fetchJson<RevisionDetail>(`/api/v1/case-lab/cases/${encodeURIComponent(caseId)}/revisions/${fromRevision}`),
      fetchJson<RevisionDetail>(`/api/v1/case-lab/cases/${encodeURIComponent(caseId)}/revisions/${toRevision}`),
    ]).then(([from, to]) => { setFromContent(from); setToContent(to); }).catch((reason: Error) => setError(reason.message));
  }, [caseId, fromRevision, toRevision]);

  const diffRows = useMemo(() => {
    if (!fromContent || !toContent) return [];
    const before = flatten(fromContent.content);
    const after = flatten(toContent.content);
    const paths = [...new Set([...Object.keys(before), ...Object.keys(after)])].sort();
    return paths
      .map((path) => ({ path, before: before[path] ?? "", after: after[path] ?? "" }))
      .filter((row) => row.before !== row.after);
  }, [fromContent, toContent]);

  return <section className="workspace-shell workspace-case-page">
    <Link className="workspace-back" href={`/workspace/cases/${encodeURIComponent(caseId)}`}>← Quay lại soạn bài</Link>
    <div className="workspace-heading"><div><p className="workspace-eyebrow">Case Lab · lịch sử</p><h1>Lịch sử revision</h1><p>So sánh nội dung giữa 2 revision — chỉ hiện các trường đã thay đổi.</p></div></div>
    {error ? <div className="workspace-alert" role="alert">{error === "SESSION_REQUIRED" ? <><b>Phiên đăng nhập chưa sẵn sàng</b><span>Đăng nhập để xem lịch sử case.</span><Link className="workspace-alert__link" href={`/login?return_to=/workspace/cases/${encodeURIComponent(caseId)}/history`}>Đăng nhập Case Lab →</Link></> : error}</div> : null}
    {loading ? <p className="workspace-loading">Đang tải lịch sử revision…</p> : null}

    {!loading && !error && revisions.length ? <>
      <div className="workspace-list-controls">
        <label><span>So sánh từ (cũ hơn)</span><select value={fromRevision ?? ""} onChange={(event) => setFromRevision(Number(event.target.value))}>{revisions.map((item) => <option key={item.revision} value={item.revision}>r{item.revision} · {item.createdBy} · {dateFormatter.format(new Date(item.createdAt))}</option>)}</select></label>
        <label><span>Đến (mới hơn)</span><select value={toRevision ?? ""} onChange={(event) => setToRevision(Number(event.target.value))}>{revisions.map((item) => <option key={item.revision} value={item.revision}>r{item.revision} · {item.createdBy} · {dateFormatter.format(new Date(item.createdAt))}</option>)}</select></label>
      </div>

      {fromContent && toContent ? (
        diffRows.length ? <div className="workspace-table workspace-table--full workspace-table--diff" role="table" aria-label="Khác biệt giữa 2 revision">
          <div className="workspace-table__head" role="row"><span>Trường</span><span>r{fromRevision}</span><span>r{toRevision}</span></div>
          {diffRows.map((row) => <div className="workspace-row workspace-diff-row" role="row" key={row.path}>
            <span><b>{row.path}</b></span>
            <span className="workspace-diff-before">{row.before || <em>— trống —</em>}</span>
            <span className="workspace-diff-after">{row.after || <em>— trống —</em>}</span>
          </div>)}
        </div> : <div className="workspace-empty workspace-empty--card"><b>Không có thay đổi giữa 2 revision này.</b></div>
      ) : <p className="workspace-loading">Đang tải nội dung để so sánh…</p>}
    </> : null}
    {!loading && !error && !revisions.length ? <div className="workspace-empty workspace-empty--card"><b>Case chưa có revision nào.</b></div> : null}
  </section>;
}
