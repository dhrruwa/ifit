import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { Settings, Units } from '@/types';

interface SettingsState extends Settings {
  setUnits: (u: Units) => void;
  setBodyweight: (kg: number) => void;
  setProteinTarget: (g: number) => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      units: 'kg',
      bodyweightKg: 80,
      proteinTargetG: 144, // ~1.8 g/kg at 80kg
      setUnits: (units) => set({ units }),
      setBodyweight: (bodyweightKg) => set({ bodyweightKg }),
      setProteinTarget: (proteinTargetG) => set({ proteinTargetG }),
    }),
    {
      name: 'ifit-settings',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
