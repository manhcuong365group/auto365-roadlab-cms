# Deployment & Rollback Runbook

## Trước deploy

1. Backup DB và xác nhận migration plan.
2. Chạy `npm run install:ci && npm run qa` trên bản giải nén sạch.
3. Apply migration ở môi trường thử; kiểm unique constraints và down/forward strategy.
4. Cấu hình DB, object storage/CDN, CMS session, work-order/catalog adapter, publisher/outbox.
5. Seed role/branch scope và reviewer assignments.
6. Smoke test upload, preview noindex, review, publish idempotent, sitemap/cache.

## Triển khai an toàn

- Mở feature flag cho nhóm pilot tuyến Đèn và một chi nhánh trước.
- Import read-only work order trước; chỉ bật write sau khi đối chiếu nguồn.
- Chạy 3 ca thử nội bộ, rồi 15 ca pilot có đo thời gian/ticket.
- Chỉ mở tự publish sau approval khi 15 ca đạt gate.

## Rollback ứng dụng

- Tắt feature flag Studio write; public renderer tiếp tục đọc published snapshots.
- Rollback code không xóa schema/data mới.
- Requeue outbox sau khi nguyên nhân được sửa; không chạy lại publication thủ công không có idempotency key.

## Rollback bài

1. Publisher chọn published revision trước.
2. Backend tạo publication rollback idempotent, render hash và swap current published revision atomically.
3. Giữ canonical/slug, cập nhật sitemap/cache qua outbox.
4. Ghi audit và xác minh public page. Mục tiêu dưới 5 phút.
