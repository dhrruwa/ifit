/**
 * iFit dark theme. Day accent colors mirror the training bible's
 * color-coding (Push=blue, Pull=green, Legs=red, Upper=purple, Lower=brown).
 */
export const colors = {
  bg: '#0B0D10',
  surface: '#15181D',
  surface2: '#1E232A',
  border: '#2A2F38',
  text: '#F2F4F7',
  textDim: '#9AA3AF',
  textFaint: '#6B7280',
  accent: '#4C8DFF',
  accentDim: '#1E3A5F',
  good: '#34D399',
  warn: '#FBBF24',
  danger: '#F87171',
} as const;

/** Per-day accent (keyed by program day id). */
export const dayColors: Record<string, string> = {
  mon: '#4C8DFF', // Push  — blue
  tue: '#34D399', // Pull  — green
  wed: '#F87171', // Legs  — red
  thu: '#6B7280', // Rest  — grey
  fri: '#A78BFA', // Upper — purple
  sat: '#D6A06A', // Lower — brown
  sun: '#6B7280', // Rest  — grey
};

export const space = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
} as const;

export const radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  pill: 999,
} as const;

export const font = {
  h1: 30,
  h2: 22,
  h3: 18,
  body: 15,
  small: 13,
  tiny: 11,
} as const;
