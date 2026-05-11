import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-d1-sqlite'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.run(sql`ALTER TABLE \`orders\` ADD COLUMN \`refund_bank\` text;`)
  await db.run(sql`ALTER TABLE \`orders\` ADD COLUMN \`refund_account_num\` text;`)
  await db.run(sql`ALTER TABLE \`orders\` ADD COLUMN \`refund_account_holder\` text;`)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.run(sql`ALTER TABLE \`orders\` DROP COLUMN \`refund_bank\`;`)
  await db.run(sql`ALTER TABLE \`orders\` DROP COLUMN \`refund_account_num\`;`)
  await db.run(sql`ALTER TABLE \`orders\` DROP COLUMN \`refund_account_holder\`;`)
}
