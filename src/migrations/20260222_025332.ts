import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-d1-sqlite'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.run(sql`CREATE TABLE \`products\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`title\` text NOT NULL,
  	\`price\` numeric NOT NULL,
  	\`stock\` numeric DEFAULT 0 NOT NULL,
  	\`category_id\` integer,
  	\`description\` text,
  	\`status\` text DEFAULT 'published' NOT NULL,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	FOREIGN KEY (\`category_id\`) REFERENCES \`categories\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`products_category_idx\` ON \`products\` (\`category_id\`);`)
  await db.run(sql`CREATE INDEX \`products_updated_at_idx\` ON \`products\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`products_created_at_idx\` ON \`products\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`products_rels\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	\`media_id\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`products\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`media_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`products_rels_order_idx\` ON \`products_rels\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`products_rels_parent_idx\` ON \`products_rels\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`products_rels_path_idx\` ON \`products_rels\` (\`path\`);`)
  await db.run(sql`CREATE INDEX \`products_rels_media_id_idx\` ON \`products_rels\` (\`media_id\`);`)
  await db.run(sql`CREATE TABLE \`reviews\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`user_id\` integer NOT NULL,
  	\`rating\` numeric NOT NULL,
  	\`content\` text NOT NULL,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`reviews_user_idx\` ON \`reviews\` (\`user_id\`);`)
  await db.run(sql`CREATE INDEX \`reviews_updated_at_idx\` ON \`reviews\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`reviews_created_at_idx\` ON \`reviews\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`reviews_rels\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	\`products_id\` integer,
  	\`programs_id\` integer,
  	\`courses_id\` integer,
  	\`media_id\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`reviews\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`products_id\`) REFERENCES \`products\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`programs_id\`) REFERENCES \`programs\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`courses_id\`) REFERENCES \`courses\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`media_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`reviews_rels_order_idx\` ON \`reviews_rels\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`reviews_rels_parent_idx\` ON \`reviews_rels\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`reviews_rels_path_idx\` ON \`reviews_rels\` (\`path\`);`)
  await db.run(sql`CREATE INDEX \`reviews_rels_products_id_idx\` ON \`reviews_rels\` (\`products_id\`);`)
  await db.run(sql`CREATE INDEX \`reviews_rels_programs_id_idx\` ON \`reviews_rels\` (\`programs_id\`);`)
  await db.run(sql`CREATE INDEX \`reviews_rels_courses_id_idx\` ON \`reviews_rels\` (\`courses_id\`);`)
  await db.run(sql`CREATE INDEX \`reviews_rels_media_id_idx\` ON \`reviews_rels\` (\`media_id\`);`)
  await db.run(sql`CREATE TABLE \`orders_items\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`quantity\` numeric DEFAULT 1 NOT NULL,
  	\`price\` numeric NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`orders\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`orders_items_order_idx\` ON \`orders_items\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`orders_items_parent_id_idx\` ON \`orders_items\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`orders\` (
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`customer_id\` integer NOT NULL,
  	\`status\` text DEFAULT 'pending' NOT NULL,
  	\`amount\` numeric NOT NULL,
  	\`shipping_info_receiver_name\` text,
  	\`shipping_info_receiver_phone\` text,
  	\`shipping_info_address\` text,
  	\`shipping_info_memo\` text,
  	\`shipping_info_tracking_number\` text,
  	\`payment_info_method\` text,
  	\`payment_info_transaction_i_d\` text,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	FOREIGN KEY (\`customer_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`orders_customer_idx\` ON \`orders\` (\`customer_id\`);`)
  await db.run(sql`CREATE INDEX \`orders_updated_at_idx\` ON \`orders\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`orders_created_at_idx\` ON \`orders\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`orders_rels\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer,
  	\`parent_id\` text NOT NULL,
  	\`path\` text NOT NULL,
  	\`products_id\` integer,
  	\`programs_id\` integer,
  	\`courses_id\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`orders\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`products_id\`) REFERENCES \`products\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`programs_id\`) REFERENCES \`programs\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`courses_id\`) REFERENCES \`courses\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`orders_rels_order_idx\` ON \`orders_rels\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`orders_rels_parent_idx\` ON \`orders_rels\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`orders_rels_path_idx\` ON \`orders_rels\` (\`path\`);`)
  await db.run(sql`CREATE INDEX \`orders_rels_products_id_idx\` ON \`orders_rels\` (\`products_id\`);`)
  await db.run(sql`CREATE INDEX \`orders_rels_programs_id_idx\` ON \`orders_rels\` (\`programs_id\`);`)
  await db.run(sql`CREATE INDEX \`orders_rels_courses_id_idx\` ON \`orders_rels\` (\`courses_id\`);`)
  await db.run(sql`CREATE TABLE \`programs\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`title\` text NOT NULL,
  	\`description\` text,
  	\`file_id\` integer NOT NULL,
  	\`link\` text,
  	\`category\` text,
  	\`price\` numeric DEFAULT 0 NOT NULL,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	FOREIGN KEY (\`file_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`programs_file_idx\` ON \`programs\` (\`file_id\`);`)
  await db.run(sql`CREATE INDEX \`programs_updated_at_idx\` ON \`programs\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`programs_created_at_idx\` ON \`programs\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`courses_tags\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`tag\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`courses\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`courses_tags_order_idx\` ON \`courses_tags\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`courses_tags_parent_id_idx\` ON \`courses_tags\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`courses\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`title\` text NOT NULL,
  	\`description\` text,
  	\`thumbnail_id\` integer,
  	\`stream_id\` text,
  	\`duration\` text,
  	\`level\` text,
  	\`price\` numeric DEFAULT 0 NOT NULL,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	FOREIGN KEY (\`thumbnail_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`courses_thumbnail_idx\` ON \`courses\` (\`thumbnail_id\`);`)
  await db.run(sql`CREATE INDEX \`courses_updated_at_idx\` ON \`courses\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`courses_created_at_idx\` ON \`courses\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`posts\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`title\` text NOT NULL,
  	\`category\` text DEFAULT 'column' NOT NULL,
  	\`content\` text,
  	\`author_id\` integer NOT NULL,
  	\`published_date\` text,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	FOREIGN KEY (\`author_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`posts_author_idx\` ON \`posts\` (\`author_id\`);`)
  await db.run(sql`CREATE INDEX \`posts_updated_at_idx\` ON \`posts\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`posts_created_at_idx\` ON \`posts\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`community_posts\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`title\` text NOT NULL,
  	\`content\` text NOT NULL,
  	\`author_id\` integer NOT NULL,
  	\`likes\` numeric DEFAULT 0,
  	\`is_pinned\` integer DEFAULT false,
  	\`comments_count\` numeric DEFAULT 0,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	FOREIGN KEY (\`author_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`community_posts_author_idx\` ON \`community_posts\` (\`author_id\`);`)
  await db.run(sql`CREATE INDEX \`community_posts_updated_at_idx\` ON \`community_posts\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`community_posts_created_at_idx\` ON \`community_posts\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`comments\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`text\` text NOT NULL,
  	\`user_id\` integer NOT NULL,
  	\`parent_comment_id\` integer,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`parent_comment_id\`) REFERENCES \`comments\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`comments_user_idx\` ON \`comments\` (\`user_id\`);`)
  await db.run(sql`CREATE INDEX \`comments_parent_comment_idx\` ON \`comments\` (\`parent_comment_id\`);`)
  await db.run(sql`CREATE INDEX \`comments_updated_at_idx\` ON \`comments\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`comments_created_at_idx\` ON \`comments\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`comments_rels\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	\`community_posts_id\` integer,
  	\`courses_id\` integer,
  	\`programs_id\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`comments\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`community_posts_id\`) REFERENCES \`community_posts\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`courses_id\`) REFERENCES \`courses\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`programs_id\`) REFERENCES \`programs\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`comments_rels_order_idx\` ON \`comments_rels\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`comments_rels_parent_idx\` ON \`comments_rels\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`comments_rels_path_idx\` ON \`comments_rels\` (\`path\`);`)
  await db.run(sql`CREATE INDEX \`comments_rels_community_posts_id_idx\` ON \`comments_rels\` (\`community_posts_id\`);`)
  await db.run(sql`CREATE INDEX \`comments_rels_courses_id_idx\` ON \`comments_rels\` (\`courses_id\`);`)
  await db.run(sql`CREATE INDEX \`comments_rels_programs_id_idx\` ON \`comments_rels\` (\`programs_id\`);`)
  await db.run(sql`CREATE TABLE \`categories\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`title\` text NOT NULL,
  	\`slug\` text NOT NULL,
  	\`type\` text NOT NULL,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`categories_slug_idx\` ON \`categories\` (\`slug\`);`)
  await db.run(sql`CREATE INDEX \`categories_updated_at_idx\` ON \`categories\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`categories_created_at_idx\` ON \`categories\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`inquiries\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`subject\` text NOT NULL,
  	\`message\` text NOT NULL,
  	\`user_id\` integer NOT NULL,
  	\`status\` text DEFAULT 'pending',
  	\`answer\` text,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`inquiries_user_idx\` ON \`inquiries\` (\`user_id\`);`)
  await db.run(sql`CREATE INDEX \`inquiries_updated_at_idx\` ON \`inquiries\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`inquiries_created_at_idx\` ON \`inquiries\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`site_stats\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`date\` text NOT NULL,
  	\`visitors\` numeric DEFAULT 0,
  	\`page_views\` numeric DEFAULT 0,
  	\`new_orders\` numeric DEFAULT 0,
  	\`revenue\` numeric DEFAULT 0,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`site_stats_date_idx\` ON \`site_stats\` (\`date\`);`)
  await db.run(sql`CREATE INDEX \`site_stats_updated_at_idx\` ON \`site_stats\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`site_stats_created_at_idx\` ON \`site_stats\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`payload_kv\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`key\` text NOT NULL,
  	\`data\` text NOT NULL
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`payload_kv_key_idx\` ON \`payload_kv\` (\`key\`);`)
  await db.run(sql`CREATE TABLE \`hero_stats\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`label\` text NOT NULL,
  	\`value\` text NOT NULL,
  	\`icon\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`hero\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`hero_stats_order_idx\` ON \`hero_stats\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`hero_stats_parent_id_idx\` ON \`hero_stats\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`hero\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`title\` text NOT NULL,
  	\`subtitle\` text,
  	\`primary_button_label\` text,
  	\`primary_button_link\` text,
  	\`secondary_button_label\` text,
  	\`secondary_button_link\` text,
  	\`background_image_id\` integer,
  	\`cta_title\` text,
  	\`cta_subtitle\` text,
  	\`cta_button_label\` text,
  	\`cta_button_link\` text,
  	\`updated_at\` text,
  	\`created_at\` text,
  	FOREIGN KEY (\`background_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`hero_background_image_idx\` ON \`hero\` (\`background_image_id\`);`)
  await db.run(sql`CREATE TABLE \`main_nav_items\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`label\` text NOT NULL,
  	\`link\` text NOT NULL,
  	\`icon\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`main_nav\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`main_nav_items_order_idx\` ON \`main_nav_items\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`main_nav_items_parent_id_idx\` ON \`main_nav_items\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`main_nav\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`updated_at\` text,
  	\`created_at\` text
  );
  `)
  await db.run(sql`CREATE TABLE \`shop_settings\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`currency\` text DEFAULT '원',
  	\`base_shipping_fee\` numeric DEFAULT 3000,
  	\`free_shipping_threshold\` numeric DEFAULT 50000,
  	\`updated_at\` text,
  	\`created_at\` text
  );
  `)
  await db.run(sql`CREATE TABLE \`seo_settings\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`title\` text,
  	\`description\` text,
  	\`keywords\` text,
  	\`aeo_geo_semantic_data\` text,
  	\`aeo_geo_voice_search\` integer DEFAULT true,
  	\`updated_at\` text,
  	\`created_at\` text
  );
  `)
  await db.run(sql`CREATE TABLE \`payment_settings\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`provider\` text,
  	\`mid\` text,
  	\`api_key\` text,
  	\`test_mode\` integer DEFAULT true,
  	\`updated_at\` text,
  	\`created_at\` text
  );
  `)
  await db.run(sql`CREATE TABLE \`message_settings_templates\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`name\` text,
  	\`content\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`message_settings\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`message_settings_templates_order_idx\` ON \`message_settings_templates\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`message_settings_templates_parent_id_idx\` ON \`message_settings_templates\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`message_settings\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`notification_talk_enabled\` integer DEFAULT false,
  	\`notification_talk_sender_key\` text,
  	\`updated_at\` text,
  	\`created_at\` text
  );
  `)
  await db.run(sql`ALTER TABLE \`users\` ADD \`nickname\` text;`)
  await db.run(sql`ALTER TABLE \`users\` ADD \`user_type\` text DEFAULT 'general' NOT NULL;`)
  await db.run(sql`ALTER TABLE \`users\` ADD \`group\` text DEFAULT 'none';`)
  await db.run(sql`ALTER TABLE \`users\` ADD \`points\` numeric DEFAULT 0;`)
  await db.run(sql`ALTER TABLE \`users\` ADD \`purchase_amount\` numeric DEFAULT 0;`)
  await db.run(sql`ALTER TABLE \`users\` ADD \`profile_image_id\` integer REFERENCES media(id);`)
  await db.run(sql`ALTER TABLE \`users\` ADD \`memo\` text;`)
  await db.run(sql`ALTER TABLE \`users\` ADD \`notification_settings_comments\` integer DEFAULT true;`)
  await db.run(sql`ALTER TABLE \`users\` ADD \`notification_settings_marketing\` integer DEFAULT false;`)
  await db.run(sql`CREATE UNIQUE INDEX \`users_nickname_idx\` ON \`users\` (\`nickname\`);`)
  await db.run(sql`CREATE INDEX \`users_profile_image_idx\` ON \`users\` (\`profile_image_id\`);`)
  await db.run(sql`ALTER TABLE \`payload_locked_documents_rels\` ADD \`products_id\` integer REFERENCES products(id);`)
  await db.run(sql`ALTER TABLE \`payload_locked_documents_rels\` ADD \`reviews_id\` integer REFERENCES reviews(id);`)
  await db.run(sql`ALTER TABLE \`payload_locked_documents_rels\` ADD \`orders_id\` text REFERENCES orders(id);`)
  await db.run(sql`ALTER TABLE \`payload_locked_documents_rels\` ADD \`programs_id\` integer REFERENCES programs(id);`)
  await db.run(sql`ALTER TABLE \`payload_locked_documents_rels\` ADD \`courses_id\` integer REFERENCES courses(id);`)
  await db.run(sql`ALTER TABLE \`payload_locked_documents_rels\` ADD \`posts_id\` integer REFERENCES posts(id);`)
  await db.run(sql`ALTER TABLE \`payload_locked_documents_rels\` ADD \`community_posts_id\` integer REFERENCES community_posts(id);`)
  await db.run(sql`ALTER TABLE \`payload_locked_documents_rels\` ADD \`comments_id\` integer REFERENCES comments(id);`)
  await db.run(sql`ALTER TABLE \`payload_locked_documents_rels\` ADD \`categories_id\` integer REFERENCES categories(id);`)
  await db.run(sql`ALTER TABLE \`payload_locked_documents_rels\` ADD \`inquiries_id\` integer REFERENCES inquiries(id);`)
  await db.run(sql`ALTER TABLE \`payload_locked_documents_rels\` ADD \`site_stats_id\` integer REFERENCES site_stats(id);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_products_id_idx\` ON \`payload_locked_documents_rels\` (\`products_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_reviews_id_idx\` ON \`payload_locked_documents_rels\` (\`reviews_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_orders_id_idx\` ON \`payload_locked_documents_rels\` (\`orders_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_programs_id_idx\` ON \`payload_locked_documents_rels\` (\`programs_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_courses_id_idx\` ON \`payload_locked_documents_rels\` (\`courses_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_posts_id_idx\` ON \`payload_locked_documents_rels\` (\`posts_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_community_posts_id_idx\` ON \`payload_locked_documents_rels\` (\`community_posts_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_comments_id_idx\` ON \`payload_locked_documents_rels\` (\`comments_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_categories_id_idx\` ON \`payload_locked_documents_rels\` (\`categories_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_inquiries_id_idx\` ON \`payload_locked_documents_rels\` (\`inquiries_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_site_stats_id_idx\` ON \`payload_locked_documents_rels\` (\`site_stats_id\`);`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.run(sql`DROP TABLE \`products\`;`)
  await db.run(sql`DROP TABLE \`products_rels\`;`)
  await db.run(sql`DROP TABLE \`reviews\`;`)
  await db.run(sql`DROP TABLE \`reviews_rels\`;`)
  await db.run(sql`DROP TABLE \`orders_items\`;`)
  await db.run(sql`DROP TABLE \`orders\`;`)
  await db.run(sql`DROP TABLE \`orders_rels\`;`)
  await db.run(sql`DROP TABLE \`programs\`;`)
  await db.run(sql`DROP TABLE \`courses_tags\`;`)
  await db.run(sql`DROP TABLE \`courses\`;`)
  await db.run(sql`DROP TABLE \`posts\`;`)
  await db.run(sql`DROP TABLE \`community_posts\`;`)
  await db.run(sql`DROP TABLE \`comments\`;`)
  await db.run(sql`DROP TABLE \`comments_rels\`;`)
  await db.run(sql`DROP TABLE \`categories\`;`)
  await db.run(sql`DROP TABLE \`inquiries\`;`)
  await db.run(sql`DROP TABLE \`site_stats\`;`)
  await db.run(sql`DROP TABLE \`payload_kv\`;`)
  await db.run(sql`DROP TABLE \`hero_stats\`;`)
  await db.run(sql`DROP TABLE \`hero\`;`)
  await db.run(sql`DROP TABLE \`main_nav_items\`;`)
  await db.run(sql`DROP TABLE \`main_nav\`;`)
  await db.run(sql`DROP TABLE \`shop_settings\`;`)
  await db.run(sql`DROP TABLE \`seo_settings\`;`)
  await db.run(sql`DROP TABLE \`payment_settings\`;`)
  await db.run(sql`DROP TABLE \`message_settings_templates\`;`)
  await db.run(sql`DROP TABLE \`message_settings\`;`)
  await db.run(sql`PRAGMA foreign_keys=OFF;`)
  await db.run(sql`CREATE TABLE \`__new_users\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`email\` text NOT NULL,
  	\`reset_password_token\` text,
  	\`reset_password_expiration\` text,
  	\`salt\` text,
  	\`hash\` text,
  	\`login_attempts\` numeric DEFAULT 0,
  	\`lock_until\` text
  );
  `)
  await db.run(sql`INSERT INTO \`__new_users\`("id", "updated_at", "created_at", "email", "reset_password_token", "reset_password_expiration", "salt", "hash", "login_attempts", "lock_until") SELECT "id", "updated_at", "created_at", "email", "reset_password_token", "reset_password_expiration", "salt", "hash", "login_attempts", "lock_until" FROM \`users\`;`)
  await db.run(sql`DROP TABLE \`users\`;`)
  await db.run(sql`ALTER TABLE \`__new_users\` RENAME TO \`users\`;`)
  await db.run(sql`PRAGMA foreign_keys=ON;`)
  await db.run(sql`CREATE INDEX \`users_updated_at_idx\` ON \`users\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`users_created_at_idx\` ON \`users\` (\`created_at\`);`)
  await db.run(sql`CREATE UNIQUE INDEX \`users_email_idx\` ON \`users\` (\`email\`);`)
  await db.run(sql`CREATE TABLE \`__new_payload_locked_documents_rels\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	\`users_id\` integer,
  	\`media_id\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`payload_locked_documents\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`users_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`media_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`INSERT INTO \`__new_payload_locked_documents_rels\`("id", "order", "parent_id", "path", "users_id", "media_id") SELECT "id", "order", "parent_id", "path", "users_id", "media_id" FROM \`payload_locked_documents_rels\`;`)
  await db.run(sql`DROP TABLE \`payload_locked_documents_rels\`;`)
  await db.run(sql`ALTER TABLE \`__new_payload_locked_documents_rels\` RENAME TO \`payload_locked_documents_rels\`;`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_order_idx\` ON \`payload_locked_documents_rels\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_parent_idx\` ON \`payload_locked_documents_rels\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_path_idx\` ON \`payload_locked_documents_rels\` (\`path\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_users_id_idx\` ON \`payload_locked_documents_rels\` (\`users_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_media_id_idx\` ON \`payload_locked_documents_rels\` (\`media_id\`);`)
}
