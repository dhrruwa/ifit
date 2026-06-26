import { Ionicons } from '@expo/vector-icons';
import { router, Stack, useLocalSearchParams } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { Screen } from '@/components/Screen';
import { ListRow, PrimaryButton, SectionHeader, Surface, Tag } from '@/components/kit';
import { getExercise } from '@/data/exercises';
import { getDay } from '@/data/program';
import { STRETCHES } from '@/data/stretches';
import { WARMUPS } from '@/data/warmups';
import { difficultyOf } from '@/lib/difficulty';
import { haptic } from '@/lib/motion';
import { useWorkoutStore } from '@/store/useWorkoutStore';
import { colors, dayColors, radius, space, type } from '@/theme';

export default function DayScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const day = getDay(id);
  const active = useWorkoutStore((s) => s.active);
  const startWorkout = useWorkoutStore((s) => s.startWorkout);

  if (!day) {
    return (
      <Screen>
        <Text style={type.body}>Day not found.</Text>
      </Screen>
    );
  }

  const accent = dayColors[day.id];
  const warmup = day.warmupId ? WARMUPS[day.warmupId] : null;
  const stretch = day.stretchKey ? STRETCHES[day.stretchKey] : null;
  const sets = day.slots.reduce((n, s) => n + s.sets, 0);

  const onStart = () => {
    if (!active) startWorkout(day.id);
    haptic.press();
    router.push(`/workout/${day.id}`);
  };

  return (
    <>
      <Stack.Screen options={{ title: '', headerTintColor: accent }} />
      <Screen>
        <View>
          <Tag label={day.focus} color={accent} />
          <Text style={[type.display, { fontSize: 40, marginTop: space.md }]}>{day.name}</Text>
        </View>

        {day.rest ? (
          <Surface style={styles.rest}>
            <Ionicons name="bed-outline" size={28} color={colors.textDim} />
            <Text style={[type.body, { flex: 1 }]}>
              Rest day. Recovery is when you grow — walk, stretch, sleep 7–9 hrs, and hit your protein.
            </Text>
          </Surface>
        ) : (
          <>
            {day.flow && (
              <Surface>
                <Text style={type.label}>The flow</Text>
                <Text style={[type.bodyDim, { marginTop: space.sm }]}>{day.flow}</Text>
              </Surface>
            )}

            {/* Exercises */}
            <View>
              <SectionHeader title={`Session · ${day.slots.length} exercises · ${sets} sets`} />
              <Surface padded={false} style={{ paddingHorizontal: space.lg }}>
                {day.slots.map((slot, i) => {
                  const ex = getExercise(slot.exerciseId);
                  if (!ex) return null;
                  const diff = difficultyOf(ex);
                  return (
                    <Animated.View
                      key={slot.exerciseId}
                      entering={FadeInDown.duration(220).delay(i * 35)}
                      style={i > 0 ? styles.divider : undefined}>
                      <ListRow
                        title={ex.name}
                        subtitle={`${ex.muscleGroup} · ${ex.regionOrHead}`}
                        left={
                          <View style={[styles.idx, { backgroundColor: accent + '22' }]}>
                            <Text style={[styles.idxText, { color: accent }]}>{i + 1}</Text>
                          </View>
                        }
                        right={
                          <View style={{ alignItems: 'flex-end' }}>
                            <Text style={[type.headline, { color: accent }]}>
                              {slot.sets}×{slot.reps}
                            </Text>
                            <Text style={[type.caption, { color: diff.color }]}>{diff.label}</Text>
                          </View>
                        }
                        onPress={() => router.push(`/exercise/${ex.id}`)}
                      />
                    </Animated.View>
                  );
                })}
              </Surface>
            </View>

            {/* Warm-up */}
            {warmup && (
              <View>
                <SectionHeader title={`Warm-up · ${warmup.title}`} />
                <Surface>
                  {warmup.steps.map((s, i) => (
                    <View key={i} style={[styles.warmRow, i > 0 && styles.divider]}>
                      <Text style={[type.body, { flex: 1 }]}>{s.movement}</Text>
                      <Text style={[type.caption, { color: accent }]}>{s.amount}</Text>
                    </View>
                  ))}
                </Surface>
              </View>
            )}

            {/* Stretches */}
            {stretch && (
              <View>
                <SectionHeader title="Post-workout stretches" />
                <Surface>
                  <View style={styles.stretchTags}>
                    {stretch.stretches.map((s, i) => (
                      <Tag key={i} label={s} color={colors.good} />
                    ))}
                  </View>
                  <Text style={[type.caption, { marginTop: space.md }]}>Hold each 20–30 sec, both sides.</Text>
                </Surface>
              </View>
            )}

            <PrimaryButton
              label={active ? 'Continue Workout' : 'Start Workout'}
              icon="play"
              color={active ? colors.good : accent}
              onPress={onStart}
            />
          </>
        )}
      </Screen>
    </>
  );
}

const styles = StyleSheet.create({
  rest: { flexDirection: 'row', alignItems: 'center', gap: space.lg },
  divider: { borderTopWidth: 1, borderTopColor: colors.border },
  warmRow: { flexDirection: 'row', alignItems: 'center', gap: space.md, paddingVertical: space.md },
  idx: { width: 32, height: 32, borderRadius: radius.sm, alignItems: 'center', justifyContent: 'center' },
  idxText: { fontWeight: '800', fontSize: 15 },
  stretchTags: { flexDirection: 'row', flexWrap: 'wrap', gap: space.sm },
});
