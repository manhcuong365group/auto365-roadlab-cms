import { D as __toESM, S as require_react, t as require_jsx_runtime } from "../index.js";
import Link from "./link-Bcu-ppP_.js";
//#region app/workspace/page.tsx
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var import_jsx_runtime = require_jsx_runtime();
var statusLabels = {
	draft: "Bản nháp",
	ready_for_review: "Chờ review",
	in_review: "Đang review",
	changes_requested: "Cần chỉnh sửa",
	technical_approved: "Đã qua IT",
	publishable: "Sẵn sàng xuất bản",
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
			arrow: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M5 12h14" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "m13 6 6 6-6 6" })] }),
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
	const [loading, setLoading] = (0, import_react.useState)(true);
	const [error, setError] = (0, import_react.useState)(null);
	async function load() {
		setLoading(true);
		setError(null);
		try {
			const dashboardResponse = await fetch("/api/v1/case-lab/dashboard");
			if (!dashboardResponse.ok) {
				const body = await dashboardResponse.json().catch(() => ({}));
				setError(body.error?.code === "UNAUTHENTICATED" ? "SESSION_REQUIRED" : body.error?.message ?? "Không thể tải dữ liệu vận hành. Hãy thử lại.");
				return;
			}
			setDashboard(await dashboardResponse.json());
		} catch {
			setError("Không thể kết nối tới Case Lab. Hãy kiểm tra phiên đăng nhập rồi thử lại.");
		} finally {
			setLoading(false);
		}
	}
	(0, import_react.useEffect)(() => {
		const task = window.setTimeout(() => {
			load();
		}, 0);
		return () => window.clearTimeout(task);
	}, []);
	const metrics = (0, import_react.useMemo)(() => [
		["Tổng case", dashboard?.summary.totalCases],
		["Được giao cho tôi", dashboard?.summary.assignedToMe],
		["Feedback đang mở", dashboard?.summary.openFeedback],
		["Thông báo chưa đọc", dashboard?.summary.unreadNotifications]
	], [dashboard]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
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
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: error === "SESSION_REQUIRED" ? "Phiên đăng nhập chưa sẵn sàng" : "Không thể tải workspace" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: error === "SESSION_REQUIRED" ? "Đăng nhập để xem số liệu và các case theo quyền tài khoản." : error }),
					error === "SESSION_REQUIRED" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						className: "workspace-alert__link",
						href: "/login?return_to=/workspace",
						children: "Đăng nhập Case Lab →"
					}) : null
				]
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
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "workspace-grid workspace-grid--secondary",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
					className: "workspace-card workspace-card--guide",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "workspace-eyebrow",
						children: "Quy trình dùng thật"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: "Bắt đầu đúng luồng" })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						href: "/workspace/guides",
						children: ["Kho hướng dẫn ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { name: "arrow" })]
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ol", {
						className: "workspace-steps",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "01" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Tạo và kiểm tra case" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Kiểm tra nguồn, chi nhánh và revision đang thực hiện." })] })] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "02" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Gửi review theo revision" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Content, OA/SEO Lead và IT cùng để lại feedback có ngữ cảnh." })] })] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "03" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Theo dõi và chốt xuất bản" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Dùng báo cáo và thông báo để không bỏ sót case đang chờ." })] })] })
						]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
					className: "workspace-card workspace-card--attention",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "workspace-eyebrow",
						children: "Cần chú ý"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: "Việc cần xử lý" })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						href: "/workspace/review",
						children: ["Mở review ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { name: "arrow" })]
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "workspace-attention",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Feedback đang mở" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: loading ? "—" : dashboard?.summary.openFeedback }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Phản hồi chưa được xử lý trong các case bạn có quyền." })
						] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Thông báo chưa đọc" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: loading ? "—" : dashboard?.summary.unreadNotifications }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Nhắc việc, phân công và feedback mới dành cho tài khoản của bạn." })
						] })]
					})]
				})]
			})
		]
	}) });
}
//#endregion
export { WorkspacePage as default };
