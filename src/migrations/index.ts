import * as migration_20250929_111647 from './20250929_111647';
import * as migration_20260222_025332 from './20260222_025332';
import * as migration_20260222_notifications from './20260222_notifications';
import * as migration_20260222_pages from './20260222_pages';
import * as migration_20260222_locked_docs_fix from './20260222_locked_docs_fix';

export const migrations = [
  {
    up: migration_20250929_111647.up,
    down: migration_20250929_111647.down,
    name: '20250929_111647',
  },
  {
    up: migration_20260222_025332.up,
    down: migration_20260222_025332.down,
    name: '20260222_025332',
  },
  {
    up: migration_20260222_notifications.up,
    down: migration_20260222_notifications.down,
    name: '20260222_notifications',
  },
  {
    up: migration_20260222_pages.up,
    down: migration_20260222_pages.down,
    name: '20260222_pages',
  },
  {
    up: migration_20260222_locked_docs_fix.up,
    down: migration_20260222_locked_docs_fix.down,
    name: '20260222_locked_docs_fix',
  },
];
