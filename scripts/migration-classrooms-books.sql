-- Orders 컬렉션의 classrooms / books 다중 select 필드를 위한 join 테이블
CREATE TABLE IF NOT EXISTS `orders_classrooms` (
  `order` integer NOT NULL,
  `parent_id` integer NOT NULL,
  `value` text,
  `id` integer PRIMARY KEY NOT NULL,
  FOREIGN KEY (`parent_id`) REFERENCES `orders`(`id`) ON UPDATE no action ON DELETE cascade
);
CREATE INDEX IF NOT EXISTS `orders_classrooms_order_idx` ON `orders_classrooms` (`order`);
CREATE INDEX IF NOT EXISTS `orders_classrooms_parent_idx` ON `orders_classrooms` (`parent_id`);

CREATE TABLE IF NOT EXISTS `orders_books` (
  `order` integer NOT NULL,
  `parent_id` integer NOT NULL,
  `value` text,
  `id` integer PRIMARY KEY NOT NULL,
  FOREIGN KEY (`parent_id`) REFERENCES `orders`(`id`) ON UPDATE no action ON DELETE cascade
);
CREATE INDEX IF NOT EXISTS `orders_books_order_idx` ON `orders_books` (`order`);
CREATE INDEX IF NOT EXISTS `orders_books_parent_idx` ON `orders_books` (`parent_id`);
