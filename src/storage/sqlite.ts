import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { DatabaseSync } from 'node:sqlite';

export interface StorageDatabase {
  db: DatabaseSync;
  close: () => void;
}

export function createSqliteStorage(databasePath: string): StorageDatabase {
  const db = new DatabaseSync(databasePath);
  db.exec(loadSchemaSql());

  return {
    db,
    close: () => db.close(),
  };
}

function loadSchemaSql(): string {
  const currentFile = fileURLToPath(import.meta.url);
  const currentDir = dirname(currentFile);
  const schemaPath = resolve(currentDir, 'schema.sql');

  return readFileSync(schemaPath, 'utf-8');
}
