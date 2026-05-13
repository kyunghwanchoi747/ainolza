import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-d1-sqlite'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  // 1) referrals 테이블
  await db.run(sql`CREATE TABLE \`referrals\` (
    \`id\` integer PRIMARY KEY NOT NULL,
    \`code\` text NOT NULL,
    \`user_id\` integer NOT NULL,
    \`status\` text DEFAULT 'active' NOT NULL,
    \`payout_bank\` text,
    \`payout_account_num\` text,
    \`payout_holder\` text,
    \`memo\` text,
    \`total_referrals\` numeric DEFAULT 0,
    \`total_reward_krw\` numeric DEFAULT 0,
    \`paid_out_krw\` numeric DEFAULT 0,
    \`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
    \`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
    FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );`)
  await db.run(sql`CREATE UNIQUE INDEX \`referrals_code_idx\` ON \`referrals\` (\`code\`);`)
  await db.run(sql`CREATE INDEX \`referrals_user_idx\` ON \`referrals\` (\`user_id\`);`)
  await db.run(sql`CREATE INDEX \`referrals_updated_at_idx\` ON \`referrals\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`referrals_created_at_idx\` ON \`referrals\` (\`created_at\`);`)

  // 2) coupons 테이블
  await db.run(sql`CREATE TABLE \`coupons\` (
    \`id\` integer PRIMARY KEY NOT NULL,
    \`code\` text NOT NULL,
    \`user_id\` integer NOT NULL,
    \`discount_type\` text DEFAULT 'percent' NOT NULL,
    \`discount_percent\` numeric,
    \`discount_amount\` numeric,
    \`source\` text DEFAULT 'referral',
    \`referral_code\` text,
    \`status\` text DEFAULT 'active' NOT NULL,
    \`expires_at\` text,
    \`redeemed_at\` text,
    \`redeemed_order_number\` text,
    \`memo\` text,
    \`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
    \`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
    FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );`)
  await db.run(sql`CREATE UNIQUE INDEX \`coupons_code_idx\` ON \`coupons\` (\`code\`);`)
  await db.run(sql`CREATE INDEX \`coupons_user_idx\` ON \`coupons\` (\`user_id\`);`)
  await db.run(sql`CREATE INDEX \`coupons_referral_code_idx\` ON \`coupons\` (\`referral_code\`);`)
  await db.run(sql`CREATE INDEX \`coupons_updated_at_idx\` ON \`coupons\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`coupons_created_at_idx\` ON \`coupons\` (\`created_at\`);`)

  // 3) orders에 추천·쿠폰 관련 컬럼 추가
  await db.run(sql`ALTER TABLE \`orders\` ADD COLUMN \`referred_by_code\` text;`)
  await db.run(sql`ALTER TABLE \`orders\` ADD COLUMN \`referrer_user_id\` integer REFERENCES \`users\`(\`id\`);`)
  await db.run(sql`ALTER TABLE \`orders\` ADD COLUMN \`referral_reward_krw\` numeric;`)
  await db.run(sql`ALTER TABLE \`orders\` ADD COLUMN \`referral_paid_out_at\` text;`)
  await db.run(sql`ALTER TABLE \`orders\` ADD COLUMN \`coupon_code\` text;`)
  await db.run(sql`ALTER TABLE \`orders\` ADD COLUMN \`coupon_discount_krw\` numeric;`)
  await db.run(sql`CREATE INDEX \`orders_referred_by_code_idx\` ON \`orders\` (\`referred_by_code\`);`)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.run(sql`DROP INDEX IF EXISTS \`orders_referred_by_code_idx\`;`)
  await db.run(sql`ALTER TABLE \`orders\` DROP COLUMN \`coupon_discount_krw\`;`)
  await db.run(sql`ALTER TABLE \`orders\` DROP COLUMN \`coupon_code\`;`)
  await db.run(sql`ALTER TABLE \`orders\` DROP COLUMN \`referral_paid_out_at\`;`)
  await db.run(sql`ALTER TABLE \`orders\` DROP COLUMN \`referral_reward_krw\`;`)
  await db.run(sql`ALTER TABLE \`orders\` DROP COLUMN \`referrer_user_id\`;`)
  await db.run(sql`ALTER TABLE \`orders\` DROP COLUMN \`referred_by_code\`;`)
  await db.run(sql`DROP TABLE IF EXISTS \`coupons\`;`)
  await db.run(sql`DROP TABLE IF EXISTS \`referrals\`;`)
}
