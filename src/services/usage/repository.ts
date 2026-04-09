import type { DatabaseSync } from 'node:sqlite';

import type { UsageCounterKey, UsageSnapshot } from './types.js';

export interface UsageRepository {
  getDailyUsage: (key: UsageCounterKey) => UsageSnapshot;
  incrementDailyUsage: (key: UsageCounterKey) => UsageSnapshot;
}

interface UsageRow {
  user_id: number;
  date_key: string;
  message_count: number;
}

export function createSqliteUsageRepository(db: DatabaseSync): UsageRepository {
  const getDailyUsage = (key: UsageCounterKey): UsageSnapshot => {
    const row = db
      .prepare(
        'SELECT user_id, date_key, message_count FROM daily_usage WHERE user_id = ? AND date_key = ?',
      )
      .get(key.userId, key.dateKey) as UsageRow | undefined;

    return row
      ? mapRow(row)
      : {
          key,
          messageCount: 0,
        };
  };

  const incrementDailyUsage = (key: UsageCounterKey): UsageSnapshot => {
    db.prepare(
      `INSERT INTO daily_usage (user_id, date_key, message_count)
       VALUES (?, ?, 1)
       ON CONFLICT(user_id, date_key) DO UPDATE SET message_count = message_count + 1`,
    ).run(key.userId, key.dateKey);

    return getDailyUsage(key);
  };

  return {
    getDailyUsage,
    incrementDailyUsage,
  };
}

function mapRow(row: UsageRow): UsageSnapshot {
  return {
    key: {
      userId: row.user_id,
      dateKey: row.date_key,
    },
    messageCount: row.message_count,
  };
}
