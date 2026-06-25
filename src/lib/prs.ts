import { WorkoutSession } from '@/types';

/** Epley estimated 1-rep-max for a set. */
export function est1RM(weight: number, reps: number): number {
  if (weight <= 0 || reps <= 0) return 0;
  return Math.round(weight * (1 + reps / 30));
}

/** Best (heaviest) completed set across all sessions for an exercise. */
export function bestSet(
  sessions: WorkoutSession[],
  exerciseId: string
): { weight: number; reps: number; e1rm: number } | null {
  let best: { weight: number; reps: number; e1rm: number } | null = null;
  for (const s of sessions) {
    for (const entry of s.entries) {
      if (entry.exerciseId !== exerciseId) continue;
      for (const set of entry.sets) {
        if (!set.done || set.weight <= 0) continue;
        const e = est1RM(set.weight, set.reps);
        if (!best || e > best.e1rm) best = { weight: set.weight, reps: set.reps, e1rm: e };
      }
    }
  }
  return best;
}

/** The most recent logged sets for an exercise (used to prefill a new workout). */
export function lastSetsFor(
  sessions: WorkoutSession[],
  exerciseId: string
): { weight: number; reps: number }[] | null {
  const sorted = [...sessions].sort((a, b) => b.dateISO.localeCompare(a.dateISO));
  for (const s of sorted) {
    const entry = s.entries.find((e) => e.exerciseId === exerciseId);
    if (entry && entry.sets.some((set) => set.done)) {
      return entry.sets.map((set) => ({ weight: set.weight, reps: set.reps }));
    }
  }
  return null;
}

/** Top-set est-1RM over time for charting (oldest → newest). */
export function progressSeries(
  sessions: WorkoutSession[],
  exerciseId: string
): { value: number; label: string; dateISO: string }[] {
  const points: { value: number; label: string; dateISO: string }[] = [];
  const sorted = [...sessions].sort((a, b) => a.dateISO.localeCompare(b.dateISO));
  for (const s of sorted) {
    const entry = s.entries.find((e) => e.exerciseId === exerciseId);
    if (!entry) continue;
    let top = 0;
    for (const set of entry.sets) {
      if (set.done) top = Math.max(top, est1RM(set.weight, set.reps));
    }
    if (top > 0) {
      const d = new Date(s.dateISO);
      points.push({
        value: top,
        label: `${d.getMonth() + 1}/${d.getDate()}`,
        dateISO: s.dateISO,
      });
    }
  }
  return points;
}

/** Volume (Σ weight×reps of completed sets) for a session. */
export function sessionVolume(session: WorkoutSession): number {
  let v = 0;
  for (const entry of session.entries) {
    for (const set of entry.sets) {
      if (set.done) v += set.weight * set.reps;
    }
  }
  return Math.round(v);
}

/** Count of completed sets in a session. */
export function completedSetCount(session: WorkoutSession): number {
  return session.entries.reduce(
    (n, e) => n + e.sets.filter((s) => s.done).length,
    0
  );
}
