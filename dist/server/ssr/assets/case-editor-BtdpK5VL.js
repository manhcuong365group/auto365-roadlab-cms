import { T as __toESM, b as require_react, t as require_jsx_runtime } from "../index.js";
import Link from "./link-B6R2H3TZ.js";
//#region app/workspace/cases/[caseId]/case-editor.tsx
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
var categoryLabels = {
	content: "Nội dung",
	evidence: "Evidence",
	seo: "SEO",
	technical: "Kỹ thuật",
	general: "Chung"
};
var formatDate = new Intl.DateTimeFormat("vi-VN", {
	day: "2-digit",
	month: "2-digit",
	year: "numeric",
	hour: "2-digit",
	minute: "2-digit"
});
async function readResponse(response) {
	if (response.ok) return response.json();
	const body = await response.json().catch(() => ({}));
	throw new Error(body.error?.code === "UNAUTHENTICATED" ? "SESSION_REQUIRED" : body.error?.message ?? "Không thể tải dữ liệu case.");
}
function CaseEditor({ caseId, mode }) {
	const [data, setData] = (0, import_react.useState)(null);
	const [feedback, setFeedback] = (0, import_react.useState)([]);
	const [assignments, setAssignments] = (0, import_react.useState)([]);
	const [audit, setAudit] = (0, import_react.useState)([]);
	const [form, setForm] = (0, import_react.useState)({
		title: "",
		summary: "",
		body: ""
	});
	const [error, setError] = (0, import_react.useState)("");
	const [notice, setNotice] = (0, import_react.useState)("");
	const [loading, setLoading] = (0, import_react.useState)(true);
	const [saving, setSaving] = (0, import_react.useState)(false);
	const [feedbackMessage, setFeedbackMessage] = (0, import_react.useState)("");
	const [feedbackCategory, setFeedbackCategory] = (0, import_react.useState)("general");
	const load = (0, import_react.useCallback)(async () => {
		setLoading(true);
		setError("");
		try {
			const [draft, feedbackResponse, assignmentsResponse, auditResponse] = await Promise.all([
				fetch(`/api/v1/case-lab/cases/${encodeURIComponent(caseId)}/draft`).then(readResponse),
				fetch(`/api/v1/case-lab/cases/${encodeURIComponent(caseId)}/feedback`).then(readResponse),
				fetch(`/api/v1/case-lab/cases/${encodeURIComponent(caseId)}/assignments`).then(readResponse),
				fetch(`/api/v1/case-lab/cases/${encodeURIComponent(caseId)}/audit`).then(readResponse)
			]);
			setData(draft);
			setForm(draft.draft.content);
			setFeedback(feedbackResponse.items);
			setAssignments(assignmentsResponse.items);
			setAudit(auditResponse.items);
		} catch (reason) {
			setError(reason instanceof Error ? reason.message : "Không thể tải dữ liệu case.");
		} finally {
			setLoading(false);
		}
	}, [caseId]);
	(0, import_react.useEffect)(() => {
		const task = window.setTimeout(() => {
			load();
		}, 0);
		return () => window.clearTimeout(task);
	}, [load]);
	async function saveDraft() {
		if (!data) return;
		setSaving(true);
		setError("");
		setNotice("");
		try {
			const saved = await fetch(`/api/v1/case-lab/cases/${encodeURIComponent(caseId)}/draft`, {
				method: "PUT",
				headers: { "content-type": "application/json" },
				body: JSON.stringify({
					...form,
					expectedRevision: data.draft.revision
				})
			}).then(readResponse);
			setData((current) => current ? {
				...saved,
				case: {
					...current.case,
					...saved.case,
					branchRef: current.case.branchRef,
					vehicleRef: current.case.vehicleRef,
					productRef: current.case.productRef
				}
			} : saved);
			setNotice(`Đã lưu phiên bản r${saved.draft.revision}.`);
			await load();
		} catch (reason) {
			setError(reason instanceof Error ? reason.message : "Không thể lưu bản nháp.");
		} finally {
			setSaving(false);
		}
	}
	async function createFeedback() {
		if (!data || feedbackMessage.trim().length < 3) return;
		setSaving(true);
		setError("");
		setNotice("");
		try {
			await fetch(`/api/v1/case-lab/cases/${encodeURIComponent(caseId)}/feedback`, {
				method: "POST",
				headers: { "content-type": "application/json" },
				body: JSON.stringify({
					revision: data.draft.revision,
					category: feedbackCategory,
					message: feedbackMessage.trim()
				})
			}).then(readResponse);
			setFeedbackMessage("");
			setNotice("Đã gửi feedback vào revision hiện tại.");
			await load();
		} catch (reason) {
			setError(reason instanceof Error ? reason.message : "Không thể gửi feedback.");
		} finally {
			setSaving(false);
		}
	}
	async function resolveFeedback(feedbackId) {
		setSaving(true);
		setError("");
		try {
			await fetch(`/api/v1/case-lab/feedback/${encodeURIComponent(feedbackId)}/resolve`, { method: "POST" }).then(readResponse);
			setNotice("Đã đánh dấu feedback đã xử lý.");
			await load();
		} catch (reason) {
			setError(reason instanceof Error ? reason.message : "Không thể cập nhật feedback.");
		} finally {
			setSaving(false);
		}
	}
	const title = mode === "review" ? "Review case" : "Soạn bài / case";
	if (loading) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
		className: "workspace-page",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
			className: "workspace-shell",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "workspace-loading",
				children: "Đang tải case…"
			})
		})
	});
	if (error && !data) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
		className: "workspace-page",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "workspace-shell",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				className: "workspace-back",
				href: "/workspace/cases",
				children: "← Case / bài viết"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "workspace-alert",
				role: "alert",
				children: error === "SESSION_REQUIRED" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "Phiên đăng nhập chưa sẵn sàng" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					className: "workspace-alert__link",
					href: `/login?return_to=/workspace/cases/${encodeURIComponent(caseId)}`,
					children: "Đăng nhập Case Lab →"
				})] }) : error
			})]
		})
	});
	if (!data) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
		className: "workspace-page",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "workspace-shell workspace-case-page",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					className: "workspace-back",
					href: "/workspace/cases",
					children: "← Case / bài viết"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "workspace-case-heading",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "workspace-eyebrow",
							children: [
								data.case.caseCode,
								" · ",
								data.case.branchRef
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", { children: title }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
							data.case.vehicleRef,
							" · ",
							data.case.productRef
						] })
					] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "workspace-case-actions",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: `workspace-status-pill workspace-status-pill--${data.case.workflowStatus}`,
							children: statusLabels[data.case.workflowStatus] ?? data.case.workflowStatus
						}), mode === "editor" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							className: "workspace-button workspace-button--ghost",
							href: `/workspace/cases/${encodeURIComponent(caseId)}/review`,
							children: "Mở review"
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							className: "workspace-button workspace-button--ghost",
							href: `/workspace/cases/${encodeURIComponent(caseId)}`,
							children: "Soạn bài"
						})]
					})]
				}),
				error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "workspace-alert",
					role: "alert",
					children: error
				}) : null,
				notice ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "workspace-notice",
					children: notice
				}) : null,
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "workspace-case-grid",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						className: "workspace-card workspace-editor-card",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "workspace-card__head",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "workspace-eyebrow",
									children: ["Revision r", data.draft.revision]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: "Nội dung bài viết" })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									className: "workspace-button",
									onClick: saveDraft,
									disabled: saving,
									children: saving ? "Đang lưu…" : "Lưu revision mới"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "workspace-field",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Tiêu đề" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									value: form.title,
									onChange: (event) => setForm({
										...form,
										title: event.target.value
									}),
									maxLength: 180
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "workspace-field",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Mô tả ngắn" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
									value: form.summary,
									onChange: (event) => setForm({
										...form,
										summary: event.target.value
									}),
									rows: 3,
									maxLength: 600
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "workspace-field",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Nội dung bài viết" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
									className: "workspace-editor-body",
									value: form.body,
									onChange: (event) => setForm({
										...form,
										body: event.target.value
									}),
									rows: 14,
									maxLength: 2e4,
									placeholder: "Viết nội dung bài review tại đây…"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "workspace-editor-note",
								children: "Mỗi lần lưu tạo revision mới, không ghi đè bản đang review."
							})
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
						className: "workspace-case-side",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
							className: "workspace-card",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "workspace-eyebrow",
									children: "Người phụ trách"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: "Phân công hiện tại" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "workspace-assignment-list",
									children: assignments.length ? assignments.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: item.user.displayName }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: item.role })] }, item.id)) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Chưa có phân công." })
								})
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
							className: "workspace-card",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "workspace-eyebrow",
									children: "Theo revision"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: "Lịch sử gần đây" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "workspace-audit-list",
									children: audit.slice(0, 5).map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: formatDate.format(new Date(item.createdAt)) }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: item.actor.displayName }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [item.action, item.revision ? ` · r${item.revision}` : ""] })
									] }, item.id))
								})
							]
						})]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "workspace-card workspace-feedback-panel",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "workspace-card__head",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "workspace-eyebrow",
								children: "Feedback review"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: mode === "review" ? "Luồng phản hồi" : "Phản hồi trên case" })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [feedback.filter((item) => item.status === "open").length, " mở"] })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "workspace-feedback-compose",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
									"aria-label": "Loại feedback",
									value: feedbackCategory,
									onChange: (event) => setFeedbackCategory(event.target.value),
									children: Object.entries(categoryLabels).map(([key, label]) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: key,
										children: label
									}, key))
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
									value: feedbackMessage,
									onChange: (event) => setFeedbackMessage(event.target.value),
									placeholder: "Nhập feedback cụ thể cho revision hiện tại",
									rows: 3,
									maxLength: 2e3
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									className: "workspace-button",
									onClick: createFeedback,
									disabled: saving || feedbackMessage.trim().length < 3,
									children: "Gửi feedback"
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "workspace-feedback-list",
							children: feedback.length ? feedback.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: categoryLabels[item.category] ?? item.category }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
									"r",
									item.revision,
									" · ",
									item.author.displayName,
									" · ",
									formatDate.format(new Date(item.createdAt))
								] })] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: item.message }),
								item.status === "open" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									className: "workspace-text-button",
									disabled: saving,
									onClick: () => resolveFeedback(item.id),
									children: "Đánh dấu đã xử lý →"
								}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: "Đã xử lý" })
							] }, item.id)) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "workspace-empty",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "Chưa có feedback." }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Reviewer có thể bắt đầu phản hồi ở revision này." })]
							})
						})
					]
				})
			]
		})
	});
}
//#endregion
export { CaseEditor as default };
