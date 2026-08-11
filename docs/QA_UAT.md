# QA & UAT — V2.0

## Automated gate

```bash
npm run qa
```

Phải bao gồm lint, typecheck, migration generation/inspection, build, unit/contract tests và artifact validation.

## P0 test matrix

1. Work order hợp lệ tự nạp toàn bộ system fields; import lặp không tạo Case mới.
2. Client patch trường system-owned bị từ chối.
3. Thiếu một trong 6 role, trùng checksum, sai Case ID hoặc quyền pending chặn submit.
4. Asset tùy chọn nhập dở chặn evidence; upload retry riêng không mất draft.
5. Autosave revision cũ trả 409; không ghi đè im lặng.
6. Content không technical approve; reviewer sai assignment/revision bị 403/409.
7. Sửa content/media/technical sau approval làm approval mất hiệu lực.
8. Publish chạy lại gate; idempotency key lặp chỉ tạo một publication/slug.
9. URL/intent collision chặn publish; legacy canonical Camry được giữ.
10. Preview noindex; published HTML/metadata/JSON-LD cùng revision và renderer.
11. JSON-LD không đóng được thẻ script; URL `javascript:` bị chặn.
12. Magic-byte MIME, pixel/size, SVG/script payload, SSRF và cross-case media bị chặn.

## Browser/UAT

- 320/375/768/1440 px; không tràn ngang, keyboard ảo không che CTA.
- Hoàn tất bằng bàn phím; focus vào đúng lỗi; không axe critical/serious.
- Content: dashboard → chọn ca → chỉnh 2 ghi chú → xác nhận ảnh → preview → gửi duyệt.
- Reviewer: mở đúng revision → approve/return; UI không cho duyệt sau khi revision thay đổi.
- Mạng chậm/offline: `Đang lưu`, `Mất kết nối`, `Lưu lỗi` chính xác; retry không mất dữ liệu.

## Pilot gate 10/10

- 15 bài tuyến Đèn liên tiếp.
- Thời gian content trung vị ≤ 6 phút/bài.
- ≥95% bài không cần IT hỗ trợ; sau ổn định ≤1 ticket/100 bài.
- 100% bài có 6–8 ảnh đúng vai trò/quyền.
- 0 bypass kỹ thuật, 0 URL cùng intent, 0 duplicate publication.
- Rollback bài <5 phút.

