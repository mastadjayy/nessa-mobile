import { useMemo } from 'react';

import { countCompletedLessons, getStreak, getTotalXp, getXpToday } from '@/db/progress';
import { useRefreshOnFocus } from '@/hooks/useRefreshOnFocus';

/** XP, streak and completed lessons, re-read whenever the screen is focused. */
export function useProgressSummary() {
  const version = useRefreshOnFocus();

  return useMemo(
    () => ({
      totalXp: getTotalXp(),
      xpToday: getXpToday(),
      streak: getStreak(),
      completedLessons: countCompletedLessons(),
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [version],
  );
}