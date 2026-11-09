import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-d1-sqlite'

// Payload 3.92 스토리지 플러그인: media/ebooks 에 _objectKey 필드 추가.
// 컬럼이 없으면 R2 경로가 어긋나 /api/media/file/* 가 404 가 된다. NULL 이면 기존처럼 루트 경로로 조회.
export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.run(sql`ALTER TABLE \`media\` ADD COLUMN \`_object_key\` text;`)
  await db.run(sql`ALTER TABLE \`ebooks\` ADD COLUMN \`_object_key\` text;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  // SQLite doesn't easily drop columns before version 3.35.
}
