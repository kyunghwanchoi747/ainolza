-- Products 에 tags(array) + duration 필드 추가

-- duration 컬럼
ALTER TABLE `products` ADD COLUMN `duration` text;

-- tags 자식 테이블 (array)
CREATE TABLE IF NOT EXISTS `products_tags` (
  `_order` integer NOT NULL,
  `_parent_id` integer NOT NULL,
  `id` text PRIMARY KEY NOT NULL,
  `label` text NOT NULL,
  FOREIGN KEY (`_parent_id`) REFERENCES `products`(`id`) ON UPDATE no action ON DELETE cascade
);
CREATE INDEX IF NOT EXISTS `products_tags_order_idx` ON `products_tags` (`_order`);
CREATE INDEX IF NOT EXISTS `products_tags_parent_id_idx` ON `products_tags` (`_parent_id`);
