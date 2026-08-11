# Production Readiness Matrix

| Hạng mục | Trạng thái trong gói | IT cần làm |
|---|---|---|
| Giao diện bài V1.4 | Implemented | Nối published snapshot vào renderer động theo slug |
| Dashboard Content V2.0 | Implemented reference | Thay fixture bằng API hàng đợi có auth/branch scope |
| Luồng Zero‑Rekey | Implemented reference | Nối work order + catalog, lưu revision máy chủ |
| 6 ảnh lõi + 2 bổ sung | Implemented policy + test | Upload thật, xử lý ảnh, CDN và quyền dùng |
| Technical Review | Implemented reference | RBAC, review record gắn revision/digest |
| Gate engine | Implemented pure rules | Chạy lại phía server khi submit/review/publish |
| Data model | Implemented schema reference | Áp migration vào DB production và bổ sung mapping hiện hữu |
| API | OpenAPI + TypeScript contract | Cài endpoint trong CMS/backend Auto365 |
| Auth/RBAC | Contract | Dùng SSO/session CMS; không tin role từ client |
| SEO/AI output | Generator reference | Dùng URL registry, published snapshot và dynamic metadata |
| Publish | Contract only | Transaction/outbox, slug reservation, sitemap, cache và retry |
| Rollback | Contract/runbook | Cài rollback atomic về published snapshot cũ |
| Audit/metrics | Schema + KPI | Nối log, dashboard vận hành và cảnh báo |

## Không được hiểu sai

Tên sản phẩm là **Production Zero‑Rekey** vì đây là kiến trúc và UX đích. Gói này là **reference implementation + IT handoff**, không phải CMS production đã kết nối Auto365. Nút trong demo không ghi vào hệ thống live.

## Điều kiện đổi trạng thái sang Production Ready

- API, auth, DB, upload, review và publisher đã kết nối.
- Test backend/RBAC/media/idempotency đạt.
- 15 bài pilot: trung vị content không quá 6 phút, ít nhất 95% không cần IT hỗ trợ.
- 100% bài đủ 6–8 ảnh đúng vai trò và quyền.
- Không thể bypass kỹ thuật, không trùng URL/intent, publish retry không tạo bài trùng.
- Rollback một bài dưới 5 phút.

