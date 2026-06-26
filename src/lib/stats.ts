import { TRAINING_DAYS } from '@/data/program';
import { bestSet, est1RM, sessionVolume } from '@/lib/prs';
import { WorkoutSession } from '@/types';

const DAY_MS = 86400000;

function dayKey(d: Date): string {
  return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
}

/** Consecutive-day workout streak ending today (or yesterday). */
export function currentStreak(sessions: WorkoutSession[], now: Date = new Date()): number {
  if (sessions.length === 0) return 0;
  const days = new Set(sessions.map((s) => dayKey(new Date(s.dateISO))));
  let streak = 0;
  const cursor = new Date(now);
  // Allow the streak to count if today not yet trained but yesterday was.
  if (!days.has(dayKey(cursor))) cursor.setTime(cursor.getTime() - DAY_MS);
  while (days.has(dayKey(cursor))) {
    streak += 1;
    cursor.setTime(cursor.getTime() - DAY_MS);
  }
  return streak;
}

/** Start of the current week (Monday 00:00). */
export function weekStart(now: Date = new Date()): Date {
  const d = new Date(now);
  const wd = (d.getDay() + 6) % 7; // Mon=0
  d.setHours(0, 0, 0, 0);
  d.setTime(d.getTime() - wd * DAY_MS);
  return d;
}

/** Distinct training days completed this week, and the weekly target (5). */
export function weekSessions(sessions: WorkoutSession[], now: Date = new Date()) {
  const start = weekStart(now).getTime();
  const days = new Set(
    sessions
      .filter((s) => new Date(s.dateISO).getTime() >= start)
      .map((s) => dayKey(new Date(s.dateISO)))
  );
  return { done: days.size, target: TRAINING_DAYS.length };
}

export function weeklyVolume(sessions: WorkoutSession[], now: Date = new Date()): number {
  const start = weekStart(now).getTime();
  return sessions
    .filter((s) => new Date(s.dateISO).getTime() >= start)
    .reduce((v, s) => v + sessionVolume(s), 0);
}

export function totalVolume(sessions: WorkoutSession[]): number {
  return sessions.reduce((v, s) => v + sessionVolume(s), 0);
}

/** All exercises ever logged, with their best set — sorted by est-1RM desc. */
export function prList(sessions: WorkoutSession[]) {
  const ids = new Set<string>();
  sessions.forEach((s) => s.entries.forEach((e) => ids.add(e.exerciseId)));
  return [...ids]
    .map((id) => ({ exerciseId: id, best: bestSet(sessions, id) }))
    .filter((p) => p.best)
    .sort((a, b) => (b.best!.e1rm ?? 0) - (a.best!.e1rm ?? 0));
}

export function totalPRs(sessions: WorkoutSession[]): number {
  return prList(sessions).length;
}

/** Most recent PR (chronologically last session's best lift). */
export function recentPR(sessions: WorkoutSession[]) {
  if (sessions.length === 0) return null;
  const latest = [...sessions].sort((a, b) => b.dateISO.localeCompare(a.dateISO))[0];
  let top: { exerciseId: string; weight: number; reps: number; e1rm: number } | null = null;
  for (const e of latest.entries) {
    for (const set of e.sets) {
      const e1 = est1RM(set.weight, set.reps);
      if (!top || e1 > top.e1rm) top = { exerciseId: e.exerciseId, weight: set.weight, reps: set.reps, e1rm: e1 };
    }
  }
  return top;
}

/** Exercise ids ordered by most-recently logged. */
export function recentExerciseIds(sessions: WorkoutSession[], limit = 8): string[] {
  const seen: string[] = [];
  for (const s of [...sessions].sort((a, b) => b.dateISO.localeCompare(a.dateISO))) {
    for (const e of s.entries) {
      if (!seen.includes(e.exerciseId)) seen.push(e.exerciseId);
    }
  }
  return seen.slice(0, limit);
}

/** Weekly volume series for the last `weeks` weeks (oldest→newest). */
export function volumeSeries(sessions: WorkoutSession[], weeks = 8, now: Date = new Date()) {
  const start = weekStart(now);
  const out: { value: number; label: string }[] = [];
  for (let i = weeks - 1; i >= 0; i--) {
    const wkStart = new Date(start.getTime() - i * 7 * DAY_MS);
    const wkEnd = new Date(wkStart.getTime() + 7 * DAY_MS);
    const v = sessions
      .filter((s) => {
        const t = new Date(s.dateISO).getTime();
        return t >= wkStart.getTime() && t < wkEnd.getTime();
      })
      .reduce((acc, s) => acc + sessionVolume(s), 0);
    out.push({ value: Math.round(v), label: `${wkStart.getMonth() + 1}/${wkStart.getDate()}` });
  }
  return out;
}

/** Sessions-per-week count for the last `weeks` weeks. */
export function frequencySeries(sessions: WorkoutSession[], weeks = 8, now: Date = new Date()) {
  const start = weekStart(now);
  const out: { value: number; label: string }[] = [];
  for (let i = weeks - 1; i >= 0; i--) {
    const wkStart = new Date(start.getTime() - i * 7 * DAY_MS);
    const wkEnd = new Date(wkStart.getTime() + 7 * DAY_MS);
    const days = new Set(
      sessions
        .filter((s) => {
          const t = new Date(s.dateISO).getTime();
          return t >= wkStart.getTime() && t < wkEnd.getTime();
        })
        .map((s) => dayKey(new Date(s.dateISO)))
    );
    out.push({ value: days.size, label: `${wkStart.getMonth() + 1}/${wkStart.getDate()}` });
  }
  return out;
}
