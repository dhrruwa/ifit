import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { getDay } from '@/data/program';
import { lastSetsFor } from '@/lib/prs';
import { ExerciseLog, LoggedSet, WorkoutSession } from '@/types';

export interface ActiveSession {
  dayId: string;
  startedAt: number; // ms epoch
  entries: ExerciseLog[];
}

interface WorkoutState {
  sessions: WorkoutSession[];
  active: ActiveSession | null;

  startWorkout: (dayId: string) => void;
  updateSet: (exerciseId: string, index: number, patch: Partial<LoggedSet>) => void;
  toggleDone: (exerciseId: string, index: number) => void;
  addSet: (exerciseId: string) => void;
  removeSet: (exerciseId: string, index: number) => void;
  finishWorkout: () => WorkoutSession | null;
  cancelWorkout: () => void;
  deleteSession: (id: string) => void;
}

function uid(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

function buildEntries(dayId: string, sessions: WorkoutSession[]): ExerciseLog[] {
  const day = getDay(dayId);
  if (!day) return [];
  return day.slots.map((slot) => {
    const prev = lastSetsFor(sessions, slot.exerciseId);
    const count = prev?.length ?? slot.sets;
    const sets: LoggedSet[] = Array.from({ length: count }, (_, i) => ({
      weight: prev?.[i]?.weight ?? 0,
      reps: prev?.[i]?.reps ?? 0,
      done: false,
    }));
    return { exerciseId: slot.exerciseId, sets };
  });
}

export const useWorkoutStore = create<WorkoutState>()(
  persist(
    (set, get) => ({
      sessions: [],
      active: null,

      startWorkout: (dayId) => {
        const entries = buildEntries(dayId, get().sessions);
        set({ active: { dayId, startedAt: Date.now(), entries } });
      },

      updateSet: (exerciseId, index, patch) =>
        set((state) => {
          if (!state.active) return state;
          return {
            active: {
              ...state.active,
              entries: state.active.entries.map((e) =>
                e.exerciseId === exerciseId
                  ? { ...e, sets: e.sets.map((s, i) => (i === index ? { ...s, ...patch } : s)) }
                  : e
              ),
            },
          };
        }),

      toggleDone: (exerciseId, index) =>
        set((state) => {
          if (!state.active) return state;
          return {
            active: {
              ...state.active,
              entries: state.active.entries.map((e) =>
                e.exerciseId === exerciseId
                  ? { ...e, sets: e.sets.map((s, i) => (i === index ? { ...s, done: !s.done } : s)) }
                  : e
              ),
            },
          };
        }),

      addSet: (exerciseId) =>
        set((state) => {
          if (!state.active) return state;
          return {
            active: {
              ...state.active,
              entries: state.active.entries.map((e) => {
                if (e.exerciseId !== exerciseId) return e;
                const last = e.sets[e.sets.length - 1];
                return {
                  ...e,
                  sets: [...e.sets, { weight: last?.weight ?? 0, reps: last?.reps ?? 0, done: false }],
                };
              }),
            },
          };
        }),

      removeSet: (exerciseId, index) =>
        set((state) => {
          if (!state.active) return state;
          return {
            active: {
              ...state.active,
              entries: state.active.entries.map((e) =>
                e.exerciseId === exerciseId
                  ? { ...e, sets: e.sets.filter((_, i) => i !== index) }
                  : e
              ),
            },
          };
        }),

      finishWorkout: () => {
        const active = get().active;
        if (!active) return null;
        // Keep only exercises with at least one completed set.
        const entries = active.entries
          .map((e) => ({ ...e, sets: e.sets.filter((s) => s.done) }))
          .filter((e) => e.sets.length > 0);
        if (entries.length === 0) {
          set({ active: null });
          return null;
        }
        const session: WorkoutSession = {
          id: uid(),
          dateISO: new Date().toISOString(),
          dayId: active.dayId,
          entries,
          durationSec: Math.round((Date.now() - active.startedAt) / 1000),
        };
        set((state) => ({ sessions: [session, ...state.sessions], active: null }));
        return session;
      },

      cancelWorkout: () => set({ active: null }),

      deleteSession: (id) =>
        set((state) => ({ sessions: state.sessions.filter((s) => s.id !== id) })),
    }),
    {
      name: 'ifit-workouts',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({ sessions: state.sessions, active: state.active }),
    }
  )
);
