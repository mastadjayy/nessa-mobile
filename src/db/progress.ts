import { getDb } from './index';

/** Today's date in the device's local time zone, as YYYY-MM-DD. Defines the streak "day". */
export function localDateString(date: Date = new Date()): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function awardXp(amount: number, source: 'lesson', refId: string | null = null): void {
  const now = new Date();
  getDb().runSync(
    'INSERT INTO xp_events (amount, source, ref_id, local_date, created_at) VALUES (?, ?, ?, ?, ?)',
    [amount, source, refId, localDateString(now), now.toISOString()],
  );
}

export function getTotalXp(): number {
  const row = getDb().getFirstSync<{ total: number }>(
    'SELECT COALESCE(SUM(amount), 0) AS total FROM xp_events',
  );
  return row?.total ?? 0;
}

export function getXpToday(): number {
  const row = getDb().getFirstSync<{ total: number }>(
    'SELECT COALESCE(SUM(amount), 0) AS total FROM xp_events WHERE local_date = ?',
    [localDateString()],
  );
  return row?.total ?? 0;
}

export function countCompletedLessons(): number {
  const row = getDb().getFirstSync<{ total: number }>(
    "SELECT COUNT(*) AS total FROM lesson_progress WHERE status = 'completed'",
  );
  return row?.total ?? 0;
}

/** Development helper: clears lesson progress and XP so the flow can be replayed. */
export function resetUserData(): void {
  const db = getDb();
  db.withTransactionSync(() => {
    db.runSync('DELETE FROM lesson_progress');
    db.runSync('DELETE FROM xp_events');
  });
}