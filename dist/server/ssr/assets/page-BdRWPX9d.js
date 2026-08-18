import { D as __toESM, S as require_react, t as require_jsx_runtime } from "../index.js";
import Link from "./link-Bcu-ppP_.js";
import { r as useSearchParams } from "./navigation-DbgvjWuQ.js";
//#region app/login/page.tsx
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var import_jsx_runtime = require_jsx_runtime();
var testAccounts = [
	["content@auto365.test", "Content"],
	["oa@auto365.test", "OA"],
	["seo-lead@auto365.test", "SEO Lead"],
	["it@auto365.test", "IT"],
	["boss@auto365.test", "Sếp"]
];
var demoPassword = "CaseLab-2026!";
function LoginPage() {
	const requested = useSearchParams().get("return_to") ?? "/workspace";
	const returnTo = requested.startsWith("/") && !requested.startsWith("//") ? requested : "/workspace";
	const [email, setEmail] = (0, import_react.useState)("content@auto365.test");
	const [password, setPassword] = (0, import_react.useState)(demoPassword);
	const [error, setError] = (0, import_react.useState)("");
	const [loading, setLoading] = (0, import_react.useState)(false);
	async function submit(event) {
		event.preventDefault();
		setLoading(true);
		setError("");
		try {
			const response = await fetch("/api/auth/login", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					email,
					password
				})
			});
			const body = await response.json().catch(() => ({}));
			if (!response.ok) {
				setError(body.error?.message ?? "Đăng nhập không thành công.");
				return;
			}
			window.location.assign(returnTo);
		} catch {
			setError("Không thể kết nối tới Case Lab.");
		} finally {
			setLoading(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
		className: "case-login",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "case-login__card",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					className: "case-login__brand",
					href: "/",
					children: ["365 ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "CASE LAB" })]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "workspace-eyebrow",
					children: "Workspace vận hành"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", { children: "Đăng nhập Case Lab" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "case-login__intro",
					children: "Đăng nhập để xem case, review feedback và lịch sử thao tác theo quyền tài khoản."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					onSubmit: submit,
					className: "case-login__form",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { children: ["Email", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "email",
							value: email,
							onChange: (e) => setEmail(e.target.value),
							autoComplete: "username",
							required: true
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { children: ["Mật khẩu", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "password",
							value: password,
							onChange: (e) => setPassword(e.target.value),
							autoComplete: "current-password",
							required: true
						})] }),
						error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "case-login__error",
							role: "alert",
							children: error
						}) : null,
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "submit",
							disabled: loading,
							children: loading ? "Đang đăng nhập…" : "Đăng nhập"
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "case-login__accounts",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "Tài khoản test nhanh" }), testAccounts.map(([account, role]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: () => {
							setEmail(account);
							setPassword(demoPassword);
						},
						children: [role, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: account })]
					}, account))]
				})
			]
		})
	});
}
//#endregion
export { LoginPage as default };
