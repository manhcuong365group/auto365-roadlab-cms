import { t as require_jsx_runtime, w as __toESM, y as require_react } from "../index.js";
import Link from "./link-CP_H_gWV.js";
//#region app/workspace/cases/page.tsx
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var import_jsx_runtime = require_jsx_runtime();
var labels = {
	draft: "Bản nháp",
	in_review: "Đang review",
	changes_requested: "Cần chỉnh sửa",
	approved: "Đã duyệt",
	published: "Đã xuất bản"
};
function CasesPage() {
	const [cases, setCases] = (0, import_react.useState)([]);
	const [error, setError] = (0, import_react.useState)("");
	(0, import_react.useEffect)(() => {
		fetch("/api/v1/case-lab/dashboard").then(async (response) => {
			if (!response.ok) throw new Error("Không thể tải danh sách case.");
			setCases((await response.json()).cases);
		}).catch((reason) => setError(reason.message));
	}, []);
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
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "workspace-heading",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "workspace-eyebrow",
							children: "Case Lab · tài nguyên"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", { children: "Case / bài viết" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Danh sách case trong phạm vi quyền của tài khoản." })
					] })
				}),
				error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "workspace-alert",
					role: "alert",
					children: error
				}) : null,
				!error && cases.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "workspace-empty",
					children: "Chưa có case hoặc phiên đăng nhập chưa sẵn sàng."
				}) : null,
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "workspace-table workspace-table--full",
					role: "table",
					"aria-label": "Danh sách case",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "workspace-table__head",
						role: "row",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Case" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Trạng thái" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Revision" })
						]
					}), cases.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						className: "workspace-row",
						role: "row",
						href: `/workspace/cases/${encodeURIComponent(item.id)}`,
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: item.caseCode }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: item.branchRef })] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: labels[item.workflowStatus] ?? item.workflowStatus }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
								"r",
								item.currentRevision,
								" · ",
								new Date(item.updatedAt).toLocaleDateString("vi-VN"),
								" →"
							] })
						]
					}, item.id))]
				})
			]
		})
	});
}
//#endregion
export { CasesPage as default };
