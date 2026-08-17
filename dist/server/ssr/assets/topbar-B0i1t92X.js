import { b as require_react, t as require_jsx_runtime, w as __toESM } from "../index.js";
import Link from "./link-C0Cm0FA3.js";
import { t as usePathname } from "./navigation-BZ1nfxFD.js";
//#region app/workspace/topbar.tsx
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var import_jsx_runtime = require_jsx_runtime();
var links = [
	["Tổng quan", "/workspace"],
	["Case / bài viết", "/workspace/cases"],
	["Review", "/workspace/review"],
	["Báo cáo", "/workspace/reports"]
];
function Icon({ name }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
		"aria-hidden": "true",
		viewBox: "0 0 24 24",
		fill: "none",
		stroke: "currentColor",
		strokeWidth: "1.8",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M18 9a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M10 22h4" })]
	});
}
function WorkspaceTopbar() {
	const pathname = usePathname();
	const [profile, setProfile] = (0, import_react.useState)(null);
	const [unreadCount, setUnreadCount] = (0, import_react.useState)(0);
	(0, import_react.useEffect)(() => {
		fetch("/api/v1/case-lab/me").then((response) => response.ok ? response.json() : null).then(setProfile).catch(() => setProfile(null));
		fetch("/api/v1/case-lab/dashboard").then((response) => response.ok ? response.json() : null).then((body) => setUnreadCount(body?.summary.unreadNotifications ?? 0)).catch(() => setUnreadCount(0));
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
		className: "workspace-topbar",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
				className: "workspace-brand",
				href: "/workspace",
				"aria-label": "Case Lab Workspace",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "365" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "CASE LAB" })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
				"aria-label": "Điều hướng workspace",
				children: links.map(([label, href]) => {
					return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						className: (href === "/workspace" ? pathname === href : pathname?.startsWith(href)) ? "is-active" : "",
						href,
						children: label
					}, href);
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "workspace-profile",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					className: "workspace-notification-link",
					href: "/workspace/notifications",
					"aria-label": `Thông báo chưa đọc: ${unreadCount}`,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { name: "bell" }), unreadCount ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: unreadCount }) : null]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: profile?.displayName ?? "Tài khoản" })]
			})
		]
	});
}
//#endregion
export { WorkspaceTopbar as default };
