import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-d1-sqlite'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.run(sql`CREATE TABLE \`site_settings_navigation\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`label\` text NOT NULL,
  	\`path\` text NOT NULL,
  	\`type\` text NOT NULL,
  	\`custom_page_slug\` text,
  	\`enabled\` integer DEFAULT true,
  	\`order\` numeric DEFAULT 0,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`site_settings\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`site_settings_navigation_order_idx\` ON \`site_settings_navigation\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`site_settings_navigation_parent_id_idx\` ON \`site_settings_navigation\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`site_settings\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`site_name\` text DEFAULT 'AI 놀자',
  	\`home_path\` text DEFAULT '/home',
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
  );
  `)
  await db.run(sql`CREATE INDEX \`site_settings_updated_at_idx\` ON \`site_settings\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`site_settings_created_at_idx\` ON \`site_settings\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`enrollments\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`name\` text NOT NULL,
  	\`phone\` text NOT NULL,
  	\`email\` text NOT NULL,
  	\`program\` text DEFAULT 'vibe-coding' NOT NULL,
  	\`message\` text,
  	\`status\` text DEFAULT 'pending',
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
  );
  `)
  await db.run(sql`CREATE INDEX \`enrollments_updated_at_idx\` ON \`enrollments\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`enrollments_created_at_idx\` ON \`enrollments\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`orders\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order_number\` text NOT NULL,
  	\`buyer_name\` text NOT NULL,
  	\`buyer_email\` text NOT NULL,
  	\`buyer_phone\` text,
  	\`user_id\` integer,
  	\`product_name\` text NOT NULL,
  	\`product_slug\` text,
  	\`product_type\` text,
  	\`amount\` numeric NOT NULL,
  	\`original_amount\` numeric,
  	\`pay_method\` text,
  	\`status\` text DEFAULT 'pending' NOT NULL,
  	\`imp_uid\` text,
  	\`merchant_uid\` text,
  	\`pg_provider\` text,
  	\`receipt_url\` text,
  	\`vbank_name\` text,
  	\`vbank_num\` text,
  	\`vbank_date\` text,
  	\`refund_reason\` text,
  	\`refunded_at\` text,
  	\`refund_amount\` numeric,
  	\`cash_receipt_type\` text DEFAULT 'none',
  	\`cash_receipt_number\` text,
  	\`admin_memo\` text,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`orders_order_number_idx\` ON \`orders\` (\`order_number\`);`)
  await db.run(sql`CREATE INDEX \`orders_user_idx\` ON \`orders\` (\`user_id\`);`)
  await db.run(sql`CREATE INDEX \`orders_updated_at_idx\` ON \`orders\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`orders_created_at_idx\` ON \`orders\` (\`created_at\`);`)
  await db.run(sql`ALTER TABLE \`users\` ADD \`name\` text;`)
  await db.run(sql`ALTER TABLE \`users\` ADD \`phone\` text;`)
  await db.run(sql`ALTER TABLE \`users\` ADD \`must_reset_password\` integer DEFAULT false;`)
  await db.run(sql`ALTER TABLE \`users\` ADD \`imported_from\` text;`)
  await db.run(sql`ALTER TABLE \`payload_locked_documents_rels\` ADD \`site_settings_id\` integer REFERENCES site_settings(id);`)
  await db.run(sql`ALTER TABLE \`payload_locked_documents_rels\` ADD \`enrollments_id\` integer REFERENCES enrollments(id);`)
  await db.run(sql`ALTER TABLE \`payload_locked_documents_rels\` ADD \`orders_id\` integer REFERENCES orders(id);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_site_settings_id_idx\` ON \`payload_locked_documents_rels\` (\`site_settings_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_enrollments_id_idx\` ON \`payload_locked_documents_rels\` (\`enrollments_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_orders_id_idx\` ON \`payload_locked_documents_rels\` (\`orders_id\`);`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.run(sql`DROP TABLE \`site_settings_navigation\`;`)
  await db.run(sql`DROP TABLE \`site_settings\`;`)
  await db.run(sql`DROP TABLE \`enrollments\`;`)
  await db.run(sql`DROP TABLE \`orders\`;`)
  await db.run(sql`PRAGMA foreign_keys=OFF;`)
  await db.run(sql`CREATE TABLE \`__new_payload_locked_documents_rels\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	\`users_id\` integer,
  	\`media_id\` integer,
  	\`design_pages_id\` integer,
  	\`products_id\` integer,
  	\`product_categories_id\` integer,
  	\`posts_id\` integer,
  	\`comments_id\` integer,
  	\`programs_id\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`payload_locked_documents\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`users_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`media_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`design_pages_id\`) REFERENCES \`design_pages\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`products_id\`) REFERENCES \`products\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`product_categories_id\`) REFERENCES \`product_categories\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`posts_id\`) REFERENCES \`posts\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`comments_id\`) REFERENCES \`comments\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`programs_id\`) REFERENCES \`programs\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`INSERT INTO \`__new_payload_locked_documents_rels\`("id", "order", "parent_id", "path", "users_id", "media_id", "design_pages_id", "products_id", "product_categories_id", "posts_id", "comments_id", "programs_id") SELECT "id", "order", "parent_id", "path", "users_id", "media_id", "design_pages_id", "products_id", "product_categories_id", "posts_id", "comments_id", "programs_id" FROM \`payload_locked_documents_rels\`;`)
  await db.run(sql`DROP TABLE \`payload_locked_documents_rels\`;`)
  await db.run(sql`ALTER TABLE \`__new_payload_locked_documents_rels\` RENAME TO \`payload_locked_documents_rels\`;`)
  await db.run(sql`PRAGMA foreign_keys=ON;`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_order_idx\` ON \`payload_locked_documents_rels\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_parent_idx\` ON \`payload_locked_documents_rels\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_path_idx\` ON \`payload_locked_documents_rels\` (\`path\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_users_id_idx\` ON \`payload_locked_documents_rels\` (\`users_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_media_id_idx\` ON \`payload_locked_documents_rels\` (\`media_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_design_pages_id_idx\` ON \`payload_locked_documents_rels\` (\`design_pages_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_products_id_idx\` ON \`payload_locked_documents_rels\` (\`products_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_product_categories_id_idx\` ON \`payload_locked_documents_rels\` (\`product_categories_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_posts_id_idx\` ON \`payload_locked_documents_rels\` (\`posts_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_comments_id_idx\` ON \`payload_locked_documents_rels\` (\`comments_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_programs_id_idx\` ON \`payload_locked_documents_rels\` (\`programs_id\`);`)
  await db.run(sql`ALTER TABLE \`users\` DROP COLUMN \`name\`;`)
  await db.run(sql`ALTER TABLE \`users\` DROP COLUMN \`phone\`;`)
  await db.run(sql`ALTER TABLE \`users\` DROP COLUMN \`must_reset_password\`;`)
  await db.run(sql`ALTER TABLE \`users\` DROP COLUMN \`imported_from\`;`)
}
