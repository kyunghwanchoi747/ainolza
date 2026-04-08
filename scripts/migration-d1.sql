-- AI놀자 D1 마이그레이션 SQL
-- Cloudflare D1 Console에서 한 번에 실행

-- site_settings_navigation
CREATE TABLE IF NOT EXISTS `site_settings_navigation` (
  `_order` integer NOT NULL,
  `_parent_id` integer NOT NULL,
  `id` text PRIMARY KEY NOT NULL,
  `label` text NOT NULL,
  `path` text NOT NULL,
  `type` text NOT NULL,
  `custom_page_slug` text,
  `enabled` integer DEFAULT true,
  `order` numeric DEFAULT 0,
  FOREIGN KEY (`_parent_id`) REFERENCES `site_settings`(`id`) ON UPDATE no action ON DELETE cascade
);
CREATE INDEX IF NOT EXISTS `site_settings_navigation_order_idx` ON `site_settings_navigation` (`_order`);
CREATE INDEX IF NOT EXISTS `site_settings_navigation_parent_id_idx` ON `site_settings_navigation` (`_parent_id`);

-- site_settings
CREATE TABLE IF NOT EXISTS `site_settings` (
  `id` integer PRIMARY KEY NOT NULL,
  `site_name` text DEFAULT 'AI 놀자',
  `home_path` text DEFAULT '/home',
  `updated_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  `created_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
);
CREATE INDEX IF NOT EXISTS `site_settings_updated_at_idx` ON `site_settings` (`updated_at`);
CREATE INDEX IF NOT EXISTS `site_settings_created_at_idx` ON `site_settings` (`created_at`);

-- enrollments
CREATE TABLE IF NOT EXISTS `enrollments` (
  `id` integer PRIMARY KEY NOT NULL,
  `name` text NOT NULL,
  `phone` text NOT NULL,
  `email` text NOT NULL,
  `program` text DEFAULT 'vibe-coding' NOT NULL,
  `message` text,
  `status` text DEFAULT 'pending',
  `updated_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  `created_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
);
CREATE INDEX IF NOT EXISTS `enrollments_updated_at_idx` ON `enrollments` (`updated_at`);
CREATE INDEX IF NOT EXISTS `enrollments_created_at_idx` ON `enrollments` (`created_at`);

-- orders
CREATE TABLE IF NOT EXISTS `orders` (
  `id` integer PRIMARY KEY NOT NULL,
  `order_number` text NOT NULL,
  `buyer_name` text NOT NULL,
  `buyer_email` text NOT NULL,
  `buyer_phone` text,
  `user_id` integer,
  `product_name` text NOT NULL,
  `product_slug` text,
  `product_type` text,
  `amount` numeric NOT NULL,
  `original_amount` numeric,
  `pay_method` text,
  `status` text DEFAULT 'pending' NOT NULL,
  `imp_uid` text,
  `merchant_uid` text,
  `pg_provider` text,
  `receipt_url` text,
  `vbank_name` text,
  `vbank_num` text,
  `vbank_date` text,
  `refund_reason` text,
  `refunded_at` text,
  `refund_amount` numeric,
  `cash_receipt_type` text DEFAULT 'none',
  `cash_receipt_number` text,
  `admin_memo` text,
  `updated_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  `created_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE set null
);
CREATE UNIQUE INDEX IF NOT EXISTS `orders_order_number_idx` ON `orders` (`order_number`);
CREATE INDEX IF NOT EXISTS `orders_user_idx` ON `orders` (`user_id`);
CREATE INDEX IF NOT EXISTS `orders_updated_at_idx` ON `orders` (`updated_at`);
CREATE INDEX IF NOT EXISTS `orders_created_at_idx` ON `orders` (`created_at`);

-- users 컬럼 추가
ALTER TABLE `users` ADD `name` text;
ALTER TABLE `users` ADD `phone` text;
ALTER TABLE `users` ADD `must_reset_password` integer DEFAULT false;
ALTER TABLE `users` ADD `imported_from` text;

-- payload_locked_documents_rels 컬럼 추가
ALTER TABLE `payload_locked_documents_rels` ADD `site_settings_id` integer REFERENCES site_settings(id);
ALTER TABLE `payload_locked_documents_rels` ADD `enrollments_id` integer REFERENCES enrollments(id);
ALTER TABLE `payload_locked_documents_rels` ADD `orders_id` integer REFERENCES orders(id);

CREATE INDEX IF NOT EXISTS `payload_locked_documents_rels_site_settings_id_idx` ON `payload_locked_documents_rels` (`site_settings_id`);
CREATE INDEX IF NOT EXISTS `payload_locked_documents_rels_enrollments_id_idx` ON `payload_locked_documents_rels` (`enrollments_id`);
CREATE INDEX IF NOT EXISTS `payload_locked_documents_rels_orders_id_idx` ON `payload_locked_documents_rels` (`orders_id`);
