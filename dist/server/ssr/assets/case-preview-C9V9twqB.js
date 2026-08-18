import { b as require_react, t as require_jsx_runtime, w as __toESM } from "../index.js";
import Link from "./link-C0Cm0FA3.js";
import { a as parseListLines, c as parseRelated, i as parseFollowup, l as parseTimeline, o as parseMetrics, r as parseFaqs, s as parseQc, t as getRoadLabMediaUrls } from "./road-lab-draft-DWlCLesN.js";
import { n as getCaseContentType } from "./case-content-types-BwbiOG91.js";
//#region app/workspace/workspace.css
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
//#endregion
//#region lib/case-article-view.ts
var lines = (value) => value.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
var firstLine = (value) => lines(value)[0] ?? "";
var fallback = (value, whenEmpty) => value.trim() ? value : whenEmpty;
function buildExtendedFields(extended) {
	return {
		authorName: fallback(extended.authorName, "Auto365.vn"),
		authorRole: fallback(extended.authorRole, "Content Writer"),
		reviewerName: extended.reviewerName,
		reviewerRole: extended.reviewerRole,
		primarySource: extended.primarySource,
		timelineSteps: parseTimeline(extended.timeline),
		known: parseListLines(extended.known),
		unknown: parseListLines(extended.unknown),
		qcItems: parseQc(extended.qc),
		faqs: parseFaqs(extended.faqs),
		metrics: parseMetrics(extended.metrics),
		priceValue: extended.priceValue,
		priceNote: extended.priceNote,
		priceIncludes: parseListLines(extended.priceIncludes),
		beamCosUrl: extended.beamCosUrl,
		beamCosCaption: extended.beamCosCaption,
		beamPhaUrl: extended.beamPhaUrl,
		beamPhaCaption: extended.beamPhaCaption,
		followupSteps: parseFollowup(extended.followup),
		relatedLinks: parseRelated(extended.related)
	};
}
function buildRoadLabView(draft) {
	return {
		templateKey: "road_lab",
		title: draft.publication.title,
		summary: draft.publication.summary,
		answerFirst: draft.publication.answerFirst,
		heroUrl: draft.publication.heroUrl,
		facts: [
			{
				label: "Xe thực tế",
				value: fallback(draft.vehicle.vehicleName, "Chưa cập nhật")
			},
			{
				label: "Đời xe",
				value: fallback(draft.vehicle.modelYear, "—")
			},
			{
				label: "ODO",
				value: fallback(draft.vehicle.odometer, "—")
			},
			{
				label: "Giai đoạn thi công",
				value: fallback(draft.vehicle.installationStage, "—")
			}
		],
		profileHeading: "Hồ sơ xe",
		profileLead: "Bối cảnh sử dụng thực tế trước khi triển khai giải pháp.",
		profileEntries: [{
			label: "Nhu cầu chính",
			value: fallback(draft.vehicle.primaryNeed, "Chưa cập nhật")
		}, {
			label: "Bối cảnh sử dụng",
			value: fallback(draft.vehicle.usageConditions, "Chưa cập nhật")
		}],
		editorialHeading: "Vấn đề & cấu hình trước",
		editorialLead: "Vấn đề ban đầu và hiện trạng trước khi triển khai giải pháp.",
		editorialParagraphs: lines(draft.configuration.problem),
		editorialNoteLabel: "CẤU HÌNH TRƯỚC",
		editorialNoteText: fallback(draft.configuration.beforeConfig, "Chưa cập nhật."),
		methodHeading: "Cấu hình triển khai",
		methodLead: "Giải pháp thực tế đã lắp đặt cho ca này.",
		methodEntries: [
			{
				label: "Sản phẩm chính",
				value: fallback(draft.configuration.productName, "Chưa cập nhật")
			},
			{
				label: "Cấu hình thực tế",
				value: fallback(draft.configuration.actualConfig, "Chưa cập nhật")
			},
			{
				label: "Vật tư / phụ kiện",
				value: fallback(draft.configuration.materials, "Chưa cập nhật")
			}
		],
		evidenceImages: getRoadLabMediaUrls(draft.evidence.proofUrls),
		sourceNote: draft.evidence.sourceNotes,
		slug: draft.seo.slug,
		metaTitle: draft.seo.metaTitle,
		metaDescription: draft.seo.metaDescription,
		...buildExtendedFields(draft.extended)
	};
}
function buildProofLabView(draft) {
	return {
		templateKey: "proof_lab",
		title: draft.publication.title,
		summary: draft.publication.summary,
		answerFirst: draft.publication.answerFirst,
		heroUrl: draft.publication.heroUrl,
		facts: [
			{
				label: "Đối tượng nghiệm thu",
				value: fallback(draft.verification.subjectRef, "Chưa cập nhật")
			},
			{
				label: "Phương pháp đo",
				value: fallback(draft.verification.testMethod, "—")
			},
			{
				label: "Tiêu chuẩn đối chiếu",
				value: fallback(draft.verification.standardRef, "—")
			},
			{
				label: "Người xác minh",
				value: fallback(draft.verification.verifiedBy, "—")
			}
		],
		profileHeading: "Đối tượng nghiệm thu",
		profileLead: "Thông tin đối tượng và thời điểm thực hiện đo kiểm.",
		profileEntries: [{
			label: "Ngày đo / nghiệm thu",
			value: fallback(draft.verification.testedAt, "Chưa cập nhật")
		}, {
			label: "Tiêu chuẩn / mốc đối chiếu",
			value: fallback(draft.verification.standardRef, "Chưa cập nhật")
		}],
		editorialHeading: "Kết luận",
		editorialLead: "Kết luận rút ra từ kết quả đo kiểm.",
		editorialParagraphs: lines(draft.findings.conclusion),
		editorialNoteLabel: "SAI LỆCH / LƯU Ý",
		editorialNoteText: fallback(draft.findings.deviationNote, "Không ghi nhận sai lệch đáng chú ý."),
		methodHeading: "Kết quả trước & sau",
		methodLead: "So sánh trực tiếp kết quả đo trước và sau khi thực hiện.",
		methodEntries: [{
			label: "Kết quả trước",
			value: fallback(draft.findings.beforeResult, "Chưa cập nhật")
		}, {
			label: "Kết quả sau",
			value: fallback(draft.findings.afterResult, "Chưa cập nhật")
		}],
		evidenceImages: getRoadLabMediaUrls(draft.evidence.proofUrls),
		sourceNote: draft.evidence.sourceNotes,
		slug: draft.seo.slug,
		metaTitle: draft.seo.metaTitle,
		metaDescription: draft.seo.metaDescription,
		...buildExtendedFields(draft.extended)
	};
}
function buildBrandStoryView(draft) {
	return {
		templateKey: "brand_story",
		title: draft.publication.title,
		summary: draft.publication.summary,
		answerFirst: draft.publication.answerFirst,
		heroUrl: draft.publication.heroUrl,
		facts: [
			{
				label: "Đối tượng mục tiêu",
				value: fallback(draft.positioning.targetAudience, "Chưa cập nhật")
			},
			{
				label: "Tông giọng",
				value: fallback(draft.positioning.toneOfVoice, "—")
			},
			{
				label: "Thông điệp chính",
				value: fallback(firstLine(draft.positioning.keyMessages), "—")
			},
			{
				label: "Điểm khác biệt",
				value: fallback(firstLine(draft.positioning.differentiators), "—")
			}
		],
		profileHeading: "Định vị thương hiệu",
		profileLead: "Tuyên bố định vị và đối tượng mà nội dung này hướng tới.",
		profileEntries: [{
			label: "Tuyên bố định vị",
			value: fallback(draft.positioning.positioningStatement, "Chưa cập nhật")
		}],
		editorialHeading: "Thông điệp chính",
		editorialLead: "Những thông điệp cốt lõi cần truyền tải.",
		editorialParagraphs: lines(draft.positioning.keyMessages),
		editorialNoteLabel: "ĐIỂM KHÁC BIỆT",
		editorialNoteText: fallback(draft.positioning.differentiators, "Chưa cập nhật."),
		methodHeading: "Luận cứ hỗ trợ",
		methodLead: "Số liệu và bằng chứng xã hội hỗ trợ định vị.",
		methodEntries: [{
			label: "Số liệu / luận cứ hỗ trợ",
			value: fallback(draft.support.supportingFacts, "Chưa cập nhật")
		}, {
			label: "Bằng chứng xã hội",
			value: fallback(draft.support.socialProof, "Chưa cập nhật")
		}],
		evidenceImages: getRoadLabMediaUrls(draft.evidence.proofUrls),
		sourceNote: draft.evidence.sourceNotes,
		slug: draft.seo.slug,
		metaTitle: draft.seo.metaTitle,
		metaDescription: draft.seo.metaDescription,
		...buildExtendedFields(draft.extended)
	};
}
function buildProductSpotlightView(draft) {
	return {
		templateKey: "product_spotlight",
		title: draft.publication.title,
		summary: draft.publication.summary,
		answerFirst: draft.publication.answerFirst,
		heroUrl: draft.publication.heroUrl,
		facts: [
			{
				label: "Sản phẩm",
				value: fallback(draft.productInfo.productName, "Chưa cập nhật")
			},
			{
				label: "Giá / khuyến mãi",
				value: fallback(draft.productInfo.pricingNote, "—")
			},
			{
				label: "Thông số chính",
				value: fallback(firstLine(draft.productInfo.keySpecs), "—")
			},
			{
				label: "Lựa chọn thay thế",
				value: fallback(draft.comparison.alternativeRef, "—")
			}
		],
		profileHeading: "Thông tin sản phẩm",
		profileLead: "Thông số và định vị giá của sản phẩm được giới thiệu.",
		profileEntries: [{
			label: "Thông số kỹ thuật chính",
			value: fallback(draft.productInfo.keySpecs, "Chưa cập nhật")
		}],
		editorialHeading: "Tính năng nổi bật",
		editorialLead: "Những tính năng chính người đọc cần biết.",
		editorialParagraphs: lines(draft.productInfo.keyFeatures),
		editorialNoteLabel: "TRƯỜNG HỢP SỬ DỤNG",
		editorialNoteText: fallback(draft.productInfo.useCases, "Chưa cập nhật."),
		methodHeading: "So sánh lựa chọn",
		methodLead: "Đối chiếu với lựa chọn thay thế để làm rõ lợi thế.",
		methodEntries: [{
			label: "Lựa chọn thay thế",
			value: fallback(draft.comparison.alternativeRef, "Chưa cập nhật")
		}, {
			label: "Lợi thế so với lựa chọn khác",
			value: fallback(draft.comparison.advantageNote, "Chưa cập nhật")
		}],
		evidenceImages: getRoadLabMediaUrls(draft.evidence.proofUrls),
		sourceNote: draft.evidence.sourceNotes,
		slug: draft.seo.slug,
		metaTitle: draft.seo.metaTitle,
		metaDescription: draft.seo.metaDescription,
		...buildExtendedFields(draft.extended)
	};
}
function buildArticleViewModel(draft) {
	switch (draft.templateKey) {
		case "proof_lab": return buildProofLabView(draft);
		case "brand_story": return buildBrandStoryView(draft);
		case "product_spotlight": return buildProductSpotlightView(draft);
		default: return buildRoadLabView(draft);
	}
}
var SITE_URL = "https://auto365.vn";
var PUBLISHER_ID = `${SITE_URL}/#organization`;
var personId = (canonicalUrl, role) => `${canonicalUrl}#${role}`;
function buildCaseArticleJsonLd(vm, canonicalUrl, publishedAt) {
	const pageId = `${canonicalUrl}#webpage`;
	const articleId = `${canonicalUrl}#article`;
	const breadcrumbId = `${canonicalUrl}#breadcrumb`;
	const authorId = personId(canonicalUrl, "author");
	const reviewerId = vm.reviewerName ? personId(canonicalUrl, "reviewer") : void 0;
	const graph = [
		{
			"@type": "Article",
			"@id": articleId,
			headline: vm.title,
			description: vm.metaDescription || vm.summary,
			image: vm.heroUrl ? [vm.heroUrl] : void 0,
			datePublished: publishedAt,
			dateModified: publishedAt,
			inLanguage: "vi-VN",
			mainEntityOfPage: { "@id": pageId },
			publisher: { "@id": PUBLISHER_ID },
			author: { "@id": authorId },
			...reviewerId ? { reviewedBy: { "@id": reviewerId } } : {},
			...vm.primarySource ? { citation: [{
				"@type": "CreativeWork",
				name: vm.primarySource
			}] } : {}
		},
		{
			"@type": "WebPage",
			"@id": pageId,
			url: canonicalUrl,
			name: vm.metaTitle || vm.title,
			description: vm.metaDescription || vm.summary,
			inLanguage: "vi-VN",
			breadcrumb: { "@id": breadcrumbId },
			mainEntity: { "@id": articleId }
		},
		{
			"@type": "BreadcrumbList",
			"@id": breadcrumbId,
			itemListElement: [{
				"@type": "ListItem",
				position: 1,
				name: "Auto365",
				item: `${SITE_URL}/`
			}, {
				"@type": "ListItem",
				position: 2,
				name: vm.title,
				item: canonicalUrl
			}]
		},
		{
			"@type": "Organization",
			"@id": PUBLISHER_ID,
			name: "Auto365.vn",
			url: `${SITE_URL}/`
		},
		{
			"@type": "Person",
			"@id": authorId,
			name: vm.authorName,
			...vm.authorRole ? { jobTitle: vm.authorRole } : {}
		}
	];
	if (reviewerId) graph.push({
		"@type": "Person",
		"@id": reviewerId,
		name: vm.reviewerName,
		...vm.reviewerRole ? { jobTitle: vm.reviewerRole } : {}
	});
	if (vm.priceValue) graph.push({
		"@type": "Product",
		"@id": `${canonicalUrl}#product`,
		name: vm.title,
		offers: {
			"@type": "Offer",
			price: vm.priceValue.replace(/[^\d]/g, "") || void 0,
			priceCurrency: "VND",
			availability: "https://schema.org/InStock",
			url: canonicalUrl
		}
	});
	if (vm.faqs.length) graph.push({
		"@type": "FAQPage",
		"@id": `${canonicalUrl}#faq`,
		mainEntity: vm.faqs.map((item) => ({
			"@type": "Question",
			name: item.q,
			acceptedAnswer: {
				"@type": "Answer",
				text: item.a
			}
		}))
	});
	return {
		"@context": "https://schema.org",
		"@graph": graph
	};
}
//#endregion
//#region lib/case-lab.ts
function serializeJsonLd(value) {
	return JSON.stringify(value).replace(/</g, "\\u003c");
}
//#endregion
//#region app/tin-tuc/[slug]/CaseArticleView.tsx
var import_jsx_runtime = require_jsx_runtime();
var HOTLINE_DISPLAY = "0365 365 911";
var HOTLINE_HREF = "tel:0365365911";
function initials(text) {
	return (text.trim()[0] ?? "A").toUpperCase();
}
function SiteHeader() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
		className: "site-header",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "site-header__top",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "case-shell site-header__top-inner",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						className: "site-logo",
						href: "/",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "site-logo__mark",
							children: "AUTO365"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: "HỆ THỐNG NÂNG CẤP XE TOÀN QUỐC" })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("nav", {
						className: "site-header__links",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								href: "/",
								children: "Giới thiệu"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								href: "/",
								children: "Dịch vụ"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								href: "/",
								children: "Tin tức"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								href: "/",
								children: "Hỏi đáp"
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
						className: "site-header__cta",
						href: HOTLINE_HREF,
						children: HOTLINE_DISPLAY
					})
				]
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "site-header__sub",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "case-shell site-header__sub-inner",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						href: "/",
						children: "Ánh sáng"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						href: "/",
						children: "Phim cách nhiệt"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						href: "/",
						children: "PPF/Wrap film"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						href: "/",
						children: "Camera hành trình"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						href: "/",
						children: "Đồ chơi xe"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						href: "/",
						children: "Âm thanh"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						href: "/",
						children: "Chi nhánh"
					})
				]
			})
		})]
	});
}
/** Right-hand widget rail matching auto365.vn's real article sidebar (contact box + related reading). */
function SidebarWidgets({ vm, branchRef, toc }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
		className: "site-sidebar",
		children: [
			toc ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "site-widget site-widget--toc",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", { children: "Trong bài này" }), toc]
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "site-widget site-widget--contact",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", { children: "Cần tư vấn?" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: HOTLINE_DISPLAY }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("small", { children: [
						"Auto365.vn hỗ trợ trực tiếp theo chi nhánh ",
						branchRef,
						"."
					] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
						href: HOTLINE_HREF,
						children: "Gọi ngay"
					})
				]
			}),
			vm.relatedLinks.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "site-widget",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", { children: "Bài viết liên quan" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", { children: vm.relatedLinks.map((link, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
					href: link.url,
					children: link.label
				}) }, index)) })]
			}) : null
		]
	});
}
function FinalCta() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		className: "case-final-cta",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "case-kicker case-kicker--light",
				children: "AUTO365.VN"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: "Cần tư vấn giải pháp tương tự?" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Liên hệ Auto365.vn để được tư vấn theo đúng nhu cầu và ca xe của bạn." }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
				href: HOTLINE_HREF,
				children: HOTLINE_DISPLAY
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				href: "/",
				children: "Về trang chủ"
			})] })
		] })
	});
}
/** Long-tail sections shared by the non-road_lab layouts: same data, single-column, no rail. */
function TailSections({ vm, skipMetrics }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		!skipMetrics && vm.metrics.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "case-content-section",
			id: "metrics",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "case-section-heading",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: "Thông số sản phẩm" }) })
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "case-metric-grid",
				children: vm.metrics.map((item, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: item.label }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: item.value }),
					item.note ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: item.note }) : null
				] }, index))
			})]
		}) : null,
		vm.evidenceImages.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "case-content-section",
			id: "evidence",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "case-section-heading",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "case-section-no",
						children: "•"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: "Bằng chứng" })] })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "case-photo-story",
					children: vm.evidenceImages.map((url, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("figure", {
						className: index === 0 ? "case-photo-story__large" : void 0,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src: url,
							alt: `${vm.title} — bằng chứng ${index + 1}`,
							loading: index === 0 ? "eager" : "lazy"
						})
					}, url))
				}),
				vm.sourceNote ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "case-source-note",
					children: vm.sourceNote
				}) : null
			]
		}) : null,
		vm.beamCosUrl || vm.beamPhaUrl ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "case-content-section",
			id: "beams",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "case-section-heading",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: "Vùng sáng Cos/Pha" }) })
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "case-beam-grid",
				children: [vm.beamCosUrl ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("figure", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "COS" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "Chế độ chiếu gần" })] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: vm.beamCosUrl,
						alt: `Vùng sáng Cos — ${vm.title}`
					}),
					vm.beamCosCaption ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("figcaption", { children: vm.beamCosCaption }) : null
				] }) : null, vm.beamPhaUrl ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("figure", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "PHA" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "Chế độ chiếu xa" })] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: vm.beamPhaUrl,
						alt: `Vùng sáng Pha — ${vm.title}`
					}),
					vm.beamPhaCaption ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("figcaption", { children: vm.beamPhaCaption }) : null
				] }) : null]
			})]
		}) : null,
		vm.timelineSteps.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "case-content-section",
			id: "timeline",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "case-section-heading",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "case-section-no",
					children: "•"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: "Timeline thực hiện" })] })
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
				className: "case-timeline",
				children: vm.timelineSteps.map((step, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: String(index + 1).padStart(2, "0") }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: step.title }), step.text ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: step.text }) : null] })] }, index))
			})]
		}) : null,
		vm.known.length || vm.unknown.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "case-ledger-section",
			id: "ledger",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "case-section-heading",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: "Đã biết / Chưa biết" }) })
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "case-ledger-grid",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "case-ledger case-ledger--yes",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "✓" }), "Đã xác nhận"] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", { children: vm.known.map((item, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: item }, index)) })]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "case-ledger case-ledger--unknown",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "?" }), "Chưa xác nhận"] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", { children: vm.unknown.map((item, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: item }, index)) })]
				})]
			})]
		}) : null,
		vm.qcItems.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "case-content-section",
			id: "qc",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "case-section-heading",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: "Kiểm tra chất lượng" }) })
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "case-qc-card",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "case-qc-head",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", {}), "ĐÃ NGHIỆM THU"] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("b", { children: [vm.qcItems.length, " hạng mục đã kiểm tra"] })]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "case-qc-grid",
					children: vm.qcItems.map((item, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "✓" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: item.label }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: item.result })] })] }, index))
				})]
			})]
		}) : null,
		vm.priceValue ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "case-price-section",
			id: "price",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "case-kicker case-kicker--light",
					children: "GIÁ THAM KHẢO"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: vm.priceValue }),
				vm.priceNote ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: vm.priceNote }) : null
			] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dl", { children: vm.priceIncludes.map((item, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "known",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", { children: String(index + 1).padStart(2, "0") }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", { children: item })]
			}, index)) })]
		}) : null,
		vm.faqs.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "case-faq-section",
			id: "faq",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "case-section-heading",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: "Hỏi đáp" }) })
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: vm.faqs.map((item, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("details", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("summary", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: String(index + 1).padStart(2, "0") }), item.q] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: item.a })] }, index)) })]
		}) : null,
		vm.reviewerName || vm.primarySource ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "case-author-section",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "case-author-person",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "case-avatar case-avatar--large",
						children: initials(vm.authorName)
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "TÁC GIẢ" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", { children: vm.authorName }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: vm.authorRole })
					] })]
				}),
				vm.reviewerName ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "case-author-person",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "case-avatar case-avatar--large",
						children: initials(vm.reviewerName)
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "NGƯỜI RÀ SOÁT" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", { children: vm.reviewerName }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: vm.reviewerRole })
					] })]
				}) : null,
				vm.primarySource ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "case-editorial-policy",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "NGUỒN CHÍNH" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: vm.primarySource })]
				}) : null
			]
		}) : null,
		vm.followupSteps.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "case-followup-section",
			id: "followup",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "case-section-heading",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: "Theo dõi hậu kiểm" }) })
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "case-followup-track",
				children: vm.followupSteps.map((step, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: step.done ? "done" : void 0,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: step.date || `MỐC ${index + 1}` }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: step.label })]
				}, index))
			})]
		}) : null,
		vm.relatedLinks.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "case-content-section",
			id: "related",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "case-section-heading",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: "Bài liên quan" }) })
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "case-cluster-links",
				children: vm.relatedLinks.map((link, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
					href: link.url,
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "ĐỌC THÊM" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: link.label }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "→" })
					]
				}, index))
			})]
		}) : null
	] });
}
/** road_lab — long-form editorial magazine layout: photo hero, stat strip, sticky TOC rail. */
function RoadLabArticle({ vm, contentTypeLabel, caseCode, branchRef, publishedDisplay }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "case-page case-page--road_lab",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteHeader, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "case-hero",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "case-hero-media",
					children: [vm.heroUrl ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: vm.heroUrl,
						alt: vm.title
					}) : null, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "case-hero-scrim" })]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "case-shell case-hero-content",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "case-breadcrumb",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "Auto365" }),
								" ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "/" }),
								" ",
								contentTypeLabel,
								" ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "/" }),
								" ",
								caseCode
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "case-eyebrow-row",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "case-tag case-tag--red",
								children: contentTypeLabel.toUpperCase()
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "case-tag",
								children: branchRef
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", { children: vm.title }),
						vm.summary ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "case-dek",
							children: vm.summary
						}) : null,
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "case-byline",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "case-avatar",
									children: initials(vm.authorName)
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: vm.authorName }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
									vm.authorRole
								] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "case-date-block",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Xuất bản" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: publishedDisplay })]
								})
							]
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
				className: "case-fact-strip",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "case-shell case-fact-grid",
					children: vm.facts.map((fact) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: fact.label }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: fact.value }),
						fact.note ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: fact.note }) : null
					] }, fact.label))
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "case-shell case-article-shell",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
					className: "case-article-body",
					children: [
						vm.answerFirst ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
							className: "case-answer-card",
							id: "answer",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "case-kicker",
									children: "KẾT LUẬN NHANH"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: "Answer First" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: vm.answerFirst })
							]
						}) : null,
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
							className: "case-passport",
							id: "profile",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "case-passport-head",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "case-kicker",
										children: "01"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: vm.profileHeading }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: vm.profileLead })
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "case-passport-grid",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dl", { children: vm.profileEntries.map((entry) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", { children: entry.label }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", { children: entry.value })] }, entry.label)) })
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
							className: "case-content-section",
							id: "editorial",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "case-section-heading",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "case-section-no",
										children: "02"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: vm.editorialHeading })] })
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "case-section-lead",
									children: vm.editorialLead
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "case-editorial-split",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [vm.editorialParagraphs.length ? vm.editorialParagraphs.map((paragraph, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: paragraph }, index)) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Chưa cập nhật nội dung chi tiết." }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "case-editorial-note",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: vm.editorialNoteLabel }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: vm.editorialNoteText })]
									})] })
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
							className: "case-content-section",
							id: "method",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "case-method-card",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "case-kicker",
										children: "03"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", { children: vm.methodHeading }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: vm.methodLead })
								] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dl", { children: vm.methodEntries.map((entry) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", { children: entry.label }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", { children: entry.value })] }, entry.label)) })]
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TailSections, { vm })
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SidebarWidgets, {
					vm,
					branchRef,
					toc: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ol", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
							href: "#answer",
							children: "Kết luận nhanh"
						}) }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
							href: "#profile",
							children: vm.profileHeading
						}) }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
							href: "#editorial",
							children: vm.editorialHeading
						}) }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
							href: "#method",
							children: vm.methodHeading
						}) }),
						vm.metrics.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
							href: "#metrics",
							children: "Thông số sản phẩm"
						}) }) : null,
						vm.evidenceImages.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
							href: "#evidence",
							children: "Bằng chứng"
						}) }) : null,
						vm.timelineSteps.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
							href: "#timeline",
							children: "Timeline"
						}) }) : null,
						vm.qcItems.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
							href: "#qc",
							children: "Kiểm tra chất lượng"
						}) }) : null,
						vm.faqs.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
							href: "#faq",
							children: "Hỏi đáp"
						}) }) : null
					] })
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FinalCta, {})
		]
	});
}
/** proof_lab — inspection / lab-report layout: letterhead header, verdict stamp, before/after as the centerpiece, no sidebar. */
function ProofLabArticle({ vm, contentTypeLabel, caseCode, branchRef, publishedDisplay }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "case-page case-page--proof_lab",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteHeader, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
				className: "proof-letterhead",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "case-shell proof-letterhead-inner",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "case-breadcrumb",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "Auto365" }),
								" ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "/" }),
								" ",
								contentTypeLabel,
								" ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "/" }),
								" ",
								caseCode
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "proof-letterhead-row",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "case-eyebrow-row",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "case-tag case-tag--red",
										children: contentTypeLabel.toUpperCase()
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "case-tag",
										children: branchRef
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", { children: vm.title }),
								vm.summary ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "case-dek",
									children: vm.summary
								}) : null
							] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "proof-verdict-stamp",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "ĐÃ NGHIỆM THU" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: publishedDisplay })]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "proof-meta-row",
							children: vm.facts.map((fact) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", { children: fact.label }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", { children: fact.value })] }, fact.label))
						})
					]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "case-shell proof-body",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
					className: "proof-body__main",
					children: [
						vm.answerFirst ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
							className: "case-answer-card case-answer-card--verdict",
							id: "answer",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "case-verdict-badge",
									children: "KẾT LUẬN"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "case-kicker",
									children: "KẾT LUẬN NHANH"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: "Kết quả nghiệm thu" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: vm.answerFirst })
							]
						}) : null,
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
							className: "proof-compare-section",
							id: "method",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "case-section-heading",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "case-section-no",
										children: "01"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: vm.methodHeading })] })
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "case-section-lead",
									children: vm.methodLead
								}),
								vm.methodEntries.length === 2 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "case-compare-grid proof-compare-grid",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "case-compare-panel case-compare-panel--before",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: vm.methodEntries[0].label }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: vm.methodEntries[0].value })]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "case-compare-arrow",
											"aria-hidden": "true",
											children: "→"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "case-compare-panel case-compare-panel--after",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: vm.methodEntries[1].label }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: vm.methodEntries[1].value })]
										})
									]
								}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dl", {
									className: "proof-plain-dl",
									children: vm.methodEntries.map((entry) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", { children: entry.label }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", { children: entry.value })] }, entry.label))
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
							className: "proof-report-block",
							id: "profile",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "case-section-heading",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "case-section-no",
										children: "02"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: vm.profileHeading })] })
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "case-section-lead",
									children: vm.profileLead
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dl", {
									className: "proof-plain-dl",
									children: vm.profileEntries.map((entry) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", { children: entry.label }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", { children: entry.value })] }, entry.label))
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
							className: "case-content-section",
							id: "editorial",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "case-section-heading",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "case-section-no",
										children: "03"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: vm.editorialHeading })] })
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "case-section-lead",
									children: vm.editorialLead
								}),
								vm.editorialParagraphs.length ? vm.editorialParagraphs.map((paragraph, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "proof-paragraph",
									children: paragraph
								}, index)) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "proof-paragraph",
									children: "Chưa cập nhật nội dung chi tiết."
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "case-editorial-note",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: vm.editorialNoteLabel }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: vm.editorialNoteText })]
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TailSections, { vm })
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SidebarWidgets, {
					vm,
					branchRef
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FinalCta, {})
		]
	});
}
/** brand_story — manifesto layout: full-bleed quote hero, single centered narrative column, no sidebar. */
function BrandStoryArticle({ vm, contentTypeLabel, caseCode, branchRef, publishedDisplay }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "case-page case-page--brand_story",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteHeader, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "brand-hero",
				children: [vm.heroUrl ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "brand-hero-media",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: vm.heroUrl,
						alt: vm.title
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "case-hero-scrim" })]
				}) : null, /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "case-shell brand-hero-content",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "case-breadcrumb",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "Auto365" }),
								" ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "/" }),
								" ",
								contentTypeLabel,
								" ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "/" }),
								" ",
								caseCode
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "case-eyebrow-row",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "case-tag case-tag--red",
								children: contentTypeLabel.toUpperCase()
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "case-tag",
								children: branchRef
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
							className: "brand-hero-title",
							children: vm.title
						}),
						vm.answerFirst ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "brand-hero-quote",
							children: [
								"“",
								vm.answerFirst,
								"”"
							]
						}) : null,
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "case-byline",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "case-avatar",
									children: initials(vm.authorName)
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: vm.authorName }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
									vm.authorRole
								] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "case-date-block",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Xuất bản" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: publishedDisplay })]
								})
							]
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "case-shell brand-body",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
					className: "brand-body__main",
					children: [
						vm.summary ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "brand-lede",
							children: vm.summary
						}) : null,
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
							className: "brand-pillar",
							id: "profile",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "case-kicker",
									children: "ĐỊNH VỊ"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: vm.profileHeading }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "brand-pillar-lead",
									children: vm.profileLead
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "brand-pillar-list",
									children: vm.profileEntries.map((entry) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", { children: entry.label }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", { children: entry.value })] }, entry.label))
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
							className: "brand-pillar",
							id: "editorial",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "case-kicker",
									children: "THÔNG ĐIỆP"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: vm.editorialHeading }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
									className: "brand-message-list",
									children: vm.editorialParagraphs.length ? vm.editorialParagraphs.map((paragraph, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: String(index + 1).padStart(2, "0") }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: paragraph })] }, index)) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "01" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Chưa cập nhật nội dung chi tiết." })] })
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "case-editorial-note",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: vm.editorialNoteLabel }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: vm.editorialNoteText })]
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
							className: "brand-testimonial",
							id: "method",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "case-kicker",
									children: vm.methodHeading.toUpperCase()
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "brand-testimonial-lead",
									children: vm.methodLead
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "brand-testimonial-grid",
									children: vm.methodEntries.map((entry) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: entry.label }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: entry.value })] }, entry.label))
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TailSections, { vm })
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SidebarWidgets, {
					vm,
					branchRef
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FinalCta, {})
		]
	});
}
/** product_spotlight — commerce PDP layout: two-column gallery + sticky buy box, spec table, comparison table. */
function ProductSpotlightArticle({ vm, contentTypeLabel, caseCode, branchRef, publishedDisplay }) {
	const gallery = vm.heroUrl ? [vm.heroUrl, ...vm.evidenceImages] : vm.evidenceImages;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "case-page case-page--product_spotlight",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteHeader, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "case-shell product-hero",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "product-gallery",
					children: gallery.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("figure", {
						className: "product-gallery-main",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src: gallery[0],
							alt: vm.title
						})
					}), gallery.length > 1 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "product-gallery-thumbs",
						children: gallery.slice(1, 5).map((url, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src: url,
							alt: `${vm.title} — ảnh ${index + 2}`,
							loading: "lazy"
						}, url))
					}) : null] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "product-gallery-empty" })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "product-buybox",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "case-breadcrumb",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "Auto365" }),
								" ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "/" }),
								" ",
								contentTypeLabel,
								" ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "/" }),
								" ",
								caseCode
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "case-eyebrow-row",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "case-tag case-tag--red",
								children: contentTypeLabel.toUpperCase()
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "case-tag",
								children: branchRef
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
							className: "product-title",
							children: vm.title
						}),
						vm.summary ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "product-summary",
							children: vm.summary
						}) : null,
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
							className: "product-spec-bullets",
							children: vm.facts.map((fact) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: fact.label }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: fact.value })] }, fact.label))
						}),
						vm.priceValue ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "product-price-card",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "GIÁ THAM KHẢO" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: vm.priceValue }),
								vm.priceNote ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: vm.priceNote }) : null,
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
									href: HOTLINE_HREF,
									children: "Gọi tư vấn ngay"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
									href: "#price",
									className: "product-price-card__link",
									children: "Xem chi tiết giá & ưu đãi →"
								})
							]
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
							className: "product-buy-cta",
							href: HOTLINE_HREF,
							children: "Gọi tư vấn ngay"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "product-published",
							children: [
								"Cập nhật ",
								publishedDisplay,
								" · ",
								vm.authorName
							]
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "case-shell product-body",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
					className: "product-body__main",
					children: [
						vm.answerFirst ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
							className: "case-answer-card",
							id: "answer",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "case-kicker",
									children: "KẾT LUẬN NHANH"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: "Có nên chọn sản phẩm này?" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: vm.answerFirst })
							]
						}) : null,
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
							className: "case-content-section",
							id: "profile",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "case-section-heading",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "case-section-no",
										children: "01"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: vm.profileHeading })] })
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "case-section-lead",
									children: vm.profileLead
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("table", {
									className: "product-spec-table",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: vm.profileEntries.map((entry) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: entry.label }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { children: entry.value })] }, entry.label)) })
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
							className: "case-content-section",
							id: "editorial",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "case-section-heading",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "case-section-no",
										children: "02"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: vm.editorialHeading })] })
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "case-section-lead",
									children: vm.editorialLead
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
									className: "product-feature-list",
									children: vm.editorialParagraphs.length ? vm.editorialParagraphs.map((paragraph, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "✓" }), paragraph] }, index)) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "✓" }), "Chưa cập nhật nội dung chi tiết."] })
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "case-editorial-note",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: vm.editorialNoteLabel }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: vm.editorialNoteText })]
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
							className: "case-content-section",
							id: "method",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "case-section-heading",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "case-section-no",
										children: "03"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: vm.methodHeading })] })
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "case-section-lead",
									children: vm.methodLead
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
									className: "product-compare-table",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Sản phẩm này" }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Lựa chọn khác" })
									] }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: vm.methodEntries.map((entry) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: entry.label }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { children: entry.value }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "product-compare-table__muted",
											children: "—"
										})
									] }, entry.label)) })]
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TailSections, { vm })
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SidebarWidgets, {
					vm,
					branchRef
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FinalCta, {})
		]
	});
}
function CaseArticleView({ vm, contentTypeLabel, caseCode, branchRef, publishedDisplay, jsonLd }) {
	const props = {
		vm,
		contentTypeLabel,
		caseCode,
		branchRef,
		publishedDisplay
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [vm.templateKey === "proof_lab" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProofLabArticle, { ...props }) : vm.templateKey === "brand_story" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BrandStoryArticle, { ...props }) : vm.templateKey === "product_spotlight" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProductSpotlightArticle, { ...props }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RoadLabArticle, { ...props }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("script", {
		type: "application/ld+json",
		dangerouslySetInnerHTML: { __html: serializeJsonLd(jsonLd) }
	})] });
}
//#endregion
//#region app/case-preview/[caseId]/case-preview.tsx
var publishedDisplay = new Intl.DateTimeFormat("vi-VN", {
	day: "2-digit",
	month: "2-digit",
	year: "numeric"
});
var statusLabels = {
	draft: "Bản nháp",
	ready_for_review: "Chờ review",
	in_review: "Đang review",
	changes_requested: "Cần chỉnh sửa",
	technical_approved: "Đã qua IT",
	publishable: "Sẵn sàng xuất bản",
	published: "Đã xuất bản"
};
async function readResponse(response) {
	if (response.ok) return response.json();
	const body = await response.json().catch(() => ({}));
	throw new Error(body.error?.code === "UNAUTHENTICATED" ? "SESSION_REQUIRED" : body.error?.message ?? "Không thể tải dữ liệu case.");
}
function CasePreview({ caseId }) {
	const [data, setData] = (0, import_react.useState)(null);
	const [error, setError] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		let cancelled = false;
		fetch(`/api/v1/case-lab/cases/${encodeURIComponent(caseId)}/draft`).then(readResponse).then((response) => {
			if (!cancelled) setData(response);
		}).catch((requestError) => {
			if (!cancelled) setError(requestError instanceof Error ? requestError.message : "Không thể tải dữ liệu case.");
		});
		return () => {
			cancelled = true;
		};
	}, [caseId]);
	const backLink = /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
		className: "preview-bar__back",
		href: `/workspace/cases/${encodeURIComponent(caseId)}`,
		children: "← Quay lại soạn bài"
	});
	if (error) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "preview-shell",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "preview-bar",
			children: backLink
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
			className: "workspace-shell",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "workspace-alert",
				role: "alert",
				children: error === "SESSION_REQUIRED" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "Phiên đăng nhập chưa sẵn sàng" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					className: "workspace-alert__link",
					href: `/login?return_to=/case-preview/${encodeURIComponent(caseId)}`,
					children: "Đăng nhập Case Lab →"
				})] }) : error
			})
		})]
	});
	if (!data) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "preview-shell",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "preview-bar",
			children: backLink
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
			className: "workspace-shell",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "workspace-editor-note",
				children: "Đang tải bản xem trước…"
			})
		})]
	});
	const vm = buildArticleViewModel(data.draft.content);
	const jsonLd = buildCaseArticleJsonLd(vm, `https://auto365.vn/tin-tuc/${data.draft.content.seo.slug || caseId}`, data.draft.updatedAt);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("meta", {
			name: "robots",
			content: "noindex, nofollow"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "preview-bar",
			children: [
				backLink,
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "preview-bar__meta",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "preview-bar__flag",
							children: "XEM TRƯỚC — CHƯA XUẤT BẢN"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "preview-bar__rev",
							children: ["Revision r", data.draft.revision]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: `preview-bar__status preview-bar__status--${data.case.workflowStatus}`,
							children: statusLabels[data.case.workflowStatus] ?? data.case.workflowStatus
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					className: "preview-bar__cta",
					href: `/workspace/cases/${encodeURIComponent(caseId)}`,
					children: "Chỉnh sửa bài →"
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CaseArticleView, {
			vm,
			contentTypeLabel: getCaseContentType(data.case.contentType).label,
			caseCode: data.case.caseCode,
			branchRef: data.case.branchRef,
			publishedDisplay: publishedDisplay.format(new Date(data.draft.updatedAt)),
			jsonLd
		})
	] });
}
//#endregion
export { CasePreview as default };
