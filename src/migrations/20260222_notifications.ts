import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-d1-sqlite'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.run(sql`CREATE TABLE IF NOT EXISTS \`notifications\` (
    \`id\` integer PRIMARY KEY NOT NULL,
    \`type\` text NOT NULL,
    \`title\` text NOT NULL,
    \`body\` text,
    \`is_read\` integer DEFAULT false,
    \`related_id\` text,
    \`href\` text,
    \`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
    \`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
  );`)
  await db.run(
    sql`CREATE INDEX IF NOT EXISTS \`notifications_updated_at_idx\` ON \`notifications\` (\`updated_at\`);`,
  )
  await db.run(
    sql`CREATE INDEX IF NOT EXISTS \`notifications_created_at_idx\` ON \`notifications\` (\`created_at\`);`,
  )
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.run(sql`DROP TABLE IF EXISTS \`notifications\`;`)
}
