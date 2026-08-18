import { D as __toESM, S as require_react, t as require_jsx_runtime } from "../index.js";
import Link from "./link-Cpwhskqh.js";
//#region app/workspace/reports/page.tsx
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var import_jsx_runtime = require_jsx_runtime();
var labels = {
	draft: "Bản nháp",
	ready_for_review: "Chờ review",
	in_review: "Đang review",
	changes_requested: "Cần chỉnh sửa",
	technical_approved: "Đã qua IT",
	publishable: "Sẵn sàng xuất bản",
	published: "Đã xuất bản",
	archived: "Đã lưu trữ"
};
var formatter = new Intl.DateTimeFormat("vi-VN", {
	day: "2-digit",
	month: "2-digit",
	year: "numeric",
	hour: "2-digit",
	minute: "2-digit"
});
function ReportsPage() {
	const [report, setReport] = (0, import_react.useState)(null);
	const [error, setError] = (0, import_react.useState)("");
	const [loading, setLoading] = (0, import_react.useState)(true);
	(0, import_react.useEffect)(() => {
		fetch("/api/v1/case-lab/reports/operations").then(async (response) => {
			if (!response.ok) {
				const body = await response.json().catch(() => ({}));
				throw new Error(body.error?.code === "UNAUTHENTICATED" ? "SESSION_REQUIRED" : body.error?.message ?? "Không thể tải báo cáo.");
			}
			return response.json();
		}).then(setReport).catch((reason) => setError(reason.message)).finally(() => setLoading(false));
	}, []);
	const statuses = (0, import_react.useMemo)(() => Object.entries(report?.byWorkflowStatus ?? {}).sort(([, a], [, b]) => b - a), [report]);
	const max = Math.max(1, ...statuses.map(([, value]) => value));
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
						children: "Case Lab · vận hành"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", { children: "Báo cáo" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Tổng hợp tiến độ case, feedback và khối lượng xử lý trong phạm vi quyền hiện tại." })
				] }), report ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("time", {
					className: "workspace-report-time",
					dateTime: report.generatedAt,
					children: ["Cập nhật ", formatter.format(new Date(report.generatedAt))]
				}) : null]
			}),
			error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "workspace-alert",
				role: "alert",
				children: error === "SESSION_REQUIRED" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "Phiên đăng nhập chưa sẵn sàng" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Đăng nhập để xem báo cáo vận hành." }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						className: "workspace-alert__link",
						href: "/login?return_to=/workspace/reports",
						children: "Đăng nhập Case Lab →"
					})
				] }) : error
			}) : null,
			loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "workspace-loading",
				children: "Đang tổng hợp dữ liệu vận hành…"
			}) : null,
			!loading && !error && report ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "workspace-list-summary workspace-list-summary--four",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Tổng case" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: report.summary.totalCases })] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Được giao" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: report.summary.assignedToMe })] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Feedback mở" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: report.summary.openFeedback })] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Thông báo chưa đọc" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: report.summary.unreadNotifications })] })
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
				className: "workspace-card workspace-report-card",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "workspace-eyebrow",
					children: "Theo workflow"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: "Phân bổ trạng thái case" })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: report.scope.join(", ") === "*" ? "Toàn bộ chi nhánh" : report.scope.join(", ") })] }), statuses.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "workspace-report-bars",
					children: statuses.map(([status, count]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: labels[status] ?? status }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [count, " case"] })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("em", { style: { width: `${Math.max(8, count / max * 100)}%` } }) })] }, status))
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "workspace-empty",
					children: "Chưa có case để tổng hợp."
				})]
			})] }) : null
		]
	});
}
//#endregion
export { ReportsPage as default };
