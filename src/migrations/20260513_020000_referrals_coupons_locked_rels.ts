import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-d1-sqlite'

/**
 * payload_locked_documents_rels 테이블에 referrals_id / coupons_id 컬럼 추가.
 *
 * 어제(2026-05-12) 추가한 20260512_020000_referrals_coupons 마이그레이션이
 * referrals/coupons 테이블 + orders 확장 컬럼은 만들었지만,
 * Payload 시스템 조인 테이블(payload_locked_documents_rels)에 두 컬렉션의 _id 컬럼을
 * 누락 → 워커가 잠금 검사 쿼리를 돌릴 때 SQL 실패 → /api/health dbWrite 503 + admin 폼 저장 거부.
 *
 * 같은 패턴: 20260506_080000_ebooks_locked_rels.ts, 20260513_010000_webhook_events_locked_rels.ts.
 *
 * 진단 경로: D1 콘솔에서 `SELECT sql FROM sqlite_master WHERE name='payload_locked_documents_rels';`
 * 로 테이블 정의를 보고 워커가 참조하는 17개 _id 컬럼 중 referrals_id, coupons_id 두 개가
 * 누락된 것을 확인.
 */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.run(sql`ALTER TABLE \`payload_locked_documents_rels\` ADD COLUMN \`referrals_id\` integer REFERENCES \`referrals\`(\`id\`) ON UPDATE no action ON DELETE cascade;`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_referrals_id_idx\` ON \`payload_locked_documents_rels\` (\`referrals_id\`);`)

  await db.run(sql`ALTER TABLE \`payload_locked_documents_rels\` ADD COLUMN \`coupons_id\` integer REFERENCES \`coupons\`(\`id\`) ON UPDATE no action ON DELETE cascade;`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_coupons_id_idx\` ON \`payload_locked_documents_rels\` (\`coupons_id\`);`)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.run(sql`DROP INDEX IF EXISTS \`payload_locked_documents_rels_coupons_id_idx\`;`)
  await db.run(sql`ALTER TABLE \`payload_locked_documents_rels\` DROP COLUMN \`coupons_id\`;`)
  await db.run(sql`DROP INDEX IF EXISTS \`payload_locked_documents_rels_referrals_id_idx\`;`)
  await db.run(sql`ALTER TABLE \`payload_locked_documents_rels\` DROP COLUMN \`referrals_id\`;`)
}
