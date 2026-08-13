import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-d1-sqlite'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.run(sql`ALTER TABLE \`products\` ADD COLUMN \`display_category\` text DEFAULT 'class';`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  // SQLite doesn't easily drop columns before version 3.35.
}
