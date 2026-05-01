import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-d1-sqlite'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  // 1) display_name 컬럼 추가
  await db.run(sql`ALTER TABLE \`reviews\` ADD COLUMN \`display_name\` text;`)

  // 2) user_id를 NOT NULL → NULL 허용으로 바꾸려면 SQLite에선 테이블 재생성 필요
  await db.run(sql`PRAGMA foreign_keys=OFF;`)
  await db.run(sql`CREATE TABLE \`__new_reviews\` (
    \`id\` integer PRIMARY KEY NOT NULL,
    \`product_id\` integer,
    \`user_id\` integer,
    \`display_name\` text,
    \`rating\` numeric NOT NULL,
    \`content\` text NOT NULL,
    \`site_url\` text,
    \`status\` text DEFAULT 'approved' NOT NULL,
    \`order\` numeric DEFAULT 0,
    \`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
    \`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
    FOREIGN KEY (\`product_id\`) REFERENCES \`products\`(\`id\`) ON UPDATE no action ON DELETE set null,
    FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE set null
  );`)
  await db.run(sql`INSERT INTO \`__new_reviews\`(
    "id","product_id","user_id","display_name","rating","content","site_url","status","order","updated_at","created_at"
  ) SELECT
    "id","product_id","user_id","display_name","rating","content","site_url","status","order","updated_at","created_at"
  FROM \`reviews\`;`)
  await db.run(sql`DROP TABLE \`reviews\`;`)
  await db.run(sql`ALTER TABLE \`__new_reviews\` RENAME TO \`reviews\`;`)
  await db.run(sql`PRAGMA foreign_keys=ON;`)

  await db.run(sql`CREATE INDEX \`reviews_product_idx\` ON \`reviews\` (\`product_id\`);`)
  await db.run(sql`CREATE INDEX \`reviews_user_idx\` ON \`reviews\` (\`user_id\`);`)
  await db.run(sql`CREATE INDEX \`reviews_updated_at_idx\` ON \`reviews\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`reviews_created_at_idx\` ON \`reviews\` (\`created_at\`);`)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  // user_id를 다시 NOT NULL로, display_name 제거
  await db.run(sql`PRAGMA foreign_keys=OFF;`)
  await db.run(sql`CREATE TABLE \`__new_reviews\` (
    \`id\` integer PRIMARY KEY NOT NULL,
    \`product_id\` integer,
    \`user_id\` integer NOT NULL,
    \`rating\` numeric NOT NULL,
    \`content\` text NOT NULL,
    \`site_url\` text,
    \`status\` text DEFAULT 'approved' NOT NULL,
    \`order\` numeric DEFAULT 0,
    \`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
    \`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
    FOREIGN KEY (\`product_id\`) REFERENCES \`products\`(\`id\`) ON UPDATE no action ON DELETE set null,
    FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );`)
  // user_id가 NULL인 row(매니저 임의 작성 후기)는 다운그레이드 시 제외됨
  await db.run(sql`INSERT INTO \`__new_reviews\`(
    "id","product_id","user_id","rating","content","site_url","status","order","updated_at","created_at"
  ) SELECT
    "id","product_id","user_id","rating","content","site_url","status","order","updated_at","created_at"
  FROM \`reviews\` WHERE \`user_id\` IS NOT NULL;`)
  await db.run(sql`DROP TABLE \`reviews\`;`)
  await db.run(sql`ALTER TABLE \`__new_reviews\` RENAME TO \`reviews\`;`)
  await db.run(sql`PRAGMA foreign_keys=ON;`)

  await db.run(sql`CREATE INDEX \`reviews_product_idx\` ON \`reviews\` (\`product_id\`);`)
  await db.run(sql`CREATE INDEX \`reviews_user_idx\` ON \`reviews\` (\`user_id\`);`)
  await db.run(sql`CREATE INDEX \`reviews_updated_at_idx\` ON \`reviews\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`reviews_created_at_idx\` ON \`reviews\` (\`created_at\`);`)
}
