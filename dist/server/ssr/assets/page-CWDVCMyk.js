import { t as require_jsx_runtime, w as __toESM, y as require_react } from "../index.js";
import { c as sampleWorkOrders, d as Link, n as createDraftFromWorkOrder, o as patchContent, r as evaluateZeroRekeyDraft, s as recordTechnicalDecision, t as confirmMediaSet, u as submitForTechnicalReview } from "./zero-rekey-BmpFD0-X.js";
//#region app/studio/review/page.tsx
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var import_jsx_runtime = require_jsx_runtime();
var order = sampleWorkOrders[0];
function readyReviewDraft() {
	let draft = createDraftFromWorkOrder(order);
	draft = patchContent(draft, { caseNote: "Hốc gầm còn nguyên trạng, bộ gá rời được dùng để hạn chế can thiệp vào chi tiết zin." });
	draft = confirmMediaSet(draft, true);
	return submitForTechnicalReview(order, draft);
}
function TechnicalReviewPage() {
	const [draft, setDraft] = (0, import_react.useState)(readyReviewDraft);
	const [note, setNote] = (0, import_react.useState)("");
	const gate = (0, import_react.useMemo)(() => evaluateZeroRekeyDraft(order, draft), [draft]);
	const decide = (decision) => {
		try {
			setDraft(recordTechnicalDecision(order, draft, {
				actorRole: "technical_reviewer",
				reviewerRef: order.reviewer.ref,
				expectedRevision: draft.revision,
				decision,
				note
			}));
		} catch {
			setNote("Revision đã thay đổi. Vui lòng tải lại bản mới trước khi duyệt.");
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "review-page",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("header", {
				className: "zero-header",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "zero-shell zero-header__inner",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							className: "zero-brand",
							href: "/studio",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "A365" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "TECHNICAL REVIEW" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: "Case Lab Studio · V2.0" })] })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "zero-pilot",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", {}),
								" Reviewer: ",
								order.reviewer.name
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							href: "/studio",
							children: "← Về Content Studio"
						}) }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "zero-save zero-save--saved",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {}),
								" Revision r",
								draft.revision
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							className: "zero-user",
							type: "button",
							children: "Đ"
						})
					]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "review-hero zero-shell",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "zero-kicker",
					children: "HÀNG ĐỢI KỸ THUẬT · 1–2 PHÚT/CASE"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", { children: [
					"Chỉ xác nhận điều kỹ thuật.",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("em", { children: "Không đọc lại toàn bài SEO." })
				] })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "review-counter",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "CHỜ DUYỆT" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "01" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: "Đúng reviewer · đúng chi nhánh" })
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "review-case zero-shell",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["CASE ID · ", order.caseId] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", { children: [
						order.vehicle.make,
						" ",
						order.vehicle.model,
						" ",
						order.vehicle.year,
						" ",
						order.vehicle.trim
					] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
						order.product.name,
						" · ",
						order.product.configuration
					] })
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "review-revision",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "REVISION KHÓA" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("b", { children: ["r", draft.revision] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: "Approval chỉ hợp lệ cho revision này" })
					]
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "review-grid",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "review-section-title",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "01" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "Cấu hình & phương án thi công" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: "Từ phiếu việc và catalog" })] })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
							className: "review-facts",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", { children: "Sản phẩm" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", { children: order.product.name })] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", { children: "Cấu hình" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", { children: order.product.configuration })] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", { children: "Tháo cản" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", { children: factLabel(order.technical.removedBumper) })] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", { children: "Cắt chi tiết zin" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", { children: factLabel(order.technical.originalCut) })] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", { children: "Pát / bộ gá" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", { children: order.technical.bracket })] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", { children: "Relay · cầu chì" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dd", { children: [
									factLabel(order.technical.relay),
									" · ",
									factLabel(order.technical.fuse)
								] })] })
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "review-section-title",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "02" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "Kết quả QC & giới hạn claim" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: "Phần reviewer chịu trách nhiệm" })] })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "review-claim",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "NGHIỆM THU" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: order.technical.qc })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "review-claim warning",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "GIỚI HẠN DỮ LIỆU" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: order.technical.conditionBefore })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "review-section-title",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "03" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "Ảnh bằng chứng lõi" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: "6 vai trò · đúng Case ID" })] })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "review-media",
							children: draft.media.filter((asset) => asset.required).map((asset) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("figure", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
								src: asset.url,
								alt: asset.alt
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("figcaption", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: asset.label }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["✓ ", asset.caseId] })] })] }, asset.id))
						})
					] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "review-gate",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: gate.gates.source && gate.gates.content && gate.gates.evidence && gate.gates.seo ? "✓" : "!" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "4 gate trước kỹ thuật đã đạt" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: "Nguồn · content · media · SEO" })] })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "review-owner",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "REVIEWER ĐƯỢC PHÂN CÔNG" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: order.reviewer.name }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: "Người khác không thể duyệt qua API." })
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "review-note",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Ghi chú duyệt / yêu cầu sửa" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
								rows: 5,
								value: note,
								onChange: (event) => setNote(event.target.value),
								placeholder: "Chỉ ghi phần kỹ thuật cần điều chỉnh..."
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							className: "review-return",
							type: "button",
							disabled: draft.workflowStatus !== "in_review",
							onClick: () => decide("changes_requested"),
							children: "Yêu cầu content sửa"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							className: "review-approve",
							type: "button",
							disabled: draft.workflowStatus !== "in_review",
							onClick: () => decide("approved"),
							children: draft.workflowStatus === "publishable" ? "✓ Đã duyệt · Sẵn sàng xuất bản" : "Duyệt kỹ thuật revision này"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Production ghi actor, revision digest, quyết định và thời gian vào audit log; client không gửi được `technicalApproved=true`." })
					] })]
				})]
			})
		]
	});
}
function factLabel(value) {
	return value === "yes" ? "Có" : value === "no" ? "Không" : "Chưa xác nhận";
}
//#endregion
export { TechnicalReviewPage as default };
