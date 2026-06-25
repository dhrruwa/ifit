import { Units } from '@/types';

const KG_PER_LB = 0.45359237;

/** Stored weights are always in kg. Convert for display. */
export function toDisplay(kg: number, units: Units): number {
  const v = units === 'lb' ? kg / KG_PER_LB : kg;
  return Math.round(v * 10) / 10;
}

/** Convert a user-entered display value back to kg for storage. */
export function toKg(value: number, units: Units): number {
  const v = units === 'lb' ? value * KG_PER_LB : value;
  return Math.round(v * 100) / 100;
}

export function unitLabel(units: Units): string {
  return units;
}
