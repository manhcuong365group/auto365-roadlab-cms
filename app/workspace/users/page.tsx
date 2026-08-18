"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

type UserRole = { role: string; branchRef: string };
type UserItem = { id: string; email: string; displayName: string; status: string; createdAt: string; roles: UserRole[] };
type ApiError = { error?: { code?: string; message?: string } };

const roleLabels: Record<string, string> = { content: "Content", oa: "OA", seo_lead: "SEO Lead", it: "IT", boss: "Sếp" };
const roleOptions = Object.entries(roleLabels);
const dateFormatter = new Intl.DateTimeFormat("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" });

function EditUserPanel({ user, onClose, onSaved }: { user: UserItem; onClose: () => void; onSaved: () => void }) {
  const [displayName, setDisplayName] = useState(user.displayName);
  const [status, setStatus] = useState(user.status);
  const [role, setRole] = useState(user.roles[0]?.role ?? "content");
  const [branchRef, setBranchRef] = useState(user.roles[0]?.branchRef ?? "*");
  const [newPassword, setNewPassword] = useState("");
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");

  async function submit() {
    setSaving(true); setSaveError("");
    try {
      const body: Record<string, unknown> = { displayName: displayName.trim(), status, roles: [{ role, branchRef: branchRef.trim() }] };
      if (newPassword.trim()) body.password = newPassword.trim();
      const response = await fetch(`/api/v1/case-lab/users/${encodeURIComponent(user.id)}`, {
        method: "PATCH", headers: { "content-type": "application/json" }, body: JSON.stringify(body),
      });
      const data = await response.json().catch(() => ({})) as { ok?: boolean; error?: { message?: string } };
      if (!response.ok || !data.ok) throw new Error(data.error?.message ?? "Không thể cập nhật tài khoản.");
      onSaved();
    } catch (reason) { setSaveError(reason instanceof Error ? reason.message : "Không thể cập nhật tài khoản."); }
    finally { setSaving(false); }
  }

  return <div className="workspace-card workspace-new-case">
    <div className="workspace-card__head"><h2>Sửa tài khoản · {user.email}</h2><button type="button" className="workspace-button workspace-button--ghost" onClick={onClose}>Đóng</button></div>
    {saveError ? <div className="workspace-alert" role="alert">{saveError}</div> : null}
    <div className="workspace-field-grid">
      <label className="workspace-field"><span>Tên hiển thị</span><input value={displayName} onChange={(event) => setDisplayName(event.target.value)} /></label>
      <label className="workspace-field"><span>Trạng thái</span><select value={status} onChange={(event) => setStatus(event.target.value)}><option value="active">Hoạt động</option><option value="suspended">Tạm khoá</option></select></label>
      <label className="workspace-field"><span>Vai trò</span><select value={role} onChange={(event) => setRole(event.target.value)}>{roleOptions.map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label>
      <label className="workspace-field"><span>Phạm vi chi nhánh</span><input value={branchRef} onChange={(event) => setBranchRef(event.target.value)} /></label>
      <label className="workspace-field workspace-field--wide"><span>Đặt lại mật khẩu (bỏ trống nếu không đổi)</span><input type="text" value={newPassword} onChange={(event) => setNewPassword(event.target.value)} placeholder="Tối thiểu 8 ký tự" /></label>
    </div>
    <button type="button" className="workspace-button" disabled={saving || !displayName.trim() || (newPassword.length > 0 && newPassword.length < 8)} onClick={submit}>{saving ? "Đang lưu…" : "Lưu thay đổi"}</button>
  </div>;
}

export default function UsersPage() {
  const [items, setItems] = useState<UserItem[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("content");
  const [branchRef, setBranchRef] = useState("*");
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState("");
  const [notice, setNotice] = useState("");

  const load = useCallback(async () => {
    setLoading(true); setError("");
    try {
      const response = await fetch("/api/v1/case-lab/users");
      if (!response.ok) {
        const body = await response.json().catch(() => ({})) as ApiError;
        throw new Error(body.error?.code === "UNAUTHENTICATED" ? "SESSION_REQUIRED" : body.error?.message ?? "Không thể tải danh sách người dùng.");
      }
      const body = await response.json() as { items: UserItem[] };
      setItems(body.items);
    } catch (reason) { setError(reason instanceof Error ? reason.message : "Không thể tải danh sách người dùng."); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { void load(); }, [load]);

  async function submit() {
    setCreating(true); setCreateError(""); setNotice("");
    try {
      const response = await fetch("/api/v1/case-lab/users", {
        method: "POST", headers: { "content-type": "application/json" },
        body: JSON.stringify({ email: email.trim(), displayName: displayName.trim(), password, roles: [{ role, branchRef: branchRef.trim() }] }),
      });
      const body = await response.json().catch(() => ({})) as { user?: { email: string }; error?: { message?: string } };
      if (!response.ok || !body.user) throw new Error(body.error?.message ?? "Không thể tạo tài khoản.");
      setNotice(`Đã tạo tài khoản ${body.user.email}.`);
      setEmail(""); setDisplayName(""); setPassword(""); setRole("content"); setBranchRef("*"); setShowForm(false);
      await load();
    } catch (reason) { setCreateError(reason instanceof Error ? reason.message : "Không thể tạo tài khoản."); }
    finally { setCreating(false); }
  }

  const editingUser = items.find((item) => item.id === editingId) ?? null;

  return <section className="workspace-shell workspace-list-page">
    <Link className="workspace-back" href="/workspace">← Tổng quan</Link>
    <div className="workspace-heading"><div><p className="workspace-eyebrow">Case Lab · quản trị</p><h1>Người dùng</h1><p>Chỉ vai trò Sếp mới tạo, sửa và xem được danh sách tài khoản.</p></div>{!showForm ? <button type="button" className="workspace-button" onClick={() => { setShowForm(true); setEditingId(null); }}>+ Tạo tài khoản</button> : null}</div>

    {showForm ? <div className="workspace-card workspace-new-case">
      <div className="workspace-card__head"><h2>Tạo tài khoản mới</h2><button type="button" className="workspace-button workspace-button--ghost" onClick={() => setShowForm(false)}>Đóng</button></div>
      {createError ? <div className="workspace-alert" role="alert">{createError}</div> : null}
      <div className="workspace-field-grid">
        <label className="workspace-field"><span>Email</span><input type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="ten@auto365.vn" /></label>
        <label className="workspace-field"><span>Tên hiển thị</span><input value={displayName} onChange={(event) => setDisplayName(event.target.value)} placeholder="Nguyễn Văn A" /></label>
        <label className="workspace-field"><span>Mật khẩu tạm</span><input type="text" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Tối thiểu 8 ký tự" /></label>
        <label className="workspace-field"><span>Vai trò</span><select value={role} onChange={(event) => setRole(event.target.value)}>{roleOptions.map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label>
        <label className="workspace-field"><span>Phạm vi chi nhánh</span><input value={branchRef} onChange={(event) => setBranchRef(event.target.value)} placeholder="* (toàn hệ thống) hoặc VD: HCM-01" /></label>
      </div>
      <button type="button" className="workspace-button" disabled={creating || !email.trim() || !displayName.trim() || password.length < 8} onClick={submit}>{creating ? "Đang tạo…" : "Tạo tài khoản"}</button>
    </div> : null}

    {editingUser ? <EditUserPanel user={editingUser} onClose={() => setEditingId(null)} onSaved={() => { setEditingId(null); setNotice(`Đã cập nhật tài khoản ${editingUser.email}.`); void load(); }} /> : null}

    {notice ? <div className="workspace-notice">{notice}</div> : null}
    {error ? <div className="workspace-alert" role="alert">{error === "SESSION_REQUIRED" ? <><b>Phiên đăng nhập chưa sẵn sàng</b><span>Đăng nhập để xem danh sách người dùng.</span><Link className="workspace-alert__link" href="/login?return_to=/workspace/users">Đăng nhập Case Lab →</Link></> : error}</div> : null}
    {loading ? <p className="workspace-loading">Đang tải danh sách người dùng…</p> : null}

    {!loading && !error ? <div className="workspace-table workspace-table--full workspace-table--users" role="table" aria-label="Danh sách người dùng">
      <div className="workspace-table__head" role="row"><span>Tài khoản</span><span>Vai trò</span><span>Trạng thái</span><span>Ngày tạo</span><span></span></div>
      {items.map((item) => <div className="workspace-row" role="row" key={item.id}>
        <span><b>{item.displayName}</b><small>{item.email}</small></span>
        <span>{item.roles.map((r) => `${roleLabels[r.role] ?? r.role} · ${r.branchRef}`).join(", ") || "Chưa gán vai trò"}</span>
        <span className="workspace-row__status"><i className={`status status--${item.status === "active" ? "published" : "changes_requested"}`} />{item.status === "active" ? "Hoạt động" : "Tạm khoá"}</span>
        <span>{dateFormatter.format(new Date(item.createdAt))}</span>
        <span><button type="button" className="workspace-text-button" onClick={() => { setEditingId(item.id); setShowForm(false); }}>Sửa</button></span>
      </div>)}
    </div> : null}
  </section>;
}
