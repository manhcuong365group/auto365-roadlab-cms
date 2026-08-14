import { t as require_jsx_runtime, w as __toESM, y as require_react } from "../index.js";
import Link from "./link-CP_H_gWV.js";
import { a as generateZeroRekeyOutputs, c as sampleWorkOrders, i as formatVnd, l as submitDataIssue, n as createDraftFromWorkOrder, o as patchContent, r as evaluateZeroRekeyDraft, t as confirmMediaSet, u as submitForTechnicalReview } from "./zero-rekey-M2LkS-4b.js";
//#region app/studio/page.tsx
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var import_jsx_runtime = require_jsx_runtime();
var queueTabs = [
	{
		status: "ready",
		label: "Sẵn sàng viết"
	},
	{
		status: "missing_media",
		label: "Thiếu ảnh"
	},
	{
		status: "in_review",
		label: "Chờ duyệt"
	},
	{
		status: "changes_requested",
		label: "Bị trả sửa"
	},
	{
		status: "published",
		label: "Đã xuất bản"
	}
];
var steps = [
	{
		id: 1,
		label: "Xác nhận ca",
		note: "Phiếu việc tự nạp"
	},
	{
		id: 2,
		label: "Kiểm tra ảnh",
		note: "6 lõi + 2 bổ sung"
	},
	{
		id: 3,
		label: "Xem & gửi",
		note: "Preview · 4 gate"
	}
];
function StudioPage() {
	const [activeQueue, setActiveQueue] = (0, import_react.useState)("ready");
	const [order, setOrder] = (0, import_react.useState)(sampleWorkOrders[0]);
	const [draft, setDraft] = (0, import_react.useState)(() => createDraftFromWorkOrder(sampleWorkOrders[0]));
	const [activeStep, setActiveStep] = (0, import_react.useState)(1);
	const [saveState, setSaveState] = (0, import_react.useState)("saved");
	const [issueOpen, setIssueOpen] = (0, import_react.useState)(false);
	const [issueTarget, setIssueTarget] = (0, import_react.useState)("work_order");
	const [issueMessage, setIssueMessage] = (0, import_react.useState)("");
	const [previewMode, setPreviewMode] = (0, import_react.useState)("desktop");
	const saveTimer = (0, import_react.useRef)(null);
	const gate = (0, import_react.useMemo)(() => evaluateZeroRekeyDraft(order, draft), [order, draft]);
	const output = (0, import_react.useMemo)(() => generateZeroRekeyOutputs(order, draft), [order, draft]);
	const visibleOrders = sampleWorkOrders.filter((item) => item.queueStatus === activeQueue);
	const issueCounts = (0, import_react.useMemo)(() => steps.reduce((result, step) => {
		result[step.id] = gate.issues.filter((issue) => issue.step === step.id && issue.code !== "TECHNICAL_APPROVAL_REQUIRED").length;
		return result;
	}, {}), [gate.issues]);
	(0, import_react.useEffect)(() => () => {
		if (saveTimer.current) clearTimeout(saveTimer.current);
	}, []);
	const simulateServerSave = (next) => {
		setDraft(next);
		setSaveState("saving");
		if (saveTimer.current) clearTimeout(saveTimer.current);
		saveTimer.current = setTimeout(() => setSaveState("saved"), 650);
	};
	const openOrder = (nextOrder) => {
		setOrder(nextOrder);
		setDraft(createDraftFromWorkOrder(nextOrder));
		setActiveStep(nextOrder.queueStatus === "missing_media" ? 2 : 1);
		setIssueOpen(false);
		setIssueMessage("");
		setSaveState("saved");
	};
	const updateContribution = (key, value) => {
		simulateServerSave(patchContent(draft, { [key]: value }));
	};
	const toggleMediaConfirmation = (confirmed) => {
		simulateServerSave(confirmMediaSet(draft, confirmed));
	};
	const sendReview = () => {
		try {
			simulateServerSave(submitForTechnicalReview(order, draft));
		} catch {
			focusIssue(gate.issues.find((issue) => issue.code !== "TECHNICAL_APPROVAL_REQUIRED"));
		}
	};
	const reportIssue = () => {
		if (issueMessage.trim().length < 10) return;
		simulateServerSave(submitDataIssue(draft, {
			target: issueTarget,
			message: issueMessage.trim(),
			status: "submitted"
		}));
		setIssueOpen(false);
	};
	const focusIssue = (issue) => {
		if (!issue) return;
		setActiveStep(issue.step);
		window.setTimeout(() => {
			const id = issue.field === "customerNeed" ? "customer-need" : issue.field === "caseNote" ? "case-note" : issue.field === "media" ? "media-board" : "data-source";
			document.getElementById(id)?.focus();
			document.getElementById(id)?.scrollIntoView({
				behavior: "smooth",
				block: "center"
			});
		}, 80);
	};
	const actionableIssues = gate.issues.filter((issue) => issue.code !== "TECHNICAL_APPROVAL_REQUIRED");
	const mediaReady = draft.media.filter((asset) => asset.required && asset.url && asset.rightsStatus === "confirmed").length;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "zero-page",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("header", {
				className: "zero-header",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "zero-shell zero-header__inner",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							className: "zero-brand",
							href: "/",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "A365" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "CASE LAB STUDIO" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: "Production Zero‑Rekey · V2.0" })] })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "zero-pilot",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", {}), " Pilot tuyến Đèn"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("nav", {
							"aria-label": "Điều hướng Studio",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
									href: "#queue",
									children: "Ca xe"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									href: `/workspace/cases/${encodeURIComponent(order.id)}/review`,
									children: "Kỹ thuật duyệt"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									href: "/",
									children: "Bài V1.4"
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: `zero-save zero-save--${saveState}`,
							"aria-live": "polite",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {}), saveState === "saving" ? "Đang lưu máy chủ" : saveState === "saved" ? `Đã lưu · r${draft.revision}` : saveState === "offline" ? "Mất kết nối" : "Lưu lỗi"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							className: "zero-user",
							type: "button",
							"aria-label": "Tài khoản content Vinh",
							children: "V"
						})
					]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "zero-intro zero-shell",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "zero-kicker",
					children: "AUTO365 CASE LAB · DAILY CONTENT"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", { children: [
					"Chọn đúng ca. Thêm 2 ghi chú.",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("em", { children: "Gửi duyệt trong 3–6 phút." })
				] })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Xe, sản phẩm, giá, cấu hình, chi nhánh, nguồn, tác giả, reviewer và SEO đều lấy từ phiếu việc cùng catalog. Content không nhập lại và không thể sửa dữ liệu hệ thống." })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "zero-queue zero-shell",
				id: "queue",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "zero-queue__head",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "zero-kicker",
							children: "HÀNG ĐỢI THEO CASE ID"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: "Ca xe của hôm nay" })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "zero-search",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								"aria-hidden": "true",
								children: "⌕"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								"aria-label": "Tìm Case ID hoặc biển số",
								placeholder: "Tìm Case ID hoặc quét QR"
							})]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "zero-tabs",
						role: "tablist",
						"aria-label": "Trạng thái ca xe",
						children: queueTabs.map((tab) => {
							const count = sampleWorkOrders.filter((item) => item.queueStatus === tab.status).length;
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								role: "tab",
								"aria-selected": activeQueue === tab.status,
								className: activeQueue === tab.status ? "active" : "",
								onClick: () => setActiveQueue(tab.status),
								children: [tab.label, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: count })]
							}, tab.status);
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "zero-order-list",
						children: visibleOrders.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							className: `zero-order ${order.id === item.id ? "active" : ""}`,
							onClick: () => openOrder(item),
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "zero-order__status",
									children: queueLabel(item.queueStatus)
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("b", { children: [
									item.vehicle.make,
									" ",
									item.vehicle.model,
									" ",
									item.vehicle.year,
									" ",
									item.vehicle.trim
								] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("small", { children: [
									item.product.name,
									" · ",
									item.product.configuration
								] })] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", { children: "CASE ID" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", { children: item.caseId })] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", { children: "ẢNH" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dd", { children: [item.media.filter((asset) => asset.url).length, "/8"] })] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", { children: "ĐỒNG BỘ" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dd", { children: ["v", item.sourceVersion] })] })
								] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", {
									"aria-hidden": "true",
									children: "→"
								})
							]
						}, item.id))
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "zero-casebar zero-shell",
				id: "data-source",
				tabIndex: -1,
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "CASE ĐANG MỞ" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: draft.caseId })] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "PHIẾU VIỆC" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("b", { children: [
						order.id,
						" · v",
						order.sourceVersion
					] })] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "DỮ LIỆU" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("b", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", {}), " Đã đồng bộ"] })] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "NGUỒN" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: order.sourceSystem })] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => setIssueOpen((value) => !value),
						children: "Báo dữ liệu sai"
					})
				]
			}),
			issueOpen && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "zero-issue zero-shell",
				"aria-label": "Báo dữ liệu sai",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "ROUTE ĐÚNG CHỦ SỞ HỮU" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: "Không tự sửa dữ liệu nguồn" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Yêu cầu sẽ chuyển đến xưởng, quản trị catalog hoặc kế toán; chỉ lỗi hệ thống mới tạo ticket IT." })
					] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Nhóm dữ liệu" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
						value: issueTarget,
						onChange: (event) => setIssueTarget(event.target.value),
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "work_order",
								children: "Phiếu việc"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "catalog",
								children: "Catalog sản phẩm/xe"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "media",
								children: "Ảnh đúng ca"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "price",
								children: "Giá/VAT"
							})
						]
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Mô tả ngắn" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
						rows: 3,
						value: issueMessage,
						onChange: (event) => setIssueMessage(event.target.value),
						placeholder: "Ví dụ: phiên bản xe trên phiếu chưa đúng..."
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => setIssueOpen(false),
						children: "Hủy"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						disabled: issueMessage.trim().length < 10,
						onClick: reportIssue,
						children: "Gửi đúng bộ phận"
					})] })
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
				className: "zero-stepper zero-shell",
				"aria-label": "Ba bước tạo bài",
				children: steps.map((step) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					className: activeStep === step.id ? "active" : activeStep > step.id ? "done" : "",
					onClick: () => setActiveStep(step.id),
					"aria-current": activeStep === step.id ? "step" : void 0,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: activeStep > step.id ? "✓" : String(step.id).padStart(2, "0") }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("b", { children: [step.label, issueCounts[step.id] ? ` · ${issueCounts[step.id]} việc` : ""] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: step.note })] })]
				}, step.id))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "zero-workspace zero-shell",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "zero-editor",
					children: [
						activeStep === 1 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(StepPanel, {
							kicker: "BƯỚC 01 · 1–2 PHÚT",
							title: "Xác nhận dữ liệu tự nạp và thêm hai ghi chú",
							note: "Trường màu xám thuộc nguồn hệ thống. Nếu sai, dùng “Báo dữ liệu sai”; content không nhập lại.",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "zero-source-grid",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SourceItem, {
											label: "Xe",
											value: `${order.vehicle.make} ${order.vehicle.model} ${order.vehicle.year} ${order.vehicle.trim}`,
											source: "Phiếu việc"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SourceItem, {
											label: "Sản phẩm",
											value: order.product.name,
											source: `Catalog ${order.product.catalogVersion}`
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SourceItem, {
											label: "Cấu hình",
											value: order.product.configuration,
											source: "Phiếu việc"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SourceItem, {
											label: "Điểm thi công",
											value: order.branch.name,
											source: "Danh mục chi nhánh"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SourceItem, {
											label: "Giá sản phẩm",
											value: formatVnd(order.price.productAmount),
											source: order.price.vatIncluded ? "Đã gồm VAT" : "Chưa VAT"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SourceItem, {
											label: "Tác giả · Reviewer",
											value: `${order.author.name} · ${order.reviewer.name}`,
											source: "Tài khoản + phân công"
										})
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "zero-tech-snapshot",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "HIỆN TRẠNG / GIỚI HẠN" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: order.technical.conditionBefore })] }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "LÝ DO CẤU HÌNH" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: order.technical.choiceReason })] }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "NGHIỆM THU TẠI XƯỞNG" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: order.technical.qc })] })
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "zero-content-fields",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
										htmlFor: "customer-need",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "1. Nhu cầu thật của chủ xe" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("small", { children: [draft.content.customerNeed.length, "/240"] })] }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
												id: "customer-need",
												rows: 4,
												maxLength: 240,
												value: draft.content.customerNeed,
												"aria-invalid": draft.content.customerNeed.trim().length < 20,
												"aria-describedby": "customer-need-help",
												onChange: (event) => updateContribution("customerNeed", event.target.value)
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", {
												id: "customer-need-help",
												children: "Đã lấy từ cố vấn dịch vụ; content chỉ chỉnh câu chữ khi cần."
											})
										]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
										htmlFor: "case-note",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "2. Điểm khác biệt của ca xe" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("small", { children: [draft.content.caseNote.length, "/320"] })] }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
												id: "case-note",
												rows: 4,
												maxLength: 320,
												value: draft.content.caseNote,
												"aria-invalid": draft.content.caseNote.trim().length < 20,
												"aria-describedby": "case-note-help",
												onChange: (event) => updateContribution("caseNote", event.target.value),
												placeholder: "Ví dụ: hốc gầm còn zin, pát lắp trên bộ gá rời, chủ xe ưu tiên đi tỉnh..."
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", {
												id: "case-note-help",
												children: "Chỉ ghi điều quan sát được trong ca; không suy diễn thông số hay hiệu quả."
											})
										]
									})]
								})
							]
						}),
						activeStep === 2 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(StepPanel, {
							kicker: "BƯỚC 02 · 1–2 PHÚT",
							title: "Kiểm tra câu chuyện ảnh 6 + 2",
							note: "Xưởng tải ảnh theo Case ID/QR. Hệ thống gợi ý vai trò, kiểm checksum, chất lượng và quyền dùng trước khi ca xuất hiện ở đây.",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "zero-media-toolbar",
									id: "media-board",
									tabIndex: -1,
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("b", { children: [mediaReady, "/6 ảnh lõi sẵn sàng"] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [draft.media.filter((asset) => asset.url).length, "/8 ảnh đã nhận từ xưởng"] })] }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "zero-media-health",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "✓ Đúng Case ID" }),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "✓ Không trùng checksum" }),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "✓ Quyền dùng đã ghi nhận" })
											]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
											className: "zero-confirm",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
													type: "checkbox",
													checked: draft.mediaConfirmed,
													onChange: (event) => toggleMediaConfirmation(event.target.checked)
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "✓" }),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "Tôi đã xem và xác nhận bộ ảnh đúng ca" })
											]
										})
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "zero-media-grid",
									children: draft.media.map((asset, index) => {
										const complete = Boolean(asset.url && asset.checksum && asset.rightsStatus === "confirmed" && asset.caseId === draft.caseId);
										return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
											className: `zero-media-card ${complete ? "complete" : "missing"}`,
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", { children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: String(index + 1).padStart(2, "0") }),
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: asset.label }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("small", { children: [
														asset.required ? "BẮT BUỘC" : "BỔ SUNG",
														" · ",
														asset.role
													] })] }),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { children: complete ? "Đủ" : "Thiếu" })
												] }),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													className: "zero-media-image",
													children: asset.url ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
														src: asset.url,
														alt: asset.alt
													}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "Chưa có ảnh" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Xưởng bổ sung theo Case ID" })] })
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("footer", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: asset.capturedAt || "Chưa có ngày" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: asset.rightsStatus === "confirmed" ? "Quyền dùng: Đã xác nhận" : "Quyền dùng: Chờ" })] })
											]
										}, asset.id);
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "zero-media-note",
									children: "Production: ảnh được tải một lần từ điện thoại, lưu R2/CDN, đọc magic byte, kích thước và checksum; một ảnh lỗi có thể thử lại riêng mà không mất cả bộ."
								})
							]
						}),
						activeStep === 3 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(StepPanel, {
							kicker: "BƯỚC 03 · DƯỚI 1 PHÚT",
							title: "Xem đúng bài V1.4 rồi gửi kỹ thuật",
							note: "Preview production dùng cùng CaseRecord và renderer với bài public; draft luôn noindex.",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "zero-preview-tools",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										className: previewMode === "desktop" ? "active" : "",
										onClick: () => setPreviewMode("desktop"),
										children: "Desktop"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										className: previewMode === "mobile" ? "active" : "",
										onClick: () => setPreviewMode("mobile"),
										children: "Mobile"
									})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
										"Preview r",
										draft.revision,
										" · noindex"
									] })]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArticlePreview, {
									order,
									draft,
									output,
									mode: previewMode
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("details", {
									className: "zero-system-details",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("summary", { children: "Chi tiết SEO & AI Search do hệ thống khóa" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", { children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", { children: "H1" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", { children: output.h1 })] }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", { children: "Title" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", { children: output.metaTitle })] }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", { children: "Canonical" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", { children: output.canonical })] }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", { children: "Meta description" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", { children: output.metaDescription })] }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", { children: "Entity" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", { children: order.product.entityId })] }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", { children: "Internal link" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", { children: "Hub bi gầm → sản phẩm → Case Lab" })] })
									] })]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "zero-submit-card",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "KHI BẤM GỬI" }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", { children: "Kỹ thuật chỉ nhận đúng phần cần xác nhận" }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Cấu hình, pát/bộ gá, mức can thiệp, điện và QC. Reviewer không phải đọc lại SEO hoặc biên tập toàn bài." })
										] }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
												type: "checkbox",
												checked: draft.publishAfterApproval,
												onChange: (event) => simulateServerSave({
													...draft,
													publishAfterApproval: event.target.checked,
													revision: draft.revision + 1
												})
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "✓" }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "Tự xuất bản sau khi kỹ thuật duyệt và server chạy lại 4 gate" })
										] }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											type: "button",
											disabled: !gate.readyForReview || draft.workflowStatus === "in_review",
											onClick: sendReview,
											children: draft.workflowStatus === "in_review" ? "Đã gửi kỹ thuật duyệt" : "Gửi kỹ thuật duyệt →"
										})
									]
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "zero-step-actions",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									disabled: activeStep === 1,
									onClick: () => setActiveStep(activeStep - 1),
									children: "← Bước trước"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
									"Bước ",
									activeStep,
									"/3"
								] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									disabled: activeStep === 3,
									onClick: () => setActiveStep(activeStep + 1),
									children: "Bước tiếp theo →"
								})
							]
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
					className: "zero-gates",
					"aria-label": "Trạng thái bài",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "zero-gates__head",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "PUBLISH CONTROL · SERVER" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: gate.publishable ? "Đủ điều kiện xuất bản" : gate.readyForReview ? "Sẵn sàng gửi kỹ thuật" : `Còn ${actionableIssues.length} việc trước khi gửi` }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: "Client không thể tự đặt gate xanh." })
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(GateStatus, {
							label: "Nguồn đã sẵn sàng",
							note: "Phiếu việc · catalog · revision",
							ok: gate.gates.source
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(GateStatus, {
							label: "Ghi chú content đủ",
							note: "Nhu cầu · điểm khác biệt",
							ok: gate.gates.content
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(GateStatus, {
							label: "6–8 ảnh hợp lệ",
							note: "Vai trò · Case ID · checksum · quyền",
							ok: gate.gates.evidence
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(GateStatus, {
							label: "Hệ thống SEO sẵn sàng",
							note: "Owner · intent · canonical · link map",
							ok: gate.gates.seo
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(GateStatus, {
							label: "Kỹ thuật duyệt revision",
							note: `Reviewer: ${order.reviewer.name}`,
							ok: gate.gates.technical,
							pendingLabel: "Chờ sau khi gửi"
						}),
						actionableIssues.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "zero-issues",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "VIỆC CẦN LÀM" }), actionableIssues.map((issue) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								onClick: () => focusIssue(issue),
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: ownerLabel(issue.owner) }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: issue.message }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { children: "→" })
								]
							}, issue.code))]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "zero-no-rekey",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "CONTENT KHÔNG NHẬP" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Xe · sản phẩm · cấu hình · giá/VAT" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Chi nhánh · tác giả · reviewer · nguồn" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "H1 · meta · URL · canonical · schema" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Gate kỹ thuật · sitemap · trạng thái publish" })
							] })]
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "zero-mobile-action",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [activeStep, "/3"] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: gate.readyForReview ? "Sẵn sàng gửi duyệt" : `${actionableIssues.length} việc cần xử lý` })] }), activeStep < 3 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => setActiveStep(activeStep + 1),
					children: "Tiếp tục →"
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					disabled: !gate.readyForReview || draft.workflowStatus === "in_review",
					onClick: sendReview,
					children: "Gửi duyệt"
				})]
			})
		]
	});
}
function StepPanel({ kicker, title, note, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "zero-step",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: kicker }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: title }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: note })
		] }), children]
	});
}
function SourceItem({ label, value, source }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: label }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: value }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("small", { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", {}),
			" ",
			source,
			" · khóa sửa"
		] })
	] });
}
function GateStatus({ label, note, ok, pendingLabel = "Cần xử lý" }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: `zero-gate ${ok ? "ok" : "pending"}`,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: ok ? "✓" : "!" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: label }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: note })] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { children: ok ? "Đạt" : pendingLabel })
		]
	});
}
function ArticlePreview({ order, draft, output, mode }) {
	const hero = draft.media.find((asset) => asset.role === "vehicle_after");
	const low = draft.media.find((asset) => asset.role === "beam_low_after");
	const high = draft.media.find((asset) => asset.role === "beam_high_after");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: `zero-preview zero-preview--${mode}`,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "AUTO365" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "XE THẬT · SẢN PHẨM THẬT · TAY NGHỀ THẬT" })] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "zero-preview__hero",
				style: hero?.url ? { backgroundImage: `linear-gradient(90deg, rgba(6,8,12,.94), rgba(6,8,12,.2)), url(${hero.url})` } : void 0,
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["CASE LAB · ", draft.caseId] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: output.h1 }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: draft.content.customerNeed || "Nhu cầu khách hàng sẽ hiển thị tại đây." })
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "zero-preview__facts",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "CẤU HÌNH" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: order.product.configuration })] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "SẢN PHẨM" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: order.product.shortName })] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "CHI NHÁNH" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "Trụ Sở Chính" })] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "GIÁ" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: formatVnd(order.price.productAmount) })] })
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "zero-preview__body",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "TRẢ LỜI NHANH · DỮ LIỆU ĐÚNG CA" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", { children: "Camry trong bài đã lắp cấu hình nào?" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: output.answer }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("blockquote", { children: draft.content.caseNote || "Điểm khác biệt của ca xe sẽ xuất hiện tại đây." }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: [low, high].map((asset) => asset?.url ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("figure", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: asset.url,
						alt: asset.alt
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("figcaption", { children: asset.label })] }, asset.id) : null) })
				]
			})
		] })
	});
}
function queueLabel(status) {
	return status === "ready" ? "SẴN SÀNG VIẾT" : status === "missing_media" ? "THIẾU ẢNH" : status === "in_review" ? "CHỜ DUYỆT" : status === "changes_requested" ? "BỊ TRẢ SỬA" : "ĐÃ XUẤT BẢN";
}
function ownerLabel(owner) {
	return owner === "content" ? "CONTENT" : owner === "workshop" ? "XƯỞNG" : owner === "catalog" ? "DATA" : owner === "technical" ? "KỸ THUẬT" : "HỆ THỐNG";
}
//#endregion
export { StudioPage as default };
