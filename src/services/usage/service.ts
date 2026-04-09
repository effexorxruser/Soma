import type { UserPlan } from '../users/types.js';
import type { UsageRepository } from './repository.js';
import type { UsageLimitDecision, UsageSnapshot } from './types.js';

export interface UsageService {
  getDailySnapshot: (userId: number, date?: Date) => UsageSnapshot;
  getLimitDecision: (plan: UserPlan, userId: number, date?: Date) => UsageLimitDecision;
  incrementDailyUsage: (userId: number, date?: Date) => UsageSnapshot;
}

export function createUsageService(
  repository: UsageRepository,
  freeDailyMessageLimit: number,
): UsageService {
  return {
    getDailySnapshot: (userId, date = new Date()) => repository.getDailyUsage(makeKey(userId, date)),
    getLimitDecision: (plan, userId, date = new Date()) => {
      const snapshot = repository.getDailyUsage(makeKey(userId, date));
      const limit = resolveDailyLimit(plan, freeDailyMessageLimit);
      const remaining = Math.max(0, limit - snapshot.messageCount);

      return {
        limit,
        used: snapshot.messageCount,
        remaining,
        exceeded: snapshot.messageCount >= limit,
      };
    },
    incrementDailyUsage: (userId, date = new Date()) => repository.incrementDailyUsage(makeKey(userId, date)),
  };
}

function makeKey(userId: number, date: Date) {
  return {
    userId,
    dateKey: date.toISOString().slice(0, 10),
  };
}

function resolveDailyLimit(plan: UserPlan, freeDailyMessageLimit: number): number {
  if (plan === 'free') {
    return freeDailyMessageLimit;
  }

  return freeDailyMessageLimit;
}
