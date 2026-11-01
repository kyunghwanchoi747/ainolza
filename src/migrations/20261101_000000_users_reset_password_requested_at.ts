import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-d1-sqlite'

// Payload 3.92: auth 컬렉션에 resetPasswordRequestedAt(비밀번호 재설정 요청 간격 제한) 필드 추가.
// users 조회 시 항상 함께 select 되므로 컬럼이 없으면 로그인·어드민 접근이 실패한다.
export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.run(sql`ALTER TABLE \`users\` ADD COLUMN \`reset_password_requested_at\` text;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  // SQLite doesn't easily drop columns before version 3.35.
}
