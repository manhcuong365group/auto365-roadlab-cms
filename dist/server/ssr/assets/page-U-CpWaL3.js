import { b as require_react, t as require_jsx_runtime, w as __toESM } from "../index.js";
import Link from "./link-C4SWyAck.js";
//#region lib/case-content-types.ts
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var caseContentTypeOptions = [
	{
		value: "case",
		label: "Ca thực tế",
		description: "Ca vận hành thực tế"
	},
	{
		value: "proof",
		label: "Bằng chứng & nghiệm thu",
		description: "Bằng chứng, đo kiểm và nghiệm thu"
	},
	{
		value: "brand",
		label: "Nội dung thương hiệu",
		description: "Nội dung định vị thương hiệu"
	},
	{
		value: "product",
		label: "Nội dung sản phẩm",
		description: "Nội dung trọng tâm sản phẩm"
	}
];
var contentTypeByValue = new Map(caseContentTypeOptions.map((item) => [item.value, item]));
function normalizeCaseContentType(value) {
	return typeof value === "string" && contentTypeByValue.has(value) ? value : "case";
}
function getCaseContentType(value) {
	return contentTypeByValue.get(normalizeCaseContentType(value));
}
//#endregion
//#region app/workspace/cases/page.tsx
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
var dateFormatter = new Intl.DateTimeFormat("vi-VN", {
	day: "2-digit",
	month: "2-digit",
	year: "numeric"
});
function CasesPage() {
	const [cases, setCases] = (0, import_react.useState)([]);
	const [error, setError] = (0, import_react.useState)("");
	const [loading, setLoading] = (0, import_react.useState)(true);
	const [query, setQuery] = (0, import_react.useState)("");
	const [contentType, setContentType] = (0, import_react.useState)("all");
	const [status, setStatus] = (0, import_react.useState)("all");
	(0, import_react.useEffect)(() => {
		fetch("/api/v1/case-lab/dashboard").then(async (response) => {
			if (!response.ok) {
				const body = await response.json().catch(() => ({}));
				if (body.error?.code === "UNAUTHENTICATED") throw new Error("SESSION_REQUIRED");
				throw new Error(body.error?.message ?? "Không thể tải danh sách case.");
			}
			setCases((await response.json()).cases);
		}).catch((reason) => setError(reason.message)).finally(() => setLoading(false));
	}, []);
	const openCases = cases.filter((item) => !["published", "archived"].includes(item.workflowStatus)).length;
	const needsAttention = cases.filter((item) => [
		"changes_requested",
		"in_review",
		"ready_for_review"
	].includes(item.workflowStatus)).length;
	const visibleCases = (0, import_react.useMemo)(() => cases.filter((item) => {
		return `${item.caseCode} ${item.branchRef} ${getCaseContentType(item.contentType).label}`.toLocaleLowerCase("vi-VN").includes(query.trim().toLocaleLowerCase("vi-VN")) && (contentType === "all" || item.contentType === contentType) && (status === "all" || item.workflowStatus === status);
	}), [
		cases,
		contentType,
		query,
		status
	]);
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
						children: "Case Lab · tài nguyên"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", { children: "Case / bài viết" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Danh sách case trong phạm vi quyền của tài khoản." })
				] })
			}),
			error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "workspace-alert",
				role: "alert",
				children: error === "SESSION_REQUIRED" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "Phiên đăng nhập chưa sẵn sàng" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Đăng nhập để xem danh sách case theo quyền tài khoản." }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						className: "workspace-alert__link",
						href: "/login?return_to=/workspace/cases",
						children: "Đăng nhập Case Lab →"
					})
				] }) : error
			}) : null,
			loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "workspace-loading",
				children: "Đang tải danh sách case…"
			}) : null,
			!loading && !error && cases.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "workspace-empty workspace-empty--card",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "Chưa có case trong phạm vi quyền hiện tại." }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Dữ liệu sẽ xuất hiện sau khi tạo case hoặc import từ nguồn vận hành." })]
			}) : null,
			!loading && !error && cases.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "workspace-list-summary",
					"aria-label": "Tổng quan danh sách case",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Tổng case" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: cases.length })] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Đang xử lý" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: openCases })] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Cần review" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: needsAttention })] })
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "workspace-list-controls workspace-list-controls--cases",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Tìm case" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							value: query,
							onChange: (event) => setQuery(event.target.value),
							placeholder: "Mã case hoặc chi nhánh"
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Loại bài" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
							value: contentType,
							onChange: (event) => setContentType(event.target.value),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "all",
								children: "Tất cả loại bài"
							}), caseContentTypeOptions.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: item.value,
								children: item.label
							}, item.value))]
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Trạng thái" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
							value: status,
							onChange: (event) => setStatus(event.target.value),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "all",
								children: "Tất cả trạng thái"
							}), Object.entries(labels).map(([value, label]) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value,
								children: label
							}, value))]
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("b", { children: [visibleCases.length, " kết quả"] })
					]
				}),
				visibleCases.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "workspace-empty workspace-empty--card",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "Không tìm thấy case phù hợp." }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Thử đổi từ khóa, loại bài hoặc trạng thái lọc." })]
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "workspace-table workspace-table--full workspace-table--cases",
					role: "table",
					"aria-label": "Danh sách case",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "workspace-table__head",
						role: "row",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Case / chi nhánh" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Loại bài" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Trạng thái" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Cập nhật" })
						]
					}), visibleCases.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						className: "workspace-row",
						role: "row",
						href: `/workspace/cases/${encodeURIComponent(item.id)}`,
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: item.caseCode }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: item.branchRef })] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", {
								className: `workspace-content-type workspace-content-type--${item.contentType}`,
								children: getCaseContentType(item.contentType).label
							}) }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "workspace-row__status",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: `status status--${item.workflowStatus}` }), labels[item.workflowStatus] ?? item.workflowStatus]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("b", { children: ["r", item.currentRevision] }),
								dateFormatter.format(new Date(item.updatedAt)),
								" ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("em", { children: "→" })
							] })
						]
					}, item.id))]
				})
			] }) : null
		]
	});
}
//#endregion
export { CasesPage as default };
