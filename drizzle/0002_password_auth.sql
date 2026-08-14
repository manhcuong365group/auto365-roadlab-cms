ALTER TABLE `users` ADD `password_hash` text;
--> statement-breakpoint
CREATE TABLE `auth_sessions` (
  `id` text PRIMARY KEY NOT NULL,
  `user_id` text NOT NULL REFERENCES `users`(`id`) ON DELETE CASCADE,
  `token_hash` text NOT NULL,
  `expires_at` text NOT NULL,
  `created_at` text NOT NULL,
  `last_used_at` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `auth_sessions_token_uq` ON `auth_sessions` (`token_hash`);
--> statement-breakpoint
CREATE INDEX `auth_sessions_user_idx` ON `auth_sessions` (`user_id`, `expires_at`);
