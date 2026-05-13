import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-d1-sqlite'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.run(sql`CREATE TABLE \`webhook_events\` (
    \`id\` integer PRIMARY KEY NOT NULL,
    \`webhook_id\` text NOT NULL,
    \`source\` text DEFAULT 'portone' NOT NULL,
    \`event_type\` text,
    \`payment_id\` text,
    \`status\` text DEFAULT 'pending' NOT NULL,
    \`attempts\` numeric DEFAULT 1,
    \`last_error\` text,
    \`processed_at\` text,
    \`raw_payload\` text,
    \`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
    \`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
  );`)
  await db.run(sql`CREATE UNIQUE INDEX \`webhook_events_webhook_id_idx\` ON \`webhook_events\` (\`webhook_id\`);`)
  await db.run(sql`CREATE INDEX \`webhook_events_event_type_idx\` ON \`webhook_events\` (\`event_type\`);`)
  await db.run(sql`CREATE INDEX \`webhook_events_payment_id_idx\` ON \`webhook_events\` (\`payment_id\`);`)
  await db.run(sql`CREATE INDEX \`webhook_events_updated_at_idx\` ON \`webhook_events\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`webhook_events_created_at_idx\` ON \`webhook_events\` (\`created_at\`);`)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.run(sql`DROP TABLE IF EXISTS \`webhook_events\`;`)
}
