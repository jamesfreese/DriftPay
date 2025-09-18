
import { Kysely, SqliteDialect } from 'kysely';
import Database from 'better-sqlite3';
import { DB } from './types';

const dialect = new SqliteDialect({
  database: new Database(process.env.DATA_DIRECTORY ? `${process.env.DATA_DIRECTORY}/database.sqlite` : 'data/database.sqlite'),
});

export const db = new Kysely<DB>({
  dialect,
  log: ['query', 'error'],
});
