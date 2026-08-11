CREATE TABLE `audit_events` (
	`id` text PRIMARY KEY NOT NULL,
	`case_id` text,
	`actor_id` text NOT NULL,
	`actor_role` text NOT NULL,
	`action` text NOT NULL,
	`entity_type` text NOT NULL,
	`entity_id` text NOT NULL,
	`revision` integer,
	`detail_json` text NOT NULL,
	`ip_hash` text,
	`created_at` text NOT NULL,
	FOREIGN KEY (`case_id`) REFERENCES `cases`(`id`) ON UPDATE no action ON DELETE set null,
	FOREIGN KEY (`actor_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `audit_events_case_idx` ON `audit_events` (`case_id`,`created_at`);--> statement-breakpoint
CREATE INDEX `audit_events_actor_idx` ON `audit_events` (`actor_id`,`created_at`);--> statement-breakpoint
CREATE TABLE `case_revision_media` (
	`revision_id` text NOT NULL,
	`media_asset_id` text NOT NULL,
	`role` text NOT NULL,
	`caption` text NOT NULL,
	`alt_text` text NOT NULL,
	`captured_at` text NOT NULL,
	`proof_state` text NOT NULL,
	`focal_point_desktop_json` text,
	`focal_point_mobile_json` text,
	`sort_order` integer NOT NULL,
	PRIMARY KEY(`revision_id`, `role`),
	FOREIGN KEY (`revision_id`) REFERENCES `case_revisions`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`media_asset_id`) REFERENCES `media_assets`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `case_revision_media_asset_uq` ON `case_revision_media` (`revision_id`,`media_asset_id`);--> statement-breakpoint
CREATE TABLE `case_revisions` (
	`id` text PRIMARY KEY NOT NULL,
	`case_id` text NOT NULL,
	`revision` integer NOT NULL,
	`source_version` integer NOT NULL,
	`source_hash` text NOT NULL,
	`content_json` text NOT NULL,
	`technical_snapshot_json` text NOT NULL,
	`catalog_snapshot_json` text NOT NULL,
	`seo_snapshot_json` text NOT NULL,
	`technical_digest` text NOT NULL,
	`created_by` text NOT NULL,
	`created_at` text NOT NULL,
	FOREIGN KEY (`case_id`) REFERENCES `cases`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`created_by`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `case_revisions_case_revision_uq` ON `case_revisions` (`case_id`,`revision`);--> statement-breakpoint
CREATE INDEX `case_revisions_created_idx` ON `case_revisions` (`case_id`,`created_at`);--> statement-breakpoint
CREATE TABLE `cases` (
	`id` text PRIMARY KEY NOT NULL,
	`case_code` text NOT NULL,
	`work_order_id` text NOT NULL,
	`vertical` text NOT NULL,
	`branch_ref` text NOT NULL,
	`vehicle_ref` text NOT NULL,
	`product_ref` text NOT NULL,
	`current_revision` integer DEFAULT 0 NOT NULL,
	`published_revision` integer,
	`workflow_status` text DEFAULT 'draft' NOT NULL,
	`lock_owner_id` text,
	`lock_expires_at` text,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	FOREIGN KEY (`work_order_id`) REFERENCES `work_orders`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`lock_owner_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `cases_case_code_uq` ON `cases` (`case_code`);--> statement-breakpoint
CREATE UNIQUE INDEX `cases_work_order_uq` ON `cases` (`work_order_id`);--> statement-breakpoint
CREATE INDEX `cases_status_branch_idx` ON `cases` (`workflow_status`,`branch_ref`,`updated_at`);--> statement-breakpoint
CREATE TABLE `data_issues` (
	`id` text PRIMARY KEY NOT NULL,
	`case_id` text NOT NULL,
	`target` text NOT NULL,
	`owner_team` text NOT NULL,
	`status` text DEFAULT 'open' NOT NULL,
	`message` text NOT NULL,
	`opened_by` text NOT NULL,
	`opened_at` text NOT NULL,
	`resolved_by` text,
	`resolved_at` text,
	FOREIGN KEY (`case_id`) REFERENCES `cases`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`opened_by`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`resolved_by`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `data_issues_owner_status_idx` ON `data_issues` (`owner_team`,`status`,`opened_at`);--> statement-breakpoint
CREATE TABLE `gate_evaluations` (
	`id` text PRIMARY KEY NOT NULL,
	`case_id` text NOT NULL,
	`revision_id` text NOT NULL,
	`ruleset_version` text NOT NULL,
	`source_passed` integer NOT NULL,
	`content_passed` integer NOT NULL,
	`evidence_passed` integer NOT NULL,
	`technical_passed` integer NOT NULL,
	`seo_passed` integer NOT NULL,
	`issues_json` text NOT NULL,
	`evaluated_at` text NOT NULL,
	FOREIGN KEY (`case_id`) REFERENCES `cases`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`revision_id`) REFERENCES `case_revisions`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `gate_evaluations_revision_idx` ON `gate_evaluations` (`revision_id`,`evaluated_at`);--> statement-breakpoint
CREATE TABLE `media_assets` (
	`id` text PRIMARY KEY NOT NULL,
	`case_id` text NOT NULL,
	`r2_key_original` text NOT NULL,
	`r2_key_webp` text,
	`r2_key_avif` text,
	`mime_type` text NOT NULL,
	`byte_size` integer NOT NULL,
	`width` integer NOT NULL,
	`height` integer NOT NULL,
	`sha256` text NOT NULL,
	`perceptual_hash` text,
	`processing_status` text NOT NULL,
	`rejection_code` text,
	`uploaded_by` text NOT NULL,
	`uploaded_at` text NOT NULL,
	FOREIGN KEY (`case_id`) REFERENCES `cases`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`uploaded_by`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `media_assets_r2_key_uq` ON `media_assets` (`r2_key_original`);--> statement-breakpoint
CREATE UNIQUE INDEX `media_assets_case_sha_uq` ON `media_assets` (`case_id`,`sha256`);--> statement-breakpoint
CREATE INDEX `media_assets_processing_idx` ON `media_assets` (`processing_status`,`uploaded_at`);--> statement-breakpoint
CREATE TABLE `outbox_events` (
	`id` text PRIMARY KEY NOT NULL,
	`aggregate_type` text NOT NULL,
	`aggregate_id` text NOT NULL,
	`event_type` text NOT NULL,
	`payload_json` text NOT NULL,
	`status` text DEFAULT 'pending' NOT NULL,
	`attempt_count` integer DEFAULT 0 NOT NULL,
	`available_at` text NOT NULL,
	`processed_at` text,
	`last_error` text,
	`created_at` text NOT NULL
);
--> statement-breakpoint
CREATE INDEX `outbox_status_available_idx` ON `outbox_events` (`status`,`available_at`);--> statement-breakpoint
CREATE TABLE `publications` (
	`id` text PRIMARY KEY NOT NULL,
	`case_id` text NOT NULL,
	`revision_id` text NOT NULL,
	`idempotency_key` text NOT NULL,
	`state` text NOT NULL,
	`public_url` text,
	`rendered_hash` text,
	`error_code` text,
	`published_by` text,
	`created_at` text NOT NULL,
	`completed_at` text,
	FOREIGN KEY (`case_id`) REFERENCES `cases`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`revision_id`) REFERENCES `case_revisions`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`published_by`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `publications_idempotency_uq` ON `publications` (`idempotency_key`);--> statement-breakpoint
CREATE INDEX `publications_case_state_idx` ON `publications` (`case_id`,`state`,`created_at`);--> statement-breakpoint
CREATE TABLE `rights_attestations` (
	`id` text PRIMARY KEY NOT NULL,
	`case_id` text NOT NULL,
	`media_asset_id` text NOT NULL,
	`status` text NOT NULL,
	`policy_version` text NOT NULL,
	`attested_by` text NOT NULL,
	`attested_at` text NOT NULL,
	FOREIGN KEY (`case_id`) REFERENCES `cases`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`media_asset_id`) REFERENCES `media_assets`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`attested_by`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `rights_attestations_asset_idx` ON `rights_attestations` (`media_asset_id`,`attested_at`);--> statement-breakpoint
CREATE TABLE `technical_reviews` (
	`id` text PRIMARY KEY NOT NULL,
	`case_id` text NOT NULL,
	`revision_id` text NOT NULL,
	`technical_digest` text NOT NULL,
	`reviewer_id` text NOT NULL,
	`decision` text NOT NULL,
	`note` text DEFAULT '' NOT NULL,
	`decided_at` text NOT NULL,
	FOREIGN KEY (`case_id`) REFERENCES `cases`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`revision_id`) REFERENCES `case_revisions`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`reviewer_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `technical_reviews_revision_reviewer_uq` ON `technical_reviews` (`revision_id`,`reviewer_id`);--> statement-breakpoint
CREATE INDEX `technical_reviews_case_idx` ON `technical_reviews` (`case_id`,`decided_at`);--> statement-breakpoint
CREATE TABLE `url_registry` (
	`id` text PRIMARY KEY NOT NULL,
	`case_id` text NOT NULL,
	`slug` text NOT NULL,
	`canonical_url` text NOT NULL,
	`intent_key` text NOT NULL,
	`owner_type` text NOT NULL,
	`locked_at` text,
	`created_at` text NOT NULL,
	FOREIGN KEY (`case_id`) REFERENCES `cases`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `url_registry_slug_uq` ON `url_registry` (`slug`);--> statement-breakpoint
CREATE UNIQUE INDEX `url_registry_canonical_uq` ON `url_registry` (`canonical_url`);--> statement-breakpoint
CREATE UNIQUE INDEX `url_registry_intent_uq` ON `url_registry` (`intent_key`);--> statement-breakpoint
CREATE UNIQUE INDEX `url_registry_case_uq` ON `url_registry` (`case_id`);--> statement-breakpoint
CREATE TABLE `user_roles` (
	`user_id` text NOT NULL,
	`role` text NOT NULL,
	`branch_ref` text DEFAULT '*' NOT NULL,
	`granted_at` text NOT NULL,
	`granted_by` text NOT NULL,
	PRIMARY KEY(`user_id`, `role`, `branch_ref`),
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `user_roles_role_idx` ON `user_roles` (`role`);--> statement-breakpoint
CREATE TABLE `users` (
	`id` text PRIMARY KEY NOT NULL,
	`email` text NOT NULL,
	`display_name` text NOT NULL,
	`status` text DEFAULT 'active' NOT NULL,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `users_email_uq` ON `users` (`email`);--> statement-breakpoint
CREATE TABLE `work_orders` (
	`id` text PRIMARY KEY NOT NULL,
	`external_id` text NOT NULL,
	`source_system` text NOT NULL,
	`source_version` integer NOT NULL,
	`source_hash` text NOT NULL,
	`vertical` text NOT NULL,
	`branch_ref` text NOT NULL,
	`readiness` text NOT NULL,
	`payload_json` text NOT NULL,
	`synced_at` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `work_orders_source_id_uq` ON `work_orders` (`source_system`,`external_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `work_orders_source_version_uq` ON `work_orders` (`source_system`,`external_id`,`source_version`);--> statement-breakpoint
CREATE INDEX `work_orders_readiness_idx` ON `work_orders` (`readiness`,`synced_at`);