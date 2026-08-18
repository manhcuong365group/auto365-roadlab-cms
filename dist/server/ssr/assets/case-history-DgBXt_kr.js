import { D as __toESM, S as require_react, t as require_jsx_runtime } from "../index.js";
import Link from "./link-Bcu-ppP_.js";
//#region app/workspace/cases/[caseId]/history/case-history.tsx
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var import_jsx_runtime = require_jsx_runtime();
var dateFormatter = new Intl.DateTimeFormat("vi-VN", {
	day: "2-digit",
	month: "2-digit",
	year: "numeric",
	hour: "2-digit",
	minute: "2-digit"
});
function flatten(value, prefix = "") {
	const out = {};
	if (value && typeof value === "object" && !Array.isArray(value)) for (const [key, entryValue] of Object.entries(value)) {
		const path = prefix ? `${prefix}.${key}` : key;
		if (entryValue && typeof entryValue === "object" && !Array.isArray(entryValue)) Object.assign(out, flatten(entryValue, path));
		else out[path] = typeof entryValue === "boolean" ? entryValue ? "true" : "false" : String(entryValue ?? "");
	}
	return out;
}
async function fetchJson(url) {
	const response = await fetch(url);
	if (!response.ok) {
		const body = await response.json().catch(() => ({}));
		throw new Error(body.error?.code === "UNAUTHENTICATED" ? "SESSION_REQUIRED" : body.error?.message ?? "Không thể tải dữ liệu.");
	}
	return response.json();
}
function CaseHistory({ caseId }) {
	const [revisions, setRevisions] = (0, import_react.useState)([]);
	const [fromRevision, setFromRevision] = (0, import_react.useState)(null);
	const [toRevision, setToRevision] = (0, import_react.useState)(null);
	const [fromContent, setFromContent] = (0, import_react.useState)(null);
	const [toContent, setToContent] = (0, import_react.useState)(null);
	const [error, setError] = (0, import_react.useState)("");
	const [loading, setLoading] = (0, import_react.useState)(true);
	(0, import_react.useEffect)(() => {
		fetchJson(`/api/v1/case-lab/cases/${encodeURIComponent(caseId)}/revisions`).then((body) => {
			setRevisions(body.items);
			if (body.items.length >= 2) {
				setToRevision(body.items[0].revision);
				setFromRevision(body.items[1].revision);
			} else if (body.items.length === 1) {
				setToRevision(body.items[0].revision);
				setFromRevision(body.items[0].revision);
			}
		}).catch((reason) => setError(reason.message)).finally(() => setLoading(false));
	}, [caseId]);
	(0, import_react.useEffect)(() => {
		if (fromRevision === null || toRevision === null) return;
		setFromContent(null);
		setToContent(null);
		Promise.all([fetchJson(`/api/v1/case-lab/cases/${encodeURIComponent(caseId)}/revisions/${fromRevision}`), fetchJson(`/api/v1/case-lab/cases/${encodeURIComponent(caseId)}/revisions/${toRevision}`)]).then(([from, to]) => {
			setFromContent(from);
			setToContent(to);
		}).catch((reason) => setError(reason.message));
	}, [
		caseId,
		fromRevision,
		toRevision
	]);
	const diffRows = (0, import_react.useMemo)(() => {
		if (!fromContent || !toContent) return [];
		const before = flatten(fromContent.content);
		const after = flatten(toContent.content);
		return [...new Set([...Object.keys(before), ...Object.keys(after)])].sort().map((path) => ({
			path,
			before: before[path] ?? "",
			after: after[path] ?? ""
		})).filter((row) => row.before !== row.after);
	}, [fromContent, toContent]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "workspace-shell workspace-case-page",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				className: "workspace-back",
				href: `/workspace/cases/${encodeURIComponent(caseId)}`,
				children: "← Quay lại soạn bài"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "workspace-heading",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "workspace-eyebrow",
						children: "Case Lab · lịch sử"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", { children: "Lịch sử revision" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "So sánh nội dung giữa 2 revision — chỉ hiện các trường đã thay đổi." })
				] })
			}),
			error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "workspace-alert",
				role: "alert",
				children: error === "SESSION_REQUIRED" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "Phiên đăng nhập chưa sẵn sàng" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Đăng nhập để xem lịch sử case." }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						className: "workspace-alert__link",
						href: `/login?return_to=/workspace/cases/${encodeURIComponent(caseId)}/history`,
						children: "Đăng nhập Case Lab →"
					})
				] }) : error
			}) : null,
			loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "workspace-loading",
				children: "Đang tải lịch sử revision…"
			}) : null,
			!loading && !error && revisions.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "workspace-list-controls",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "So sánh từ (cũ hơn)" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
					value: fromRevision ?? "",
					onChange: (event) => setFromRevision(Number(event.target.value)),
					children: revisions.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("option", {
						value: item.revision,
						children: [
							"r",
							item.revision,
							" · ",
							item.createdBy,
							" · ",
							dateFormatter.format(new Date(item.createdAt))
						]
					}, item.revision))
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Đến (mới hơn)" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
					value: toRevision ?? "",
					onChange: (event) => setToRevision(Number(event.target.value)),
					children: revisions.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("option", {
						value: item.revision,
						children: [
							"r",
							item.revision,
							" · ",
							item.createdBy,
							" · ",
							dateFormatter.format(new Date(item.createdAt))
						]
					}, item.revision))
				})] })]
			}), fromContent && toContent ? diffRows.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "workspace-table workspace-table--full workspace-table--diff",
				role: "table",
				"aria-label": "Khác biệt giữa 2 revision",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "workspace-table__head",
					role: "row",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Trường" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["r", fromRevision] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["r", toRevision] })
					]
				}), diffRows.map((row) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "workspace-row workspace-diff-row",
					role: "row",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: row.path }) }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "workspace-diff-before",
							children: row.before || /* @__PURE__ */ (0, import_jsx_runtime.jsx)("em", { children: "— trống —" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "workspace-diff-after",
							children: row.after || /* @__PURE__ */ (0, import_jsx_runtime.jsx)("em", { children: "— trống —" })
						})
					]
				}, row.path))]
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "workspace-empty workspace-empty--card",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "Không có thay đổi giữa 2 revision này." })
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "workspace-loading",
				children: "Đang tải nội dung để so sánh…"
			})] }) : null,
			!loading && !error && !revisions.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "workspace-empty workspace-empty--card",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "Case chưa có revision nào." })
			}) : null
		]
	});
}
//#endregion
export { CaseHistory as default };
