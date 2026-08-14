"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useSearchParams } from "next/navigation";

const testAccounts = [
  ["content@auto365.test", "Content"],
  ["oa@auto365.test", "OA"],
  ["seo-lead@auto365.test", "SEO Lead"],
  ["it@auto365.test", "IT"],
  ["boss@auto365.test", "Sếp"],
];

export default function LoginPage() {
  const params = useSearchParams();
  const requested = params.get("return_to") ?? "/workspace";
  const returnTo = requested.startsWith("/") && !requested.startsWith("//") ? requested : "/workspace";
  const [email, setEmail] = useState("content@auto365.test");
  const [password, setPassword] = useState("Auto365-Content-2026!");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setLoading(true); setError("");
    try {
      const response = await fetch("/api/auth/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email, password }) });
      const body = await response.json().catch(() => ({}));
      if (!response.ok) { setError(body.error?.message ?? "Đăng nhập không thành công."); return; }
      window.location.assign(returnTo);
    } catch { setError("Không thể kết nối tới Case Lab."); }
    finally { setLoading(false); }
  }

  return <main className="case-login"><section className="case-login__card">
    <Link className="case-login__brand" href="/">365 <span>CASE LAB</span></Link>
    <p className="workspace-eyebrow">Workspace vận hành</p><h1>Đăng nhập Case Lab</h1>
    <p className="case-login__intro">Đăng nhập để xem case, review feedback và lịch sử thao tác theo quyền tài khoản.</p>
    <form onSubmit={submit} className="case-login__form">
      <label>Email<input type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="username" required /></label>
      <label>Mật khẩu<input type="password" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" required /></label>
      {error ? <p className="case-login__error" role="alert">{error}</p> : null}
      <button type="submit" disabled={loading}>{loading ? "Đang đăng nhập…" : "Đăng nhập"}</button>
    </form>
    <div className="case-login__accounts"><b>Tài khoản test nhanh</b>{testAccounts.map(([account, role]) => <button type="button" key={account} onClick={() => { setEmail(account); setPassword(account === "content@auto365.test" ? "Auto365-Content-2026!" : account === "oa@auto365.test" ? "Auto365-OA-2026!" : account === "seo-lead@auto365.test" ? "Auto365-SEO-2026!" : account === "it@auto365.test" ? "Auto365-IT-2026!" : "Auto365-Boss-2026!"); }}>{role}<small>{account}</small></button>)}</div>
  </section></main>;
}
