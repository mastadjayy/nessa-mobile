export type Streak = {
  /** Consecutive days with learning, counting back from today (or yesterday). */
  current: number;
  longest: number;
  activeToday: boolean;
};

const DAY_MS = 86_400_000;

/** 'YYYY-MM-DD' to a whole number of days, independent of time zones and daylight saving. */
function dayNumber(date: string): number {
  const [year, month, day] = date.split('-').map(Number);
  return Math.round(Date.UTC(year, month - 1, day) / DAY_MS);
}

/**
 * Works out the streak from the local dates on which the learner earned XP.
 * A streak stays alive until the end of the day after the last active day, so a
 * learner who was active yesterday but not yet today still has their streak.
 */
export function computeStreak(activeDates: string[], today: string): Streak {
  const days = [...new Set(activeDates.map(dayNumber))].sort((a, b) => b - a);
  if (days.length === 0) return { current: 0, longest: 0, activeToday: false };

  const todayNumber = dayNumber(today);

  let longest = 1;
  let run = 1;
  for (let i = 1; i < days.length; i++) {
    run = days[i - 1] - days[i] === 1 ? run + 1 : 1;
    longest = Math.max(longest, run);
  }

  let current = 0;
  if (days[0] === todayNumber || days[0] === todayNumber - 1) {
    current = 1;
    for (let i = 1; i < days.length && days[i - 1] - days[i] === 1; i++) current++;
  }

  return { current, longest, activeToday: days.includes(todayNumber) };
}