import * as migration_20260303_064707 from './20260303_064707';
import * as migration_20260408_043249 from './20260408_043249';
import * as migration_20260409_004239_classrooms_books from './20260409_004239_classrooms_books';
import * as migration_20260409_065546_products_extended from './20260409_065546_products_extended';
import * as migration_20260502_034500_reviews_displayname from './20260502_034500_reviews_displayname';
import * as migration_20260506_054000_ebooks from './20260506_054000_ebooks';
import * as migration_20260506_080000_ebooks_locked_rels from './20260506_080000_ebooks_locked_rels';
import * as migration_20260507_000000_orders_paid_at from './20260507_000000_orders_paid_at';
import * as migration_20260508_000000_products_price_schedule from './20260508_000000_products_price_schedule';
import * as migration_20260512_000000_orders_depositor_name from './20260512_000000_orders_depositor_name';
import * as migration_20260512_010000_orders_refund_account from './20260512_010000_orders_refund_account';
import * as migration_20260512_020000_referrals_coupons from './20260512_020000_referrals_coupons';
import * as migration_20260513_000000_webhook_events from './20260513_000000_webhook_events';
import * as migration_20260513_010000_webhook_events_locked_rels from './20260513_010000_webhook_events_locked_rels';
import * as migration_20260513_020000_referrals_coupons_locked_rels from './20260513_020000_referrals_coupons_locked_rels';
import * as migration_20260519_000000_waitlists from './20260519_000000_waitlists';
import * as migration_20260606_000000_products_bypass_prereq from './20260606_000000_products_bypass_prereq';

export const migrations = [
  {
    up: migration_20260303_064707.up,
    down: migration_20260303_064707.down,
    name: '20260303_064707',
  },
  {
    up: migration_20260408_043249.up,
    down: migration_20260408_043249.down,
    name: '20260408_043249',
  },
  {
    up: migration_20260409_004239_classrooms_books.up,
    down: migration_20260409_004239_classrooms_books.down,
    name: '20260409_004239_classrooms_books',
  },
  {
    up: migration_20260409_065546_products_extended.up,
    down: migration_20260409_065546_products_extended.down,
    name: '20260409_065546_products_extended'
  },
  {
    up: migration_20260502_034500_reviews_displayname.up,
    down: migration_20260502_034500_reviews_displayname.down,
    name: '20260502_034500_reviews_displayname'
  },
  {
    up: migration_20260506_054000_ebooks.up,
    down: migration_20260506_054000_ebooks.down,
    name: '20260506_054000_ebooks'
  },
  {
    up: migration_20260506_080000_ebooks_locked_rels.up,
    down: migration_20260506_080000_ebooks_locked_rels.down,
    name: '20260506_080000_ebooks_locked_rels'
  },
  {
    up: migration_20260507_000000_orders_paid_at.up,
    down: migration_20260507_000000_orders_paid_at.down,
    name: '20260507_000000_orders_paid_at'
  },
  {
    up: migration_20260508_000000_products_price_schedule.up,
    down: migration_20260508_000000_products_price_schedule.down,
    name: '20260508_000000_products_price_schedule'
  },
  {
    up: migration_20260512_000000_orders_depositor_name.up,
    down: migration_20260512_000000_orders_depositor_name.down,
    name: '20260512_000000_orders_depositor_name'
  },
  {
    up: migration_20260512_010000_orders_refund_account.up,
    down: migration_20260512_010000_orders_refund_account.down,
    name: '20260512_010000_orders_refund_account'
  },
  {
    up: migration_20260512_020000_referrals_coupons.up,
    down: migration_20260512_020000_referrals_coupons.down,
    name: '20260512_020000_referrals_coupons'
  },
  {
    up: migration_20260513_000000_webhook_events.up,
    down: migration_20260513_000000_webhook_events.down,
    name: '20260513_000000_webhook_events'
  },
  {
    up: migration_20260513_010000_webhook_events_locked_rels.up,
    down: migration_20260513_010000_webhook_events_locked_rels.down,
    name: '20260513_010000_webhook_events_locked_rels'
  },
  {
    up: migration_20260513_020000_referrals_coupons_locked_rels.up,
    down: migration_20260513_020000_referrals_coupons_locked_rels.down,
    name: '20260513_020000_referrals_coupons_locked_rels'
  },
  {
    up: migration_20260519_000000_waitlists.up,
    down: migration_20260519_000000_waitlists.down,
    name: '20260519_000000_waitlists'
  },
  {
    up: migration_20260606_000000_products_bypass_prereq.up,
    down: migration_20260606_000000_products_bypass_prereq.down,
    name: '20260606_000000_products_bypass_prereq'
  },
];
