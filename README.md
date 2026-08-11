# Auto365 Case Lab Studio V2.0 — Production Zero‑Rekey

Bộ reference + IT handoff giữ giao diện bài Case Lab V1.4 và thay Studio cũ bằng luồng vận hành 3–6 phút:

1. Chọn Case ID đã sẵn sàng.
2. Xác nhận dữ liệu tự nạp, chỉnh tối đa hai ghi chú.
3. Kiểm tra 6 ảnh lõi + tối đa 2 ảnh bổ sung.
4. Preview cùng revision và gửi kỹ thuật duyệt.

Content không nhập lại xe, sản phẩm, cấu hình, giá/VAT, chi nhánh, nguồn, tác giả, reviewer, URL hoặc SEO.

## Route

- `/` — bài mẫu Camry theo giao diện V1.4.
- `/studio` — Content Studio V2.0.
- `/studio/review` — Technical Review theo revision.

## Chạy

Node.js `>=22.13.0`.

```bash
npm run install:ci
npm run qa
npm run dev
```

## Bắt đầu bàn giao

Đọc [docs/START_HERE_IT.md](docs/START_HERE_IT.md), sau đó [docs/PRODUCTION_READINESS.md](docs/PRODUCTION_READINESS.md).

Các hợp đồng chính:

- `lib/zero-rekey.ts` — domain model, fixture, gate và workflow reference.
- `server/case-lab-contract.ts` — adapter/API TypeScript contract.
- `openapi/case-lab-v2.yaml` — OpenAPI 3.1.
- `db/schema.ts` + `drizzle/` — data model/migration reference.
- `docs/` — architecture, RBAC, media, SEO/AI, security, deploy và UAT.

## Trạng thái

UI + contract + acceptance suite đã nằm trong gói. Đây chưa phải CMS Auto365 đã kết nối: IT vẫn phải cài auth, work-order/catalog adapter, DB, upload/CDN và publisher. Xem bảng implemented/reference/IT must connect trong `docs/PRODUCTION_READINESS.md`.
