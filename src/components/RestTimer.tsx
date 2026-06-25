import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, font, radius, space } from '@/theme';

/**
 * Floating rest-timer bar. Counts down to `endsAt` (ms epoch).
 * Hidden when endsAt is null or already elapsed.
 */
export function RestTimer({
  endsAt,
  onAdd,
  onSkip,
}: {
  endsAt: number | null;
  onAdd: (sec: number) => void;
  onSkip: () => void;
}) {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    if (!endsAt) return;
    const id = setInterval(() => setNow(Date.now()), 250);
    return () => clearInterval(id);
  }, [endsAt]);

  if (!endsAt) return null;
  const remaining = Math.max(0, Math.round((endsAt - now) / 1000));
  if (remaining <= 0) return null;

  const m = Math.floor(remaining / 60);
  const s = remaining % 60;

  return (
    <View style={styles.bar}>
      <Text style={styles.label}>Rest</Text>
      <Text style={styles.time}>
        {m}:{String(s).padStart(2, '0')}
      </Text>
      <Pressable onPress={() => onAdd(15)} style={styles.btn}>
        <Text style={styles.btnText}>+15s</Text>
      </Pressable>
      <Pressable onPress={onSkip} style={[styles.btn, styles.skip]}>
        <Text style={[styles.btnText, { color: '#fff' }]}>Skip</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    position: 'absolute',
    left: space.lg,
    right: space.lg,
    bottom: space.lg,
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.sm,
    backgroundColor: colors.accent,
    borderRadius: radius.lg,
    paddingHorizontal: space.lg,
    paddingVertical: space.md,
  },
  label: { color: '#08121F', fontWeight: '700', fontSize: font.small },
  time: { color: '#08121F', fontWeight: '800', fontSize: font.h3, flex: 1 },
  btn: {
    backgroundColor: '#08121F22',
    paddingHorizontal: space.md,
    paddingVertical: space.xs,
    borderRadius: radius.sm,
  },
  skip: { backgroundColor: '#08121F' },
  btnText: { color: '#08121F', fontWeight: '700', fontSize: font.small },
});
