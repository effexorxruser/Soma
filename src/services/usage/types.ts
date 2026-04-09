export type UserPlan = 'free' | 'supporter' | 'plus';

export interface UsageCounterKey {
  userId: number;
  dateKey: string;
}

export interface UsageSnapshot {
  key: UsageCounterKey;
  messageCount: number;
}

export interface UsageLimitDecision {
  limit: number;
  used: number;
  remaining: number;
  exceeded: boolean;
}
