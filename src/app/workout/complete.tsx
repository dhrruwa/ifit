import { Ionicons } from '@expo/vector-icons';
import { router, Stack, useLocalSearchParams } from 'expo-router';
import { useEffect } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeIn, FadeInDown, ZoomIn } from 'react-native-reanimated';

import { AnimatedNumber } from '@/components/AnimatedNumber';
import { PrimaryButton, Surface } from '@/components/kit';
import { getExercise } from '@/data/exercises';
import { getDay } from '@/data/program';
import { formatDuration } from '@/lib/dates';
import { haptic } from '@/lib/motion';
import { completedSetCount, sessionVolume } from '@/lib/prs';
import { newPRsForSession } from '@/lib/stats';
import { toDisplay } from '@/lib/units';
import { useSettingsStore } from '@/store/useSettingsStore';
import { useWorkoutStore } from '@/store/useWorkoutStore';
import { colors, space, type } from '@/theme';

export default function WorkoutComplete() {
  const { sid } = useLocalSearchParams<{ sid: string }>();
  const sessions = useWorkoutStore((s) => s.sessions);
  const units = useSettingsStore((s) => s.units);

  const session = sessions.find((s) => s.id === sid);

  useEffect(() => {
    haptic.success();
  }, []);

  const done = () => {
    router.dismissAll?.();
    router.replace('/');
  };

  if (!session) {
    return (
      <View style={styles.fallback}>
        <Text style={type.title}>Workout saved</Text>
        <PrimaryButton label="Done" onPress={done} style={{ marginTop: space.lg, alignSelf: 'stretch' }} />
      </View>
    );
  }

  const day = getDay(session.dayId);
  const volume = sessionVolume(session);
  const sets = completedSetCount(session);
  const prs = newPRsForSession(sessions, session);

  const stats = [
    { label: `Volume (${units})`, value: toDisplay(volume, units), fmt: (n: number) => Math.round(n).toLocaleString() },
    { label: 'Duration', value: session.durationSec, fmt: (n: number) => formatDuration(Math.round(n)) },
    { label: 'Exercises', value: session.entries.length, fmt: (n: number) => String(Math.round(n)) },
    { label: 'Sets', value: sets, fmt: (n: number) => String(Math.round(n)) },
  ];

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
        <Animated.View entering={ZoomIn.duration(300)} style={styles.badge}>
          <Ionicons name="checkmark" size={52} color={colors.accentText} />
        </Animated.View>

        <Animated.View entering={FadeIn.duration(280).delay(120)} style={{ alignItems: 'center' }}>
          <Text style={type.label}>{day?.name ?? 'Workout'} complete</Text>
          <Text style={styles.title}>Nice work.</Text>
        </Animated.View>

        {/* stat grid */}
        <Animated.View entering={FadeInDown.duration(280).delay(200)} style={styles.grid}>
          {stats.map((s) => (
            <Surface key={s.label} style={styles.statCell}>
              <AnimatedNumber value={s.value} format={s.fmt} style={styles.statValue} />
              <Text style={type.caption}>{s.label}</Text>
            </Surface>
          ))}
        </Animated.View>

        {/* new PRs */}
        {prs.length > 0 && (
          <Animated.View entering={FadeInDown.duration(280).delay(300)} style={{ alignSelf: 'stretch' }}>
            <Surface style={styles.prCard}>
              <View style={styles.prHead}>
                <Ionicons name="trophy" size={20} color={colors.warn} />
                <Text style={[type.headline, { color: colors.warn }]}>
                  {prs.length} New {prs.length === 1 ? 'PR' : 'PRs'}!
                </Text>
              </View>
              {prs.map((p) => (
                <View key={p.exerciseId} style={styles.prRow}>
                  <Text style={[type.body, { flex: 1 }]} numberOfLines={1}>
                    {getExercise(p.exerciseId)?.name ?? p.exerciseId}
                  </Text>
                  <Text style={type.headline}>
                    {toDisplay(p.weight, units)}
                    {units} × {p.reps}
                  </Text>
                </View>
              ))}
            </Surface>
          </Animated.View>
        )}

        <Animated.View entering={FadeIn.duration(280).delay(380)} style={{ alignSelf: 'stretch' }}>
          <PrimaryButton label="Continue" icon="arrow-forward" onPress={done} />
        </Animated.View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  content: { padding: space.xl, paddingTop: space.huge * 1.5, gap: space.xl, alignItems: 'center' },
  fallback: { flex: 1, backgroundColor: colors.bg, alignItems: 'center', justifyContent: 'center', padding: space.xl },
  badge: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: { ...type.display, fontSize: 34, marginTop: space.sm },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: space.md, alignSelf: 'stretch' },
  statCell: { width: '47%', flexGrow: 1, alignItems: 'center', paddingVertical: space.xl },
  statValue: { ...type.display, fontSize: 28, fontVariant: ['tabular-nums'] },
  prCard: { gap: space.md },
  prHead: { flexDirection: 'row', alignItems: 'center', gap: space.sm },
  prRow: { flexDirection: 'row', alignItems: 'center', gap: space.md },
});
