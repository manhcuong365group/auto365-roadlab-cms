import { T as __toESM, b as require_react, t as require_jsx_runtime } from "../index.js";
import Link from "./link-CIvnmgxx.js";
//#region lib/road-lab-draft.ts
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var videoFilePattern = /\.(?:mp4|webm|mov|m4v)(?:$|[?#])/i;
var videoHosts = new Set([
	"youtube.com",
	"www.youtube.com",
	"youtu.be",
	"vimeo.com",
	"www.vimeo.com"
]);
function getRoadLabMediaUrls(value, limit = 12) {
	if (typeof value !== "string") return [];
	const urls = [];
	const seen = /* @__PURE__ */ new Set();
	for (const candidate of value.split(/\r?\n/)) {
		if (urls.length >= limit) break;
		try {
			const parsed = new URL(candidate.trim());
			if (parsed.protocol !== "https:" && parsed.protocol !== "http:" || seen.has(parsed.href)) continue;
			seen.add(parsed.href);
			urls.push(parsed.href);
		} catch {}
	}
	return urls;
}
function isRoadLabImageUrl(value) {
	try {
		const parsed = new URL(value);
		return !videoFilePattern.test(parsed.href) && !videoHosts.has(parsed.hostname.toLowerCase());
	} catch {
		return false;
	}
}
//#endregion
//#region app/workspace/cases/[caseId]/case-editor.tsx
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
var roadLabSteps = [
	{
		id: "publication",
		label: "Xuất bản",
		description: "Thông tin hiển thị của bài Road Lab."
	},
	{
		id: "vehicle",
		label: "Hồ sơ xe",
		description: "Bối cảnh xe, nhu cầu và điều kiện sử dụng thực tế."
	},
	{
		id: "configuration",
		label: "Cấu hình",
		description: "Vấn đề, cấu hình trước và giải pháp triển khai."
	},
	{
		id: "evidence",
		label: "Bằng chứng",
		description: "Đo đạc, ảnh/video và nguồn xác minh."
	},
	{
		id: "seo",
		label: "SEO & liên kết",
		description: "Metadata và bốn liên kết owner của Road Lab."
	},
	{
		id: "review",
		label: "Kiểm duyệt",
		description: "Checklist bàn giao trước khi gửi review."
	}
];
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
function MediaPreview({ urls, title, emptyMessage }) {
	if (!urls.length) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "road-lab-media-empty",
		children: emptyMessage
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "road-lab-media-grid",
		"aria-label": title,
		children: urls.map((url, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
			className: "road-lab-media-card",
			children: [isRoadLabImageUrl(url) ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
				src: url,
				alt: `${title} ${index + 1}`,
				loading: "lazy",
				onError: (event) => {
					event.currentTarget.style.display = "none";
				}
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "road-lab-media-file",
				children: "Video / liên kết"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
				className: "road-lab-media-link",
				href: url,
				target: "_blank",
				rel: "noreferrer",
				children: "Mở tệp ↗"
			})]
		}, url))
	});
}
function CaseEditor({ caseId, mode }) {
	const [data, setData] = (0, import_react.useState)(null);
	const [feedback, setFeedback] = (0, import_react.useState)([]);
	const [assignments, setAssignments] = (0, import_react.useState)([]);
	const [audit, setAudit] = (0, import_react.useState)([]);
	const [form, setForm] = (0, import_react.useState)(null);
	const [activeStep, setActiveStep] = (0, import_react.useState)("publication");
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
	function updateField(section, field, value) {
		setForm((current) => current ? {
			...current,
			[section]: {
				...current[section],
				[field]: value
			}
		} : current);
	}
	async function saveDraft() {
		if (!data || !form) return;
		setSaving(true);
		setError("");
		setNotice("");
		try {
			const saved = await fetch(`/api/v1/case-lab/cases/${encodeURIComponent(caseId)}/draft`, {
				method: "PUT",
				headers: { "content-type": "application/json" },
				body: JSON.stringify({
					content: form,
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
	const title = mode === "review" ? "Review Road Lab" : "Soạn Road Lab";
	const active = roadLabSteps.find((step) => step.id === activeStep);
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
	if (!data || !form) return null;
	const heroMedia = getRoadLabMediaUrls(form.publication.heroUrl, 1);
	const evidenceMedia = getRoadLabMediaUrls(form.evidence.proofUrls);
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
								"Road Lab · ",
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
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: "Hồ sơ Road Lab" })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									className: "workspace-button",
									onClick: saveDraft,
									disabled: saving,
									children: saving ? "Đang lưu…" : "Lưu revision mới"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
								className: "road-lab-steps",
								"aria-label": "Các bước soạn Road Lab",
								children: roadLabSteps.map((step, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "button",
									className: "road-lab-step",
									"aria-current": activeStep === step.id ? "step" : void 0,
									onClick: () => setActiveStep(step.id),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: String(index + 1).padStart(2, "0") }), step.label]
								}, step.id))
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "road-lab-step-heading",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "workspace-eyebrow",
										children: [
											"Bước ",
											String(roadLabSteps.findIndex((step) => step.id === activeStep) + 1).padStart(2, "0"),
											" / 06"
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", { children: active.label }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: active.description })
								]
							}),
							activeStep === "publication" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "workspace-field-grid",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
										className: "workspace-field workspace-field--wide",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Tiêu đề bài Road Lab" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											value: form.publication.title,
											onChange: (event) => updateField("publication", "title", event.target.value),
											maxLength: 180
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
										className: "workspace-field workspace-field--wide",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Tóm tắt" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
											value: form.publication.summary,
											onChange: (event) => updateField("publication", "summary", event.target.value),
											rows: 3,
											maxLength: 600
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
										className: "workspace-field workspace-field--wide",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Kết luận mở đầu (answer-first)" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
											value: form.publication.answerFirst,
											onChange: (event) => updateField("publication", "answerFirst", event.target.value),
											rows: 4,
											maxLength: 1200,
											placeholder: "Kết quả chính người đọc cần biết ngay…"
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
										className: "workspace-field workspace-field--wide",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Ảnh hero (URL)" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											type: "url",
											value: form.publication.heroUrl,
											onChange: (event) => updateField("publication", "heroUrl", event.target.value),
											placeholder: "https://…"
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "workspace-field workspace-field--wide",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Xem trước ảnh hero" }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MediaPreview, {
												urls: heroMedia,
												title: "Ảnh hero",
												emptyMessage: "Nhập URL ảnh công khai để xem trước tại đây."
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "road-lab-storage-note",
												children: "Ảnh được lưu theo URL trong revision. Upload tệp/R2 chưa nằm trong bản này."
											})
										]
									})
								]
							}) : null,
							activeStep === "vehicle" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "workspace-field-grid",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
										className: "workspace-field",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Xe thực tế" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											value: form.vehicle.vehicleName,
											onChange: (event) => updateField("vehicle", "vehicleName", event.target.value)
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
										className: "workspace-field",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Đời xe" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											value: form.vehicle.modelYear,
											onChange: (event) => updateField("vehicle", "modelYear", event.target.value)
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
										className: "workspace-field",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "ODO / số km" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											value: form.vehicle.odometer,
											onChange: (event) => updateField("vehicle", "odometer", event.target.value)
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
										className: "workspace-field",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Giai đoạn thi công" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											value: form.vehicle.installationStage,
											onChange: (event) => updateField("vehicle", "installationStage", event.target.value),
											placeholder: "Trước, trong hoặc sau thi công"
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
										className: "workspace-field workspace-field--wide",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Nhu cầu chính" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
											value: form.vehicle.primaryNeed,
											onChange: (event) => updateField("vehicle", "primaryNeed", event.target.value),
											rows: 3
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
										className: "workspace-field workspace-field--wide",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Bối cảnh sử dụng" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
											value: form.vehicle.usageConditions,
											onChange: (event) => updateField("vehicle", "usageConditions", event.target.value),
											rows: 3
										})]
									})
								]
							}) : null,
							activeStep === "configuration" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "workspace-field-grid",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
										className: "workspace-field workspace-field--wide",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Vấn đề ban đầu" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
											value: form.configuration.problem,
											onChange: (event) => updateField("configuration", "problem", event.target.value),
											rows: 3
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
										className: "workspace-field",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Cấu hình trước" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
											value: form.configuration.beforeConfig,
											onChange: (event) => updateField("configuration", "beforeConfig", event.target.value),
											rows: 4
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
										className: "workspace-field",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Cấu hình thực tế" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
											value: form.configuration.actualConfig,
											onChange: (event) => updateField("configuration", "actualConfig", event.target.value),
											rows: 4
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
										className: "workspace-field",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Sản phẩm chính" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											value: form.configuration.productName,
											onChange: (event) => updateField("configuration", "productName", event.target.value)
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
										className: "workspace-field",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Vật tư / phụ kiện" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											value: form.configuration.materials,
											onChange: (event) => updateField("configuration", "materials", event.target.value)
										})]
									})
								]
							}) : null,
							activeStep === "evidence" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "workspace-field-grid",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
										className: "workspace-field",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Đo đạc / thông số" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
											value: form.evidence.measurement,
											onChange: (event) => updateField("evidence", "measurement", event.target.value),
											rows: 4
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
										className: "workspace-field",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Kết quả thực tế" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
											value: form.evidence.resultSummary,
											onChange: (event) => updateField("evidence", "resultSummary", event.target.value),
											rows: 4
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
										className: "workspace-field workspace-field--wide",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Danh sách URL ảnh / video" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
											value: form.evidence.proofUrls,
											onChange: (event) => updateField("evidence", "proofUrls", event.target.value),
											rows: 4,
											placeholder: "Mỗi URL một dòng"
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "workspace-field workspace-field--wide",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Xem trước bằng chứng" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MediaPreview, {
											urls: evidenceMedia,
											title: "Bằng chứng",
											emptyMessage: "Nhập từng URL ảnh hoặc video công khai, mỗi URL một dòng."
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
										className: "workspace-field workspace-field--wide",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Nguồn xác minh / ghi chú" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
											value: form.evidence.sourceNotes,
											onChange: (event) => updateField("evidence", "sourceNotes", event.target.value),
											rows: 4
										})]
									})
								]
							}) : null,
							activeStep === "seo" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "workspace-field-grid",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
										className: "workspace-field",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Slug" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											value: form.seo.slug,
											onChange: (event) => updateField("seo", "slug", event.target.value)
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
										className: "workspace-field",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Meta title" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											value: form.seo.metaTitle,
											onChange: (event) => updateField("seo", "metaTitle", event.target.value),
											maxLength: 180
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
										className: "workspace-field workspace-field--wide",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Meta description" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
											value: form.seo.metaDescription,
											onChange: (event) => updateField("seo", "metaDescription", event.target.value),
											rows: 3,
											maxLength: 320
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "road-lab-linked-owners workspace-field--wide",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Liên kết owner" }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Road Lab dùng bốn quan hệ cố định, không phải chọn loại bài." }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
													className: "workspace-field",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Road Case ID" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
														value: form.seo.roadCaseId,
														onChange: (event) => updateField("seo", "roadCaseId", event.target.value)
													})]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
													className: "workspace-field",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Proof Lab ID" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
														value: form.seo.proofLabId,
														onChange: (event) => updateField("seo", "proofLabId", event.target.value)
													})]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
													className: "workspace-field",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Brand Pillar ID" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
														value: form.seo.brandPillarId,
														onChange: (event) => updateField("seo", "brandPillarId", event.target.value)
													})]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
													className: "workspace-field",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Product Owner ID" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
														value: form.seo.productOwnerId,
														onChange: (event) => updateField("seo", "productOwnerId", event.target.value)
													})]
												})
											] })
										]
									})
								]
							}) : null,
							activeStep === "review" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "road-lab-review",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Đánh dấu mục đã chuẩn bị trước khi gửi review. Việc duyệt vẫn đi theo luồng review hiện tại." }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "checkbox",
										checked: form.review.contentChecked,
										onChange: (event) => updateField("review", "contentChecked", event.target.checked)
									}), " Nội dung và answer-first đã kiểm tra"] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "checkbox",
										checked: form.review.evidenceChecked,
										onChange: (event) => updateField("review", "evidenceChecked", event.target.checked)
									}), " Bằng chứng và nguồn xác minh đã đủ"] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "checkbox",
										checked: form.review.seoChecked,
										onChange: (event) => updateField("review", "seoChecked", event.target.checked)
									}), " Metadata và liên kết owner đã kiểm tra"] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "checkbox",
										checked: form.review.technicalChecked,
										onChange: (event) => updateField("review", "technicalChecked", event.target.checked)
									}), " Cấu hình kỹ thuật đã sẵn sàng review"] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
										className: "workspace-field",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Ghi chú bàn giao" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
											value: form.review.reviewNote,
											onChange: (event) => updateField("review", "reviewNote", event.target.value),
											rows: 4,
											placeholder: "Điểm cần reviewer tập trung kiểm tra…"
										})]
									})
								]
							}) : null,
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
