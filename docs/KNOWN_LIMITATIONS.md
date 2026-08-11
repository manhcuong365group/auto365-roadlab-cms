# Known Limitations of This Handoff

- UI hiện dùng fixture cục bộ để đội ngũ duyệt trải nghiệm; chưa gọi API Auto365 thật.
- Trạng thái “lưu máy chủ” trong demo chỉ mô phỏng độ trễ để thể hiện UX; production phải dùng revisioned autosave.
- Ảnh demo là URL ca Camry hiện có; production phải upload qua media pipeline.
- D1/R2 schema và binding là reference cho Sites; nếu CMS Auto365 dùng hạ tầng khác, giữ nguyên contract/constraint nhưng thay adapter.
- `/` vẫn là bài Camry mẫu; IT phải nối dynamic published repository/route.
- Preview trong UI là representation gần đúng; production phải gọi `PublishedRenderer.renderPreview()` dùng cùng renderer public.
- Film, Camera và PPF bị khóa khỏi pilot. Chỉ mở khi mỗi tuyến có field/evidence/media/schema policy và test riêng.
- Không có secret, session hoặc credential production trong gói.

