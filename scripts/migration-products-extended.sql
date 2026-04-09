-- Products 컬렉션 확장 (subtitle, originalPrice, actions, detailImages, classroomSlug 등)

-- 1. 자식 테이블: actions (버튼 리스트)
CREATE TABLE IF NOT EXISTS `products_actions` (
  `_order` integer NOT NULL,
  `_parent_id` integer NOT NULL,
  `id` text PRIMARY KEY NOT NULL,
  `label` text NOT NULL,
  `url` text NOT NULL,
  `primary` integer,
  `external` integer,
  FOREIGN KEY (`_parent_id`) REFERENCES `products`(`id`) ON UPDATE no action ON DELETE cascade
);
CREATE INDEX IF NOT EXISTS `products_actions_order_idx` ON `products_actions` (`_order`);
CREATE INDEX IF NOT EXISTS `products_actions_parent_id_idx` ON `products_actions` (`_parent_id`);

-- 2. 자식 테이블: detail_images (상세 이미지 리스트)
CREATE TABLE IF NOT EXISTS `products_detail_images` (
  `_order` integer NOT NULL,
  `_parent_id` integer NOT NULL,
  `id` text PRIMARY KEY NOT NULL,
  `image_id` integer NOT NULL,
  FOREIGN KEY (`image_id`) REFERENCES `media`(`id`) ON UPDATE no action ON DELETE set null,
  FOREIGN KEY (`_parent_id`) REFERENCES `products`(`id`) ON UPDATE no action ON DELETE cascade
);
CREATE INDEX IF NOT EXISTS `products_detail_images_order_idx` ON `products_detail_images` (`_order`);
CREATE INDEX IF NOT EXISTS `products_detail_images_parent_id_idx` ON `products_detail_images` (`_parent_id`);
CREATE INDEX IF NOT EXISTS `products_detail_images_image_idx` ON `products_detail_images` (`image_id`);

-- 3. products 테이블 재생성 (비어있으니 drop & create)
PRAGMA foreign_keys=OFF;
DROP TABLE IF EXISTS `products`;
CREATE TABLE `products` (
  `id` integer PRIMARY KEY NOT NULL,
  `title` text NOT NULL,
  `slug` text NOT NULL,
  `subtitle` text,
  `short_description` text,
  `product_type` text DEFAULT 'class' NOT NULL,
  `category` text,
  `price` numeric,
  `original_price` numeric,
  `price_label` text,
  `discount_until` text,
  `classroom_slug` text,
  `thumbnail_id` integer,
  `order` numeric DEFAULT 999,
  `status` text DEFAULT 'published' NOT NULL,
  `featured` integer DEFAULT false,
  `seo_type` text DEFAULT 'Product',
  `seo_author` text,
  `description` text,
  `content` text,
  `updated_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  `created_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  FOREIGN KEY (`thumbnail_id`) REFERENCES `media`(`id`) ON UPDATE no action ON DELETE set null
);
PRAGMA foreign_keys=ON;
CREATE UNIQUE INDEX IF NOT EXISTS `products_slug_idx` ON `products` (`slug`);
CREATE INDEX IF NOT EXISTS `products_thumbnail_idx` ON `products` (`thumbnail_id`);
CREATE INDEX IF NOT EXISTS `products_updated_at_idx` ON `products` (`updated_at`);
CREATE INDEX IF NOT EXISTS `products_created_at_idx` ON `products` (`created_at`);
