ALTER TABLE `cases` ADD `content_type` text NOT NULL DEFAULT 'case';
--> statement-breakpoint
CREATE INDEX `cases_content_type_status_idx` ON `cases` (`content_type`,`workflow_status`,`updated_at`);
--> statement-breakpoint
UPDATE `cases`
SET `content_type` = CASE CAST(substr(`case_code`, -3) AS INTEGER) % 4
  WHEN 1 THEN 'proof'
  WHEN 2 THEN 'brand'
  WHEN 3 THEN 'product'
  ELSE 'case'
END
WHERE `case_code` GLOB 'CL-DEMO-[0-9][0-9][0-9]';
