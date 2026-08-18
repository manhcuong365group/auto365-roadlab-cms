"use client";

import Link from "next/link";
import { useState } from "react";

export default function AccountPage() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  async function submit() {
    setSaving(true); setError(""); setNotice("");
    try {
      if (newPassword !== confirmPassword) throw new Error("Mật khẩu mới nhập lại không khớp.");
      const response = await fetch("/api/v1/case-lab/me/password", {
        method: "POST", headers: { "content-type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const body = await response.json().catch(() => ({})) as { ok?: boolean; error?: { message?: string } };
      if (!response.ok || !body.ok) throw new Error(body.error?.message ?? "Không thể đổi mật khẩu.");
      setNotice("Đã đổi mật khẩu thành công.");
      setCurrentPassword(""); setNewPassword(""); setConfirmPassword("");
    } catch (reason) { setError(reason instanceof Error ? reason.message : "Không thể đổi mật khẩu."); }
    finally { setSaving(false); }
  }

  return <section className="workspace-shell workspace-list-page">
    <Link className="workspace-back" href="/workspace">← Tổng quan</Link>
    <div className="workspace-heading"><div><p className="workspace-eyebrow">Case Lab · tài khoản</p><h1>Đổi mật khẩu</h1><p>Đổi mật khẩu đăng nhập của chính bạn.</p></div></div>
    {notice ? <div className="workspace-notice">{notice}</div> : null}
    {error ? <div className="workspace-alert" role="alert">{error}</div> : null}
    <div className="workspace-card workspace-new-case">
      <div className="workspace-field-grid">
        <label className="workspace-field workspace-field--wide"><span>Mật khẩu hiện tại</span><input type="password" value={currentPassword} onChange={(event) => setCurrentPassword(event.target.value)} /></label>
        <label className="workspace-field"><span>Mật khẩu mới</span><input type="password" value={newPassword} onChange={(event) => setNewPassword(event.target.value)} placeholder="Tối thiểu 8 ký tự" /></label>
        <label className="workspace-field"><span>Nhập lại mật khẩu mới</span><input type="password" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} /></label>
      </div>
      <button type="button" className="workspace-button" disabled={saving || !currentPassword || newPassword.length < 8} onClick={submit}>{saving ? "Đang lưu…" : "Đổi mật khẩu"}</button>
    </div>
  </section>;
}
