-- Reviews 컬렉션
CREATE TABLE IF NOT EXISTS `reviews` (
  `id` integer PRIMARY KEY NOT NULL,
  `product_id` integer NOT NULL,
  `user_id` integer NOT NULL,
  `rating` numeric NOT NULL,
  `content` text NOT NULL,
  `status` text DEFAULT 'pending' NOT NULL,
  `updated_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  `created_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON UPDATE no action ON DELETE set null,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE set null
);
CREATE INDEX IF NOT EXISTS `reviews_product_idx` ON `reviews` (`product_id`);
CREATE INDEX IF NOT EXISTS `reviews_user_idx` ON `reviews` (`user_id`);
CREATE INDEX IF NOT EXISTS `reviews_status_idx` ON `reviews` (`status`);
CREATE INDEX IF NOT EXISTS `reviews_created_at_idx` ON `reviews` (`created_at`);
