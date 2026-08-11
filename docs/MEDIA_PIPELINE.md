# Media Pipeline — Lighting Pilot

## Hợp đồng 6 + 2

| Role | Bắt buộc | Nội dung |
|---|---:|---|
| `vehicle_after` | Có | Toàn xe sau hoàn thiện |
| `lamp_stock_before` | Có | Đèn zin trước khi làm |
| `lamp_after` | Có | Đèn sau nâng cấp |
| `product_identity` | Có | Sản phẩm/tem/mã nhận diện |
| `beam_low_after` | Có | Cos sau căn chỉnh |
| `beam_high_after` | Có | Pha sau căn chỉnh |
| `installation_qc` | Không | Thi công hoặc QC |
| `handover_detail` | Không | Góc xe, bàn giao hoặc hậu kiểm |

Mỗi role tối đa một asset; tổng 6–8. Không tin `required` từ client, policy nằm server.

## Luồng upload

1. Xưởng quét QR/Case ID và chọn tối đa 8 ảnh một lần.
2. Backend cấp upload intent giới hạn dung lượng/MIME/role/case/actor.
3. R2 nhận bytes; finalize đọc magic byte, kích thước và SHA‑256, loại metadata nhạy cảm.
4. Chặn giả MIME, SVG/script payload, ảnh quá nhỏ, cross-case asset và trùng SHA‑256.
5. Tạo AVIF/WebP + `srcset` 16:9, 4:3, 1:1; lưu focal point desktop/mobile.
6. Asset lỗi retry riêng; 7 ảnh khác và draft không mất.
7. Rights attestation là record riêng có actor, policy version và thời gian.

## Giới hạn mặc định

- JPEG/PNG/WebP/HEIC theo magic bytes.
- Tối đa 20 MiB/file; tối thiểu 1280×720.
- URL public chỉ sinh cho asset `ready` + quyền `confirmed` + revision published.
- Original không public nếu policy không yêu cầu; delivery qua CDN signed/private trước publish.

