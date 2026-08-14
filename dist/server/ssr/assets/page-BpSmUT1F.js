import { t as require_jsx_runtime, w as __toESM, y as require_react } from "../index.js";
import Link from "./link-CP_H_gWV.js";
//#region app/workspace/page.tsx
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var import_jsx_runtime = require_jsx_runtime();
var statusLabels = {
	draft: "Bản nháp",
	in_review: "Đang review",
	changes_requested: "Cần chỉnh sửa",
	approved: "Đã duyệt",
	published: "Đã xuất bản"
};
function formatDate(value) {
	const date = new Date(value);
	return Number.isNaN(date.getTime()) ? "Chưa có thời gian" : new Intl.DateTimeFormat("vi-VN", {
		day: "2-digit",
		month: "2-digit",
		hour: "2-digit",
		minute: "2-digit"
	}).format(date);
}
function Icon({ name }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("svg", {
		"aria-hidden": "true",
		viewBox: "0 0 24 24",
		fill: "none",
		stroke: "currentColor",
		strokeWidth: "1.8",
		children: {
			grid: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
					x: "4",
					y: "4",
					width: "6",
					height: "6",
					rx: "1"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
					x: "14",
					y: "4",
					width: "6",
					height: "6",
					rx: "1"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
					x: "4",
					y: "14",
					width: "6",
					height: "6",
					rx: "1"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
					x: "14",
					y: "14",
					width: "6",
					height: "6",
					rx: "1"
				})
			] }),
			arrow: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M5 12h14" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "m13 6 6 6-6 6" })] }),
			bell: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M18 9a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M10 22h4" })] }),
			refresh: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M20 11a8 8 0 0 0-14.9-3L3 10" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M3 4v6h6" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M4 13a8 8 0 0 0 14.9 3L21 14" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M21 20v-6h-6" })
			] })
		}[name]
	});
}
function WorkspacePage() {
	const [dashboard, setDashboard] = (0, import_react.useState)(null);
	const [profile, setProfile] = (0, import_react.useState)(null);
	const [loading, setLoading] = (0, import_react.useState)(true);
	const [error, setError] = (0, import_react.useState)(null);
	async function load() {
		setLoading(true);
		setError(null);
		try {
			const [dashboardResponse, profileResponse] = await Promise.all([fetch("/api/v1/case-lab/dashboard"), fetch("/api/v1/case-lab/me")]);
			if (!dashboardResponse.ok || !profileResponse.ok) {
				setError((await (dashboardResponse.ok ? profileResponse : dashboardResponse).json().catch(() => ({}))).error?.message ?? "Không thể tải dữ liệu vận hành. Hãy thử lại.");
				return;
			}
			setDashboard(await dashboardResponse.json());
			setProfile(await profileResponse.json());
		} catch {
			setError("Không thể kết nối tới Case Lab. Hãy kiểm tra phiên đăng nhập rồi thử lại.");
		} finally {
			setLoading(false);
		}
	}
	(0, import_react.useEffect)(() => {
		load();
	}, []);
	const metrics = (0, import_react.useMemo)(() => [
		["Tổng case", dashboard?.summary.totalCases],
		["Được giao cho tôi", dashboard?.summary.assignedToMe],
		["Feedback đang mở", dashboard?.summary.openFeedback],
		["Thông báo chưa đọc", dashboard?.summary.unreadNotifications]
	], [dashboard]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "workspace-page",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
			className: "workspace-topbar",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					className: "workspace-brand",
					href: "/workspace",
					"aria-label": "Case Lab Workspace",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "365" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "CASE LAB" })]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("nav", {
					"aria-label": "Điều hướng workspace",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							className: "is-active",
							href: "/workspace",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { name: "grid" }), "Tổng quan"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							href: "/workspace/cases",
							children: "Case / bài viết"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							href: "/workspace/reports",
							children: "Báo cáo"
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "workspace-profile",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { name: "bell" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: profile?.displayName ?? "Tài khoản" })]
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "workspace-shell",
			"aria-labelledby": "workspace-title",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "workspace-heading",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "workspace-eyebrow",
							children: "Vận hành nội dung · dữ liệu thật"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
							id: "workspace-title",
							children: "Case Lab Workspace"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Dữ liệu vận hành theo thời gian thực, phân theo quyền và chi nhánh của bạn." })
					] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						className: "workspace-refresh",
						type: "button",
						onClick: () => void load(),
						disabled: loading,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { name: "refresh" }), loading ? "Đang tải" : "Làm mới"]
					})]
				}),
				error ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "workspace-alert",
					role: "alert",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "Chưa có phiên làm việc" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: error })]
				}) : null,
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
					className: "workspace-metrics",
					"aria-label": "Tóm tắt vận hành",
					children: metrics.map(([label, value]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
						className: "workspace-metric",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: label }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: loading ? "—" : value }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: loading ? "Đang tải dữ liệu vận hành" : "Cập nhật từ Case Lab" })
						]
					}, label))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "workspace-grid",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
						className: "workspace-card workspace-card--cases",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "workspace-eyebrow",
								children: "Ưu tiên hiện tại"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: "Case theo dõi" })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
								href: "/workspace/cases",
								children: ["Xem tất cả ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { name: "arrow" })]
							})] }),
							loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "workspace-loading",
								children: "Đang tải dữ liệu vận hành…"
							}) : null,
							!loading && !error && dashboard?.cases.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "workspace-empty",
								children: "Chưa có case nào trong phạm vi quyền hiện tại."
							}) : null,
							!loading && dashboard?.cases.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "workspace-table",
								role: "table",
								"aria-label": "Danh sách case",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "workspace-table__head",
									role: "row",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Case" }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Trạng thái" }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Cập nhật" })
									]
								}), dashboard.cases.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
									href: `/workspace/cases/${encodeURIComponent(item.id)}`,
									className: "workspace-row",
									role: "row",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: item.caseCode }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("small", { children: [
											item.branchRef,
											" · Revision ",
											item.currentRevision
										] })] }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: `status status--${item.workflowStatus}` }), statusLabels[item.workflowStatus] ?? item.workflowStatus] }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [formatDate(item.updatedAt), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { name: "arrow" })] })
									]
								}, item.id))]
							}) : null
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
						className: "workspace-card workspace-card--activity",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("header", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "workspace-eyebrow",
								children: "Theo revision"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: "Lịch sử của bạn" })] }) }),
							loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "workspace-loading",
								children: "Đang tải dữ liệu vận hành…"
							}) : null,
							!loading && !error && dashboard?.activity.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "workspace-empty",
								children: "Chưa có thao tác nào được ghi nhận."
							}) : null,
							!loading && dashboard?.activity.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
								className: "workspace-activity",
								children: dashboard.activity.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", {}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: item.action.replaceAll(".", " · ") }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
									item.caseId ?? "Tài khoản",
									" · ",
									formatDate(item.createdAt)
								] })] })] }, item.id))
							}) : null
						]
					})]
				})
			]
		})]
	});
}
//#endregion
export { WorkspacePage as default };
