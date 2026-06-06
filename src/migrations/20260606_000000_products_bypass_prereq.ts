import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-d1-sqlite'

/**
 * products 테이블에 bypass_prerequisite 컬럼 추가.
 *
 * 용도: 심화 단독 결제처럼 선수강(prerequisite) 정책이 걸린 상품에서
 * 어드민이 임시로 정책을 풀고 싶을 때 사용. 체크박스 ON이면 누구나 결제 가능.
 *
 * checkEligibility() 가 이 플래그를 보고 prerequisite 검사를 우회.
 */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.run(sql`ALTER TABLE \`products\` ADD COLUMN \`bypass_prerequisite\` numeric DEFAULT false;`)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.run(sql`ALTER TABLE \`products\` DROP COLUMN \`bypass_prerequisite\`;`)
}
