import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-d1-sqlite'

/**
 * Ebooks 컬렉션 신설 — 전자책 PDF 전용 R2 비공개 저장
 * Products.ebookFile (relation to ebooks) 컬럼 추가
 */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  // ebooks 테이블 (Payload upload 컬렉션 표준 컬럼 + r2Storage prefix)
  await db.run(sql`CREATE TABLE \`ebooks\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`title\` text NOT NULL,
  	\`prefix\` text DEFAULT 'ebooks',
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`url\` text,
  	\`thumbnail_u_r_l\` text,
  	\`filename\` text,
  	\`mime_type\` text,
  	\`filesize\` numeric,
  	\`width\` numeric,
  	\`height\` numeric,
  	\`focal_x\` numeric,
  	\`focal_y\` numeric
  );
  `)
  await db.run(sql`CREATE INDEX \`ebooks_updated_at_idx\` ON \`ebooks\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`ebooks_created_at_idx\` ON \`ebooks\` (\`created_at\`);`)
  await db.run(sql`CREATE UNIQUE INDEX \`ebooks_filename_idx\` ON \`ebooks\` (\`filename\`);`)

  // products.ebook_file_id (relation FK)
  await db.run(sql`ALTER TABLE \`products\` ADD COLUMN \`ebook_file_id\` integer REFERENCES \`ebooks\`(\`id\`) ON UPDATE no action ON DELETE set null;`)
  await db.run(sql`CREATE INDEX \`products_ebook_file_idx\` ON \`products\` (\`ebook_file_id\`);`)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.run(sql`DROP INDEX IF EXISTS \`products_ebook_file_idx\`;`)
  // SQLite는 DROP COLUMN을 직접 지원 (3.35+) — D1은 지원함
  await db.run(sql`ALTER TABLE \`products\` DROP COLUMN \`ebook_file_id\`;`)
  await db.run(sql`DROP TABLE \`ebooks\`;`)
}
