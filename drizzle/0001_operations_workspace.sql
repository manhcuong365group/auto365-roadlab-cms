ALTER TABLE `users` ADD `profile_revision` integer DEFAULT 1 NOT NULL;
--> statement-breakpoint
ALTER TABLE `users` ADD `preferences_json` text DEFAULT '{}' NOT NULL;
--> statement-breakpoint
CREATE TABLE `case_assignments` (
  `id` text PRIMARY KEY NOT NULL,
  `case_id` text NOT NULL,
  `user_id` text NOT NULL,
  `role` text NOT NULL,
  `assigned_by` text NOT NULL,
  `assigned_at` text NOT NULL,
  `unassigned_at` text,
  FOREIGN KEY (`case_id`) REFERENCES `cases`(`id`) ON UPDATE no action ON DELETE cascade,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade,
  FOREIGN KEY (`assigned_by`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `case_assignments_case_active_idx` ON `case_assignments` (`case_id`,`role`,`unassigned_at`);
--> statement-breakpoint
CREATE INDEX `case_assignments_user_active_idx` ON `case_assignments` (`user_id`,`unassigned_at`);
--> statement-breakpoint
CREATE TABLE `case_feedback` (
  `id` text PRIMARY KEY NOT NULL,
  `case_id` text NOT NULL,
  `revision` integer NOT NULL,
  `parent_feedback_id` text,
  `author_id` text NOT NULL,
  `category` text DEFAULT 'general' NOT NULL,
  `message` text NOT NULL,
  `status` text DEFAULT 'open' NOT NULL,
  `resolved_by` text,
  `resolved_at` text,
  `created_at` text NOT NULL,
  FOREIGN KEY (`case_id`) REFERENCES `cases`(`id`) ON UPDATE no action ON DELETE cascade,
  FOREIGN KEY (`parent_feedback_id`) REFERENCES `case_feedback`(`id`) ON UPDATE no action ON DELETE set null,
  FOREIGN KEY (`author_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action,
  FOREIGN KEY (`resolved_by`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `case_feedback_case_revision_idx` ON `case_feedback` (`case_id`,`revision`,`created_at`);
--> statement-breakpoint
CREATE INDEX `case_feedback_status_idx` ON `case_feedback` (`status`,`created_at`);
--> statement-breakpoint
CREATE TABLE `notifications` (
  `id` text PRIMARY KEY NOT NULL,
  `user_id` text NOT NULL,
  `type` text NOT NULL,
  `title` text NOT NULL,
  `body` text DEFAULT '' NOT NULL,
  `case_id` text,
  `payload_json` text DEFAULT '{}' NOT NULL,
  `read_at` text,
  `created_at` text NOT NULL,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade,
  FOREIGN KEY (`case_id`) REFERENCES `cases`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE INDEX `notifications_user_read_idx` ON `notifications` (`user_id`,`read_at`,`created_at`);
