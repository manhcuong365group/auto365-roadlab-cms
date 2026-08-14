INSERT OR IGNORE INTO users (id, email, display_name, profile_revision, preferences_json, status, created_at, updated_at) VALUES
  ('test-boss-001', 'boss@auto365.test', 'Test Sếp', 1, '{}', 'active', '2026-08-14T07:05:00Z', '2026-08-14T07:05:00Z'),
  ('test-content-001', 'content@auto365.test', 'Test Content', 1, '{}', 'active', '2026-08-14T07:05:00Z', '2026-08-14T07:05:00Z'),
  ('test-oa-001', 'oa@auto365.test', 'Test OA', 1, '{}', 'active', '2026-08-14T07:05:00Z', '2026-08-14T07:05:00Z'),
  ('test-seo-lead-001', 'seo-lead@auto365.test', 'Test SEO Lead', 1, '{}', 'active', '2026-08-14T07:05:00Z', '2026-08-14T07:05:00Z'),
  ('test-it-001', 'it@auto365.test', 'Test IT', 1, '{}', 'active', '2026-08-14T07:05:00Z', '2026-08-14T07:05:00Z');

INSERT OR IGNORE INTO user_roles (user_id, role, branch_ref, granted_at, granted_by) VALUES
  ('test-boss-001', 'boss', '*', '2026-08-14T07:05:00Z', 'test-boss-001'),
  ('test-content-001', 'content', '*', '2026-08-14T07:05:00Z', 'test-boss-001'),
  ('test-oa-001', 'oa', '*', '2026-08-14T07:05:00Z', 'test-boss-001'),
  ('test-seo-lead-001', 'seo_lead', '*', '2026-08-14T07:05:00Z', 'test-boss-001'),
  ('test-it-001', 'it', '*', '2026-08-14T07:05:00Z', 'test-boss-001');

-- Tất cả tài khoản demo dùng mật khẩu: CaseLab-2026!
UPDATE users SET password_hash = 'pbkdf2-sha256$100000$YXV0bzM2NS1jYXNlLWxhYi1kZW1vLTIwMjY=$Od2Wnn+oW/O0jp2zPx0I5Va1MRgn0928H3AG2E5piQY=' WHERE email IN ('boss@auto365.test', 'content@auto365.test', 'oa@auto365.test', 'seo-lead@auto365.test', 'it@auto365.test');
