import type { DatabaseSync } from 'node:sqlite';

import type { UserPlan, UserProfile } from './types.js';

export interface UserRepository {
  getByUserId: (userId: number) => UserProfile | null;
  createIfMissing: (userId: number, plan?: UserPlan) => UserProfile;
}

interface UserRow {
  user_id: number;
  plan: UserPlan;
  created_at: string;
  updated_at: string;
}

export function createSqliteUserRepository(db: DatabaseSync): UserRepository {
  return {
    getByUserId: (userId) => {
      const row = db
        .prepare('SELECT user_id, plan, created_at, updated_at FROM users WHERE user_id = ?')
        .get(userId) as UserRow | undefined;

      return row ? mapRow(row) : null;
    },
    createIfMissing: (userId, plan = 'free') => {
      const now = new Date().toISOString();

      db.prepare(
        `INSERT INTO users (user_id, plan, created_at, updated_at)
         VALUES (?, ?, ?, ?)
         ON CONFLICT(user_id) DO UPDATE SET updated_at = excluded.updated_at`,
      ).run(userId, plan, now, now);

      const row = db
        .prepare('SELECT user_id, plan, created_at, updated_at FROM users WHERE user_id = ?')
        .get(userId) as UserRow;

      return mapRow(row);
    },
  };
}

function mapRow(row: UserRow): UserProfile {
  return {
    userId: row.user_id,
    plan: row.plan,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}
