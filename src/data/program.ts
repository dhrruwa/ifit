import { ProgramDay } from '@/types';

/**
 * The 7-day split. Slot order encodes the bible's flow:
 * heaviest compound first → secondary compounds → isolations last.
 */
export const PROGRAM: ProgramDay[] = [
  {
    id: 'mon',
    weekday: 1,
    name: 'Push',
    focus: 'Chest · Shoulders · Triceps',
    emoji: '🟦',
    heaviestCompound: 'Flat Barbell Bench Press',
    flow: 'Heaviest barbell press → upper-chest compound → lower-chest compound → shoulders → triceps finishers.',
    warmupId: 'upper',
    stretchKey: 'push',
    slots: [
      { exerciseId: 'flat-barbell-bench', sets: 4, reps: '5-8' },
      { exerciseId: 'incline-db-press', sets: 3, reps: '8-12' },
      { exerciseId: 'weighted-dips', sets: 3, reps: '8-12' },
      { exerciseId: 'overhead-barbell-press', sets: 3, reps: '6-10' },
      { exerciseId: 'db-lateral-raise', sets: 3, reps: '12-20' },
      { exerciseId: 'reverse-pec-deck', sets: 3, reps: '15-20' },
      { exerciseId: 'overhead-cable-ext', sets: 3, reps: '10-15' },
      { exerciseId: 'rope-pushdown', sets: 3, reps: '10-15' },
    ],
  },
  {
    id: 'tue',
    weekday: 2,
    name: 'Pull',
    focus: 'Back · Biceps · Rear Delts',
    emoji: '🟩',
    heaviestCompound: 'Deadlift',
    flow: 'Heaviest pull (deadlift) → vertical pull → horizontal pull → lat isolation → biceps.',
    warmupId: 'upper',
    stretchKey: 'pull',
    slots: [
      { exerciseId: 'deadlift', sets: 3, reps: '4-6' },
      { exerciseId: 'pull-ups', sets: 3, reps: '8-12' },
      { exerciseId: 'barbell-row', sets: 3, reps: '8-12' },
      { exerciseId: 'straight-arm-pulldown', sets: 3, reps: '12-15' },
      { exerciseId: 'barbell-curl', sets: 3, reps: '8-12' },
      { exerciseId: 'incline-db-curl', sets: 3, reps: '10-12' },
      { exerciseId: 'hammer-curl', sets: 2, reps: '10-15' },
    ],
  },
  {
    id: 'wed',
    weekday: 3,
    name: 'Legs',
    focus: 'Quads · Hamstrings · Glutes · Calves',
    emoji: '🟥',
    heaviestCompound: 'Barbell Back Squat',
    flow: 'Heaviest compound (squat) → hip-hinge → quad volume → ham isolation → calves.',
    warmupId: 'lower',
    stretchKey: 'legs',
    slots: [
      { exerciseId: 'back-squat', sets: 4, reps: '5-8' },
      { exerciseId: 'rdl', sets: 3, reps: '8-12' },
      { exerciseId: 'leg-press', sets: 3, reps: '10-15' },
      { exerciseId: 'seated-leg-curl', sets: 3, reps: '10-15' },
      { exerciseId: 'standing-calf-raise', sets: 4, reps: '12-20' },
    ],
  },
  {
    id: 'thu',
    weekday: 4,
    name: 'Rest',
    focus: 'Walk · stretch · recover',
    emoji: '⬜️',
    rest: true,
    slots: [],
  },
  {
    id: 'fri',
    weekday: 5,
    name: 'Upper',
    focus: '2nd hit: Chest · Back · Shoulders · Arms',
    emoji: '🟪',
    heaviestCompound: 'Incline Barbell Press',
    flow: 'Rotated angles vs Mon/Tue — compounds first (press, pull), then shoulders, then arms.',
    warmupId: 'upper',
    stretchKey: 'upper',
    slots: [
      { exerciseId: 'incline-barbell-press', sets: 4, reps: '6-10' },
      { exerciseId: 'pull-ups', sets: 3, reps: '8-12' },
      { exerciseId: 'seated-db-press', sets: 3, reps: '8-12' },
      { exerciseId: 'chest-supported-row', sets: 3, reps: '10-15' },
      { exerciseId: 'cable-lateral-raise', sets: 3, reps: '12-20' },
      { exerciseId: 'ez-bar-curl', sets: 3, reps: '10-15' },
      { exerciseId: 'rope-pushdown', sets: 3, reps: '10-15' },
    ],
  },
  {
    id: 'sat',
    weekday: 6,
    name: 'Lower',
    focus: '2nd hit: Legs + Core',
    emoji: '🟫',
    heaviestCompound: 'Front Squat',
    flow: 'Quad-dominant + unilateral work, then dedicated core. Big compounds while fresh.',
    warmupId: 'lower',
    stretchKey: 'lower',
    slots: [
      { exerciseId: 'front-squat', sets: 3, reps: '8-12' },
      { exerciseId: 'hip-thrust', sets: 3, reps: '8-12' },
      { exerciseId: 'bulgarian-split-squat', sets: 3, reps: '10-12' },
      { exerciseId: 'leg-extension', sets: 3, reps: '12-15' },
      { exerciseId: 'seated-calf-raise', sets: 4, reps: '15-20' },
      { exerciseId: 'hanging-leg-raise', sets: 3, reps: '12-15' },
    ],
  },
  {
    id: 'sun',
    weekday: 0,
    name: 'Rest',
    focus: 'Recover',
    emoji: '⬜️',
    rest: true,
    slots: [],
  },
];

export const DAY_BY_ID: Record<string, ProgramDay> = Object.fromEntries(
  PROGRAM.map((d) => [d.id, d])
);

export function getDay(id: string): ProgramDay | undefined {
  return DAY_BY_ID[id];
}

/** Training days in calendar order (Mon→Sat), excluding rest. */
export const TRAINING_DAYS = PROGRAM.filter((d) => !d.rest);
