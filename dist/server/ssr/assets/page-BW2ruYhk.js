import { D as __toESM, S as require_react, t as require_jsx_runtime } from "../index.js";
import Link from "./link-Cpwhskqh.js";
//#region app/workspace/users/page.tsx
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var import_jsx_runtime = require_jsx_runtime();
var roleLabels = {
	content: "Content",
	oa: "OA",
	seo_lead: "SEO Lead",
	it: "IT",
	boss: "Sếp"
};
var roleOptions = Object.entries(roleLabels);
var dateFormatter = new Intl.DateTimeFormat("vi-VN", {
	day: "2-digit",
	month: "2-digit",
	year: "numeric"
});
function UsersPage() {
	const [items, setItems] = (0, import_react.useState)([]);
	const [error, setError] = (0, import_react.useState)("");
	const [loading, setLoading] = (0, import_react.useState)(true);
	const [showForm, setShowForm] = (0, import_react.useState)(false);
	const [email, setEmail] = (0, import_react.useState)("");
	const [displayName, setDisplayName] = (0, import_react.useState)("");
	const [password, setPassword] = (0, import_react.useState)("");
	const [role, setRole] = (0, import_react.useState)("content");
	const [branchRef, setBranchRef] = (0, import_react.useState)("*");
	const [creating, setCreating] = (0, import_react.useState)(false);
	const [createError, setCreateError] = (0, import_react.useState)("");
	const [notice, setNotice] = (0, import_react.useState)("");
	const load = (0, import_react.useCallback)(async () => {
		setLoading(true);
		setError("");
		try {
			const response = await fetch("/api/v1/case-lab/users");
			if (!response.ok) {
				const body = await response.json().catch(() => ({}));
				throw new Error(body.error?.code === "UNAUTHENTICATED" ? "SESSION_REQUIRED" : body.error?.message ?? "Không thể tải danh sách người dùng.");
			}
			setItems((await response.json()).items);
		} catch (reason) {
			setError(reason instanceof Error ? reason.message : "Không thể tải danh sách người dùng.");
		} finally {
			setLoading(false);
		}
	}, []);
	(0, import_react.useEffect)(() => {
		load();
	}, [load]);
	async function submit() {
		setCreating(true);
		setCreateError("");
		setNotice("");
		try {
			const response = await fetch("/api/v1/case-lab/users", {
				method: "POST",
				headers: { "content-type": "application/json" },
				body: JSON.stringify({
					email: email.trim(),
					displayName: displayName.trim(),
					password,
					roles: [{
						role,
						branchRef: branchRef.trim()
					}]
				})
			});
			const body = await response.json().catch(() => ({}));
			if (!response.ok || !body.user) throw new Error(body.error?.message ?? "Không thể tạo tài khoản.");
			setNotice(`Đã tạo tài khoản ${body.user.email}.`);
			setEmail("");
			setDisplayName("");
			setPassword("");
			setRole("content");
			setBranchRef("*");
			setShowForm(false);
			await load();
		} catch (reason) {
			setCreateError(reason instanceof Error ? reason.message : "Không thể tạo tài khoản.");
		} finally {
			setCreating(false);
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
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "workspace-heading",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "workspace-eyebrow",
						children: "Case Lab · quản trị"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", { children: "Người dùng" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Chỉ vai trò Sếp mới tạo và xem được danh sách tài khoản." })
				] }), !showForm ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: "workspace-button",
					onClick: () => setShowForm(true),
					children: "+ Tạo tài khoản"
				}) : null]
			}),
			showForm ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "workspace-card workspace-new-case",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "workspace-card__head",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: "Tạo tài khoản mới" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: "workspace-button workspace-button--ghost",
							onClick: () => setShowForm(false),
							children: "Đóng"
						})]
					}),
					createError ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "workspace-alert",
						role: "alert",
						children: createError
					}) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "workspace-field-grid",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "workspace-field",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Email" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "email",
									value: email,
									onChange: (event) => setEmail(event.target.value),
									placeholder: "ten@auto365.vn"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "workspace-field",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Tên hiển thị" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									value: displayName,
									onChange: (event) => setDisplayName(event.target.value),
									placeholder: "Nguyễn Văn A"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "workspace-field",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Mật khẩu tạm" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "text",
									value: password,
									onChange: (event) => setPassword(event.target.value),
									placeholder: "Tối thiểu 8 ký tự"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "workspace-field",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Vai trò" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
									value: role,
									onChange: (event) => setRole(event.target.value),
									children: roleOptions.map(([value, label]) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value,
										children: label
									}, value))
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "workspace-field",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Phạm vi chi nhánh" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									value: branchRef,
									onChange: (event) => setBranchRef(event.target.value),
									placeholder: "* (toàn hệ thống) hoặc VD: HCM-01"
								})]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "workspace-button",
						disabled: creating || !email.trim() || !displayName.trim() || password.length < 8,
						onClick: submit,
						children: creating ? "Đang tạo…" : "Tạo tài khoản"
					})
				]
			}) : null,
			notice ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "workspace-notice",
				children: notice
			}) : null,
			error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "workspace-alert",
				role: "alert",
				children: error === "SESSION_REQUIRED" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "Phiên đăng nhập chưa sẵn sàng" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Đăng nhập để xem danh sách người dùng." }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						className: "workspace-alert__link",
						href: "/login?return_to=/workspace/users",
						children: "Đăng nhập Case Lab →"
					})
				] }) : error
			}) : null,
			loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "workspace-loading",
				children: "Đang tải danh sách người dùng…"
			}) : null,
			!loading && !error ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "workspace-table workspace-table--full workspace-table--cases",
				role: "table",
				"aria-label": "Danh sách người dùng",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "workspace-table__head",
					role: "row",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Tài khoản" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Vai trò" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Trạng thái" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Ngày tạo" })
					]
				}), items.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "workspace-row",
					role: "row",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: item.displayName }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: item.email })] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: item.roles.map((r) => `${roleLabels[r.role] ?? r.role} · ${r.branchRef}`).join(", ") || "Chưa gán vai trò" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "workspace-row__status",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: `status status--${item.status === "active" ? "published" : "changes_requested"}` }), item.status === "active" ? "Hoạt động" : "Tạm khoá"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: dateFormatter.format(new Date(item.createdAt)) })
					]
				}, item.id))]
			}) : null
		]
	});
}
//#endregion
export { UsersPage as default };
