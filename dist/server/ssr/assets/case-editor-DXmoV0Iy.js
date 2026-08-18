import { D as __toESM, S as require_react, t as require_jsx_runtime } from "../index.js";
import Link from "./link-Cpwhskqh.js";
import { n as isRoadLabImageUrl, t as getRoadLabMediaUrls } from "./road-lab-draft-DWlCLesN.js";
//#region lib/case-draft.ts
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
function templateKeyForContentType(contentType) {
	switch (contentType) {
		case "proof": return "proof_lab";
		case "brand": return "brand_story";
		case "product": return "product_spotlight";
		default: return "road_lab";
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
var formatDate = new Intl.DateTimeFormat("vi-VN", {
	day: "2-digit",
	month: "2-digit",
	year: "numeric",
	hour: "2-digit",
	minute: "2-digit"
});
var templateLabels = {
	road_lab: "Road Lab",
	proof_lab: "Proof Lab",
	brand_story: "Brand Story",
	product_spotlight: "Product Spotlight"
};
var stepsByTemplate = {
	road_lab: [
		{
			id: "publication",
			number: "01",
			label: "Xuất bản",
			hint: "Thông tin hiển thị của bài Road Lab."
		},
		{
			id: "vehicle",
			number: "02",
			label: "Hồ sơ xe",
			hint: "Bối cảnh xe, nhu cầu và điều kiện sử dụng thực tế."
		},
		{
			id: "configuration",
			number: "03",
			label: "Cấu hình",
			hint: "Vấn đề, cấu hình trước và giải pháp triển khai."
		},
		{
			id: "evidence",
			number: "04",
			label: "Bằng chứng",
			hint: "Đo đạc, ảnh/video và nguồn xác minh."
		},
		{
			id: "seo",
			number: "05",
			label: "SEO & liên kết",
			hint: "Metadata và bốn liên kết owner."
		},
		{
			id: "extended",
			number: "06",
			label: "Mở rộng biên tập",
			hint: "Tác giả, nguồn, timeline, known/unknown, QC và FAQ."
		},
		{
			id: "review",
			number: "07",
			label: "Kiểm duyệt",
			hint: "Checklist bàn giao trước khi gửi review."
		}
	],
	proof_lab: [
		{
			id: "publication",
			number: "01",
			label: "Xuất bản",
			hint: "Thông tin hiển thị của bài Proof Lab."
		},
		{
			id: "verification",
			number: "02",
			label: "Đối tượng nghiệm thu",
			hint: "Phương pháp đo, tiêu chuẩn đối chiếu và người xác minh."
		},
		{
			id: "findings",
			number: "03",
			label: "Kết quả đo",
			hint: "Số liệu trước/sau, kết luận và sai lệch."
		},
		{
			id: "evidence",
			number: "04",
			label: "Bằng chứng",
			hint: "Đo đạc, ảnh/video và nguồn xác minh."
		},
		{
			id: "seo",
			number: "05",
			label: "SEO & liên kết",
			hint: "Metadata và bốn liên kết owner."
		},
		{
			id: "extended",
			number: "06",
			label: "Mở rộng biên tập",
			hint: "Tác giả, nguồn, timeline, known/unknown, QC và FAQ."
		},
		{
			id: "review",
			number: "07",
			label: "Kiểm duyệt",
			hint: "Checklist bàn giao trước khi gửi review."
		}
	],
	brand_story: [
		{
			id: "publication",
			number: "01",
			label: "Xuất bản",
			hint: "Thông tin hiển thị của bài thương hiệu."
		},
		{
			id: "positioning",
			number: "02",
			label: "Định vị thương hiệu",
			hint: "Đối tượng, thông điệp chính và điểm khác biệt."
		},
		{
			id: "support",
			number: "03",
			label: "Luận cứ hỗ trợ",
			hint: "Số liệu và bằng chứng xã hội hỗ trợ định vị."
		},
		{
			id: "evidence",
			number: "04",
			label: "Bằng chứng",
			hint: "Ảnh/video và nguồn xác minh."
		},
		{
			id: "seo",
			number: "05",
			label: "SEO & liên kết",
			hint: "Metadata và bốn liên kết owner."
		},
		{
			id: "extended",
			number: "06",
			label: "Mở rộng biên tập",
			hint: "Tác giả, nguồn, timeline, known/unknown, QC và FAQ."
		},
		{
			id: "review",
			number: "07",
			label: "Kiểm duyệt",
			hint: "Checklist bàn giao trước khi gửi review."
		}
	],
	product_spotlight: [
		{
			id: "publication",
			number: "01",
			label: "Xuất bản",
			hint: "Thông tin hiển thị của bài sản phẩm."
		},
		{
			id: "productInfo",
			number: "02",
			label: "Thông tin sản phẩm",
			hint: "Thông số, tính năng nổi bật và trường hợp sử dụng."
		},
		{
			id: "comparison",
			number: "03",
			label: "So sánh",
			hint: "Lựa chọn thay thế và lợi thế cạnh tranh."
		},
		{
			id: "evidence",
			number: "04",
			label: "Bằng chứng",
			hint: "Ảnh/video và nguồn xác minh."
		},
		{
			id: "seo",
			number: "05",
			label: "SEO & liên kết",
			hint: "Metadata và bốn liên kết owner."
		},
		{
			id: "extended",
			number: "06",
			label: "Mở rộng biên tập",
			hint: "Tác giả, nguồn, timeline, known/unknown, QC và FAQ."
		},
		{
			id: "review",
			number: "07",
			label: "Kiểm duyệt",
			hint: "Checklist bàn giao trước khi gửi review."
		}
	]
};
async function readResponse(response) {
	if (response.ok) return response.json();
	const body = await response.json().catch(() => ({}));
	throw new Error(body.error?.code === "UNAUTHENTICATED" ? "SESSION_REQUIRED" : body.error?.message ?? "Không thể tải dữ liệu case.");
}
async function readUploadResponse(response) {
	const body = await response.json().catch(() => ({}));
	if (!response.ok || !body.url) throw new Error(body.error?.message ?? "Tải ảnh thất bại.");
	return { url: body.url };
}
function ImageUploadButton({ onUploaded, multiple }) {
	const [uploading, setUploading] = (0, import_react.useState)(false);
	const [error, setError] = (0, import_react.useState)(null);
	const handleFiles = (0, import_react.useCallback)(async (files) => {
		if (!files || !files.length) return;
		setUploading(true);
		setError(null);
		try {
			for (const file of Array.from(files)) {
				const body = new FormData();
				body.append("file", file);
				const { url } = await readUploadResponse(await fetch("/api/v1/case-lab/uploads", {
					method: "POST",
					body
				}));
				onUploaded(url);
			}
		} catch (uploadError) {
			setError(uploadError instanceof Error ? uploadError.message : "Tải ảnh thất bại.");
		} finally {
			setUploading(false);
		}
	}, [onUploaded]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "road-lab-upload",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
			className: "workspace-button workspace-button--ghost road-lab-upload-button",
			children: [uploading ? "Đang tải…" : "Tải ảnh lên", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
				type: "file",
				accept: "image/*",
				multiple,
				hidden: true,
				disabled: uploading,
				onChange: (event) => {
					handleFiles(event.target.files);
					event.target.value = "";
				}
			})]
		}), error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "road-lab-upload-error",
			children: error
		}) : null]
	});
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
function PublicationStep({ form, updateField, onManageMedia }) {
	const heroMedia = getRoadLabMediaUrls(form.publication.heroUrl, 1);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "workspace-field-grid",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
				className: "workspace-field workspace-field--wide",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Tiêu đề bài" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
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
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Hoặc tải ảnh lên trực tiếp" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ImageUploadButton, { onUploaded: (url) => updateField("publication", "heroUrl", url) })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "workspace-field workspace-field--wide",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Xem trước ảnh hero" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MediaPreview, {
					urls: heroMedia,
					title: "Ảnh hero",
					emptyMessage: "Nhập URL ảnh công khai để xem trước tại đây."
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				className: "workspace-text-button",
				onClick: onManageMedia,
				children: "Quản lý ảnh ở bước Bằng chứng →"
			})
		]
	});
}
function EvidenceStep({ form, updateField }) {
	const evidenceMedia = getRoadLabMediaUrls(form.evidence.proofUrls);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
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
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Hoặc tải ảnh lên trực tiếp" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ImageUploadButton, {
					multiple: true,
					onUploaded: (url) => updateField("evidence", "proofUrls", form.evidence.proofUrls.trim() ? `${form.evidence.proofUrls}\n${url}` : url)
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
	});
}
function SeoStep({ form, updateField, ownerLabels }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
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
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Mỗi bài dùng bốn quan hệ cố định, không phải chọn loại bài." }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: ownerLabels.map(([field, label]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "workspace-field",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: label }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							value: form.seo[field],
							onChange: (event) => updateField("seo", field, event.target.value)
						})]
					}, field)) })
				]
			})
		]
	});
}
function ExtendedStep({ form, updateField }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "workspace-field-grid",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
				className: "workspace-field",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Tên tác giả" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					value: form.extended.authorName,
					onChange: (event) => updateField("extended", "authorName", event.target.value)
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
				className: "workspace-field",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Vai trò tác giả" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					value: form.extended.authorRole,
					onChange: (event) => updateField("extended", "authorRole", event.target.value),
					placeholder: "Content Writer"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
				className: "workspace-field",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Tên reviewer" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					value: form.extended.reviewerName,
					onChange: (event) => updateField("extended", "reviewerName", event.target.value)
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
				className: "workspace-field",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Vai trò reviewer" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					value: form.extended.reviewerRole,
					onChange: (event) => updateField("extended", "reviewerRole", event.target.value),
					placeholder: "Kỹ thuật viên Auto365"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
				className: "workspace-field workspace-field--wide",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Nguồn chính" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					value: form.extended.primarySource,
					onChange: (event) => updateField("extended", "primarySource", event.target.value),
					placeholder: "Tài liệu sản phẩm / hồ sơ thi công…"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
				className: "workspace-field workspace-field--wide",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Timeline — mỗi dòng “Tiêu đề — Mô tả”" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
					value: form.extended.timeline,
					onChange: (event) => updateField("extended", "timeline", event.target.value),
					rows: 4,
					placeholder: "Kiểm tra hiện trạng — Đối chiếu hốc đèn, nguồn điện...\nKhóa cấu hình — Chốt sản phẩm theo nhu cầu..."
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
				className: "workspace-field",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Đã xác nhận (known) — mỗi dòng một ý" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
					value: form.extended.known,
					onChange: (event) => updateField("extended", "known", event.target.value),
					rows: 4
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
				className: "workspace-field",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Chưa xác nhận (unknown) — mỗi dòng một ý" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
					value: form.extended.unknown,
					onChange: (event) => updateField("extended", "unknown", event.target.value),
					rows: 4
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
				className: "workspace-field workspace-field--wide",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "QC — mỗi dòng “Hạng mục — Kết quả”" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
					value: form.extended.qc,
					onChange: (event) => updateField("extended", "qc", event.target.value),
					rows: 4,
					placeholder: "Cos — Hoạt động sau căn chỉnh\nPha — Hoạt động sau căn chỉnh"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
				className: "workspace-field workspace-field--wide",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "FAQ — dạng “Q: ...”, dòng dưới “A: ...”, cách nhau 1 dòng trống" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
					value: form.extended.faqs,
					onChange: (event) => updateField("extended", "faqs", event.target.value),
					rows: 6,
					placeholder: "Q: Câu hỏi thứ nhất?\nA: Câu trả lời.\n\nQ: Câu hỏi thứ hai?\nA: Câu trả lời."
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
				className: "workspace-field workspace-field--wide",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Thông số sản phẩm — mỗi dòng “Nhãn — Giá trị — Ghi chú”" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
					value: form.extended.metrics,
					onChange: (event) => updateField("extended", "metrics", event.target.value),
					rows: 4,
					placeholder: "Công suất Cos — Khoảng 45W — Theo tài liệu sản phẩm\nCông suất Pha — Khoảng 55W — Theo tài liệu sản phẩm"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
				className: "workspace-field",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Giá tham khảo" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					value: form.extended.priceValue,
					onChange: (event) => updateField("extended", "priceValue", event.target.value),
					placeholder: "4.500.000 VNĐ/bộ"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
				className: "workspace-field",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Ghi chú giá" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					value: form.extended.priceNote,
					onChange: (event) => updateField("extended", "priceNote", event.target.value),
					placeholder: "Chưa VAT · chưa phải tổng bill"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
				className: "workspace-field workspace-field--wide",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Giá bao gồm — mỗi dòng một ý" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
					value: form.extended.priceIncludes,
					onChange: (event) => updateField("extended", "priceIncludes", event.target.value),
					rows: 3,
					placeholder: "01 bộ = 01 cặp = 02 đèn\nBảo hành 24 tháng"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
				className: "workspace-field",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Ảnh vùng sáng Cos" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					value: form.extended.beamCosUrl,
					onChange: (event) => updateField("extended", "beamCosUrl", event.target.value),
					placeholder: "https://…"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
				className: "workspace-field",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Chú thích ảnh Cos" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					value: form.extended.beamCosCaption,
					onChange: (event) => updateField("extended", "beamCosCaption", event.target.value)
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
				className: "workspace-field",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Ảnh vùng sáng Pha" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					value: form.extended.beamPhaUrl,
					onChange: (event) => updateField("extended", "beamPhaUrl", event.target.value),
					placeholder: "https://…"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
				className: "workspace-field",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Chú thích ảnh Pha" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					value: form.extended.beamPhaCaption,
					onChange: (event) => updateField("extended", "beamPhaCaption", event.target.value)
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
				className: "workspace-field workspace-field--wide",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Theo dõi hậu kiểm — mỗi dòng “Mốc — Ngày — done/pending”" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
					value: form.extended.followup,
					onChange: (event) => updateField("extended", "followup", event.target.value),
					rows: 3,
					placeholder: "Bàn giao — Ngày 0 — done\nHậu kiểm 7 ngày — +7 ngày — pending"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
				className: "workspace-field workspace-field--wide",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Bài liên quan — mỗi dòng “Nhãn — URL”" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
					value: form.extended.related,
					onChange: (event) => updateField("extended", "related", event.target.value),
					rows: 3,
					placeholder: "Checklist kiểm tra sau khi lắp — https://auto365.vn/…"
				})]
			})
		]
	});
}
function ReviewStep({ form, updateField, items }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "road-lab-review",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Đánh dấu mục đã chuẩn bị trước khi gửi review. Việc duyệt vẫn đi theo luồng review hiện tại." }),
			items.map(([field, label]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					type: "checkbox",
					checked: form.review[field],
					onChange: (event) => updateField("review", field, event.target.checked)
				}),
				" ",
				label
			] }, field)),
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
	});
}
var workflowActionsByStatus = {
	draft: [{
		action: "submit_review",
		label: "Gửi duyệt"
	}],
	changes_requested: [{
		action: "submit_review",
		label: "Gửi duyệt lại"
	}],
	in_review: [{
		action: "approve_technical",
		label: "Duyệt kỹ thuật (IT)"
	}, {
		action: "request_changes",
		label: "Yêu cầu sửa",
		ghost: true
	}],
	technical_approved: [{
		action: "approve_seo",
		label: "Duyệt SEO"
	}, {
		action: "request_changes",
		label: "Yêu cầu sửa",
		ghost: true
	}],
	publishable: [{
		action: "publish",
		label: "Xuất bản"
	}, {
		action: "request_changes",
		label: "Yêu cầu sửa",
		ghost: true
	}]
};
function WorkflowActions({ workflowStatus, saving, onAction }) {
	const actions = workflowActionsByStatus[workflowStatus];
	if (!actions?.length) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
		className: "workspace-editor-note",
		children: [
			"Case đang ở trạng thái \"",
			statusLabels[workflowStatus] ?? workflowStatus,
			"\" — không có thao tác chuyển trạng thái nào ở đây."
		]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "road-lab-workflow-actions",
		children: actions.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			type: "button",
			className: `workspace-button${item.ghost ? " workspace-button--ghost" : ""}`,
			disabled: saving,
			onClick: () => onAction(item.action),
			children: item.label
		}, item.action))
	});
}
var ownerLabelsByTemplate = {
	road_lab: [
		["roadCaseId", "Road Case ID"],
		["proofLabId", "Proof Lab ID"],
		["brandPillarId", "Brand Pillar ID"],
		["productOwnerId", "Product Owner ID"]
	],
	proof_lab: [
		["proofLabId", "Proof Lab ID"],
		["roadCaseId", "Road Case ID"],
		["brandPillarId", "Brand Pillar ID"],
		["productOwnerId", "Product Owner ID"]
	],
	brand_story: [
		["brandPillarId", "Brand Pillar ID"],
		["roadCaseId", "Road Case ID"],
		["proofLabId", "Proof Lab ID"],
		["productOwnerId", "Product Owner ID"]
	],
	product_spotlight: [
		["productOwnerId", "Product Owner ID"],
		["roadCaseId", "Road Case ID"],
		["proofLabId", "Proof Lab ID"],
		["brandPillarId", "Brand Pillar ID"]
	]
};
var reviewItemsByTemplate = {
	road_lab: [
		["contentChecked", "Nội dung và answer-first đã kiểm tra"],
		["evidenceChecked", "Bằng chứng và nguồn xác minh đã đủ"],
		["seoChecked", "Metadata và liên kết owner đã kiểm tra"],
		["technicalChecked", "Cấu hình kỹ thuật đã sẵn sàng review"]
	],
	proof_lab: [
		["verificationChecked", "Đối tượng và phương pháp nghiệm thu đã kiểm tra"],
		["findingsChecked", "Kết quả đo và kết luận đã đủ"],
		["evidenceChecked", "Bằng chứng và nguồn xác minh đã đủ"],
		["seoChecked", "Metadata và liên kết owner đã kiểm tra"]
	],
	brand_story: [
		["positioningChecked", "Định vị và thông điệp chính đã kiểm tra"],
		["supportChecked", "Luận cứ hỗ trợ đã đủ"],
		["evidenceChecked", "Bằng chứng và nguồn xác minh đã đủ"],
		["seoChecked", "Metadata và liên kết owner đã kiểm tra"]
	],
	product_spotlight: [
		["productChecked", "Thông tin sản phẩm đã kiểm tra"],
		["comparisonChecked", "So sánh và lợi thế đã đủ"],
		["evidenceChecked", "Bằng chứng và nguồn xác minh đã đủ"],
		["seoChecked", "Metadata và liên kết owner đã kiểm tra"]
	]
};
function SubjectSteps({ templateKey, activeStep, form, updateField }) {
	if (templateKey === "road_lab" && form.templateKey === "road_lab") {
		if (activeStep === "vehicle") return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
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
		});
		if (activeStep === "configuration") return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
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
		});
	}
	if (templateKey === "proof_lab" && form.templateKey === "proof_lab") {
		if (activeStep === "verification") return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "workspace-field-grid",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "workspace-field",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Đối tượng nghiệm thu" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						value: form.verification.subjectRef,
						onChange: (event) => updateField("verification", "subjectRef", event.target.value),
						placeholder: "Sản phẩm / case liên quan"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "workspace-field",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Ngày đo / nghiệm thu" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						type: "date",
						value: form.verification.testedAt,
						onChange: (event) => updateField("verification", "testedAt", event.target.value)
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "workspace-field",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Phương pháp đo/kiểm" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						value: form.verification.testMethod,
						onChange: (event) => updateField("verification", "testMethod", event.target.value)
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "workspace-field",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Tiêu chuẩn / mốc đối chiếu" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						value: form.verification.standardRef,
						onChange: (event) => updateField("verification", "standardRef", event.target.value)
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "workspace-field workspace-field--wide",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Người / đơn vị xác minh" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						value: form.verification.verifiedBy,
						onChange: (event) => updateField("verification", "verifiedBy", event.target.value)
					})]
				})
			]
		});
		if (activeStep === "findings") return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "workspace-field-grid",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "workspace-field",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Kết quả trước" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
						value: form.findings.beforeResult,
						onChange: (event) => updateField("findings", "beforeResult", event.target.value),
						rows: 4
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "workspace-field",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Kết quả sau" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
						value: form.findings.afterResult,
						onChange: (event) => updateField("findings", "afterResult", event.target.value),
						rows: 4
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "workspace-field workspace-field--wide",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Kết luận" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
						value: form.findings.conclusion,
						onChange: (event) => updateField("findings", "conclusion", event.target.value),
						rows: 3
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "workspace-field workspace-field--wide",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Sai lệch / lưu ý" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
						value: form.findings.deviationNote,
						onChange: (event) => updateField("findings", "deviationNote", event.target.value),
						rows: 3
					})]
				})
			]
		});
	}
	if (templateKey === "brand_story" && form.templateKey === "brand_story") {
		if (activeStep === "positioning") return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "workspace-field-grid",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "workspace-field",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Đối tượng mục tiêu" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						value: form.positioning.targetAudience,
						onChange: (event) => updateField("positioning", "targetAudience", event.target.value)
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "workspace-field",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Tông giọng (tone of voice)" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						value: form.positioning.toneOfVoice,
						onChange: (event) => updateField("positioning", "toneOfVoice", event.target.value)
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "workspace-field workspace-field--wide",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Tuyên bố định vị" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
						value: form.positioning.positioningStatement,
						onChange: (event) => updateField("positioning", "positioningStatement", event.target.value),
						rows: 3
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "workspace-field workspace-field--wide",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Thông điệp chính — mỗi dòng một ý" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
						value: form.positioning.keyMessages,
						onChange: (event) => updateField("positioning", "keyMessages", event.target.value),
						rows: 4
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "workspace-field workspace-field--wide",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Điểm khác biệt — mỗi dòng một ý" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
						value: form.positioning.differentiators,
						onChange: (event) => updateField("positioning", "differentiators", event.target.value),
						rows: 4
					})]
				})
			]
		});
		if (activeStep === "support") return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "workspace-field-grid",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
				className: "workspace-field workspace-field--wide",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Số liệu / luận cứ hỗ trợ" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
					value: form.support.supportingFacts,
					onChange: (event) => updateField("support", "supportingFacts", event.target.value),
					rows: 4
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
				className: "workspace-field workspace-field--wide",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Bằng chứng xã hội (đánh giá, khách hàng tiêu biểu)" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
					value: form.support.socialProof,
					onChange: (event) => updateField("support", "socialProof", event.target.value),
					rows: 4
				})]
			})]
		});
	}
	if (templateKey === "product_spotlight" && form.templateKey === "product_spotlight") {
		if (activeStep === "productInfo") return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "workspace-field-grid",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "workspace-field",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Tên sản phẩm" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						value: form.productInfo.productName,
						onChange: (event) => updateField("productInfo", "productName", event.target.value)
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "workspace-field",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Giá / khuyến mãi" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						value: form.productInfo.pricingNote,
						onChange: (event) => updateField("productInfo", "pricingNote", event.target.value)
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "workspace-field workspace-field--wide",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Thông số kỹ thuật chính" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
						value: form.productInfo.keySpecs,
						onChange: (event) => updateField("productInfo", "keySpecs", event.target.value),
						rows: 3
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "workspace-field workspace-field--wide",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Tính năng nổi bật — mỗi dòng một ý" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
						value: form.productInfo.keyFeatures,
						onChange: (event) => updateField("productInfo", "keyFeatures", event.target.value),
						rows: 4
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "workspace-field workspace-field--wide",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Trường hợp sử dụng — mỗi dòng một ý" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
						value: form.productInfo.useCases,
						onChange: (event) => updateField("productInfo", "useCases", event.target.value),
						rows: 4
					})]
				})
			]
		});
		if (activeStep === "comparison") return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "workspace-field-grid",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
				className: "workspace-field workspace-field--wide",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Lựa chọn thay thế / đối thủ" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
					value: form.comparison.alternativeRef,
					onChange: (event) => updateField("comparison", "alternativeRef", event.target.value),
					rows: 3
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
				className: "workspace-field workspace-field--wide",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Lợi thế so với lựa chọn khác" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
					value: form.comparison.advantageNote,
					onChange: (event) => updateField("comparison", "advantageNote", event.target.value),
					rows: 4
				})]
			})]
		});
	}
	return null;
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
	async function transitionStatus(action) {
		if (!data) return;
		setSaving(true);
		setError("");
		setNotice("");
		try {
			const result = await fetch(`/api/v1/case-lab/cases/${encodeURIComponent(caseId)}/status`, {
				method: "PUT",
				headers: { "content-type": "application/json" },
				body: JSON.stringify({
					action,
					expectedRevision: data.case.currentRevision
				})
			}).then(readResponse);
			setNotice(`Đã chuyển trạng thái sang "${statusLabels[result.case.workflowStatus] ?? result.case.workflowStatus}".`);
			await load();
		} catch (reason) {
			setError(reason instanceof Error ? reason.message : "Không thể thực hiện thao tác này.");
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
	if (loading) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		className: "workspace-shell",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "workspace-loading",
			children: "Đang tải case…"
		})
	});
	if (error && !data) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
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
	});
	if (!data || !form) return null;
	const templateKey = templateKeyForContentType(data.case.contentType);
	const steps = stepsByTemplate[templateKey];
	const active = steps.find((step) => step.id === activeStep) ?? steps[0];
	const title = mode === "review" ? `Review ${templateLabels[templateKey]}` : `Soạn ${templateLabels[templateKey]}`;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
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
							templateLabels[templateKey],
							" · ",
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
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: `workspace-status-pill workspace-status-pill--${data.case.workflowStatus}`,
							children: statusLabels[data.case.workflowStatus] ?? data.case.workflowStatus
						}),
						mode === "editor" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							className: "workspace-button workspace-button--ghost",
							href: `/workspace/cases/${encodeURIComponent(caseId)}/review`,
							children: "Mở review"
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							className: "workspace-button workspace-button--ghost",
							href: `/workspace/cases/${encodeURIComponent(caseId)}`,
							children: "Soạn bài"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							className: "workspace-button workspace-button--ghost",
							href: `/case-preview/${encodeURIComponent(caseId)}`,
							target: "_blank",
							rel: "noreferrer",
							children: "Xem trước bài →"
						})
					]
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
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", { children: ["Hồ sơ ", templateLabels[templateKey]] })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								className: "workspace-button",
								onClick: saveDraft,
								disabled: saving,
								children: saving ? "Đang lưu…" : "Lưu revision mới"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
							className: "road-lab-steps",
							"aria-label": `Các bước soạn ${templateLabels[templateKey]}`,
							children: steps.map((step) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								className: "road-lab-step",
								"aria-current": activeStep === step.id ? "step" : void 0,
								onClick: () => setActiveStep(step.id),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: step.number }), step.label]
							}, step.id))
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "road-lab-step-heading",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "workspace-eyebrow",
									children: [
										"Bước ",
										String(steps.findIndex((step) => step.id === activeStep) + 1).padStart(2, "0"),
										" / ",
										String(steps.length).padStart(2, "0")
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", { children: active.label }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: active.hint })
							]
						}),
						activeStep === "publication" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PublicationStep, {
							form,
							updateField,
							onManageMedia: () => setActiveStep("evidence")
						}) : null,
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SubjectSteps, {
							templateKey,
							activeStep,
							form,
							updateField
						}),
						activeStep === "evidence" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EvidenceStep, {
							form,
							updateField
						}) : null,
						activeStep === "seo" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SeoStep, {
							form,
							updateField,
							ownerLabels: ownerLabelsByTemplate[templateKey]
						}) : null,
						activeStep === "extended" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExtendedStep, {
							form,
							updateField
						}) : null,
						activeStep === "review" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ReviewStep, {
							form,
							updateField,
							items: reviewItemsByTemplate[templateKey]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(WorkflowActions, {
							workflowStatus: data.case.workflowStatus,
							saving,
							onAction: (action) => void transitionStatus(action)
						})] }) : null,
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
	});
}
//#endregion
export { CaseEditor as default };
