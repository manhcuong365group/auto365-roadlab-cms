# Security Baseline

## Trust boundary

- Session/identity đọc phía server; mapping actor → role → branch scope trong DB.
- SIWC/workspace header nếu dùng chỉ chứng minh identity, không tự chứng minh quyền Auto365.
- Mọi write endpoint xác thực Origin/CSRF theo cơ chế CMS, rate limit và audit request ID.
- Client chỉ gửi content-owned DTO; bỏ qua mọi workflow/gate/source/URL/approval field lạ.

## Media

- Không fetch URL tùy ý do client cung cấp; tránh SSRF.
- Đọc magic bytes, decode ảnh trong sandbox/bounded worker, giới hạn pixel/bytes/time.
- Chặn SVG, polyglot, EXIF độc hại, path traversal và filename không an toàn.
- R2 key do server sinh; không lấy filename làm key.

## Rendering

- Escape HTML và JSON-LD; serializer phải biến `<` thành `\u003c`.
- Sanitize content theo allowlist; không render raw HTML của content.
- Canonical/internal link chỉ lấy từ URL registry/catalog đã duyệt; chặn `javascript:`/external URL lạ.

## Workflow

- Optimistic concurrency và idempotency bắt buộc.
- Technical approval gắn immutable revision/digest và reviewer.
- Audit append-only cho source import, content edit, media, review, publish, rollback, role change.
- Secrets nằm trong secret manager/runtime; `.env.example` không chứa giá trị thật.

