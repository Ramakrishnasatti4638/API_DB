import Database from 'better-sqlite3';

export type Db = Database.Database;

export function createConnection(path: string = process.env.DB_PATH ?? 'orders.db'): Db {
  const db = new Database(path);
  db.pragma('foreign_keys = ON');
  return db;
}
