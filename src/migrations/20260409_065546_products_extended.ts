import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-d1-sqlite'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.run(sql`CREATE TABLE \`products_actions\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`label\` text NOT NULL,
  	\`url\` text NOT NULL,
  	\`primary\` integer,
  	\`external\` integer,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`products\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`products_actions_order_idx\` ON \`products_actions\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`products_actions_parent_id_idx\` ON \`products_actions\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`products_detail_images\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`image_id\` integer NOT NULL,
  	FOREIGN KEY (\`image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`products\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`products_detail_images_order_idx\` ON \`products_detail_images\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`products_detail_images_parent_id_idx\` ON \`products_detail_images\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`products_detail_images_image_idx\` ON \`products_detail_images\` (\`image_id\`);`)
  // 기존 products 테이블은 비어있음 → 데이터 보존 없이 그냥 drop & recreate
  await db.run(sql`PRAGMA foreign_keys=OFF;`)
  await db.run(sql`DROP TABLE IF EXISTS \`products\`;`)
  await db.run(sql`CREATE TABLE \`products\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`title\` text NOT NULL,
  	\`slug\` text NOT NULL,
  	\`subtitle\` text,
  	\`short_description\` text,
  	\`product_type\` text DEFAULT 'class' NOT NULL,
  	\`category\` text,
  	\`price\` numeric,
  	\`original_price\` numeric,
  	\`price_label\` text,
  	\`discount_until\` text,
  	\`classroom_slug\` text,
  	\`thumbnail_id\` integer,
  	\`order\` numeric DEFAULT 999,
  	\`status\` text DEFAULT 'published' NOT NULL,
  	\`featured\` integer DEFAULT false,
  	\`seo_type\` text DEFAULT 'Product',
  	\`seo_author\` text,
  	\`description\` text,
  	\`content\` text,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	FOREIGN KEY (\`thumbnail_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`PRAGMA foreign_keys=ON;`)
  await db.run(sql`CREATE UNIQUE INDEX \`products_slug_idx\` ON \`products\` (\`slug\`);`)
  await db.run(sql`CREATE INDEX \`products_thumbnail_idx\` ON \`products\` (\`thumbnail_id\`);`)
  await db.run(sql`CREATE INDEX \`products_updated_at_idx\` ON \`products\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`products_created_at_idx\` ON \`products\` (\`created_at\`);`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.run(sql`DROP TABLE \`products_actions\`;`)
  await db.run(sql`DROP TABLE \`products_detail_images\`;`)
  await db.run(sql`PRAGMA foreign_keys=OFF;`)
  await db.run(sql`CREATE TABLE \`__new_products\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`title\` text NOT NULL,
  	\`slug\` text NOT NULL,
  	\`description\` text,
  	\`price\` numeric NOT NULL,
  	\`category\` text,
  	\`thumbnail_id\` integer,
  	\`content\` text,
  	\`status\` text DEFAULT 'draft',
  	\`featured\` integer DEFAULT false,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	FOREIGN KEY (\`thumbnail_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`INSERT INTO \`__new_products\`("id", "title", "slug", "description", "price", "category", "thumbnail_id", "content", "status", "featured", "updated_at", "created_at") SELECT "id", "title", "slug", "description", "price", "category", "thumbnail_id", "content", "status", "featured", "updated_at", "created_at" FROM \`products\`;`)
  await db.run(sql`DROP TABLE \`products\`;`)
  await db.run(sql`ALTER TABLE \`__new_products\` RENAME TO \`products\`;`)
  await db.run(sql`PRAGMA foreign_keys=ON;`)
  await db.run(sql`CREATE UNIQUE INDEX \`products_slug_idx\` ON \`products\` (\`slug\`);`)
  await db.run(sql`CREATE INDEX \`products_thumbnail_idx\` ON \`products\` (\`thumbnail_id\`);`)
  await db.run(sql`CREATE INDEX \`products_updated_at_idx\` ON \`products\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`products_created_at_idx\` ON \`products\` (\`created_at\`);`)
}
