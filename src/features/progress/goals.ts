import type { DailyMinutes } from '@/types/profile';

/** Daily XP goal for each time commitment chosen in onboarding. */
export const DAILY_XP_GOAL: Record<DailyMinutes, number> = {
  5: 20,
  10: 40,
  15: 60,
};

export function dailyXpGoalFor(minutes: DailyMinutes | null): number {
  return minutes ? DAILY_XP_GOAL[minutes] : DAILY_XP_GOAL[5];
}