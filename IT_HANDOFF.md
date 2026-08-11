# Auto365 Case Lab Studio V2.0 — IT Handoff

## Phán quyết kỹ thuật

Không vá API vào form V1.3. V2.0 dùng mô hình Zero‑Rekey nằm trong CMS Auto365: phiếu việc + catalog + kho ảnh tạo một `CaseRecord` revisioned; content chỉ sửa hai trường, kỹ thuật duyệt đúng revision, publisher chạy lại gate và xuất immutable snapshot.

## Điểm đã khóa trong source

- UI dashboard theo `Sẵn sàng viết · Thiếu ảnh · Chờ duyệt · Bị trả sửa · Đã xuất bản`.
- Pilot chỉ tuyến Đèn.
- 6 ảnh bắt buộc: toàn xe, đèn zin, đèn sau nâng cấp, sản phẩm, Cos, Pha; 2 ảnh bổ sung: QC và bàn giao.
- System-owned fields không xuất hiện dưới dạng input.
- Có `Báo dữ liệu sai` chuyển đúng chủ sở hữu, không mặc định tạo ticket IT.
- Technical Review tách riêng; approval gắn revision.
- Gate engine, API DTO, schema DB, OpenAPI, media/security/SEO/runbook/UAT có trong gói.

## IT đọc trước

`docs/START_HERE_IT.md` là điểm bắt đầu duy nhất. Không dùng `lib/case-automation.ts` V1.3 làm write contract production; file này chỉ giữ compatibility cho bài/demo cũ. Contract V2 ở `lib/zero-rekey.ts` và `server/case-lab-contract.ts`.

## Go-live gate

Chỉ gọi production-ready sau khi API/auth/DB/upload/publisher thật đã nối và 15 bài pilot đạt KPI trong `docs/QA_UAT.md`.

