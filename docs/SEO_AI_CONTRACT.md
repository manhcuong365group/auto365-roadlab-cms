# SEO & AI Search Contract

## Cùng một revision

HTML visible, Answer First, metadata, canonical, Open Graph, JSON-LD và sitemap `lastmod` phải sinh từ cùng published revision. Không cho content nhập các trường này.

## Indexability

- Studio, draft, review và preview: `noindex, nofollow` + `X-Robots-Tag` tương ứng.
- Live chỉ `index, follow` khi record `published`, route khớp locked canonical và URL owner không collision.
- Standalone handoff luôn noindex.

## URL owner

- `url_registry.slug`, `canonical_url`, `intent_key` là unique.
- Kiểm legacy canonical trước khi sinh slug; Camry giữ URL đã có.
- Khóa slug ở lần publish đầu; hậu kiểm cập nhật cùng URL.
- Sản phẩm dùng URL hub chung không được giả làm Product owner riêng.

## Graph tối thiểu

`WebPage`, `NewsArticle`, `BreadcrumbList`, `WebSite`, `Organization`, `AutomotiveBusiness`, `Person`, `Vehicle`, `Product`, `ImageObject`; `FAQPage` chỉ khi FAQ hiển thị thật.

- Byline khớp `Article.author`; reviewer khớp `reviewedBy`.
- Product `@id` dùng entity ID ổn định, không dùng URL hub cho nhiều sản phẩm.
- Alt/caption/ImageObject lấy từ media snapshot đã duyệt.
- Không thêm `Review`, `AggregateRating`, `Offer`, `HowTo` nếu thiếu dữ liệu đúng mục đích.

## Claim policy

- `SOURCE_DISCLOSURE`: thông số catalog có nguồn/version.
- `CASE_OBSERVED`: ảnh/QC đúng ca.
- `CASE_MEASURED`: phải có thiết bị, calibration, phương pháp, điều kiện, thời điểm.
- `FOLLOWUP_CONFIRMED`: có ngày và evidence hậu kiểm.
- Thiếu dữ liệu hiển thị `NOT_COLLECTED`; AI không được suy diễn số hoặc hiệu quả.

