import * as migration_20260303_064707 from './20260303_064707';
import * as migration_20260408_043249 from './20260408_043249';
import * as migration_20260409_004239_classrooms_books from './20260409_004239_classrooms_books';
import * as migration_20260409_065546_products_extended from './20260409_065546_products_extended';
import * as migration_20260502_034500_reviews_displayname from './20260502_034500_reviews_displayname';
import * as migration_20260506_054000_ebooks from './20260506_054000_ebooks';
import * as migration_20260506_080000_ebooks_locked_rels from './20260506_080000_ebooks_locked_rels';

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
];
