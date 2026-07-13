import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-d1-sqlite'

/**
 * ClassroomProgress 컬렉션 신설 — VOD 진도율 추적.
 *
 * 새 컬렉션을 추가할 때는 두 가지를 항상 같이 한다:
 *  1) 컬렉션 본 테이블 생성 (배열 필드 completedSessions는 별도 테이블)
 *  2) payload_locked_documents_rels 에 해당 컬렉션의 _id 컬럼 + 인덱스 추가
 *
 * 스키마는 로컬 dev.db에서 Payload가 자동 생성한 것을 그대로 옮김.
 */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.run(sql`CREATE TABLE \`classroom_progress\` (
    \`id\` integer PRIMARY KEY NOT NULL,
    \`user_id\` integer NOT NULL,
    \`classroom_id\` integer NOT NULL,
    \`progress_percent\` numeric DEFAULT 0 NOT NULL,
    \`last_accessed_at\` text,
    \`memo\` text,
    \`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
    \`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
    FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE set null,
    FOREIGN KEY (\`classroom_id\`) REFERENCES \`classrooms\`(\`id\`) ON UPDATE no action ON DELETE set null
  );`)
  await db.run(sql`CREATE INDEX \`classroom_progress_user_idx\` ON \`classroom_progress\` (\`user_id\`);`)
  await db.run(sql`CREATE INDEX \`classroom_progress_classroom_idx\` ON \`classroom_progress\` (\`classroom_id\`);`)
  await db.run(sql`CREATE INDEX \`classroom_progress_updated_at_idx\` ON \`classroom_progress\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`classroom_progress_created_at_idx\` ON \`classroom_progress\` (\`created_at\`);`)

  // 배열 필드 completedSessions — Payload가 별도 테이블로 저장
  await db.run(sql`CREATE TABLE \`classroom_progress_completed_sessions\` (
    \`_order\` integer NOT NULL,
    \`_parent_id\` integer NOT NULL,
    \`id\` text PRIMARY KEY NOT NULL,
    \`session_number\` numeric NOT NULL,
    \`completed_at\` text NOT NULL,
    FOREIGN KEY (\`_parent_id\`) REFERENCES \`classroom_progress\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );`)
  await db.run(sql`CREATE INDEX \`classroom_progress_completed_sessions_order_idx\` ON \`classroom_progress_completed_sessions\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`classroom_progress_completed_sessions_parent_id_idx\` ON \`classroom_progress_completed_sessions\` (\`_parent_id\`);`)

  // 같이 처리 — payload_locked_documents_rels에 컬럼 추가 (누락 시 admin 저장 거부 사고)
  await db.run(sql`ALTER TABLE \`payload_locked_documents_rels\` ADD COLUMN \`classroom_progress_id\` integer REFERENCES \`classroom_progress\`(\`id\`) ON UPDATE no action ON DELETE cascade;`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_classroom_progress_id_idx\` ON \`payload_locked_documents_rels\` (\`classroom_progress_id\`);`)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.run(sql`DROP INDEX IF EXISTS \`payload_locked_documents_rels_classroom_progress_id_idx\`;`)
  await db.run(sql`ALTER TABLE \`payload_locked_documents_rels\` DROP COLUMN \`classroom_progress_id\`;`)
  await db.run(sql`DROP TABLE IF EXISTS \`classroom_progress_completed_sessions\`;`)
  await db.run(sql`DROP TABLE IF EXISTS \`classroom_progress\`;`)
}
