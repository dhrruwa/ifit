// Auto-generated map: our exercise id -> ExerciseGymGifsDB <muscle>/<slug>.
// Source: github.com/JahelCuadrado/ExerciseGymGifsDB (jsDelivr CDN). GIFs (c) their authors.

const CDN = 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@v1.1.0';

const GIF_IDS: Record<string, string> = {
  'flat-barbell-bench': 'pectorals/barbell-bench-press',
  'incline-db-press': 'pectorals/dumbbell-incline-bench-press',
  'incline-barbell-press': 'pectorals/barbell-incline-bench-press',
  'weighted-dips': 'pectorals/chest-dip',
  'incline-db-flye': 'pectorals/dumbbell-incline-fly',
  'pec-deck': 'pectorals/lever-seated-fly',
  'overhead-barbell-press': 'delts/barbell-standing-wide-military-press',
  'seated-db-press': 'delts/dumbbell-seated-shoulder-press',
  'arnold-press': 'delts/dumbbell-arnold-press',
  'db-lateral-raise': 'delts/dumbbell-lateral-raise',
  'cable-lateral-raise': 'delts/cable-lateral-raise',
  'reverse-pec-deck': 'delts/lever-seated-reverse-fly',
  'face-pulls': 'delts/cable-rear-delt-row-with-rope',
  'close-grip-bench': 'triceps/barbell-close-grip-bench-press',
  'overhead-cable-ext': 'triceps/cable-overhead-triceps-extension-rope-attachment',
  'skull-crusher': 'triceps/barbell-lying-triceps-extension',
  'rope-pushdown': 'triceps/cable-pushdown',
  'deadlift': 'glutes/barbell-deadlift',
  'pull-ups': 'lats/pull-up',
  'lat-pulldown': 'lats/cable-pulldown',
  'barbell-row': 'upper-back/barbell-bent-over-row',
  'chest-supported-row': 'upper-back/lever-t-bar-row',
  'seated-cable-row': 'upper-back/cable-seated-row',
  'single-arm-db-row': 'upper-back/dumbbell-one-arm-bent-over-row',
  'straight-arm-pulldown': 'lats/cable-straight-arm-pulldown',
  'shrugs': 'traps/dumbbell-shrug',
  'barbell-curl': 'biceps/barbell-curl',
  'ez-bar-curl': 'biceps/barbell-curl',
  'incline-db-curl': 'biceps/dumbbell-incline-curl',
  'preacher-curl': 'biceps/barbell-preacher-curl',
  'hammer-curl': 'biceps/dumbbell-hammer-curl',
  'concentration-curl': 'biceps/dumbbell-concentration-curl',
  'back-squat': 'glutes/barbell-full-squat',
  'front-squat': 'quads/barbell-bench-front-squat',
  'leg-press': 'quads/lever-alternate-leg-press',
  'bulgarian-split-squat': 'quads/dumbbell-single-leg-split-squat',
  'leg-extension': 'quads/lever-leg-extension',
  'rdl': 'glutes/barbell-romanian-deadlift',
  'stiff-leg-deadlift': 'hamstrings/barbell-straight-leg-deadlift',
  'seated-leg-curl': 'hamstrings/lever-seated-leg-curl',
  'lying-leg-curl': 'hamstrings/lever-lying-leg-curl',
  'nordic-curl': 'hamstrings/glute-ham-raise',
  'hip-thrust': 'glutes/barbell-lying-lifting-on-hip',
  'walking-lunges': 'glutes/dumbbell-lunge',
  'standing-calf-raise': 'calves/lever-standing-calf-raise',
  'seated-calf-raise': 'calves/lever-seated-calf-raise',
  'hanging-leg-raise': 'abs/hanging-leg-raise',
  'cable-crunch': 'abs/cable-kneeling-crunch',
  'plank': 'abs/weighted-front-plank',
  'russian-twist': 'abs/russian-twist',
};

/** Returns the animated-GIF demo URL for an exercise, or null if none. */
export function gifUrl(exerciseId: string): string | null {
  const id = GIF_IDS[exerciseId];
  return id ? `${CDN}/${id}.gif` : null;
}
