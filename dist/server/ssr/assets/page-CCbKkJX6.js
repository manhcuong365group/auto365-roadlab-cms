import { T as __toESM, b as require_react, t as require_jsx_runtime } from "../index.js";
import Link from "./link-B6R2H3TZ.js";
//#region app/workspace/cases/[caseId]/activity/page.tsx
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var import_jsx_runtime = require_jsx_runtime();
function CaseActivityPage() {
	const [items, setItems] = (0, import_react.useState)([]);
	(0, import_react.useEffect)(() => {
		fetch("/api/v1/case-lab/dashboard").then((r) => r.json()).then((body) => setItems(body.activity ?? []));
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
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "workspace-eyebrow",
					children: "Case Lab · audit"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", { children: "Lịch sử thao tác" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Audit trail theo tài khoản và revision." }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
					className: "workspace-activity workspace-activity--page",
					children: items.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", {}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: item.action.replaceAll(".", " · ") }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
						item.caseId ?? "Tài khoản",
						" · ",
						new Date(item.createdAt).toLocaleString("vi-VN")
					] })] })] }, item.id))
				})
			]
		})
	});
}
//#endregion
export { CaseActivityPage as default };
