import { openDatabaseSync, type SQLiteDatabase } from 'expo-sqlite';

import { MIGRATIONS } from './schema';
import { seedContent } from './seed';

const DATABASE_NAME = 'nessa.db';

let database: SQLiteDatabase | null = null;

function migrate(db: SQLiteDatabase): void {
  const row = db.getFirstSync<{ user_version: number }>('PRAGMA user_version');
  const currentVersion = row?.user_version ?? 0;

  for (let version = currentVersion; version < MIGRATIONS.length; version++) {
    db.withTransactionSync(() => {
      db.execSync(MIGRATIONS[version]);
    });
    db.execSync(`PRAGMA user_version = ${version + 1}`);
  }
}

/**
 * Returns the app database, opening, migrating and seeding it on first use.
 * Everything is synchronous and small, so this is safe to call from anywhere.
 */
export function getDb(): SQLiteDatabase {
  if (!database) {
    const db = openDatabaseSync(DATABASE_NAME);
    db.execSync('PRAGMA journal_mode = WAL;');
    db.execSync('PRAGMA foreign_keys = ON;');
    migrate(db);
    seedContent(db);
    database = db;
  }
  return database;
}