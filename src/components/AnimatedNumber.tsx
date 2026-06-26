import { useCallback, useEffect, useState } from 'react';
import { Text, TextStyle } from 'react-native';
import {
  runOnJS,
  useAnimatedReaction,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import { DUR, ease } from '@/lib/motion';

/** Counts up to `value` on mount / change. */
export function AnimatedNumber({
  value,
  style,
  format = (n) => String(Math.round(n)),
  duration = DUR.slow,
}: {
  value: number;
  style?: TextStyle | TextStyle[];
  format?: (n: number) => string;
  duration?: number;
}) {
  const sv = useSharedValue(0);
  const [display, setDisplay] = useState(() => format(0));

  // Formatting runs on the JS thread — only the raw number crosses from the worklet.
  const update = useCallback((v: number) => setDisplay(format(v)), [format]);

  useEffect(() => {
    sv.value = withTiming(value, { duration, easing: ease });
  }, [value, sv, duration]);

  useAnimatedReaction(
    () => sv.value,
    (v) => {
      runOnJS(update)(v);
    }
  );

  return <Text style={style}>{display}</Text>;
}
