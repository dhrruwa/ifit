export type MuscleGroup =
  | 'Chest'
  | 'Shoulders'
  | 'Triceps'
  | 'Back'
  | 'Biceps'
  | 'Quads'
  | 'Hamstrings'
  | 'Glutes'
  | 'Calves'
  | 'Core';

export type Equipment = 'Barbell' | 'Dumbbell' | 'Cable' | 'Machine' | 'Bodyweight';

export interface Exercise {
  id: string;
  name: string;
  muscleGroup: MuscleGroup;
  /** Region or head this exercise emphasizes (e.g. "Long head", "Upper chest"). */
  regionOrHead: string;
  /** Why this exercise is in the program. */
  why: string;
  equipment: Equipment;
  /** True for the main heavy compound of its movement pattern. */
  compound?: boolean;
}

/** A prescribed slot in a day's session. */
export interface ProgramSlot {
  exerciseId: string;
  sets: number;
  /** Display rep range, e.g. "5-8". */
  reps: string;
}

export interface ProgramDay {
  id: string; // mon..sun
  weekday: number; // 0=Sun .. 6=Sat
  name: string; // "Push"
  focus: string; // "Chest · Shoulders · Triceps"
  emoji: string;
  rest?: boolean;
  heaviestCompound?: string;
  flow?: string; // one-line description of the ordering logic
  slots: ProgramSlot[];
  warmupId?: 'upper' | 'lower';
  stretchKey?: string; // key into stretches
}

/** Anatomy reference rows shown on the muscle / exercise screens. */
export interface AnatomyRow {
  part: string;
  does: string;
  target: string;
}

export interface WarmupRoutine {
  id: 'upper' | 'lower';
  title: string;
  steps: { movement: string; amount: string; purpose: string }[];
  tweaks?: string;
}

export interface StretchRoutine {
  key: string;
  title: string;
  stretches: string[];
}

// ---- Dynamic / user data ----

export interface LoggedSet {
  weight: number;
  reps: number;
  done: boolean;
}

export interface ExerciseLog {
  exerciseId: string;
  sets: LoggedSet[];
}

export interface WorkoutSession {
  id: string;
  dateISO: string;
  dayId: string;
  entries: ExerciseLog[];
  durationSec: number;
  notes?: string;
}

export interface BodyweightEntry {
  dateISO: string;
  kg: number;
}

export type Units = 'kg' | 'lb';

export interface Settings {
  units: Units;
  bodyweightKg: number;
  proteinTargetG: number;
}
