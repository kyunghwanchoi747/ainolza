import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-d1-sqlite'

/**
 * EmailTemplates(메일 문구 어드민 관리) + EmailLogs(발송 이력) 컬렉션 신설.
 * EmailLogs는 코드상 이미 존재했으나 payload.config.ts의 collections 배열에
 * 등록이 누락되어 있어 실제 테이블이 없었음 — 이번에 함께 생성.
 */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.run(sql`CREATE TABLE \`email_templates\` (
    \`id\` integer PRIMARY KEY NOT NULL,
    \`key\` text NOT NULL,
    \`subject\` text,
    \`greeting\` text,
    \`closing\` text,
    \`body\` text,
    \`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
    \`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
  );`)
  await db.run(sql`CREATE UNIQUE INDEX \`email_templates_key_idx\` ON \`email_templates\` (\`key\`);`)
  await db.run(sql`CREATE INDEX \`email_templates_updated_at_idx\` ON \`email_templates\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`email_templates_created_at_idx\` ON \`email_templates\` (\`created_at\`);`)

  await db.run(sql`CREATE TABLE \`email_logs\` (
    \`id\` integer PRIMARY KEY NOT NULL,
    \`recipient\` text NOT NULL,
    \`subject\` text NOT NULL,
    \`type\` text,
    \`status\` text DEFAULT 'sent',
    \`error\` text,
    \`related_id\` text,
    \`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
    \`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
  );`)
  await db.run(sql`CREATE INDEX \`email_logs_recipient_idx\` ON \`email_logs\` (\`recipient\`);`)
  await db.run(sql`CREATE INDEX \`email_logs_type_idx\` ON \`email_logs\` (\`type\`);`)
  await db.run(sql`CREATE INDEX \`email_logs_updated_at_idx\` ON \`email_logs\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`email_logs_created_at_idx\` ON \`email_logs\` (\`created_at\`);`)

  // payload_locked_documents_rels — 누락 시 어드민 잠금 검사 쿼리가 깨짐(과거 사고 이력 있음)
  await db.run(sql`ALTER TABLE \`payload_locked_documents_rels\` ADD COLUMN \`email_templates_id\` integer REFERENCES \`email_templates\`(\`id\`) ON UPDATE no action ON DELETE cascade;`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_email_templates_id_idx\` ON \`payload_locked_documents_rels\` (\`email_templates_id\`);`)
  await db.run(sql`ALTER TABLE \`payload_locked_documents_rels\` ADD COLUMN \`email_logs_id\` integer REFERENCES \`email_logs\`(\`id\`) ON UPDATE no action ON DELETE cascade;`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_email_logs_id_idx\` ON \`payload_locked_documents_rels\` (\`email_logs_id\`);`)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.run(sql`DROP INDEX IF EXISTS \`payload_locked_documents_rels_email_logs_id_idx\`;`)
  await db.run(sql`ALTER TABLE \`payload_locked_documents_rels\` DROP COLUMN \`email_logs_id\`;`)
  await db.run(sql`DROP INDEX IF EXISTS \`payload_locked_documents_rels_email_templates_id_idx\`;`)
  await db.run(sql`ALTER TABLE \`payload_locked_documents_rels\` DROP COLUMN \`email_templates_id\`;`)
  await db.run(sql`DROP TABLE IF EXISTS \`email_logs\`;`)
  await db.run(sql`DROP TABLE IF EXISTS \`email_templates\`;`)
}
