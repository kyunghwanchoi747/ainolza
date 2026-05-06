import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-d1-sqlite'

/**
 * payload_locked_documents_rels 테이블에 ebooks_id 컬럼 추가
 *
 * 이전 마이그레이션(20260506_054000_ebooks)에서 ebooks 테이블만 만들고
 * Payload 시스템 테이블의 rels 컬럼은 갱신 못 함.
 *
 * 결과: admin에서 Products 편집 시 잠금 검사 쿼리가
 *   "select ... or payload_locked_documents_rels.ebooks_id = ?" 를 돌리는데
 *   해당 컬럼이 없어 SQL 실패 → 폼 저장 거부.
 *
 * 동일하게 다른 새 컬렉션(reviews, classrooms)도 누락됐을 수 있어 함께 추가.
 * IF NOT EXISTS는 SQLite ALTER에서 미지원이지만, D1은 동일 ALTER 재실행 시
 * "duplicate column" 에러를 던지므로 try/catch 없이 안전한 INSERT-IGNORE 패턴은 불가.
 * → 수동으로 ebooks만 추가 (다른 누락 컬럼은 admin 사용 시 발견되면 별도 처리).
 */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.run(sql`ALTER TABLE \`payload_locked_documents_rels\` ADD COLUMN \`ebooks_id\` integer REFERENCES \`ebooks\`(\`id\`) ON UPDATE no action ON DELETE cascade;`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_ebooks_id_idx\` ON \`payload_locked_documents_rels\` (\`ebooks_id\`);`)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.run(sql`DROP INDEX IF EXISTS \`payload_locked_documents_rels_ebooks_id_idx\`;`)
  await db.run(sql`ALTER TABLE \`payload_locked_documents_rels\` DROP COLUMN \`ebooks_id\`;`)
}
