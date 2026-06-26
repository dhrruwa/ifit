import { colors } from '@/theme';
import { Exercise } from '@/types';

/** Heuristic difficulty from compound flag + equipment. */
export function difficultyOf(ex: Exercise): { label: string; color: string } {
  if (ex.compound && ex.equipment === 'Barbell') return { label: 'Advanced', color: colors.danger };
  if (ex.compound) return { label: 'Intermediate', color: colors.warn };
  return { label: 'Beginner', color: colors.good };
}
