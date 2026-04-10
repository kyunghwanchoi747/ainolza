-- EmailLogs 컬렉션 테이블
CREATE TABLE IF NOT EXISTS `email-logs` (
  `id` integer PRIMARY KEY NOT NULL,
  `to` text NOT NULL,
  `subject` text NOT NULL,
  `type` text,
  `status` text DEFAULT 'sent',
  `error` text,
  `related_id` text,
  `updated_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  `created_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
);
CREATE INDEX IF NOT EXISTS `email_logs_to_idx` ON `email-logs` (`to`);
CREATE INDEX IF NOT EXISTS `email_logs_type_idx` ON `email-logs` (`type`);
CREATE INDEX IF NOT EXISTS `email_logs_created_at_idx` ON `email-logs` (`created_at`);
