import * as migration_20260303_064707 from './20260303_064707';
import * as migration_20260408_043249 from './20260408_043249';

export const migrations = [
  {
    up: migration_20260303_064707.up,
    down: migration_20260303_064707.down,
    name: '20260303_064707',
  },
  {
    up: migration_20260408_043249.up,
    down: migration_20260408_043249.down,
    name: '20260408_043249'
  },
];
