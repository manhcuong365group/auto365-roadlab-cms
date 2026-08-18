import { D as __toESM, S as require_react, t as require_jsx_runtime } from "../index.js";
import Link from "./link-Bcu-ppP_.js";
//#region app/workspace/account/page.tsx
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var import_jsx_runtime = require_jsx_runtime();
function AccountPage() {
	const [currentPassword, setCurrentPassword] = (0, import_react.useState)("");
	const [newPassword, setNewPassword] = (0, import_react.useState)("");
	const [confirmPassword, setConfirmPassword] = (0, import_react.useState)("");
	const [saving, setSaving] = (0, import_react.useState)(false);
	const [error, setError] = (0, import_react.useState)("");
	const [notice, setNotice] = (0, import_react.useState)("");
	async function submit() {
		setSaving(true);
		setError("");
		setNotice("");
		try {
			if (newPassword !== confirmPassword) throw new Error("Mật khẩu mới nhập lại không khớp.");
			const response = await fetch("/api/v1/case-lab/me/password", {
				method: "POST",
				headers: { "content-type": "application/json" },
				body: JSON.stringify({
					currentPassword,
					newPassword
				})
			});
			const body = await response.json().catch(() => ({}));
			if (!response.ok || !body.ok) throw new Error(body.error?.message ?? "Không thể đổi mật khẩu.");
			setNotice("Đã đổi mật khẩu thành công.");
			setCurrentPassword("");
			setNewPassword("");
			setConfirmPassword("");
		} catch (reason) {
			setError(reason instanceof Error ? reason.message : "Không thể đổi mật khẩu.");
		} finally {
			setSaving(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "workspace-shell workspace-list-page",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				className: "workspace-back",
				href: "/workspace",
				children: "← Tổng quan"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "workspace-heading",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "workspace-eyebrow",
						children: "Case Lab · tài khoản"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", { children: "Đổi mật khẩu" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Đổi mật khẩu đăng nhập của chính bạn." })
				] })
			}),
			notice ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "workspace-notice",
				children: notice
			}) : null,
			error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "workspace-alert",
				role: "alert",
				children: error
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "workspace-card workspace-new-case",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "workspace-field-grid",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "workspace-field workspace-field--wide",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Mật khẩu hiện tại" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "password",
								value: currentPassword,
								onChange: (event) => setCurrentPassword(event.target.value)
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "workspace-field",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Mật khẩu mới" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "password",
								value: newPassword,
								onChange: (event) => setNewPassword(event.target.value),
								placeholder: "Tối thiểu 8 ký tự"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "workspace-field",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Nhập lại mật khẩu mới" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "password",
								value: confirmPassword,
								onChange: (event) => setConfirmPassword(event.target.value)
							})]
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: "workspace-button",
					disabled: saving || !currentPassword || newPassword.length < 8,
					onClick: submit,
					children: saving ? "Đang lưu…" : "Đổi mật khẩu"
				})]
			})
		]
	});
}
//#endregion
export { AccountPage as default };
