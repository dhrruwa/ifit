import { Platform, TextStyle } from 'react-native';

/**
 * iFit V2 design system. Dark, calm, technical — Apple Fitness / Whoop / Linear.
 * Existing token keys (colors/space/radius/font/dayColors) are preserved so
 * not-yet-redesigned screens keep working during the phased rollout.
 */
export const colors = {
  bg: '#0A0B0D', // near-black, slightly warm
  surface: '#141619', // floating card
  surface2: '#1C1F24', // chips / inputs
  surfaceHi: '#23272E', // raised / pressed
  border: '#262A31',
  borderHi: '#363B44',
  text: '#F4F6F9',
  textDim: '#9BA3AE',
  textFaint: '#646B76',
  accent: '#5B8DEF', // single restrained accent (calm blue)
  accentText: '#06101F', // text on accent
  accentDim: '#16243B',
  good: '#3DDC97',
  warn: '#F5B945',
  danger: '#F2685F',
  ringTrack: '#23272E',
} as const;

/** Per-day accent — now used only as a small tag, not full-card theming. */
export const dayColors: Record<string, string> = {
  mon: '#5B8DEF', // Push  — blue
  tue: '#3DDC97', // Pull  — green
  wed: '#F2685F', // Legs  — red
  thu: '#646B76', // Rest  — grey
  fri: '#A78BFA', // Upper — purple
  sat: '#D6A06A', // Lower — amber
  sun: '#646B76', // Rest  — grey
};

/** Strict 8pt spacing. `xs` (4) reserved for hairline nudges only. */
export const space = {
  xs: 4,
  sm: 8,
  md: 12, // legacy; prefer lg
  lg: 16,
  xl: 24,
  xxl: 32,
  huge: 48,
} as const;

export const radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 28,
  pill: 999,
} as const;

/** Legacy numeric font sizes (kept for old screens). */
export const font = {
  h1: 30,
  h2: 22,
  h3: 18,
  body: 15,
  small: 13,
  tiny: 11,
} as const;

const systemFont = Platform.select({ ios: undefined, default: undefined }); // system SF / Roboto

/** Typography presets — use these in the redesign. */
export const type: Record<
  'display' | 'title' | 'headline' | 'body' | 'bodyDim' | 'label' | 'caption' | 'mono',
  TextStyle
> = {
  display: { fontFamily: systemFont, fontSize: 34, fontWeight: '800', letterSpacing: -0.8, color: colors.text },
  title: { fontFamily: systemFont, fontSize: 22, fontWeight: '700', letterSpacing: -0.3, color: colors.text },
  headline: { fontFamily: systemFont, fontSize: 17, fontWeight: '700', letterSpacing: -0.2, color: colors.text },
  body: { fontFamily: systemFont, fontSize: 15, fontWeight: '500', lineHeight: 22, color: colors.text },
  bodyDim: { fontFamily: systemFont, fontSize: 15, fontWeight: '500', lineHeight: 22, color: colors.textDim },
  label: {
    fontFamily: systemFont,
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    color: colors.textDim,
  },
  caption: { fontFamily: systemFont, fontSize: 13, fontWeight: '500', color: colors.textFaint },
  mono: {
    fontFamily: Platform.select({ ios: 'Menlo', android: 'monospace', default: 'monospace' }),
    fontSize: 15,
    fontWeight: '600',
    color: colors.text,
    fontVariant: ['tabular-nums'],
  },
};

/** Elevation presets so cards float off the background. */
export const elevation = {
  card: {
    shadowColor: '#000',
    shadowOpacity: 0.35,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 6,
  },
  raised: {
    shadowColor: '#000',
    shadowOpacity: 0.45,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 12 },
    elevation: 12,
  },
} as const;

/** Standard hit target & control heights. */
export const sizing = {
  control: 56,
  controlSm: 44,
  tap: 44,
} as const;
