import { AnatomyRow } from '@/types';

export const SELECTION_RULES = [
  'Compounds first, isolations after — big multi-joint lifts build the most mass; isolations target what compounds miss.',
  'One movement per region/head — cover all of a muscle’s parts with the minimum number of exercises.',
  'Free weights for heavy compounds (loadability + stabilizers); cables/machines for isolations (constant tension, safe near failure).',
];

export const ORDERING_RULES = [
  'Heaviest, most demanding lift FIRST — you’re freshest at the start, where progressive overload happens.',
  'Compounds before isolations — never pre-fatigue with flyes/curls before big presses/pulls.',
  'Barbell before dumbbell for the main lift — the barbell loads the most absolute weight.',
  'Stretch/heavy work early, squeeze/peak-contraction finishers late.',
  'PRIORITY PRINCIPLE — train your weakest or highest-priority region first. Order follows your goal.',
];

export const NON_NEGOTIABLES = [
  { title: 'Progressive overload', detail: 'Add a rep or a little weight every week. Track it — beat your log.' },
  { title: 'Frequency', detail: 'Hit every muscle ~2× per week.' },
  { title: 'Effort', detail: 'Stop 1–3 reps short of failure on most sets.' },
  { title: 'Protein', detail: '1.6–2.0 g per kg of bodyweight, daily.' },
  { title: 'Sleep', detail: '7–9 hours — recovery is when you grow.' },
];

/** Anatomy reference tables, grouped by muscle. */
export const ANATOMY: Record<string, AnatomyRow[]> = {
  Chest: [
    { part: 'Upper (clavicular)', does: 'Pressing at an incline', target: 'Incline press' },
    { part: 'Mid (sternal)', does: 'Flat pressing', target: 'Flat bench' },
    { part: 'Lower (costal)', does: 'Bottom fibers', target: 'Dips + decline' },
    { part: 'Inner', does: 'Squeeze past midline', target: 'Flyes / crossovers' },
  ],
  Shoulders: [
    { part: 'Anterior (front)', does: 'Pressing, flexion', target: 'Overhead presses' },
    { part: 'Lateral (side)', does: 'Abduction — builds width', target: 'Lateral raises' },
    { part: 'Posterior (rear)', does: 'Pulls back', target: 'Rear flyes, face pulls' },
    { part: 'Rotator cuff', does: 'Stabilizes the joint', target: 'Face pulls, external rotations' },
  ],
  Triceps: [
    { part: 'Long head', does: 'Crosses the shoulder', target: 'Overhead movements' },
    { part: 'Lateral head', does: 'Elbow extension', target: 'Pushdowns (arms at sides)' },
    { part: 'Medial head', does: 'Always assisting', target: 'Full lockout / higher reps' },
  ],
  Back: [
    { part: 'Lats', does: 'Builds width / V-taper', target: 'Vertical pulls' },
    { part: 'Traps', does: 'Shrug + retract', target: 'Shrugs, rows' },
    { part: 'Rhomboids', does: 'Squeeze shoulder blades', target: 'Rows' },
    { part: 'Erector spinae', does: 'Keep spine upright', target: 'Deadlifts' },
  ],
  Biceps: [
    { part: 'Long head (peak)', does: 'Elbow flexion', target: 'Arms behind body (incline curls)' },
    { part: 'Short head (inner)', does: 'Elbow flexion', target: 'Arms in front (preacher)' },
    { part: 'Brachialis', does: 'Pushes biceps up → thickness', target: 'Hammer / neutral curls' },
    { part: 'Brachioradialis', does: 'Flexion', target: 'Hammer / reverse curls' },
  ],
  Quads: [
    { part: 'Rectus femoris', does: 'Crosses the hip', target: 'Leg extensions' },
    { part: 'Vastus lateralis', does: 'Outer sweep', target: 'Squats / leg press' },
    { part: 'Vastus medialis', does: 'The teardrop', target: 'Full lockout' },
    { part: 'Vastus intermedius', does: 'Deep, under rectus', target: 'All squatting' },
  ],
  Hamstrings: [
    { part: 'Biceps femoris', does: 'Knee flexion', target: 'Leg curls' },
    { part: 'Semitendinosus', does: 'Hip extension', target: 'RDLs' },
    { part: 'Semimembranosus', does: 'Both functions', target: 'Curls + hinge' },
  ],
  Glutes: [
    { part: 'Gluteus maximus', does: 'Hip extension (largest muscle)', target: 'Hip thrust, squats' },
    { part: 'Gluteus medius', does: 'Abduction + stability', target: 'Hip abduction' },
    { part: 'Gluteus minimus', does: 'Deep stabilizer', target: 'Abduction' },
  ],
  Calves: [
    { part: 'Gastrocnemius', does: 'Crosses the knee (the diamond)', target: 'Standing (straight-leg) raises' },
    { part: 'Soleus', does: 'Deeper, underneath', target: 'Seated (bent-knee) raises' },
  ],
  Core: [
    { part: 'Rectus abdominis', does: 'The six-pack; spinal flexion', target: 'Crunches, leg raises' },
    { part: 'Obliques', does: 'Rotation + side bend', target: 'Twists, woodchops' },
    { part: 'Transverse abdominis', does: 'Deep stabilizer', target: 'Planks, ab wheel' },
  ],
};

export const ABS_NOTE =
  'Abs are a muscle you build like any other — but they only SHOW when body fat drops, and that’s diet-driven. You can’t spot-reduce. Train them, reveal them in the kitchen.';
