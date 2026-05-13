import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-d1-sqlite'

/**
 * payload_locked_documents_rels 테이블에 webhook_events_id 컬럼 추가.
 *
 * 직전 마이그레이션(20260513_000000_webhook_events)에서 webhook_events 테이블만
 * 만들고 Payload 시스템 테이블의 rels 컬럼은 갱신 못 함.
 *
 * 결과: 어떤 컬렉션이든 admin에서 편집 시 잠금 검사 쿼리가
 *   "select ... or payload_locked_documents_rels.webhook_events_id = ?" 를 돌리는데
 *   해당 컬럼이 없어 SQL 실패 → /api/health의 dbWrite 체크 503 + admin 폼 저장 거부.
 *
 * 패턴: 20260506_080000_ebooks_locked_rels.ts와 동일.
 */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.run(sql`ALTER TABLE \`payload_locked_documents_rels\` ADD COLUMN \`webhook_events_id\` integer REFERENCES \`webhook_events\`(\`id\`) ON UPDATE no action ON DELETE cascade;`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_webhook_events_id_idx\` ON \`payload_locked_documents_rels\` (\`webhook_events_id\`);`)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.run(sql`DROP INDEX IF EXISTS \`payload_locked_documents_rels_webhook_events_id_idx\`;`)
  await db.run(sql`ALTER TABLE \`payload_locked_documents_rels\` DROP COLUMN \`webhook_events_id\`;`)
}
