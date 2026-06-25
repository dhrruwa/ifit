import { PROGRAM } from '@/data/program';
import { ProgramDay } from '@/types';

/** Program day matching today's weekday. */
export function todaysDay(now: Date = new Date()): ProgramDay {
  const wd = now.getDay(); // 0=Sun..6=Sat
  return PROGRAM.find((d) => d.weekday === wd) ?? PROGRAM[0];
}

export function isToday(day: ProgramDay, now: Date = new Date()): boolean {
  return day.weekday === now.getDay();
}

export function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString(undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });
}

export function formatDuration(sec: number): string {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m}:${String(s).padStart(2, '0')}`;
}
