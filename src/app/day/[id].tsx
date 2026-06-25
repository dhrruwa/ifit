import { Ionicons } from '@expo/vector-icons';
import { router, Stack, useLocalSearchParams } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Screen } from '@/components/Screen';
import { Body, Button, Card, Pill, Row, SectionTitle } from '@/components/ui';
import { getExercise } from '@/data/exercises';
import { getDay } from '@/data/program';
import { STRETCHES } from '@/data/stretches';
import { WARMUPS } from '@/data/warmups';
import { useWorkoutStore } from '@/store/useWorkoutStore';
import { colors, dayColors, font, radius, space } from '@/theme';

export default function DayScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const day = getDay(id);
  const active = useWorkoutStore((s) => s.active);
  const startWorkout = useWorkoutStore((s) => s.startWorkout);

  if (!day) {
    return (
      <Screen>
        <Body>Day not found.</Body>
      </Screen>
    );
  }

  const accent = dayColors[day.id];
  const warmup = day.warmupId ? WARMUPS[day.warmupId] : null;
  const stretch = day.stretchKey ? STRETCHES[day.stretchKey] : null;

  const onStart = () => {
    if (!active) startWorkout(day.id);
    router.push(`/workout/${day.id}`);
  };

  return (
    <>
      <Stack.Screen options={{ title: day.name, headerTintColor: accent }} />
      <Screen>
        {/* Heading */}
        <View>
          <Row style={{ gap: space.sm }}>
            <Text style={styles.bigName}>{day.name}</Text>
            <Text style={{ fontSize: 24 }}>{day.emoji}</Text>
          </Row>
          <Text style={styles.focus}>{day.focus}</Text>
        </View>

        {day.rest ? (
          <Card accent={accent}>
            <Row style={{ gap: space.sm }}>
              <Ionicons name="bed-outline" size={20} color={colors.textDim} />
              <Body style={{ flex: 1 }}>
                Rest day. Recovery is when you grow — walk, stretch, sleep 7–9 hrs, and hit your protein.
              </Body>
            </Row>
          </Card>
        ) : (
          <>
            {day.flow && (
              <Card accent={accent}>
                <SectionTitle style={{ marginBottom: space.xs }}>The Flow</SectionTitle>
                <Body style={{ color: colors.textDim }}>{day.flow}</Body>
              </Card>
            )}

            {/* Warm-up */}
            {warmup && (
              <View>
                <SectionTitle>Warm-up · {warmup.title}</SectionTitle>
                <Card>
                  {warmup.steps.map((s, i) => (
                    <View key={i} style={[styles.warmRow, i > 0 && styles.divided]}>
                      <Text style={styles.warmMove}>{s.movement}</Text>
                      <Row style={{ justifyContent: 'space-between', marginTop: 2 }}>
                        <Text style={styles.warmPurpose}>{s.purpose}</Text>
                        <Text style={[styles.warmAmount, { color: accent }]}>{s.amount}</Text>
                      </Row>
                    </View>
                  ))}
                  {warmup.tweaks && (
                    <View style={[styles.tweak, { borderColor: accent + '44' }]}>
                      <Text style={styles.tweakText}>💡 {warmup.tweaks}</Text>
                    </View>
                  )}
                </Card>
              </View>
            )}

            {/* Exercises */}
            <SectionTitle>The Session · {day.slots.length} exercises</SectionTitle>
            <View style={{ gap: space.sm }}>
              {day.slots.map((slot, i) => {
                const ex = getExercise(slot.exerciseId);
                if (!ex) return null;
                return (
                  <Card
                    key={slot.exerciseId}
                    onPress={() => router.push(`/exercise/${ex.id}`)}>
                    <Row style={{ gap: space.md }}>
                      <View style={[styles.idx, { backgroundColor: accent + '22' }]}>
                        <Text style={[styles.idxText, { color: accent }]}>{i + 1}</Text>
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.exName}>{ex.name}</Text>
                        <Text style={styles.exMeta}>
                          {ex.muscleGroup} · {ex.regionOrHead}
                        </Text>
                      </View>
                      <View style={{ alignItems: 'flex-end' }}>
                        <Text style={[styles.setsReps, { color: accent }]}>
                          {slot.sets}×{slot.reps}
                        </Text>
                        {ex.compound && <Pill label="COMPOUND" color={colors.warn} />}
                      </View>
                    </Row>
                  </Card>
                );
              })}
            </View>

            {/* Stretches */}
            {stretch && (
              <View>
                <SectionTitle>Post-workout stretches</SectionTitle>
                <Card>
                  {stretch.stretches.map((s, i) => (
                    <Row key={i} style={[styles.stretchRow, i > 0 && styles.divided]}>
                      <Ionicons name="leaf-outline" size={15} color={colors.good} />
                      <Body style={{ flex: 1 }}>{s}</Body>
                    </Row>
                  ))}
                  <Text style={styles.holdNote}>Hold each 20–30 sec, both sides.</Text>
                </Card>
              </View>
            )}

            <Button
              label={active ? 'Continue workout' : 'Start workout'}
              onPress={onStart}
              color={active ? colors.good : accent}
              style={{ marginTop: space.sm }}
            />
          </>
        )}
      </Screen>
    </>
  );
}

const styles = StyleSheet.create({
  bigName: { color: colors.text, fontSize: font.h1, fontWeight: '900' },
  focus: { color: colors.textDim, fontSize: font.body, marginTop: 2 },
  warmRow: { paddingVertical: space.sm },
  divided: { borderTopWidth: 1, borderTopColor: colors.border },
  warmMove: { color: colors.text, fontSize: font.body, fontWeight: '600' },
  warmPurpose: { color: colors.textFaint, fontSize: font.small, flex: 1 },
  warmAmount: { fontSize: font.small, fontWeight: '700' },
  tweak: {
    marginTop: space.sm,
    borderTopWidth: 1,
    paddingTop: space.sm,
  },
  tweakText: { color: colors.textDim, fontSize: font.small, lineHeight: 19 },
  idx: { width: 30, height: 30, borderRadius: radius.sm, alignItems: 'center', justifyContent: 'center' },
  idxText: { fontWeight: '800', fontSize: font.body },
  exName: { color: colors.text, fontSize: font.body, fontWeight: '700' },
  exMeta: { color: colors.textDim, fontSize: font.small, marginTop: 2 },
  setsReps: { fontSize: font.h3, fontWeight: '800' },
  stretchRow: { gap: space.sm, paddingVertical: space.sm, alignItems: 'center' },
  holdNote: { color: colors.textFaint, fontSize: font.tiny, marginTop: space.sm, fontStyle: 'italic' },
});
