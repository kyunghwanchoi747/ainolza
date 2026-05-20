import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-d1-sqlite'

/**
 * Waitlists 컬렉션 신설.
 *
 * 새 컬렉션을 추가할 때는 두 가지를 항상 같이 한다:
 *  1) 컬렉션 본 테이블 생성
 *  2) payload_locked_documents_rels 에 해당 컬렉션의 _id 컬럼 + 인덱스 추가
 *
 * 2번을 빠뜨리면 워커가 잠금 검사 쿼리에서 SQL 실패 → /api/health dbWrite 503 + admin 폼 저장 거부.
 * (2026-05-13 동일 사고 — webhook_events / referrals / coupons에서 같은 누락 발생)
 */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.run(sql`CREATE TABLE \`waitlists\` (
    \`id\` integer PRIMARY KEY NOT NULL,
    \`product_slug\` text NOT NULL,
    \`product_name\` text,
    \`buyer_name\` text NOT NULL,
    \`buyer_email\` text NOT NULL,
    \`buyer_phone\` text,
    \`motivation\` text,
    \`user_id\` integer REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE set null,
    \`status\` text DEFAULT 'active' NOT NULL,
    \`notified_at\` text,
    \`source\` text,
    \`admin_memo\` text,
    \`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
    \`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
  );`)
  await db.run(sql`CREATE INDEX \`waitlists_product_slug_idx\` ON \`waitlists\` (\`product_slug\`);`)
  await db.run(sql`CREATE INDEX \`waitlists_buyer_email_idx\` ON \`waitlists\` (\`buyer_email\`);`)
  await db.run(sql`CREATE INDEX \`waitlists_status_idx\` ON \`waitlists\` (\`status\`);`)
  await db.run(sql`CREATE INDEX \`waitlists_updated_at_idx\` ON \`waitlists\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`waitlists_created_at_idx\` ON \`waitlists\` (\`created_at\`);`)

  // 같이 처리 — payload_locked_documents_rels에 컬럼 추가
  await db.run(sql`ALTER TABLE \`payload_locked_documents_rels\` ADD COLUMN \`waitlists_id\` integer REFERENCES \`waitlists\`(\`id\`) ON UPDATE no action ON DELETE cascade;`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_waitlists_id_idx\` ON \`payload_locked_documents_rels\` (\`waitlists_id\`);`)

  // products 테이블에 대기 신청 모드 컬럼 추가
  await db.run(sql`ALTER TABLE \`products\` ADD COLUMN \`waitlist_mode\` numeric DEFAULT false;`)
  await db.run(sql`ALTER TABLE \`products\` ADD COLUMN \`waitlist_notice\` text;`)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.run(sql`ALTER TABLE \`products\` DROP COLUMN \`waitlist_notice\`;`)
  await db.run(sql`ALTER TABLE \`products\` DROP COLUMN \`waitlist_mode\`;`)
  await db.run(sql`DROP INDEX IF EXISTS \`payload_locked_documents_rels_waitlists_id_idx\`;`)
  await db.run(sql`ALTER TABLE \`payload_locked_documents_rels\` DROP COLUMN \`waitlists_id\`;`)
  await db.run(sql`DROP TABLE IF EXISTS \`waitlists\`;`)
}
