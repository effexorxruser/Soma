import { describe, expect, it } from 'vitest';

import { createUsageService } from '../../../src/services/usage/service.js';
import type { UsageRepository } from '../../../src/services/usage/repository.js';

describe('usage service', () => {
  it('new user gets zero usage on first contact', () => {
    const repository: UsageRepository = {
      getDailyUsage: (key) => ({ key, messageCount: 0 }),
      incrementDailyUsage: (key) => ({ key, messageCount: 1 }),
    };

    const service = createUsageService(repository, 3);
    const snapshot = service.getDailySnapshot(10, new Date('2026-04-09T01:00:00.000Z'));

    expect(snapshot.messageCount).toBe(0);
  });

  it('usage limit triggers exactly at configured threshold', () => {
    const repository: UsageRepository = {
      getDailyUsage: (key) => ({ key, messageCount: 3 }),
      incrementDailyUsage: (key) => ({ key, messageCount: 4 }),
    };

    const service = createUsageService(repository, 3);
    const decision = service.getLimitDecision('free', 10, new Date('2026-04-09T01:00:00.000Z'));

    expect(decision.exceeded).toBe(true);
    expect(decision.remaining).toBe(0);
  });

  it('usage resets correctly on new date key', () => {
    const store = new Map<string, number>();
    const repository: UsageRepository = {
      getDailyUsage: (key) => ({
        key,
        messageCount: store.get(`${key.userId}:${key.dateKey}`) ?? 0,
      }),
      incrementDailyUsage: (key) => {
        const mapKey = `${key.userId}:${key.dateKey}`;
        const value = (store.get(mapKey) ?? 0) + 1;
        store.set(mapKey, value);

        return { key, messageCount: value };
      },
    };

    const service = createUsageService(repository, 2);
    const day1 = new Date('2026-04-09T10:00:00.000Z');
    const day2 = new Date('2026-04-10T10:00:00.000Z');

    service.incrementDailyUsage(10, day1);
    service.incrementDailyUsage(10, day1);

    expect(service.getDailySnapshot(10, day1).messageCount).toBe(2);
    expect(service.getDailySnapshot(10, day2).messageCount).toBe(0);
  });
});
