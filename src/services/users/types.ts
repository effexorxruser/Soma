export type UserPlan = 'free' | 'supporter' | 'plus';

export interface UserProfile {
  userId: number;
  plan: UserPlan;
  createdAt: string;
  updatedAt: string;
}
