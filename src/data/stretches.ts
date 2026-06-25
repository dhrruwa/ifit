import { StretchRoutine } from '@/types';

/** Post-workout static stretches (hold each 20–30s, both sides). */
export const STRETCHES: Record<string, StretchRoutine> = {
  push: {
    key: 'push',
    title: 'Push — chest, shoulders, triceps',
    stretches: [
      'Doorway / wall chest stretch',
      'Cross-body shoulder stretch (rear delt)',
      'Overhead triceps stretch (hand down your back)',
    ],
  },
  pull: {
    key: 'pull',
    title: 'Pull — back, biceps, rear delts',
    stretches: [
      'Lat stretch (hang from a bar)',
      "Child's pose (lats + lower back)",
      'Wall biceps stretch (arm behind, palm on wall)',
      'Seated forward fold (lower back + hamstrings)',
    ],
  },
  legs: {
    key: 'legs',
    title: 'Legs — quads, hams, glutes, calves',
    stretches: [
      'Standing quad stretch (heel to glute)',
      'Standing hamstring stretch / forward fold',
      'Pigeon or figure-4 (glutes)',
      'Wall calf stretch',
      'Couch / hip-flexor stretch',
    ],
  },
  upper: {
    key: 'upper',
    title: 'Upper — full upper body',
    stretches: [
      'Doorway chest stretch',
      'Lat stretch (hang or side-bend reach)',
      'Cross-body shoulder stretch',
      'Overhead triceps stretch',
      'Wall biceps stretch',
    ],
  },
  lower: {
    key: 'lower',
    title: 'Lower — legs + core',
    stretches: [
      'Standing quad stretch',
      'Standing hamstring stretch',
      'Pigeon (glutes)',
      'Wall calf stretch',
      'Hip-flexor stretch',
      'Gentle cobra / backbend (abs)',
    ],
  },
};
