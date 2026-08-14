import { T as __toESM, b as require_react, t as require_jsx_runtime } from "../index.js";
import Link from "./link-B6R2H3TZ.js";
//#region app/workspace/notifications/page.tsx
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var import_jsx_runtime = require_jsx_runtime();
var dateFormatter = new Intl.DateTimeFormat("vi-VN", {
	day: "2-digit",
	month: "2-digit",
	year: "numeric",
	hour: "2-digit",
	minute: "2-digit"
});
function NotificationsPage() {
	const [items, setItems] = (0, import_react.useState)([]);
	const [error, setError] = (0, import_react.useState)("");
	const [loading, setLoading] = (0, import_react.useState)(true);
	const [savingId, setSavingId] = (0, import_react.useState)("");
	(0, import_react.useEffect)(() => {
		fetch("/api/v1/case-lab/notifications").then(async (response) => {
			if (!response.ok) {
				const body = await response.json().catch(() => ({}));
				throw new Error(body.error?.code === "UNAUTHENTICATED" ? "SESSION_REQUIRED" : body.error?.message ?? "Không thể tải thông báo.");
			}
			return response.json();
		}).then((body) => setItems(body.items)).catch((reason) => setError(reason.message)).finally(() => setLoading(false));
	}, []);
	async function markRead(id) {
		setSavingId(id);
		try {
			const response = await fetch(`/api/v1/case-lab/notifications/${encodeURIComponent(id)}/read`, { method: "POST" });
			if (!response.ok) throw new Error("Không thể cập nhật thông báo.");
			const result = await response.json();
			setItems((current) => current.map((item) => item.id === id ? {
				...item,
				readAt: result.readAt
			} : item));
		} catch (reason) {
			setError(reason instanceof Error ? reason.message : "Không thể cập nhật thông báo.");
		} finally {
			setSavingId("");
		}
	}
	const unreadCount = items.filter((item) => !item.readAt).length;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
		className: "workspace-page",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
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
							children: "Case Lab · cá nhân"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", { children: "Thông báo" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Feedback, phân công và hoạt động mới trong phạm vi case bạn có quyền truy cập." })
					] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "workspace-heading__count",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Chưa đọc" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: unreadCount })]
					})]
				}),
				error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "workspace-alert",
					role: "alert",
					children: error === "SESSION_REQUIRED" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "Phiên đăng nhập chưa sẵn sàng" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Đăng nhập để xem thông báo cá nhân." }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							className: "workspace-alert__link",
							href: "/login?return_to=/workspace/notifications",
							children: "Đăng nhập Case Lab →"
						})
					] }) : error
				}) : null,
				loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "workspace-loading",
					children: "Đang tải thông báo…"
				}) : null,
				!loading && !error && items.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "workspace-empty workspace-empty--card",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "Chưa có thông báo mới." }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Thông báo sẽ xuất hiện khi có feedback hoặc phân công liên quan đến bạn." })]
				}) : null,
				!loading && !error && items.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "workspace-notification-list",
					children: items.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
						className: `workspace-notification${item.readAt ? " is-read" : ""}`,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { "aria-label": item.readAt ? "Đã đọc" : "Chưa đọc" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "workspace-notification__title",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: item.title }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("time", {
									dateTime: item.createdAt,
									children: dateFormatter.format(new Date(item.createdAt))
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: item.body }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "workspace-notification__actions",
								children: [item.caseId ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									href: `/workspace/cases/${encodeURIComponent(item.caseId)}`,
									children: "Mở case →"
								}) : null, !item.readAt ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: () => markRead(item.id),
									disabled: savingId === item.id,
									children: savingId === item.id ? "Đang lưu…" : "Đánh dấu đã đọc"
								}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Đã đọc" })]
							})
						] })]
					}, item.id))
				}) : null
			]
		})
	});
}
//#endregion
export { NotificationsPage as default };
