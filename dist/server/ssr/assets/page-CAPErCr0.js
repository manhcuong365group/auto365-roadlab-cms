import { D as __toESM, S as require_react, t as require_jsx_runtime } from "../index.js";
import Link from "./link-Cpwhskqh.js";
//#region app/workspace/review/page.tsx
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var import_jsx_runtime = require_jsx_runtime();
var labels = {
	ready_for_review: "Chờ review",
	in_review: "Đang review",
	changes_requested: "Cần chỉnh sửa"
};
var dateFormatter = new Intl.DateTimeFormat("vi-VN", {
	day: "2-digit",
	month: "2-digit",
	hour: "2-digit",
	minute: "2-digit"
});
function ReviewPage() {
	const [cases, setCases] = (0, import_react.useState)([]);
	const [error, setError] = (0, import_react.useState)("");
	const [loading, setLoading] = (0, import_react.useState)(true);
	(0, import_react.useEffect)(() => {
		fetch("/api/v1/case-lab/dashboard").then(async (response) => {
			if (!response.ok) {
				const body = await response.json().catch(() => ({}));
				throw new Error(body.error?.code === "UNAUTHENTICATED" ? "SESSION_REQUIRED" : body.error?.message ?? "Không thể tải hàng chờ review.");
			}
			return response.json();
		}).then((body) => setCases(body.cases)).catch((reason) => setError(reason.message)).finally(() => setLoading(false));
	}, []);
	const reviewCases = (0, import_react.useMemo)(() => cases.filter((item) => [
		"ready_for_review",
		"in_review",
		"changes_requested"
	].includes(item.workflowStatus)), [cases]);
	const changesRequested = reviewCases.filter((item) => item.workflowStatus === "changes_requested").length;
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
						children: "Case Lab · kiểm duyệt"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", { children: "Trung tâm review" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Theo dõi các case đang chờ phản hồi, cần chỉnh sửa hoặc đang được kiểm duyệt." })
				] })
			}),
			error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "workspace-alert",
				role: "alert",
				children: error === "SESSION_REQUIRED" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "Phiên đăng nhập chưa sẵn sàng" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Đăng nhập để xem hàng chờ review theo quyền." }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						className: "workspace-alert__link",
						href: "/login?return_to=/workspace/review",
						children: "Đăng nhập Case Lab →"
					})
				] }) : error
			}) : null,
			loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "workspace-loading",
				children: "Đang tải hàng chờ review…"
			}) : null,
			!loading && !error ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "workspace-list-summary",
				"aria-label": "Tổng quan review",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Chờ xử lý" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: reviewCases.length })] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Cần sửa" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: changesRequested })] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Đang review" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: reviewCases.filter((item) => item.workflowStatus === "in_review").length })] })
				]
			}), reviewCases.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "workspace-empty workspace-empty--card",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "Không có case nào trong hàng chờ review." }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Các case chuyển sang “Chờ review” sẽ hiện tại đây." })]
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "workspace-table workspace-table--full",
				role: "table",
				"aria-label": "Hàng chờ review",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "workspace-table__head",
					role: "row",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Case / chi nhánh" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Trạng thái" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Revision / cập nhật" })
					]
				}), reviewCases.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					className: "workspace-row",
					role: "row",
					href: `/workspace/cases/${encodeURIComponent(item.id)}/review`,
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: item.caseCode }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: item.branchRef })] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "workspace-row__status",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: `status status--${item.workflowStatus}` }), labels[item.workflowStatus]]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("b", { children: ["r", item.currentRevision] }),
							dateFormatter.format(new Date(item.updatedAt)),
							" ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("em", { children: "→" })
						] })
					]
				}, item.id))]
			})] }) : null
		]
	});
}
//#endregion
export { ReviewPage as default };
