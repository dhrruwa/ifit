import * as Haptics from 'expo-haptics';
import { useCallback } from 'react';
import {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

/** All motion stays under 300ms — quick, confident, never sluggish. */
export const DUR = { fast: 140, base: 220, slow: 300 } as const;

export const SPRING = { damping: 18, stiffness: 220, mass: 0.7 } as const;

export const ease = Easing.bezier(0.22, 1, 0.36, 1); // gentle ease-out

/** Haptic helpers — thin wrappers so call sites stay tidy. */
export const haptic = {
  tap: () => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light),
  press: () => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium),
  heavy: () => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy),
  success: () => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success),
  warning: () => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning),
  select: () => Haptics.selectionAsync(),
};

/** Press-to-scale interaction for cards/buttons. */
export function usePressScale(to = 0.97) {
  const scale = useSharedValue(1);
  const style = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));
  const onPressIn = useCallback(() => {
    scale.value = withTiming(to, { duration: DUR.fast, easing: ease });
  }, [scale, to]);
  const onPressOut = useCallback(() => {
    scale.value = withSpring(1, SPRING);
  }, [scale]);
  return { style, onPressIn, onPressOut };
}

export { withSpring, withTiming };
