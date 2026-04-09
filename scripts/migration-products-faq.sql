-- Products 에 faq(array) 필드 추가
CREATE TABLE IF NOT EXISTS `products_faq` (
  `_order` integer NOT NULL,
  `_parent_id` integer NOT NULL,
  `id` text PRIMARY KEY NOT NULL,
  `question` text NOT NULL,
  `answer` text NOT NULL,
  FOREIGN KEY (`_parent_id`) REFERENCES `products`(`id`) ON UPDATE no action ON DELETE cascade
);
CREATE INDEX IF NOT EXISTS `products_faq_order_idx` ON `products_faq` (`_order`);
CREATE INDEX IF NOT EXISTS `products_faq_parent_id_idx` ON `products_faq` (`_parent_id`);
