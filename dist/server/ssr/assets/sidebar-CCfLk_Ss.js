import { t as require_jsx_runtime } from "../index.js";
import Link from "./link-C4SWyAck.js";
import { t as usePathname } from "./navigation-BZ1nfxFD.js";
//#region app/workspace/sidebar.tsx
var import_jsx_runtime = require_jsx_runtime();
var items = [
	[
		"Tổng quan",
		"/workspace",
		"01"
	],
	[
		"Case / bài viết",
		"/workspace/cases",
		"02"
	],
	[
		"Trung tâm review",
		"/workspace/review",
		"03"
	],
	[
		"Kho hướng dẫn",
		"/workspace/guides",
		"04"
	],
	[
		"Báo cáo",
		"/workspace/reports",
		"05"
	],
	[
		"Thông báo",
		"/workspace/notifications",
		"06"
	]
];
function WorkspaceSidebar() {
	const pathname = usePathname();
	async function signOut() {
		if ((await fetch("/api/auth/logout", { method: "POST" })).ok) window.location.assign("/login");
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
		className: "workspace-sidebar",
		"aria-label": "Điều hướng Case Lab",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
				className: "workspace-sidebar__brand",
				href: "/workspace",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "365" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "CASE LAB" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: "EDITORIAL OPS" })] })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
				className: "workspace-sidebar__nav",
				children: items.map(([label, href, number]) => {
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						className: (href === "/workspace" ? pathname === href : pathname.startsWith(href)) ? "is-active" : "",
						href,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { children: number }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: label })]
					}, label);
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "workspace-sidebar__bottom",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "KHÔNG GIAN LÀM VIỆC" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						href: "/workspace/cases",
						children: ["Việc của tôi ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "→" })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						href: "/workspace/review",
						children: ["Được giao ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "→" })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						className: "workspace-sidebar__logout",
						onClick: () => {
							signOut();
						},
						children: ["Đăng xuất ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "→" })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "workspace-sidebar__user",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "MC" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "Minh Cường" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: "Content · Pilot tuyến Đen" })] })]
					})
				]
			})
		]
	});
}
//#endregion
export { WorkspaceSidebar as default };
