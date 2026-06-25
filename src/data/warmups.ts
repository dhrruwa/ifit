import { WarmupRoutine } from '@/types';

export const WARMUPS: Record<'upper' | 'lower', WarmupRoutine> = {
  upper: {
    id: 'upper',
    title: 'Upper-Body Warm-up',
    steps: [
      { movement: 'Light cardio (rowing ideal)', amount: '5 min', purpose: 'Raise temp, blood to upper body' },
      { movement: 'Arm circles (fwd + back)', amount: '10 each way', purpose: 'Loosen the shoulder joint' },
      { movement: 'Band pull-aparts', amount: '2 × 15', purpose: 'Activate rear delts / upper back' },
      { movement: 'Shoulder dislocates (band/PVC)', amount: '10', purpose: 'Shoulder mobility' },
      { movement: 'Wall slides', amount: '10', purpose: 'Scapular control' },
      { movement: 'Band external rotations', amount: '2 × 12/arm', purpose: 'Rotator-cuff prep' },
      { movement: 'Ramp-up sets on first lift', amount: 'bar → 50% → 75%', purpose: 'Prime the working weight' },
    ],
    tweaks:
      'Pull day: add a 15–20s dead hang + cat-cow ×8 to decompress the spine. Push day: one extra ramp-up set on bench.',
  },
  lower: {
    id: 'lower',
    title: 'Lower-Body Warm-up',
    steps: [
      { movement: 'Light cardio (bike ideal)', amount: '5 min', purpose: 'Warm the knees and hips' },
      { movement: 'Leg swings (fwd-back & side)', amount: '10 each/leg', purpose: 'Dynamic hip mobility' },
      { movement: 'Bodyweight squats', amount: '15', purpose: 'Groove the pattern, warm knees' },
      { movement: 'Walking lunges', amount: '10/leg', purpose: 'Wake up quads, glutes, hips' },
      { movement: 'Glute bridges', amount: '15', purpose: 'Glute activation so they fire' },
      { movement: 'Ankle mobility (knee-to-wall)', amount: '10/leg', purpose: 'Unlocks squat depth' },
      { movement: 'Ramp-up sets on the squat', amount: 'bar → light → moderate', purpose: 'Prime the working weight' },
    ],
  },
};
