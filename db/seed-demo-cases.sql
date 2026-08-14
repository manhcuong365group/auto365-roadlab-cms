-- Bộ dữ liệu demo vận hành Case Lab: 20 bài trải đều trong 7 ngày.
-- Chạy an toàn nhiều lần nhờ INSERT OR IGNORE với ID cố định.

INSERT OR IGNORE INTO work_orders (id, external_id, source_system, source_version, source_hash, vertical, branch_ref, readiness, payload_json, synced_at)
SELECT 'demo-wo-' || n, 'DEMO-' || printf('%03d', n), 'case-lab-demo', 1, 'demo-hash-' || n, 'lighting',
  CASE WHEN n % 4 = 0 THEN 'HCM-01' WHEN n % 4 = 1 THEN 'HN-01' WHEN n % 4 = 2 THEN 'DN-01' ELSE 'BD-01' END,
  CASE WHEN n IN (4, 9, 16) THEN 'missing_media' ELSE 'ready' END,
  json_object('demo', true, 'title', 'Bài vận hành Auto365 ' || printf('%02d', n)),
  datetime('now', '-' || ((20 - n) * 8) || ' hours')
FROM (SELECT column1 AS n FROM (VALUES (1),(2),(3),(4),(5),(6),(7),(8),(9),(10),(11),(12),(13),(14),(15),(16),(17),(18),(19),(20))) AS demo;

INSERT OR IGNORE INTO cases (id, case_code, work_order_id, vertical, branch_ref, vehicle_ref, product_ref, current_revision, published_revision, workflow_status, created_at, updated_at)
SELECT 'demo-case-' || n, 'CL-DEMO-' || printf('%03d', n), 'demo-wo-' || n, 'lighting',
  CASE WHEN n % 4 = 0 THEN 'HCM-01' WHEN n % 4 = 1 THEN 'HN-01' WHEN n % 4 = 2 THEN 'DN-01' ELSE 'BD-01' END,
  CASE n % 5 WHEN 0 THEN 'Mazda CX-5' WHEN 1 THEN 'Ford Ranger' WHEN 2 THEN 'Toyota Veloz' WHEN 3 THEN 'Kia Carnival' ELSE 'Honda CR-V' END,
  CASE n % 4 WHEN 0 THEN 'Bi LED Ultra Pro' WHEN 1 THEN 'Bi Laser X9' WHEN 2 THEN 'LED Matrix A5' ELSE 'Bi Gầm Titan' END,
  CASE WHEN n % 6 = 0 THEN 2 ELSE 1 END,
  CASE WHEN n IN (1, 6, 11, 17) THEN 1 ELSE NULL END,
  CASE n % 8 WHEN 0 THEN 'published' WHEN 1 THEN 'publishable' WHEN 2 THEN 'technical_approved' WHEN 3 THEN 'changes_requested' WHEN 4 THEN 'in_review' WHEN 5 THEN 'ready_for_review' WHEN 6 THEN 'draft' ELSE 'published' END,
  datetime('now', '-' || ((20 - n) * 8 + 4) || ' hours'), datetime('now', '-' || ((20 - n) * 8) || ' hours')
FROM (SELECT column1 AS n FROM (VALUES (1),(2),(3),(4),(5),(6),(7),(8),(9),(10),(11),(12),(13),(14),(15),(16),(17),(18),(19),(20))) AS demo;

INSERT OR IGNORE INTO case_revisions (id, case_id, revision, source_version, source_hash, content_json, technical_snapshot_json, catalog_snapshot_json, seo_snapshot_json, technical_digest, created_by, created_at)
SELECT 'demo-rev-' || n, 'demo-case-' || n, 1, 1, 'demo-revision-hash-' || n,
  json_object('title', 'Bài review xe ' || printf('%02d', n), 'summary', 'Nội dung demo để kiểm tra luồng Content, OA, SEO Lead và IT.'),
  json_object('vehicle', 'Đã xác minh tại chi nhánh', 'installation', 'Đạt'),
  json_object('product', 'Catalog demo Auto365', 'price', 'Đã đối soát'),
  json_object('metaTitle', 'Review nâng cấp ánh sáng Auto365 ' || printf('%02d', n), 'slug', 'review-auto365-demo-' || n),
  'demo-technical-digest-' || n, 'test-content-001', datetime('now', '-' || ((20 - n) * 8) || ' hours')
FROM (SELECT column1 AS n FROM (VALUES (1),(2),(3),(4),(5),(6),(7),(8),(9),(10),(11),(12),(13),(14),(15),(16),(17),(18),(19),(20))) AS demo;

INSERT OR IGNORE INTO case_assignments (id, case_id, user_id, role, assigned_by, assigned_at)
SELECT 'demo-asg-oa-' || n, 'demo-case-' || n, 'test-oa-001', 'oa', 'test-boss-001', datetime('now', '-' || ((20 - n) * 8) || ' hours') FROM (SELECT column1 AS n FROM (VALUES (1),(2),(3),(4),(5),(6),(7),(8),(9),(10),(11),(12),(13),(14),(15),(16),(17),(18),(19),(20))) AS demo;
INSERT OR IGNORE INTO case_assignments (id, case_id, user_id, role, assigned_by, assigned_at)
SELECT 'demo-asg-seo-' || n, 'demo-case-' || n, 'test-seo-lead-001', 'seo_lead', 'test-boss-001', datetime('now', '-' || ((20 - n) * 8) || ' hours') FROM (SELECT column1 AS n FROM (VALUES (1),(2),(3),(4),(5),(6),(7),(8),(9),(10),(11),(12),(13),(14),(15),(16),(17),(18),(19),(20))) AS demo;
INSERT OR IGNORE INTO case_assignments (id, case_id, user_id, role, assigned_by, assigned_at)
SELECT 'demo-asg-it-' || n, 'demo-case-' || n, 'test-it-001', 'it', 'test-boss-001', datetime('now', '-' || ((20 - n) * 8) || ' hours') FROM (SELECT column1 AS n FROM (VALUES (1),(2),(3),(4),(5),(6),(7),(8),(9),(10),(11),(12),(13),(14),(15),(16),(17),(18),(19),(20))) AS demo;

INSERT OR IGNORE INTO case_feedback (id, case_id, revision, author_id, category, message, status, created_at)
SELECT 'demo-feedback-' || n, 'demo-case-' || n, 1, CASE WHEN n % 2 = 0 THEN 'test-seo-lead-001' ELSE 'test-oa-001' END,
  CASE n % 4 WHEN 0 THEN 'evidence' WHEN 1 THEN 'content' WHEN 2 THEN 'seo' ELSE 'technical' END,
  CASE n % 4 WHEN 0 THEN 'Bổ sung ảnh nghiệm thu có biển số và góc chụp rõ hơn.' WHEN 1 THEN 'Rà lại câu mở đầu và thêm thông tin hành trình thực tế.' WHEN 2 THEN 'Kiểm tra lại meta title, slug và liên kết nội bộ.' ELSE 'Đối chiếu lại thông số kỹ thuật với catalog mới nhất.' END,
  CASE WHEN n % 3 = 0 THEN 'resolved' ELSE 'open' END,
  datetime('now', '-' || ((20 - n) * 8 - 1) || ' hours')
FROM (SELECT column1 AS n FROM (VALUES (1),(2),(3),(4),(5),(6),(7),(8),(9),(10),(11),(12),(13),(14),(15),(16),(17),(18),(19),(20))) AS demo;

INSERT OR IGNORE INTO audit_events (id, case_id, actor_id, actor_role, action, entity_type, entity_id, revision, detail_json, created_at)
SELECT 'demo-audit-' || n, 'demo-case-' || n, CASE WHEN n % 5 = 0 THEN 'test-boss-001' WHEN n % 2 = 0 THEN 'test-content-001' ELSE 'test-oa-001' END,
  CASE WHEN n % 5 = 0 THEN 'boss' WHEN n % 2 = 0 THEN 'content' ELSE 'oa' END, 'case.created', 'case', 'demo-case-' || n, 1,
  json_object('demo', true, 'message', 'Tạo case demo để kiểm tra dashboard'), datetime('now', '-' || ((20 - n) * 8) || ' hours')
FROM (SELECT column1 AS n FROM (VALUES (1),(2),(3),(4),(5),(6),(7),(8),(9),(10),(11),(12),(13),(14),(15),(16),(17),(18),(19),(20))) AS demo;

-- Bảo đảm tài khoản Sếp có lịch sử thao tác để kiểm thử dashboard theo quyền.
UPDATE audit_events SET actor_id = 'test-boss-001', actor_role = 'boss'
WHERE id IN ('demo-audit-5', 'demo-audit-10', 'demo-audit-15', 'demo-audit-20');

INSERT OR IGNORE INTO url_registry (id, case_id, slug, canonical_url, intent_key, owner_type, locked_at, created_at)
SELECT 'demo-url-' || n, 'demo-case-' || n, 'review-auto365-demo-' || n, 'https://auto365.vn/tin-tuc/review-auto365-demo-' || n,
  'demo-review-' || n, 'case', datetime('now', '-' || ((20 - n) * 8) || ' hours'), datetime('now', '-' || ((20 - n) * 8) || ' hours')
FROM (SELECT column1 AS n FROM (VALUES (1),(2),(3),(4),(5),(6),(7),(8),(9),(10),(11),(12),(13),(14),(15),(16),(17),(18),(19),(20))) AS demo;

INSERT OR IGNORE INTO notifications (id, user_id, type, title, body, case_id, payload_json, read_at, created_at)
SELECT 'demo-notification-' || n,
  CASE n % 4 WHEN 0 THEN 'test-content-001' WHEN 1 THEN 'test-oa-001' WHEN 2 THEN 'test-seo-lead-001' ELSE 'test-it-001' END,
  'case.update', 'Case ' || printf('%03d', n) || ' cần theo dõi',
  CASE n % 3 WHEN 0 THEN 'Có feedback mới cần phản hồi.' WHEN 1 THEN 'Case đã chuyển sang bước review tiếp theo.' ELSE 'Kiểm tra tiến độ trước thời hạn.' END,
  'demo-case-' || n, json_object('demo', true, 'caseCode', 'CL-DEMO-' || printf('%03d', n)),
  CASE WHEN n % 4 = 0 THEN datetime('now', '-' || ((20 - n) * 8 - 1) || ' hours') ELSE NULL END,
  datetime('now', '-' || ((20 - n) * 8 - 1) || ' hours')
FROM (SELECT column1 AS n FROM (VALUES (1),(2),(3),(4),(5),(6),(7),(8),(9),(10),(11),(12),(13),(14),(15),(16),(17),(18),(19),(20))) AS demo;
