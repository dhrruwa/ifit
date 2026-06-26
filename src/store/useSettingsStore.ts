import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { BodyweightEntry, Settings, Units } from '@/types';

interface SettingsState extends Settings {
  name: string;
  bodyweightLog: BodyweightEntry[];
  setUnits: (u: Units) => void;
  setBodyweight: (kg: number) => void;
  setProteinTarget: (g: number) => void;
  setName: (name: string) => void;
  logBodyweight: (kg: number) => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      units: 'kg',
      bodyweightKg: 80,
      proteinTargetG: 144, // ~1.8 g/kg at 80kg
      name: '',
      bodyweightLog: [],
      setUnits: (units) => set({ units }),
      setBodyweight: (bodyweightKg) => set({ bodyweightKg }),
      setProteinTarget: (proteinTargetG) => set({ proteinTargetG }),
      setName: (name) => set({ name }),
      logBodyweight: (kg) =>
        set((s) => {
          const todayKey = new Date().toISOString().slice(0, 10);
          // One entry per day — replace today's if it exists.
          const rest = s.bodyweightLog.filter((e) => e.dateISO.slice(0, 10) !== todayKey);
          return {
            bodyweightKg: kg,
            bodyweightLog: [...rest, { dateISO: new Date().toISOString(), kg }].sort((a, b) =>
              a.dateISO.localeCompare(b.dateISO)
            ),
          };
        }),
    }),
    {
      name: 'ifit-settings',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
