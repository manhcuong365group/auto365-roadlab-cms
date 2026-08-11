# START HERE — Auto365 Case Lab Studio V2.0

## Mục tiêu

V2.0 biến Case Lab thành content type nằm trong CMS Auto365. Content chọn một Case ID đã sẵn sàng, kiểm tra 6–8 ảnh, chỉnh tối đa hai ghi chú và gửi kỹ thuật duyệt. Xe, sản phẩm, cấu hình, giá/VAT, chi nhánh, nguồn, tác giả, reviewer, URL và SEO đều lấy từ nguồn hệ thống.

## Đọc theo thứ tự

1. `PRODUCTION_READINESS.md` — phần đã làm và phần IT phải nối.
2. `ARCHITECTURE.md` — luồng dữ liệu và ranh giới hệ thống.
3. `../openapi/case-lab-v2.yaml` — hợp đồng API.
4. `../db/schema.ts` và thư mục `../drizzle/` — schema/migration tham chiếu.
5. `RBAC_WORKFLOW.md`, `MEDIA_PIPELINE.md`, `SEO_AI_CONTRACT.md`.
6. `SECURITY.md`, `DEPLOYMENT_RUNBOOK.md`, `QA_UAT.md`.

## Chạy và kiểm tra

Yêu cầu Node.js `>=22.13.0`.

```bash
npm run install:ci
npm run qa
npm run dev
```

- Bài public mẫu V1.4: `/`
- Content Studio V2.0: `/studio`
- Technical Review: `/studio/review`

## Phạm vi pilot khóa

- Chỉ tuyến `lighting`.
- 6 vai trò ảnh bắt buộc + 2 tùy chọn.
- 15 bài pilot liên tiếp trước khi mở Film/Camera/PPF.
- Studio demo dùng fixture để duyệt UI. Production phải nối CMS auth, phiếu việc, catalog, D1/DB, R2/CDN và publisher theo hợp đồng.

## Điểm bắt đầu triển khai

1. Ánh xạ session CMS sang `AuthenticatedActor` và role/branch scope.
2. Ánh xạ phiếu việc thật sang `WorkOrderSnapshot`.
3. Cài `CaseRepository`, `MediaGateway`, `GateService`, `PublishedRenderer` trong `../server/case-lab-contract.ts`.
4. Dùng schema/migration, không dùng `localStorage` làm nguồn thật.
5. Kết nối `/studio` với API; giữ nguyên content write DTO chỉ gồm hai ghi chú và lựa chọn tự xuất bản sau duyệt.
6. Chạy UAT, pilot và go-live gates trong `QA_UAT.md`.
