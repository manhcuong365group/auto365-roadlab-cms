-- Bộ dữ liệu demo vận hành Case Lab: 20 bài trải đều trong 7 ngày.
-- Chạy an toàn nhiều lần nhờ INSERT OR IGNORE với ID cố định.

INSERT OR IGNORE INTO work_orders (id, external_id, source_system, source_version, source_hash, vertical, branch_ref, readiness, payload_json, synced_at)
SELECT 'demo-wo-' || n, 'DEMO-' || printf('%03d', n), 'case-lab-demo', 1, 'demo-hash-' || n, 'lighting',
  CASE WHEN n % 4 = 0 THEN 'HCM-01' WHEN n % 4 = 1 THEN 'HN-01' WHEN n % 4 = 2 THEN 'DN-01' ELSE 'BD-01' END,
  CASE WHEN n IN (4, 9, 16) THEN 'missing_media' ELSE 'ready' END,
  json_object('demo', true, 'title', 'Bài vận hành Auto365 ' || printf('%02d', n)),
  datetime('now', '-' || ((20 - n) * 8) || ' hours')
FROM (SELECT column1 AS n FROM (VALUES (1),(2),(3),(4),(5),(6),(7),(8),(9),(10),(11),(12),(13),(14),(15),(16),(17),(18),(19),(20))) AS demo;

INSERT OR IGNORE INTO cases (id, case_code, content_type, work_order_id, vertical, branch_ref, vehicle_ref, product_ref, current_revision, published_revision, workflow_status, created_at, updated_at)
SELECT 'demo-case-' || n, 'CL-DEMO-' || printf('%03d', n), CASE n % 4 WHEN 1 THEN 'proof' WHEN 2 THEN 'brand' WHEN 3 THEN 'product' ELSE 'case' END, 'demo-wo-' || n, 'lighting',
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

-- Chuẩn hoá 20 revision demo theo biểu mẫu Road Lab. Ảnh là minh hoạ công khai,
-- chỉ phục vụ test giao diện và workflow; phải thay bằng ảnh nghiệm thu trước khi xuất bản.
WITH demo(n) AS (
  SELECT column1 FROM (VALUES (1),(2),(3),(4),(5),(6),(7),(8),(9),(10),(11),(12),(13),(14),(15),(16),(17),(18),(19),(20))
)
UPDATE case_revisions
SET content_json = (
  SELECT json_object(
    'templateKey', 'road_lab',
    'publication', json_object(
      'title', 'Demo · ' || CASE n % 4 WHEN 0 THEN 'Ca thực tế' WHEN 1 THEN 'Bằng chứng & nghiệm thu' WHEN 2 THEN 'Nội dung thương hiệu' ELSE 'Nội dung sản phẩm' END || ' · ' || CASE n % 5 WHEN 0 THEN 'Mazda CX-5' WHEN 1 THEN 'Ford Ranger' WHEN 2 THEN 'Toyota Veloz' WHEN 3 THEN 'Kia Carnival' ELSE 'Honda CR-V' END,
      'summary', 'Dữ liệu mô phỏng phục vụ kiểm thử luồng Road Lab; không phải kết quả nghiệm thu thực tế.',
      'answerFirst', 'Bản demo mô tả cách ghi nhận case, cấu hình và bằng chứng theo revision.',
      'heroUrl', CASE n % 4 WHEN 0 THEN 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80' WHEN 1 THEN 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=1200&q=80' WHEN 2 THEN 'https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?auto=format&fit=crop&w=1200&q=80' ELSE 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=1200&q=80' END
    ),
    'vehicle', json_object(
      'vehicleName', CASE n % 5 WHEN 0 THEN 'Mazda CX-5' WHEN 1 THEN 'Ford Ranger' WHEN 2 THEN 'Toyota Veloz' WHEN 3 THEN 'Kia Carnival' ELSE 'Honda CR-V' END,
      'modelYear', CAST(2020 + (n % 5) AS TEXT),
      'odometer', CAST(12000 + n * 1850 AS TEXT) || ' km (demo)',
      'primaryNeed', 'Cải thiện trải nghiệm di chuyển ban đêm; nhu cầu mô phỏng.',
      'usageConditions', 'Đi lại đô thị và đường trường; dữ liệu mô phỏng.',
      'installationStage', 'Đã ghi nhận demo'
    ),
    'configuration', json_object(
      'problem', 'Cần cải thiện hiệu quả chiếu sáng khi di chuyển tối.',
      'beforeConfig', 'Hệ thống nguyên bản; chưa có dữ liệu đo thực tế.',
      'actualConfig', CASE n % 4 WHEN 0 THEN 'Bi LED Ultra Pro' WHEN 1 THEN 'Bi Laser X9' WHEN 2 THEN 'LED Matrix A5' ELSE 'Bi Gầm Titan' END,
      'productName', CASE n % 4 WHEN 0 THEN 'Bi LED Ultra Pro' WHEN 1 THEN 'Bi Laser X9' WHEN 2 THEN 'LED Matrix A5' ELSE 'Bi Gầm Titan' END,
      'materials', 'Giắc zin, dây nguồn và vật tư lắp đặt mô phỏng'
    ),
    'evidence', json_object(
      'measurement', 'Điểm đo demo: ' || (350 + n * 5) || ' lux; không dùng để nghiệm thu thực tế.',
      'resultSummary', 'Ảnh và số liệu chỉ dùng để kiểm thử giao diện, revision và luồng review.',
      'proofUrls', CASE n % 4 WHEN 0 THEN 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=1200&q=80' WHEN 1 THEN 'https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?auto=format&fit=crop&w=1200&q=80' WHEN 2 THEN 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=1200&q=80' ELSE 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80' END || char(10) || CASE n % 4 WHEN 0 THEN 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=1200&q=80' WHEN 1 THEN 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80' WHEN 2 THEN 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=1200&q=80' ELSE 'https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?auto=format&fit=crop&w=1200&q=80' END,
      'sourceNotes', 'Ảnh minh hoạ công khai phục vụ bản demo; cần thay bằng ảnh nghiệm thu thực tế trước xuất bản.'
    ),
    'seo', json_object(
      'slug', 'road-lab-demo-' || printf('%02d', n),
      'metaTitle', 'Road Lab demo ' || printf('%02d', n) || ' | Auto365',
      'metaDescription', 'Dữ liệu mô phỏng để kiểm thử vận hành Road Lab, không dùng làm nội dung xuất bản.',
      'roadCaseId', 'ROAD-DEMO-' || printf('%03d', n),
      'proofLabId', 'PROOF-DEMO-' || printf('%03d', n),
      'brandPillarId', 'BRAND-DEMO-' || printf('%03d', n),
      'productOwnerId', 'PRODUCT-DEMO-' || printf('%03d', n)
    ),
    'review', json_object(
      'contentChecked', json('true'), 'evidenceChecked', json('true'), 'seoChecked', json('true'), 'technicalChecked', json('true'),
      'reviewNote', 'Bản dữ liệu mô phỏng để test toàn bộ workflow.'
    )
  )
  FROM demo
  WHERE case_revisions.id = 'demo-rev-' || n
)
WHERE id IN (SELECT 'demo-rev-' || n FROM demo);

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

-- Bảo đảm mỗi loại nội dung (case/proof/brand/product) có ít nhất một bài ở
-- trạng thái published, để trang xem bài công khai (/tin-tuc/[slug]) luôn có
-- dữ liệu thật cho cả 4 layout khi kiểm thử.
UPDATE cases SET workflow_status = 'published', published_revision = current_revision
WHERE id IN ('demo-case-1', 'demo-case-2', 'demo-case-3', 'demo-case-4');

-- Nội dung demo đúng khuôn từng loại (proof/brand/product/case) cho 4 bài
-- published ở trên. Nội dung được biên soạn lại (không sao chép nguyên văn)
-- dựa trên các bài thật đang đăng tại https://auto365.vn/tin-tuc, cùng một
-- sản phẩm xuyên suốt (X-Light 301 V2) để 4 bài liên kết chéo với nhau qua
-- mục "Bài liên quan" — bản gốc chỉ có khuôn road_lab chung nên thiếu các
-- trường riêng của Proof Lab / Brand Story / Product Spotlight.
UPDATE case_revisions SET content_json = json_object(
  'templateKey', 'proof_lab',
  'publication', json_object(
    'title', 'X-Light F30 Ultra sau khi lắp: checklist kiểm tra trước khi nhận xe',
    'summary', 'Checklist kiểm tra nhanh sau khi lắp X-Light F30 Ultra: vị trí đèn, Cos/Pha, đường dây, cầu chì và cảnh báo điện trước khi bàn giao.',
    'answerFirst', 'Sau khi lắp X-Light F30 Ultra, khách hàng nên kiểm tra vị trí hai bên đèn, độ chắc của pát, hoạt động Cos/Pha, đường dây, cầu chì và cảnh báo trên bảng đồng hồ, sau đó chạy thử ngắn trước khi nhận xe. Chưa nên nhận xe nếu đèn rung hoặc lệch rõ, Cos/Pha chuyển không đồng đều, dây chưa hoàn thiện, có mùi khét bất thường hoặc xuất hiện cảnh báo điện.',
    'heroUrl', 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=1200&q=80'
  ),
  'verification', json_object(
    'subjectRef', 'X-Light F30 Ultra — đèn gầm dạng rời lắp bổ sung',
    'testMethod', 'Checklist quan sát trực quan (vị trí đèn, Cos/Pha, dây, cầu chì) kết hợp chạy thử ngắn trước khi bàn giao',
    'standardRef', 'Trang sản phẩm X-Light F30 Ultra trên Auto365, đối chiếu ngày 15/08/2026',
    'testedAt', '15/08/2026',
    'verifiedBy', 'Nguyễn Quang Đạo — Rà soát kỹ thuật phụ kiện điện tử ô tô'
  ),
  'findings', json_object(
    'beforeResult', 'Trước khi kiểm tra: chưa xác nhận vị trí hai bên đèn, hoạt động Cos/Pha, tình trạng đường dây và cảnh báo điện.',
    'afterResult', 'Sau khi kiểm tra: hai bên đèn cân đối và chắc chắn, Cos/Pha chuyển đồng thời, đường dây gọn và cố định, không ghi nhận cảnh báo điện.',
    'conclusion', 'Trước khi nhận xe, khách hàng nên kiểm tra đủ các điểm chính: vị trí đèn, độ chắc của pát, Cos/Pha, đường dây, cầu chì, cảnh báo điện và chạy thử ngắn trong khu vực phù hợp.',
    'deviationNote', 'Nếu đèn lệch, rung, chớp, có mùi khét hoặc mùi nhựa nóng bất thường, hoặc xuất hiện cảnh báo điện, cần yêu cầu kỹ thuật viên kiểm tra lại trước khi bàn giao.'
  ),
  'evidence', json_object(
    'measurement', 'Checklist 6 bước quan sát trực quan và chạy thử ngắn, không dùng thiết bị đo quang học chuyên dụng.',
    'resultSummary', 'Đèn cân đối, Cos/Pha hoạt động đồng đều, đường dây gọn và không phát sinh cảnh báo điện tại thời điểm kiểm tra.',
    'proofUrls', 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80' || char(10) || 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=1200&q=80',
    'sourceNotes', 'Ảnh minh hoạ một ca lắp X-Light F30 Ultra tại Auto365; vị trí pát, dây, giắc và cầu chì có thể khác nhau theo từng dòng xe.'
  ),
  'seo', json_object(
    'slug', 'review-auto365-demo-1',
    'metaTitle', 'X-Light F30 Ultra sau lắp: Checklist trước khi nhận xe | Auto365',
    'metaDescription', 'Checklist kiểm tra X-Light F30 Ultra sau khi lắp: vị trí đèn, Cos/Pha, đường dây, cầu chì và cảnh báo điện trước khi nhận xe.',
    'proofLabId', 'PROOF-DEMO-001', 'roadCaseId', 'ROAD-DEMO-001', 'brandPillarId', 'BRAND-DEMO-001', 'productOwnerId', 'PRODUCT-DEMO-001'
  ),
  'review', json_object(
    'verificationChecked', json('true'), 'findingsChecked', json('true'), 'evidenceChecked', json('true'), 'seoChecked', json('true'),
    'reviewNote', 'Đã đối chiếu checklist với trang sản phẩm X-Light F30 Ultra hiện hành.'
  ),
  'extended', json_object(
    'authorName', 'Phương', 'authorRole', 'Team Content Auto365',
    'reviewerName', 'Nguyễn Quang Đạo', 'reviewerRole', 'Rà soát kỹ thuật phụ kiện điện tử ô tô',
    'primarySource', 'Trang sản phẩm X-Light F30 Ultra trên Auto365, đối chiếu ngày 15/08/2026',
    'timeline', 'Kiểm tra hai bên đèn — Quan sát độ cân đối và độ chắc của pát.' || char(10) || 'Bật Cos — Kiểm tra hai bên cùng sáng, vùng sáng không lệch rõ.' || char(10) || 'Thử Pha — Chuyển Cos/Pha vài lần, kiểm tra hai đèn đồng bộ.' || char(10) || 'Kiểm tra đường dây — Quan sát dây gọn, vị trí cầu chì, giắc cắm.' || char(10) || 'Chạy thử ngắn — Kiểm tra rung, mùi bất thường, cảnh báo điện.' || char(10) || 'Bàn giao — Hướng dẫn Cos/Pha, vị trí cầu chì và chính sách bảo hành.',
    'known', 'Hai bên đèn cân đối, không lỏng hoặc rung khi xe nổ máy' || char(10) || 'Cos/Pha chuyển đồng thời, không chớp hoặc mất một bên' || char(10) || 'Đường dây được bó gọn, giắc cắm chắc chắn, không lộ đầu nối',
    'unknown', 'Độ bền dây và giắc sau thời gian dài sử dụng trên từng dòng xe cụ thể' || char(10) || 'Vị trí cầu chì/relay chính xác theo từng phương án thi công, có thể khác nhau theo xe',
    'qc', 'Vị trí đèn — Cân đối, được giữ chắc' || char(10) || 'Cos/Pha — Hoạt động đồng thời, không chớp' || char(10) || 'Đường dây — Gọn, cố định, không hở đầu nối' || char(10) || 'Chạy thử — Không rung, không mùi khét, không cảnh báo điện',
    'faqs', 'Q: Lắp F30 Ultra xong có cần căn chỉnh góc chiếu không?' || char(10) || 'A: Có. Kỹ thuật viên cần kiểm tra lại góc chiếu sau khi cố định pát, vì vị trí lắp và kết cấu cản trước có thể khác nhau theo từng xe.' || char(10) || char(10) || 'Q: Có nên tự chỉnh pát F30 Ultra tại nhà không?' || char(10) || 'A: Không nên. Nếu thấy đèn lệch, rung hoặc vùng sáng thay đổi bất thường, khách hàng nên đặt lịch để kỹ thuật viên kiểm tra lại pát, dây và góc chiếu.',
    'metrics', 'Công suất Cos công bố — Khoảng 75W' || char(10) || 'Công suất Pha công bố — Khoảng 95W' || char(10) || 'Điện áp — Dải 12V đến 16V' || char(10) || 'Cấu hình nhiệt màu — 6500K/6500K, 5500K/3000K, 3000K/3000K' || char(10) || 'Bảo hành công bố — 24 tháng',
    'followup', 'Bàn giao xe — Ngày 0 — done' || char(10) || 'Nhắc kiểm tra lại nếu có bất thường — Theo nhu cầu — pending',
    'related', 'Kia Carnival 2004 lắp bi gầm X-Light 301 V2 — /tin-tuc/review-auto365-demo-4' || char(10) || 'Đèn bi gầm X-Light 301 V2: thông số, giá và có nên lắp không — /tin-tuc/review-auto365-demo-3'
  )
) WHERE id = 'demo-rev-1';

UPDATE case_revisions SET content_json = json_object(
  'templateKey', 'brand_story',
  'publication', json_object(
    'title', 'Auto365.vn: hành trình từ garage đầu tiên đến hệ thống nâng cấp ô tô lớn nhất Việt Nam',
    'summary', 'Các cột mốc phát triển của Auto365.vn từ garage đầu tiên tại Thủ Đức năm 2016 đến hệ thống hơn 88 chi nhánh toàn quốc.',
    'answerFirst', 'Auto365.vn thành lập tháng 3/2016 tại Thủ Đức, TP. Hồ Chí Minh. Đến 30/11/2022, hệ thống có hơn 88 chi nhánh toàn quốc, thử nghiệm mở rộng sang Cambodia và Laos, trở thành hệ thống độ đèn lớn nhất Việt Nam với hơn 100 cửa hàng và là nhà phân phối 3M chính thức tại thị trường Việt Nam.',
    'heroUrl', 'https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?auto=format&fit=crop&w=1200&q=80'
  ),
  'positioning', json_object(
    'targetAudience', 'Chủ xe cá nhân trên toàn quốc có nhu cầu nâng cấp ánh sáng, phim cách nhiệt, PPF và phụ kiện ô tô.',
    'positioningStatement', 'Auto365 là hệ thống nâng cấp ô tô toàn quốc, dẫn đầu công nghệ nâng cấp ánh sáng tại Việt Nam, với quy trình thi công chuyên nghiệp và đội ngũ kỹ thuật giàu kinh nghiệm.',
    'toneOfVoice', 'Tự tin, gắn với hành trình phát triển thực tế, hướng tới cộng đồng.',
    'keyMessages', 'Dẫn đầu công nghệ nâng cấp ánh sáng, định hướng thị trường độ đèn tại Việt Nam' || char(10) || 'Đội ngũ kỹ thuật viên giàu kinh nghiệm, được đào tạo liên tục theo công nghệ mới' || char(10) || 'Quy trình nâng cấp ô tô chuyên nghiệp, giảm thiểu rủi ro cho xe khách hàng',
    'differentiators', 'Cơ sở hạ tầng showroom và trang thiết bị cao cấp tại từng chi nhánh' || char(10) || 'Hệ thống gần 100 cửa hàng trải dài toàn quốc, dễ tiếp cận' || char(10) || 'Là nhà phân phối 3M chính thức tại thị trường Việt Nam'
  ),
  'support', json_object(
    'supportingFacts', 'Hơn 88 chi nhánh toàn quốc tính đến 30/11/2022, cùng các điểm thử nghiệm tại Cambodia và Laos.',
    'socialProof', 'Trở thành hệ thống độ đèn lớn nhất Việt Nam với hơn 100 cửa hàng; sự kiện "7 năm một chặng đường" (2022) quy tụ toàn bộ hệ thống.'
  ),
  'evidence', json_object(
    'measurement', '', 'resultSummary', 'Các cột mốc phát triển từ 26/03/2016 đến 30/11/2022 theo trang Giới thiệu chính thức của Auto365.vn.',
    'proofUrls', 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=1200&q=80' || char(10) || 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80',
    'sourceNotes', 'Nội dung tổng hợp từ trang Giới thiệu Auto365.vn, mục "Các cột mốc Auto365.vn".'
  ),
  'seo', json_object(
    'slug', 'review-auto365-demo-2',
    'metaTitle', 'Auto365.vn: hành trình từ garage đầu tiên đến hệ thống lớn nhất Việt Nam',
    'metaDescription', 'Các cột mốc phát triển của Auto365.vn: từ garage đầu tiên tại Thủ Đức 2016 đến hệ thống hơn 88 chi nhánh toàn quốc.',
    'brandPillarId', 'BRAND-DEMO-002', 'roadCaseId', 'ROAD-DEMO-002', 'proofLabId', 'PROOF-DEMO-002', 'productOwnerId', 'PRODUCT-DEMO-002'
  ),
  'review', json_object(
    'positioningChecked', json('true'), 'supportChecked', json('true'), 'evidenceChecked', json('true'), 'seoChecked', json('true'),
    'reviewNote', 'Thông điệp và mốc thời gian đã đối chiếu với trang Giới thiệu Auto365.vn hiện hành.'
  ),
  'extended', json_object(
    'authorName', 'Team Content Auto365', 'authorRole', 'Content Auto365',
    'reviewerName', '', 'reviewerRole', '',
    'primarySource', 'Trang Giới thiệu Auto365.vn, mục "Các cột mốc Auto365.vn"',
    'timeline', 'Garage đầu tiên tại Thủ Đức (26/03/2016) — Đơn vị nòng cốt tiên phong nghiên cứu, phát triển sản phẩm chủ lực của hệ thống.' || char(10) || 'Triển khai mô hình hợp tác phát triển thương hiệu (31/12/2017) — Mở rộng lên 21 chi nhánh, trải dài cả ba khu vực Bắc Trung Nam.' || char(10) || 'Tăng trưởng thần tốc (23/10/2020) — Có mặt tại 45 tỉnh thành, mở rộng thêm Detailing, đồ chơi xe hơi, DVD Android, phim cách nhiệt và PPF.' || char(10) || 'Hơn 88 chi nhánh toàn quốc (30/11/2022) — Thử nghiệm tại Cambodia và Laos, trở thành nhà phân phối 3M chính thức tại Việt Nam.',
    'known', 'Có mặt tại hơn 88 chi nhánh toàn quốc tính đến 30/11/2022' || char(10) || 'Là nhà phân phối 3M chính thức tại thị trường Việt Nam' || char(10) || 'Hệ thống độ đèn lớn nhất Việt Nam với hơn 100 cửa hàng',
    'unknown', 'Số liệu chi nhánh và quy mô cập nhật sau năm 2022 chưa được công bố trên trang giới thiệu',
    'qc', 'Thông tin cột mốc — Đã đối chiếu với trang Giới thiệu chính thức' || char(10) || 'Số liệu chi nhánh — Đã xác minh tại thời điểm biên tập',
    'faqs', 'Q: Auto365 thành lập từ năm nào?' || char(10) || 'A: Auto365 chính thức có mặt trên thị trường từ tháng 3 năm 2016, với garage đầu tiên tại Thủ Đức, TP. Hồ Chí Minh.' || char(10) || char(10) || 'Q: Auto365 hiện có bao nhiêu chi nhánh?' || char(10) || 'A: Theo cột mốc công bố gần nhất (30/11/2022), Auto365 có hơn 88 chi nhánh toàn quốc, gồm cả các điểm thử nghiệm tại Cambodia và Laos.',
    'related', 'Kia Carnival 2004 lắp bi gầm X-Light 301 V2 — /tin-tuc/review-auto365-demo-4' || char(10) || 'X-Light F30 Ultra sau khi lắp: checklist kiểm tra trước khi nhận xe — /tin-tuc/review-auto365-demo-1'
  )
) WHERE id = 'demo-rev-2';

UPDATE case_revisions SET content_json = json_object(
  'templateKey', 'product_spotlight',
  'publication', json_object(
    'title', 'Đèn bi gầm X-Light 301 V2: thông số, giá và có nên lắp không',
    'summary', 'Thông số kỹ thuật, giá bán và đánh giá đèn bi gầm X-Light 301 V2 — dòng đèn 3 nhiệt màu, Cos mạnh của X-Light.',
    'answerFirst', 'X-Light 301 V2 là đèn bi gầm 3 chế độ nhiệt màu (3000K/4300K/5500K), công suất Cos khoảng 45W, Pha khoảng 55W, kháng nước IP68, giá tham khảo 4.500.000 VNĐ/bộ (01 cặp = 02 đèn), chưa VAT, bảo hành 24 tháng.',
    'heroUrl', 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=1200&q=80'
  ),
  'productInfo', json_object(
    'productName', 'X-Light 301 V2',
    'keySpecs', 'Công suất Cos khoảng 45W, Pha khoảng 55W' || char(10) || '6 chip LED chính (Big), kích thước thấu kính 3.0 Inch' || char(10) || 'Kích thước đèn 129x67x80mm, tuổi thọ 30.000 giờ' || char(10) || 'Điện áp dải 12V đến 16V, kháng nước IP68',
    'keyFeatures', '3 chế độ nhiệt màu: 3000K/4300K/5500K, tuỳ chỉnh theo điều kiện sử dụng' || char(10) || 'Hệ thống tản nhiệt chủ động (quạt tản nhiệt và rãnh tản nhiệt)' || char(10) || 'Cos mạnh, đường cắt sáng rõ, lắp trực tiếp vào hốc đèn gầm, không cần khoét đục',
    'useCases', 'Xe cần bổ sung vùng sáng thấp khi đi cao tốc hoặc đường thiếu sáng ban đêm' || char(10) || 'Chủ xe muốn tuỳ chỉnh nhiệt màu theo điều kiện di chuyển thực tế',
    'pricingNote', '4.500.000 VNĐ/bộ (01 cặp = 02 đèn), chưa VAT'
  ),
  'comparison', json_object(
    'alternativeRef', 'Bi gầm GTR G1 Turbo V2, giá tham khảo 6.000.000 VNĐ',
    'advantageNote', 'X-Light 301 V2 có giá thấp hơn và cho phép tuỳ chỉnh 3 nhiệt màu; GTR G1 Turbo V2 định vị phân khúc cao hơn với công suất lớn hơn.'
  ),
  'evidence', json_object(
    'measurement', 'Thông số theo trang sản phẩm Auto365, đối chiếu ngày 20/07/2026.',
    'resultSummary', 'Thông số đã đối chiếu với dữ liệu nhà cung cấp; có thể thay đổi theo lô hàng và thời điểm cung cấp.',
    'proofUrls', 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80' || char(10) || 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=1200&q=80',
    'sourceNotes', 'Ảnh sản phẩm minh hoạ từ trang "ĐÈN BI GẦM X-LIGHT 301 V2" trên Auto365.vn.'
  ),
  'seo', json_object(
    'slug', 'review-auto365-demo-3',
    'metaTitle', 'Đèn bi gầm X-Light 301 V2: thông số, giá và có nên lắp không | Auto365',
    'metaDescription', 'X-Light 301 V2: thông số Cos/Pha, 3 nhiệt màu, giá 4.500.000 VNĐ/bộ và so sánh với Bi gầm GTR G1 Turbo V2.',
    'productOwnerId', 'PRODUCT-DEMO-003', 'roadCaseId', 'ROAD-DEMO-003', 'proofLabId', 'PROOF-DEMO-003', 'brandPillarId', 'BRAND-DEMO-003'
  ),
  'review', json_object(
    'productChecked', json('true'), 'comparisonChecked', json('true'), 'evidenceChecked', json('true'), 'seoChecked', json('true'),
    'reviewNote', 'Đã đối chiếu giá bán và thông số với trang sản phẩm hiện hành.'
  ),
  'extended', json_object(
    'authorName', 'Team Content Auto365', 'authorRole', 'Content Auto365',
    'reviewerName', 'Nguyễn Quang Đạo', 'reviewerRole', 'Tư vấn kỹ thuật theo sản phẩm',
    'primarySource', 'Trang sản phẩm ĐÈN BI GẦM X-LIGHT 301 V2 trên Auto365.vn, cập nhật 20/07/2026',
    'timeline', 'Tư vấn kỹ thuật theo sản phẩm — Hotline 0365.365.365 / 0365.365.911.' || char(10) || 'Kiểm tra khả năng tương thích trước khi lắp — Liên hệ trước khi thi công để xác nhận phù hợp.',
    'known', 'Thông số theo dữ liệu nhà cung cấp, có thể thay đổi theo lô hàng' || char(10) || 'Bảo hành áp dụng theo chính sách của từng sản phẩm',
    'unknown', 'Hiệu quả chiếu sáng thực tế sau khi lắp và căn chỉnh trên từng xe cụ thể',
    'qc', 'Thông tin sản phẩm — Đã đối chiếu với dữ liệu nhà cung cấp' || char(10) || 'Chính sách bảo hành — Áp dụng theo điều kiện của từng sản phẩm',
    'faqs', 'Q: X-Light 301 V2 có mấy chế độ nhiệt màu?' || char(10) || 'A: Sản phẩm có 3 chế độ nhiệt màu 3000K, 4300K và 5500K, cho phép tuỳ chỉnh theo điều kiện sử dụng.' || char(10) || char(10) || 'Q: X-Light 301 V2 giá bao nhiêu?' || char(10) || 'A: Giá tham khảo 4.500.000 VNĐ/bộ (01 cặp = 02 đèn), chưa gồm VAT và công lắp; giá có thể thay đổi theo thời điểm và chính sách phân phối.',
    'metrics', 'Công suất Cos — Khoảng 45W' || char(10) || 'Công suất Pha — Khoảng 55W' || char(10) || 'Nhân LED — 6 (Big)' || char(10) || 'Nhiệt màu — 3000 tới 5500K' || char(10) || 'Hệ thống tản nhiệt — Chủ động' || char(10) || 'Chống nước — IP68' || char(10) || 'Tuổi thọ — 30.000 giờ' || char(10) || 'Điện áp — Dải 12V đến 16V' || char(10) || 'Kích thước đèn — 129x67x80mm' || char(10) || 'Kích thước Lens — 3.0 Inch' || char(10) || 'Bảo hành — 24 tháng',
    'priceValue', '4.500.000 VNĐ/bộ', 'priceNote', 'Chưa VAT · 01 bộ = 01 cặp = 02 đèn',
    'priceIncludes', 'Bảo hành 24 tháng theo chính sách sản phẩm' || char(10) || 'Tư vấn kỹ thuật theo sản phẩm trước khi lắp' || char(10) || 'Kiểm tra khả năng tương thích trước khi thi công',
    'related', 'Kia Carnival 2004 lắp bi gầm X-Light 301 V2 — /tin-tuc/review-auto365-demo-4' || char(10) || 'X-Light F30 Ultra sau khi lắp: checklist kiểm tra trước khi nhận xe — /tin-tuc/review-auto365-demo-1'
  )
) WHERE id = 'demo-rev-3';

UPDATE case_revisions SET content_json = json_object(
  'templateKey', 'road_lab',
  'publication', json_object(
    'title', 'Kia Carnival 2004 lắp bi gầm X-Light 301 V2: giá và cấu hình',
    'summary', 'Ca thực tế Kia Carnival 2004 lắp bi gầm X-Light 301 V2 tại hốc đèn gầm: cấu hình thi công, chi phí và các hạng mục cần kiểm tra.',
    'answerFirst', 'Kia Carnival 2004 trong bài được lắp 01 cặp bi gầm X-Light 301 V2 tại hốc đèn gầm. Ca thi công có tháo cản, gia công trên pát/bộ gá rời, sử dụng relay và cầu chì; hồ sơ không ghi nhận cắt, khoan hoặc sửa đổi trực tiếp chi tiết nguyên bản. Giá tham khảo 4.500.000 VNĐ/bộ, chưa VAT, bảo hành 24 tháng.',
    'heroUrl', 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80'
  ),
  'vehicle', json_object(
    'vehicleName', 'Kia Carnival', 'modelYear', '2004', 'odometer', 'Hồ sơ không lưu ODO',
    'primaryNeed', 'Hồ sơ ca xe ghi nhận nhu cầu bổ sung ánh sáng khi điều kiện quan sát hạn chế; không lưu tuyến đường và tình huống sử dụng cụ thể của chủ xe.',
    'usageConditions', 'Bản 2.9 MT; hồ sơ ca xe không lưu tuyến đường và tần suất sử dụng cụ thể của chủ xe.',
    'installationStage', 'Đã hoàn thiện, nghiệm thu tại Auto365.vn - Trụ Sở Chính, ngày dữ liệu 13/08/2026'
  ),
  'configuration', json_object(
    'problem', 'Đèn gầm nguyên bản trước nâng cấp: hồ sơ hiện không đủ dữ liệu để công bố cấu hình cụ thể.',
    'beforeConfig', 'Hồ sơ hiện không đủ dữ liệu để công bố.',
    'actualConfig', 'X-Light 301 V2 lắp tại hốc đèn gầm; có tháo cản, gia công trên pát/bộ gá rời, không ghi nhận cắt khoan chi tiết nguyên bản.',
    'productName', 'X-Light 301 V2',
    'materials', 'Pát/bộ gá rời gia công riêng, relay và cầu chì bảo vệ nguồn, công tắc điều khiển.'
  ),
  'evidence', json_object(
    'measurement', 'Công suất Cos khoảng 45W, Pha khoảng 55W; 3 chế độ nhiệt màu 3000K/4300K/5500K.',
    'resultSummary', 'Kết quả nghiệm thu tại xưởng: Cos/Pha hoạt động sau căn chỉnh, cân bằng hai bên đã kiểm tra, không ghi nhận cảnh báo điện.',
    'proofUrls', 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=1200&q=80' || char(10) || 'https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?auto=format&fit=crop&w=1200&q=80',
    'sourceNotes', 'Ảnh nghiệm thu tại xưởng Auto365.vn - Trụ Sở Chính, ngày dữ liệu 13/08/2026.'
  ),
  'seo', json_object(
    'slug', 'review-auto365-demo-4',
    'metaTitle', 'Kia Carnival 2004 lắp bi gầm X-Light 301 V2: Giá và cấu hình | Auto365',
    'metaDescription', 'Ca thực tế Kia Carnival 2004 lắp bi gầm X-Light 301 V2: cấu hình thi công, giá 4.500.000 VNĐ/bộ và các hạng mục cần kiểm tra.',
    'roadCaseId', 'ROAD-DEMO-004', 'proofLabId', 'PROOF-DEMO-004', 'brandPillarId', 'BRAND-DEMO-004', 'productOwnerId', 'PRODUCT-DEMO-004'
  ),
  'review', json_object(
    'contentChecked', json('true'), 'evidenceChecked', json('true'), 'seoChecked', json('true'), 'technicalChecked', json('true'),
    'reviewNote', 'Đã đối chiếu với hồ sơ thi công gốc tại Auto365.vn - Trụ Sở Chính.'
  ),
  'extended', json_object(
    'authorName', 'Vinh', 'authorRole', 'Team Content Auto365',
    'reviewerName', 'Nguyễn Quang Đạo', 'reviewerRole', 'Rà soát kỹ thuật phụ kiện điện tử ô tô',
    'primarySource', 'Thông tin sản phẩm X-Light 301 V2 trên Auto365/X-Light và hồ sơ kỹ thuật sản phẩm, đối chiếu ngày 13/08/2026',
    'timeline', 'Tiếp nhận xe và xác định nhu cầu — Ghi nhận nhu cầu bổ sung ánh sáng khi điều kiện quan sát hạn chế.' || char(10) || 'Kiểm tra hệ thống nguyên bản — Đối chiếu hốc đèn gầm, nguồn điện và điều kiện lắp đặt.' || char(10) || 'Khảo sát vị trí lắp đặt — Xác định điểm bắt pát và khoảng trống tản nhiệt.' || char(10) || 'Tư vấn cấu hình và nhiệt màu — Chốt X-Light 301 V2 theo nhu cầu sử dụng.' || char(10) || 'Lắp đặt và hoàn thiện hệ thống — Tháo cản, gia công pát/bộ gá rời, đấu relay và cầu chì.' || char(10) || 'Kiểm tra hoạt động Cos/Pha — Xác nhận cả hai chế độ hoạt động ổn định.' || char(10) || 'Căn chỉnh vùng sáng — Cân đối vùng sáng hai bên theo kết cấu xe.' || char(10) || 'Nghiệm thu và bàn giao — Rà soát pát, điện, Cos/Pha trước khi bàn giao.',
    'known', 'Có tháo cản trong ca thi công này, đã áp dụng thực tế trên Kia Carnival 2004' || char(10) || 'Gia công trên pát/bộ gá rời, không ghi nhận cắt khoan chi tiết nguyên bản' || char(10) || 'Có relay và cầu chì bảo vệ nguồn theo phương án thi công' || char(10) || 'Cos và Pha hoạt động sau căn chỉnh, không ghi nhận cảnh báo điện tại nghiệm thu',
    'unknown', 'Cấu hình đèn gầm trước nâng cấp — hồ sơ hiện không đủ dữ liệu để công bố' || char(10) || 'Hiệu quả thực tế khi lái cao tốc ban đêm lâu dài (chưa có dữ liệu hậu kiểm độc lập)' || char(10) || 'Vị trí cảm biến phía sau cản — bộ ảnh hiện tại không lưu đầy đủ',
    'qc', 'Cos — Hoạt động sau căn chỉnh' || char(10) || 'Pha — Hoạt động sau căn chỉnh' || char(10) || 'Cân bằng hai bên — Đã kiểm tra' || char(10) || 'Cảnh báo điện — Không ghi nhận tại nghiệm thu' || char(10) || 'Pát/bộ gá — Đã kiểm tra độ chắc chắn' || char(10) || 'Relay/Cầu chì — Đã kiểm tra',
    'faqs', 'Q: Kia Carnival 2004 có lắp được bi gầm X-Light 301 V2 không?' || char(10) || 'A: Có thể cân nhắc lắp, tuy nhiên cần kiểm tra trực tiếp hốc đèn gầm, pát cố định, khoảng trống phía sau và hệ thống điện trước khi thi công.' || char(10) || char(10) || 'Q: Lắp X-Light 301 V2 cho Kia Carnival 2004 có cần tháo cản không?' || char(10) || 'A: Có. Trong ca này, kỹ thuật viên đã tháo cản trước để tiếp cận hốc đèn gầm, hoàn thiện pát/bộ gá rời và lắp đặt đèn; đây là dữ liệu của ca thực tế, không mặc định áp dụng cho mọi Kia Carnival cùng đời.' || char(10) || char(10) || 'Q: Khi lắp bi gầm X-Light 301 V2 cần kiểm tra những gì?' || char(10) || 'A: Các hạng mục cần kiểm tra gồm vị trí bắt pát, không gian tản nhiệt, hệ thống dây điện, relay, cầu chì và khả năng căn chỉnh hướng chiếu sau khi hoàn thiện.',
    'metrics', 'Công suất Cos — Khoảng 45W — Theo tài liệu sản phẩm' || char(10) || 'Công suất Pha — Khoảng 55W — Theo tài liệu sản phẩm' || char(10) || 'Nhiệt màu ca lắp — 3000K/4300K/5500K' || char(10) || 'Nhân LED — 6 chip LED chính' || char(10) || 'Kích thước thấu kính — 3.0 Inch' || char(10) || 'Điện áp — Dải 12V đến 16V' || char(10) || 'Kháng nước bụi — IP68 — Chỉ áp dụng cho sản phẩm',
    'priceValue', '4.500.000 VNĐ/bộ', 'priceNote', 'Chưa VAT · chưa phải tổng chi phí bàn giao',
    'priceIncludes', '01 bộ = 01 cặp = 02 đèn' || char(10) || 'Bảo hành 24 tháng theo công bố nhà sản xuất',
    'beamCosUrl', 'https://images.unsplash.com/photo-1493238792000-8113da705763?auto=format&fit=crop&w=1200&q=80',
    'beamCosCaption', 'Ánh sáng Cos 4300K của Kia Carnival 2004 sau khi lắp X-Light 301 V2 (ảnh ghi nhận từ ca xe trong bài).',
    'beamPhaUrl', 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=1200&q=80',
    'beamPhaCaption', 'Ánh sáng Pha 4300K của X-Light 301 V2 trên Kia Carnival 2004, cùng ca nghiệm thu.',
    'followup', 'Bàn giao xe — Ngày 0 — done' || char(10) || 'Hậu kiểm đăng kiểm / vận hành cao tốc — Chưa xác nhận — pending',
    'related', 'X-Light F30 Ultra sau khi lắp: checklist kiểm tra trước khi nhận xe — /tin-tuc/review-auto365-demo-1' || char(10) || 'Đèn bi gầm X-Light 301 V2: thông số, giá và có nên lắp không — /tin-tuc/review-auto365-demo-3' || char(10) || 'Kia Sorento 2019 bản Tiêu chuẩn lắp bi LED X-Light V20 New 2025 — /tin-tuc/review-auto365-demo-8'
  )
) WHERE id = 'demo-rev-4';

-- 4 bài bổ sung (demo-case-5..8, mỗi loại nội dung thêm 1 ví dụ thật) để thư
-- viện demo trực quan và đầy đủ hơn — vẫn lấy nguyên liệu từ các bài thật
-- khác đang đăng tại https://auto365.vn/tin-tuc, biên soạn lại theo đúng
-- khuôn từng loại và liên kết chéo với 4 bài ở trên.
-- published_revision is hardcoded to 1 (not current_revision) because the
-- real content above was written into the revision=1 row (demo-rev-5..8);
-- demo-case-6 happens to have current_revision=2 from the generic seed loop
-- (n % 6 = 0), and that row has no matching content override.
UPDATE cases SET workflow_status = 'published', published_revision = 1
WHERE id IN ('demo-case-5', 'demo-case-6', 'demo-case-7', 'demo-case-8');

UPDATE case_revisions SET content_json = json_object(
  'templateKey', 'proof_lab',
  'publication', json_object(
    'title', 'Kính hậu có đường sấy: checklist trước và sau khi dán phim cách nhiệt',
    'summary', 'Checklist kiểm tra kính hậu có đường sấy trước và sau khi dán phim cách nhiệt: bề mặt kính, đường sấy, đầu nối điện và chức năng sấy.',
    'answerFirst', 'Trước khi dán phim kính hậu có đường sấy, cần ghi nhận bề mặt kính, tình trạng các đường sấy, đầu nối và khả năng hoạt động của hệ thống, cùng phim hoặc keo cũ nếu có. Sau thi công, cần kiểm tra độ hoàn thiện, đối chiếu hiện trạng đã ghi nhận và kiểm tra lại chức năng sấy vào thời điểm phù hợp theo hướng dẫn của dòng phim.',
    'heroUrl', 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80'
  ),
  'verification', json_object(
    'subjectRef', 'Kính hậu có đường sấy — dán phim cách nhiệt ô tô',
    'testMethod', 'Ghi nhận hiện trạng trước thi công, đối chiếu lại sau khi hoàn thiện theo nguyên tắc trước - sau',
    'standardRef', 'Hướng dẫn chăm sóc Automotive Window Film của 3M; hướng dẫn tháo keo phim của Madico',
    'testedAt', '13/08/2026',
    'verifiedBy', 'Đặng Minh Hoàng — Giám đốc điều hành 3M Pro Shop & 3M Training Center'
  ),
  'findings', json_object(
    'beforeResult', 'Trước khi dán: cần ghi nhận bề mặt kính, tình trạng đường sấy, đầu nối điện và phim/keo cũ nếu có.',
    'afterResult', 'Sau khi dán: kiểm tra độ hoàn thiện bề mặt phim, đối chiếu các vị trí đã ghi nhận trước đó và kiểm tra lại chức năng sấy theo thời điểm phù hợp.',
    'conclusion', 'Kiểm tra trước giúp xác định rõ tình trạng kính, đường sấy và chức năng sấy ban đầu; kiểm tra sau giúp chủ xe có cơ sở đối chiếu khi nhận xe, đặc biệt nếu kính đã từng dán phim hoặc còn keo cũ cần xử lý.',
    'deviationNote', 'Nếu xuất hiện khu vực làm sạch hơi mờ không đồng đều hoặc khác so với lúc tiếp nhận xe, cần để kỹ thuật viên kiểm tra dựa trên tình trạng trước - sau trước khi kết luận nguyên nhân.'
  ),
  'evidence', json_object(
    'measurement', 'Checklist quan sát trực quan bề mặt kính, lưới sấy và đầu nối điện, kết hợp đối chiếu tình trạng trước và sau thi công.',
    'resultSummary', 'Bề mặt phim hoàn thiện đều, các vị trí đã ghi nhận trước thi công không phát sinh thay đổi bất thường.',
    'proofUrls', 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=1200&q=80' || char(10) || 'https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?auto=format&fit=crop&w=1200&q=80',
    'sourceNotes', 'Ảnh minh họa quy trình kiểm tra kính hậu có đường sấy tại Auto365.vn - Trụ Sở Chính.'
  ),
  'seo', json_object(
    'slug', 'review-auto365-demo-5',
    'metaTitle', 'Kính hậu có đường sấy: Checklist trước và sau khi dán phim | Auto365',
    'metaDescription', 'Checklist kiểm tra kính hậu có đường sấy trước và sau khi dán phim cách nhiệt: bề mặt kính, đường sấy, đầu nối điện và chức năng sấy.',
    'proofLabId', 'PROOF-DEMO-005', 'roadCaseId', 'ROAD-DEMO-005', 'brandPillarId', 'BRAND-DEMO-005', 'productOwnerId', 'PRODUCT-DEMO-005'
  ),
  'review', json_object(
    'verificationChecked', json('true'), 'findingsChecked', json('true'), 'evidenceChecked', json('true'), 'seoChecked', json('true'),
    'reviewNote', 'Đã đối chiếu checklist với hướng dẫn chăm sóc Automotive Window Film của 3M.'
  ),
  'extended', json_object(
    'authorName', 'Thùy Nhiên', 'authorRole', 'Content Writer',
    'reviewerName', 'Đặng Minh Hoàng', 'reviewerRole', 'Giám đốc điều hành 3M Pro Shop & 3M Training Center',
    'primarySource', '3M - Automotive Window Film Product Care; Madico - How to Remove Automotive Window Tint Adhesive; quy trình kiểm tra tại Auto365.vn - Trụ Sở Chính',
    'timeline', 'Kiểm tra bề mặt kính và đường sấy — Ghi nhận vết xước, mẻ hoặc dấu hiệu bất thường trước thi công.' || char(10) || 'Kiểm tra chức năng sấy trước thi công — Ghi nhận tình trạng hệ thống tại thời điểm trước dán phim.' || char(10) || 'Kiểm tra phim/keo cũ — Xác định cần tháo phim và xử lý keo hay không.' || char(10) || 'Dán phim và hoàn thiện — Xử lý bề mặt kính, đặc biệt khu vực có đường sấy.' || char(10) || 'Kiểm tra sau hoàn thiện — Đối chiếu bề mặt phim và các vị trí đã ghi nhận trước đó.' || char(10) || 'Kiểm tra lại chức năng sấy — Đối chiếu theo thời gian chờ phù hợp với hướng dẫn dòng phim.',
    'known', 'Bề mặt phim hoàn thiện đều trên toàn bộ khu vực kính hậu' || char(10) || 'Không nên dùng dao hoặc scraper cạo trực tiếp qua lưới sấy khi tháo phim cũ' || char(10) || 'Việc kiểm tra trước - sau giúp có cơ sở đối chiếu khi phát sinh bất thường',
    'unknown', 'Nguyên nhân cụ thể nếu phát sinh khu vực làm sạch hơi mờ không đồng đều sau một thời gian sử dụng' || char(10) || 'Tình trạng đường sấy trên các xe không rõ lịch sử xử lý trước đó',
    'qc', 'Bề mặt kính và đường sấy — Đã ghi nhận hiện trạng trước thi công' || char(10) || 'Đầu nối điện — Đã kiểm tra, không lỏng hoặc bong' || char(10) || 'Bề mặt phim sau hoàn thiện — Đạt, không nếp gấp hoặc mép bất thường' || char(10) || 'Chức năng sấy — Đối chiếu theo tình trạng trước và sau',
    'faqs', 'Q: Dán phim cách nhiệt có ảnh hưởng đến sấy kính hậu không?' || char(10) || 'A: Không thể kết luận rằng cứ dán phim là ảnh hưởng đến sấy kính hậu. Điều cần quan tâm là tình trạng đường sấy trước khi thi công và cách xử lý bề mặt kính, đặc biệt khi phải tháo phim cũ hoặc làm sạch keo còn lại.' || char(10) || char(10) || 'Q: Có cần kiểm tra chức năng sấy trước và sau khi dán phim không?' || char(10) || 'A: Có. Kiểm tra trước giúp ghi nhận tình trạng sấy kính ban đầu; kiểm tra sau giúp đối chiếu lại chức năng khi hoàn thiện và bàn giao xe.',
    'metrics', 'Dòng phim tham chiếu — 3M Automotive Window Film (Ceramic / Crystalline)' || char(10) || 'Bảo hành điện tử — 3M e-Warranty 10 năm',
    'followup', 'Bàn giao xe — Ngày 0 — done' || char(10) || 'Kiểm tra lại chức năng sấy sau thời gian chờ — Theo hướng dẫn dòng phim — pending',
    'related', '3M Global trao chứng nhận 3M Preferred Installer cho đội ngũ kỹ thuật viên 3M Pro Shop — /tin-tuc/review-auto365-demo-6' || char(10) || 'Kia Carnival 2004 lắp bi gầm X-Light 301 V2: Giá và cấu hình — /tin-tuc/review-auto365-demo-4'
  )
) WHERE id = 'demo-rev-5';

UPDATE case_revisions SET content_json = json_object(
  'templateKey', 'brand_story',
  'publication', json_object(
    'title', '3M Global trao chứng nhận 3M Preferred Installer cho đội ngũ kỹ thuật viên 3M Pro Shop',
    'summary', '3M Global chính thức trao chứng nhận 3M Preferred Installer cho đội ngũ kỹ thuật viên hệ thống 3M Pro Shop - 3M Training Center tại Việt Nam.',
    'answerFirst', 'Chiều 20/06/2026, trong khuôn khổ lễ khai trương 3M Pro Shop và 3M Training Center đầu tiên tại Việt Nam, đại diện 3M Global đã trao chứng nhận 3M Preferred Installer cho 10 kỹ thuật viên của hệ thống, ghi nhận năng lực đào tạo và thi công phim cách nhiệt ô tô, PPF và Wrap Film theo chương trình của 3M.',
    'heroUrl', 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=1200&q=80'
  ),
  'positioning', json_object(
    'targetAudience', 'Chủ xe quan tâm đến chất lượng thi công phim cách nhiệt, PPF và Wrap Film, ưu tiên đơn vị có kỹ thuật viên được đào tạo và chứng nhận chính hãng.',
    'positioningStatement', 'Auto365, qua hệ sinh thái 3M Pro Shop, là đơn vị đầu tư bài bản vào đào tạo kỹ thuật viên theo chuẩn 3M Global, không chỉ dừng ở việc phân phối sản phẩm.',
    'toneOfVoice', 'Trang trọng, dựa trên sự kiện thực tế, nhấn mạnh yếu tố con người và quy trình.',
    'keyMessages', 'Đào tạo và chứng nhận kỹ thuật viên theo chương trình chính thức của 3M Global' || char(10) || 'Chứng nhận áp dụng cho 3 lĩnh vực: phim cách nhiệt ô tô, PPF và Wrap Film' || char(10) || 'Tay nghề kỹ thuật viên là yếu tố quyết định chất lượng hoàn thiện, không chỉ vật liệu',
    'differentiators', '3M Pro Shop & 3M Training Center đầu tiên tại Việt Nam' || char(10) || '10 kỹ thuật viên hệ thống được 3M Global trực tiếp trao chứng nhận 3M Preferred Installer' || char(10) || 'Quy trình đào tạo, đánh giá năng lực và kiểm tra sau hoàn thiện theo chuẩn 3M'
  ),
  'support', json_object(
    'supportingFacts', '10 kỹ thuật viên hệ thống 3M Pro Shop được trao chứng nhận 3M Preferred Installer ngày 20/06/2026.',
    'socialProof', 'Sự kiện có sự tham dự của đại diện 3M Global, 3M Việt Nam, ban điều hành 365Group và hệ thống đại lý.'
  ),
  'evidence', json_object(
    'measurement', '', 'resultSummary', 'Nội dung và hình ảnh ghi nhận từ lễ khai trương 3M Pro Shop & 3M Training Center đầu tiên tại Việt Nam, ngày 20/06/2026.',
    'proofUrls', 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80' || char(10) || 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=1200&q=80',
    'sourceNotes', 'Ảnh sự kiện trao chứng nhận 3M Preferred Installer, lưu trữ để đối chiếu khi cần.'
  ),
  'seo', json_object(
    'slug', 'review-auto365-demo-6',
    'metaTitle', '3M Global trao chứng nhận 3M Preferred Installer cho 3M Pro Shop | Auto365',
    'metaDescription', '3M Global trao chứng nhận 3M Preferred Installer cho 10 kỹ thuật viên 3M Pro Shop - 3M Training Center đầu tiên tại Việt Nam.',
    'brandPillarId', 'BRAND-DEMO-006', 'roadCaseId', 'ROAD-DEMO-006', 'proofLabId', 'PROOF-DEMO-006', 'productOwnerId', 'PRODUCT-DEMO-006'
  ),
  'review', json_object(
    'positioningChecked', json('true'), 'supportChecked', json('true'), 'evidenceChecked', json('true'), 'seoChecked', json('true'),
    'reviewNote', 'Đã đối chiếu danh sách kỹ thuật viên và tư liệu sự kiện khai trương.'
  ),
  'extended', json_object(
    'authorName', 'Team Content Auto365', 'authorRole', 'Content Auto365',
    'reviewerName', 'Đặng Minh Hoàng', 'reviewerRole', 'Giám đốc điều hành 3M Pro Shop & 3M Training Center',
    'primarySource', 'Tư liệu và hồ sơ chứng nhận sự kiện khai trương 3M Pro Shop & 3M Training Center, ngày 20/06/2026',
    'timeline', 'Lễ khai trương 3M Pro Shop & 3M Training Center (20/06/2026) — Sự kiện đầu tiên tại Việt Nam, có sự tham dự của đại diện 3M Global.' || char(10) || 'Trao chứng nhận 3M Preferred Installer — 10 kỹ thuật viên hệ thống được ghi nhận trong 3 lĩnh vực Autofilm, PPF, Wrap Film.' || char(10) || 'Công bố định hướng phát triển — 365Group và 3M hướng tới hệ sinh thái dịch vụ đạt chuẩn 3M toàn cầu.',
    'known', '10 kỹ thuật viên hệ thống 3M Pro Shop được trao chứng nhận 3M Preferred Installer' || char(10) || 'Chứng nhận áp dụng cho phim cách nhiệt ô tô, PPF và Wrap Film' || char(10) || 'Sự kiện có xác nhận trực tiếp từ đại diện 3M Global',
    'unknown', 'Chi tiết từng hạng mục chứng nhận theo hồ sơ riêng của mỗi kỹ thuật viên (Autofilm/PPF/Wrap Film) chưa được công bố đầy đủ',
    'qc', 'Danh sách kỹ thuật viên — Đã đối chiếu với hồ sơ sự kiện' || char(10) || 'Thông tin sự kiện — Đã xác nhận qua tư liệu và hình ảnh lưu trữ',
    'faqs', 'Q: Chứng nhận 3M Preferred Installer là gì?' || char(10) || 'A: Là chứng nhận được trao cho kỹ thuật viên đã hoàn thành chương trình đào tạo và đáp ứng tiêu chí đánh giá theo chương trình của 3M, ghi nhận năng lực thi công và tuân thủ quy trình kỹ thuật.' || char(10) || char(10) || 'Q: Chứng nhận áp dụng cho những lĩnh vực nào?' || char(10) || 'A: Áp dụng cho phim cách nhiệt ô tô (Automotive Window Film), Paint Protection Film (PPF) và Wrap Film.',
    'related', 'Kính hậu có đường sấy: checklist trước và sau khi dán phim cách nhiệt — /tin-tuc/review-auto365-demo-5' || char(10) || 'Đèn bi gầm X-Light 301 V2: thông số, giá và có nên lắp không — /tin-tuc/review-auto365-demo-3'
  )
) WHERE id = 'demo-rev-6';

UPDATE case_revisions SET content_json = json_object(
  'templateKey', 'product_spotlight',
  'publication', json_object(
    'title', 'Bi LED X-Light V20 New 2025: thông số, giá và có nên lắp không',
    'summary', 'Thông số kỹ thuật, giá bán và đánh giá Bi LED X-Light V20 New 2025 — dòng đèn Cos mạnh, Pha rộng của X-Light.',
    'answerFirst', 'X-Light V20 New 2025 là bi LED nhiệt màu 5000K, công suất Cos khoảng 60W, Pha khoảng 70W, 9+1+1 chip LED, giá tham khảo 8.000.000 VNĐ/cặp, chưa VAT, bảo hành 36 tháng theo chính sách X-Light.',
    'heroUrl', 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=1200&q=80'
  ),
  'productInfo', json_object(
    'productName', 'X-Light V20 New 2025',
    'keySpecs', 'Công suất Cos khoảng 60W, Pha khoảng 70W' || char(10) || '9+1+1 chip LED, kích thước thấu kính 3.0 Inch' || char(10) || 'Kích thước đèn 145x48x100mm, tản nhiệt quạt và khối nhôm',
    'keyFeatures', 'Cos mạnh, Pha rộng — đặc điểm nổi bật của dòng V20 New 2025' || char(10) || 'Nhiệt màu 5000K, ánh sáng trung tính' || char(10) || 'Phù hợp thay thế đèn pha Halogen Projector nguyên bản ánh sáng yếu, vùng sáng mờ',
    'useCases', 'Xe dùng đèn pha Halogen Projector nguyên bản ánh sáng yếu, vùng sáng mờ' || char(10) || 'Chủ xe thường xuyên di chuyển ban đêm, cần cải thiện khả năng quan sát',
    'pricingNote', '8.000.000 VNĐ/cặp (01 cặp = 02 đèn), chưa VAT'
  ),
  'comparison', json_object(
    'alternativeRef', 'X-Light V20 Base 2025, giá tham khảo 6.500.000 VNĐ/cặp',
    'advantageNote', 'V20 New 2025 có công suất Cos/Pha cao hơn và đặc điểm Cos mạnh, Pha rộng; V20 Base 2025 định vị phân khúc giá thấp hơn.'
  ),
  'evidence', json_object(
    'measurement', 'Thông số theo trang sản phẩm Auto365, cập nhật ngày 10/08/2026.',
    'resultSummary', 'Thông số đã đối chiếu với dữ liệu nhà cung cấp; có thể thay đổi theo lô hàng và thời điểm cung cấp.',
    'proofUrls', 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=1200&q=80' || char(10) || 'https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?auto=format&fit=crop&w=1200&q=80',
    'sourceNotes', 'Ảnh sản phẩm minh họa từ trang BI LED X-LIGHT V20 - NEW 2025 trên Auto365.vn.'
  ),
  'seo', json_object(
    'slug', 'review-auto365-demo-7',
    'metaTitle', 'Bi LED X-Light V20 New 2025: thông số, giá và có nên lắp không | Auto365',
    'metaDescription', 'X-Light V20 New 2025: thông số Cos/Pha, nhiệt màu 5000K, giá 8.000.000 VNĐ/cặp và so sánh với X-Light V20 Base 2025.',
    'productOwnerId', 'PRODUCT-DEMO-007', 'roadCaseId', 'ROAD-DEMO-007', 'proofLabId', 'PROOF-DEMO-007', 'brandPillarId', 'BRAND-DEMO-007'
  ),
  'review', json_object(
    'productChecked', json('true'), 'comparisonChecked', json('true'), 'evidenceChecked', json('true'), 'seoChecked', json('true'),
    'reviewNote', 'Đã đối chiếu giá bán và thông số với trang sản phẩm hiện hành.'
  ),
  'extended', json_object(
    'authorName', 'Team Content Auto365', 'authorRole', 'Content Auto365',
    'reviewerName', 'Nguyễn Quang Đạo', 'reviewerRole', 'Tư vấn kỹ thuật theo sản phẩm',
    'primarySource', 'Trang sản phẩm BI LED X-LIGHT V20 - NEW 2025 trên Auto365.vn, cập nhật 10/08/2026',
    'timeline', 'Tư vấn kỹ thuật theo sản phẩm — Hotline 0365.365.365 / 0365.365.911.' || char(10) || 'Kiểm tra khả năng tương thích trước khi lắp — Liên hệ trước khi thi công để xác nhận phù hợp.',
    'known', 'Thông số theo dữ liệu nhà cung cấp, có thể thay đổi theo lô hàng' || char(10) || 'Bảo hành 36 tháng theo chính sách X-Light',
    'unknown', 'Hiệu quả chiếu sáng thực tế sau khi lắp và căn chỉnh trên từng xe cụ thể',
    'qc', 'Thông tin sản phẩm — Đã đối chiếu với dữ liệu nhà cung cấp' || char(10) || 'Chính sách bảo hành — Áp dụng theo điều kiện của từng sản phẩm',
    'faqs', 'Q: X-Light V20 New 2025 khác gì V20 Base 2025?' || char(10) || 'A: V20 New 2025 có công suất Cos/Pha cao hơn (khoảng 60W/70W so với khoảng 55W/65W của Base) và định vị ở phân khúc giá cao hơn.' || char(10) || char(10) || 'Q: X-Light V20 New 2025 giá bao nhiêu?' || char(10) || 'A: Giá tham khảo 8.000.000 VNĐ/cặp (01 cặp = 02 đèn), chưa gồm VAT và công lắp; giá có thể thay đổi theo thời điểm và chính sách phân phối.',
    'metrics', 'Công suất Cos — Khoảng 60W' || char(10) || 'Công suất Pha — Khoảng 70W' || char(10) || 'Nhân LED — 9+1+1 chip' || char(10) || 'Nhiệt màu — 5000K' || char(10) || 'Hệ thống tản nhiệt — Quạt và khối nhôm' || char(10) || 'Kích thước đèn — 145x48x100mm' || char(10) || 'Kích thước Lens — 3.0 Inch' || char(10) || 'Bảo hành — 36 tháng',
    'priceValue', '8.000.000 VNĐ/cặp', 'priceNote', 'Chưa VAT · 01 cặp = 02 đèn',
    'priceIncludes', 'Bảo hành 36 tháng theo chính sách X-Light' || char(10) || 'Tư vấn kỹ thuật theo sản phẩm trước khi lắp',
    'related', 'Kia Sorento 2019 bản Tiêu chuẩn lắp bi LED X-Light V20 New 2025 — /tin-tuc/review-auto365-demo-8' || char(10) || 'Đèn bi gầm X-Light 301 V2: thông số, giá và có nên lắp không — /tin-tuc/review-auto365-demo-3'
  )
) WHERE id = 'demo-rev-7';

UPDATE case_revisions SET content_json = json_object(
  'templateKey', 'road_lab',
  'publication', json_object(
    'title', 'Kia Sorento 2019 bản Tiêu chuẩn lắp bi LED X-Light V20 New 2025: giá, cấu hình',
    'summary', 'Ca thực tế Kia Sorento 2019 bản Tiêu chuẩn nâng cấp đèn pha Halogen Projector sang bi LED X-Light V20 New 2025.',
    'answerFirst', 'Kia Sorento 2019 bản Tiêu chuẩn trong ca này được nâng cấp projector Halogen trong cụm đèn chính bằng 01 cặp bi LED X-Light V20 New 2025. Sản phẩm dùng ánh sáng 5000K, lens 3.0 inch, công suất tham khảo khoảng 60W ở Cos và khoảng 70W ở Pha. Giá tham khảo 8.000.000 VNĐ/cặp, chưa VAT, bảo hành 36 tháng theo chính sách X-Light.',
    'heroUrl', 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80'
  ),
  'vehicle', json_object(
    'vehicleName', 'Kia Sorento', 'modelYear', '2019', 'odometer', 'Hồ sơ không lưu ODO',
    'primaryNeed', 'Đèn pha Halogen Projector nguyên bản ánh sáng yếu, vùng sáng mờ, cần cải thiện khả năng quan sát ban đêm.',
    'usageConditions', 'Bản Tiêu chuẩn; hồ sơ ca xe không lưu tuyến đường và tần suất sử dụng cụ thể của chủ xe.',
    'installationStage', 'Đã hoàn thiện, nghiệm thu tại Auto365.vn – Trụ Sở Chính, xác nhận ngày 14/08/2026'
  ),
  'configuration', json_object(
    'problem', 'Đèn pha Halogen Projector nguyên bản ánh sáng yếu và vùng sáng mờ, ảnh hưởng khả năng quan sát ban đêm.',
    'beforeConfig', 'Đèn pha Halogen Projector nguyên bản; hồ sơ chưa đủ dữ liệu để tách riêng nguyên nhân từ bóng, chóa, lens hay quá trình căn chỉnh.',
    'actualConfig', 'X-Light V20 New 2025 lắp trong cụm đèn chính; có mở cụm đèn, gia công pát trên bộ gá rời, không cắt khoan chi tiết nguyên bản.',
    'productName', 'X-Light V20 New 2025',
    'materials', 'Pát theo sản phẩm gia công trên bộ gá rời, công tắc điều khiển, dây và giắc kiểm tra sau lắp.'
  ),
  'evidence', json_object(
    'measurement', 'Công suất Cos khoảng 60W, Pha khoảng 70W; nhiệt màu 5000K.',
    'resultSummary', 'Kết quả nghiệm thu: không ghi nhận cảnh báo điện/màn hình, không hấp hơi sau lắp, độ kín cụm đèn đã kiểm tra.',
    'proofUrls', 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=1200&q=80' || char(10) || 'https://images.unsplash.com/photo-1493238792000-8113da705763?auto=format&fit=crop&w=1200&q=80',
    'sourceNotes', 'Ảnh nghiệm thu tại Auto365.vn – Trụ Sở Chính, xác nhận ngày 14/08/2026.'
  ),
  'seo', json_object(
    'slug', 'review-auto365-demo-8',
    'metaTitle', 'Kia Sorento 2019 lắp X-Light V20 New 2025: Giá, cấu hình | Auto365',
    'metaDescription', 'Ca thực tế Kia Sorento 2019 bản Tiêu chuẩn lắp X-Light V20 New 2025: cấu hình thi công, giá 8.000.000 VNĐ/cặp và các hạng mục cần kiểm tra.',
    'roadCaseId', 'ROAD-DEMO-008', 'proofLabId', 'PROOF-DEMO-008', 'brandPillarId', 'BRAND-DEMO-008', 'productOwnerId', 'PRODUCT-DEMO-008'
  ),
  'review', json_object(
    'contentChecked', json('true'), 'evidenceChecked', json('true'), 'seoChecked', json('true'), 'technicalChecked', json('true'),
    'reviewNote', 'Đã đối chiếu với hồ sơ ca thi công Kia Sorento 2019 tại Auto365.vn – Trụ Sở Chính.'
  ),
  'extended', json_object(
    'authorName', 'Phương', 'authorRole', 'Team Content Auto365',
    'reviewerName', 'Nguyễn Quang Đạo', 'reviewerRole', 'Cố vấn kỹ thuật đèn ô tô',
    'primarySource', 'Tài liệu sản phẩm X-Light V20 New 2025 / X-Light/365Group và hồ sơ ca thi công Kia Sorento 2019, xác nhận 14/08/2026',
    'timeline', 'Tiếp nhận xe — Ghi nhận đèn pha Halogen Projector ánh sáng yếu, vùng sáng mờ.' || char(10) || 'Kiểm tra chóa đèn nguyên bản — Kiểm tra chóa, dây dẫn, giắc kết nối và tình trạng lắp đặt.' || char(10) || 'Xác định phương án — Chốt X-Light V20 New 2025 5000K và phụ kiện cần dùng.' || char(10) || 'Lắp bi LED và đi dây — Mở cụm đèn, gia công pát trên bộ gá rời, đi dây gọn.' || char(10) || 'Căn chỉnh Cos/Pha — Kiểm soát độ cao vùng sáng và đường cắt sáng.' || char(10) || 'Kiểm tra sau lắp — Giắc kết nối, dây dẫn, quạt tản nhiệt, độ kín cụm đèn.' || char(10) || 'Bàn giao xe — Hướng dẫn sử dụng và kiểm tra thông tin bảo hành.',
    'known', 'Có mở cụm đèn theo hồ sơ ca thi công này' || char(10) || 'Gia công pát trên bộ gá rời, không cắt khoan chi tiết nguyên bản' || char(10) || 'Không ghi nhận cảnh báo điện/màn hình và hấp hơi tại thời điểm nghiệm thu',
    'unknown', 'Nguyên nhân riêng lẻ của ánh sáng yếu trước nâng cấp (bóng, chóa, lens hay căn chỉnh) — hồ sơ chưa đủ dữ liệu để tách riêng' || char(10) || 'Kết quả đăng kiểm thực tế tại từng địa phương — chưa xác nhận trong ca này',
    'qc', 'Cos — Ghi nhận hoạt động sau căn chỉnh' || char(10) || 'Pha — Ghi nhận hoạt động sau căn chỉnh, cần sử dụng đúng tình huống' || char(10) || 'Cảnh báo điện/màn hình — Không ghi nhận tại nghiệm thu' || char(10) || 'Độ kín cụm đèn — Đã kiểm tra trong bước nghiệm thu' || char(10) || 'Hấp hơi sau lắp — Không ghi nhận tại thời điểm bàn giao',
    'faqs', 'Q: Kia Sorento 2019 bản Tiêu chuẩn có lắp được X-Light V20 New 2025 không?' || char(10) || 'A: Với ca trong bài, phương án sử dụng là X-Light V20 New 2025. Với các xe Sorento 2019 khác, cần kiểm tra trực tiếp chóa đèn, dây dẫn và giắc kết nối trước khi chốt phương án thi công.' || char(10) || char(10) || 'Q: Lắp X-Light V20 New 2025 có bị báo lỗi màn hình không?' || char(10) || 'A: Theo hồ sơ ca thi công này, không ghi nhận cảnh báo trên màn hình tại thời điểm nghiệm thu và bàn giao; ghi nhận này không đại diện cho mọi xe Sorento 2019 khác.',
    'metrics', 'Công suất Cos — Khoảng 60W — Theo tài liệu sản phẩm' || char(10) || 'Công suất Pha — Khoảng 70W — Theo tài liệu sản phẩm' || char(10) || 'Nhiệt màu — 5000K' || char(10) || 'Nhân LED — 9+1+1 chip' || char(10) || 'Kích thước lens — 3.0 Inch',
    'priceValue', '8.000.000 VNĐ/cặp', 'priceNote', 'Chưa VAT · công lắp và phụ kiện xác nhận riêng',
    'priceIncludes', '01 cặp = 02 đèn' || char(10) || 'Bảo hành 36 tháng theo chính sách X-Light',
    'beamCosUrl', 'https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&w=1200&q=80',
    'beamCosCaption', 'Vùng sáng Cos của Kia Sorento 2019 sau khi lắp X-Light V20 New 2025 (ảnh ghi nhận từ ca xe trong bài).',
    'beamPhaUrl', 'https://images.unsplash.com/photo-1511919884226-fd3cad34687c?auto=format&fit=crop&w=1200&q=80',
    'beamPhaCaption', 'Vùng sáng Pha của X-Light V20 New 2025 trên Kia Sorento 2019, cùng ca nghiệm thu.',
    'followup', 'Bàn giao xe — Ngày 0 — done' || char(10) || 'Xác nhận kết quả đăng kiểm — Chưa xác nhận — pending',
    'related', 'Bi LED X-Light V20 New 2025: thông số, giá và có nên lắp không — /tin-tuc/review-auto365-demo-7' || char(10) || 'Kia Carnival 2004 lắp bi gầm X-Light 301 V2: Giá và cấu hình — /tin-tuc/review-auto365-demo-4'
  )
) WHERE id = 'demo-rev-8';

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
