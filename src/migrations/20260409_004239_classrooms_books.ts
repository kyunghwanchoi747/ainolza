import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-d1-sqlite'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.run(sql`CREATE TABLE \`orders_classrooms\` (
  	\`order\` integer NOT NULL,
  	\`parent_id\` integer NOT NULL,
  	\`value\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`orders\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`orders_classrooms_order_idx\` ON \`orders_classrooms\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`orders_classrooms_parent_idx\` ON \`orders_classrooms\` (\`parent_id\`);`)
  await db.run(sql`CREATE TABLE \`orders_books\` (
  	\`order\` integer NOT NULL,
  	\`parent_id\` integer NOT NULL,
  	\`value\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`orders\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`orders_books_order_idx\` ON \`orders_books\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`orders_books_parent_idx\` ON \`orders_books\` (\`parent_id\`);`)
  // OAuth (google/kakao/naver) 컬럼은 별도 SQL 스크립트로 이미 적용됨 — 여기서 생략
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.run(sql`DROP TABLE \`orders_classrooms\`;`)
  await db.run(sql`DROP TABLE \`orders_books\`;`)
}
