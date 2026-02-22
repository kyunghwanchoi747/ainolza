import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-d1-sqlite'

/**
 * Fix: payload_locked_documents_rels was missing columns for all collections
 * added after the initial migration. This causes "no such column" errors
 * whenever Payload checks document lock status before updates.
 */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  const tryRun = async (query: Parameters<typeof db.run>[0]) => {
    try { await db.run(query) } catch { /* already exists — skip */ }
  }

  // Add missing FK columns
  await tryRun(sql`ALTER TABLE \`payload_locked_documents_rels\` ADD COLUMN \`products_id\` integer REFERENCES \`products\`(\`id\`) ON DELETE cascade`)
  await tryRun(sql`ALTER TABLE \`payload_locked_documents_rels\` ADD COLUMN \`reviews_id\` integer REFERENCES \`reviews\`(\`id\`) ON DELETE cascade`)
  await tryRun(sql`ALTER TABLE \`payload_locked_documents_rels\` ADD COLUMN \`orders_id\` text REFERENCES \`orders\`(\`id\`) ON DELETE cascade`)
  await tryRun(sql`ALTER TABLE \`payload_locked_documents_rels\` ADD COLUMN \`programs_id\` integer REFERENCES \`programs\`(\`id\`) ON DELETE cascade`)
  await tryRun(sql`ALTER TABLE \`payload_locked_documents_rels\` ADD COLUMN \`courses_id\` integer REFERENCES \`courses\`(\`id\`) ON DELETE cascade`)
  await tryRun(sql`ALTER TABLE \`payload_locked_documents_rels\` ADD COLUMN \`posts_id\` integer REFERENCES \`posts\`(\`id\`) ON DELETE cascade`)
  await tryRun(sql`ALTER TABLE \`payload_locked_documents_rels\` ADD COLUMN \`community_posts_id\` integer REFERENCES \`community_posts\`(\`id\`) ON DELETE cascade`)
  await tryRun(sql`ALTER TABLE \`payload_locked_documents_rels\` ADD COLUMN \`comments_id\` integer REFERENCES \`comments\`(\`id\`) ON DELETE cascade`)
  await tryRun(sql`ALTER TABLE \`payload_locked_documents_rels\` ADD COLUMN \`categories_id\` integer REFERENCES \`categories\`(\`id\`) ON DELETE cascade`)
  await tryRun(sql`ALTER TABLE \`payload_locked_documents_rels\` ADD COLUMN \`inquiries_id\` integer REFERENCES \`inquiries\`(\`id\`) ON DELETE cascade`)
  await tryRun(sql`ALTER TABLE \`payload_locked_documents_rels\` ADD COLUMN \`site_stats_id\` integer REFERENCES \`site_stats\`(\`id\`) ON DELETE cascade`)
  await tryRun(sql`ALTER TABLE \`payload_locked_documents_rels\` ADD COLUMN \`notifications_id\` integer REFERENCES \`notifications\`(\`id\`) ON DELETE cascade`)
  await tryRun(sql`ALTER TABLE \`payload_locked_documents_rels\` ADD COLUMN \`pages_id\` integer REFERENCES \`pages\`(\`id\`) ON DELETE cascade`)

  // Add indexes (IF NOT EXISTS to be safe)
  await tryRun(sql`CREATE INDEX IF NOT EXISTS \`payload_locked_documents_rels_products_id_idx\` ON \`payload_locked_documents_rels\` (\`products_id\`)`)
  await tryRun(sql`CREATE INDEX IF NOT EXISTS \`payload_locked_documents_rels_reviews_id_idx\` ON \`payload_locked_documents_rels\` (\`reviews_id\`)`)
  await tryRun(sql`CREATE INDEX IF NOT EXISTS \`payload_locked_documents_rels_orders_id_idx\` ON \`payload_locked_documents_rels\` (\`orders_id\`)`)
  await tryRun(sql`CREATE INDEX IF NOT EXISTS \`payload_locked_documents_rels_programs_id_idx\` ON \`payload_locked_documents_rels\` (\`programs_id\`)`)
  await tryRun(sql`CREATE INDEX IF NOT EXISTS \`payload_locked_documents_rels_courses_id_idx\` ON \`payload_locked_documents_rels\` (\`courses_id\`)`)
  await tryRun(sql`CREATE INDEX IF NOT EXISTS \`payload_locked_documents_rels_posts_id_idx\` ON \`payload_locked_documents_rels\` (\`posts_id\`)`)
  await tryRun(sql`CREATE INDEX IF NOT EXISTS \`payload_locked_documents_rels_community_posts_id_idx\` ON \`payload_locked_documents_rels\` (\`community_posts_id\`)`)
  await tryRun(sql`CREATE INDEX IF NOT EXISTS \`payload_locked_documents_rels_comments_id_idx\` ON \`payload_locked_documents_rels\` (\`comments_id\`)`)
  await tryRun(sql`CREATE INDEX IF NOT EXISTS \`payload_locked_documents_rels_categories_id_idx\` ON \`payload_locked_documents_rels\` (\`categories_id\`)`)
  await tryRun(sql`CREATE INDEX IF NOT EXISTS \`payload_locked_documents_rels_inquiries_id_idx\` ON \`payload_locked_documents_rels\` (\`inquiries_id\`)`)
  await tryRun(sql`CREATE INDEX IF NOT EXISTS \`payload_locked_documents_rels_site_stats_id_idx\` ON \`payload_locked_documents_rels\` (\`site_stats_id\`)`)
  await tryRun(sql`CREATE INDEX IF NOT EXISTS \`payload_locked_documents_rels_notifications_id_idx\` ON \`payload_locked_documents_rels\` (\`notifications_id\`)`)
  await tryRun(sql`CREATE INDEX IF NOT EXISTS \`payload_locked_documents_rels_pages_id_idx\` ON \`payload_locked_documents_rels\` (\`pages_id\`)`)
}

export async function down(_args: MigrateDownArgs): Promise<void> {
  // SQLite does not support DROP COLUMN — cannot revert this migration
}
