import { Ionicons } from '@expo/vector-icons';
import { useKeepAwake } from 'expo-keep-awake';
import { router, Stack, useLocalSearchParams } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';

import { ExerciseGif } from '@/components/ExerciseGif';
import { RestTimer } from '@/components/RestTimer';
import { PrimaryButton } from '@/components/kit';
import { getExercise } from '@/data/exercises';
import { getDay } from '@/data/program';
import { formatDuration } from '@/lib/dates';
import { haptic } from '@/lib/motion';
import { lastSetsFor } from '@/lib/prs';
import { toDisplay, toKg } from '@/lib/units';
import { useSettingsStore } from '@/store/useSettingsStore';
import { useWorkoutStore } from '@/store/useWorkoutStore';
import { colors, dayColors, radius, space, type } from '@/theme';

const REST_SEC = 120;

export default function WorkoutScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  useKeepAwake();

  const active = useWorkoutStore((s) => s.active);
  const sessions = useWorkoutStore((s) => s.sessions);
  const startWorkout = useWorkoutStore((s) => s.startWorkout);
  const finishWorkout = useWorkoutStore((s) => s.finishWorkout);
  const cancelWorkout = useWorkoutStore((s) => s.cancelWorkout);
  const updateSet = useWorkoutStore((s) => s.updateSet);
  const toggleDone = useWorkoutStore((s) => s.toggleDone);
  const addSet = useWorkoutStore((s) => s.addSet);
  const units = useSettingsStore((s) => s.units);

  const [idx, setIdx] = useState(0);
  const [restEndsAt, setRestEndsAt] = useState<number | null>(null);
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    if (!active && id) startWorkout(id);
  }, [active, id, startWorkout]);

  useEffect(() => {
    if (!active) return;
    const tick = () => setElapsed(Math.round((Date.now() - active.startedAt) / 1000));
    tick();
    const i = setInterval(tick, 1000);
    return () => clearInterval(i);
  }, [active]);

  const day = active ? getDay(active.dayId) : undefined;
  const accent = day ? dayColors[day.id] : colors.accent;

  const slotMap = useMemo(() => {
    const m: Record<string, { sets: number; reps: string }> = {};
    day?.slots.forEach((s) => (m[s.exerciseId] = { sets: s.sets, reps: s.reps }));
    return m;
  }, [day]);

  if (!active || !day) {
    return (
      <View style={styles.loading}>
        <Text style={type.bodyDim}>Starting workout…</Text>
      </View>
    );
  }

  const entries = active.entries;
  const safeIdx = Math.min(idx, entries.length - 1);
  const entry = entries[safeIdx];
  const ex = getExercise(entry.exerciseId);
  const target = slotMap[entry.exerciseId];
  const prev = lastSetsFor(sessions, entry.exerciseId);

  const doneCount = (e: typeof entry) => e.sets.filter((s) => s.done).length;
  const curSetIdx = entry.sets.findIndex((s) => !s.done);
  const allDone = curSetIdx === -1;
  const editIdx = allDone ? entry.sets.length - 1 : curSetIdx;
  const editSet = entry.sets[editIdx];

  const step = units === 'kg' ? 2.5 : 5;
  const bumpWeight = (delta: number) => {
    const cur = toDisplay(editSet.weight, units);
    updateSet(entry.exerciseId, editIdx, { weight: toKg(Math.max(0, cur + delta), units) });
    haptic.select();
  };
  const bumpReps = (delta: number) => {
    updateSet(entry.exerciseId, editIdx, { reps: Math.max(0, editSet.reps + delta) });
    haptic.select();
  };

  const completeSet = () => {
    if (allDone) {
      addSet(entry.exerciseId);
      return;
    }
    toggleDone(entry.exerciseId, curSetIdx);
    haptic.success();
    setRestEndsAt(Date.now() + REST_SEC * 1000);
  };

  const goto = (next: number) => {
    setIdx(Math.max(0, Math.min(entries.length - 1, next)));
    haptic.tap();
  };

  const onFinish = () => {
    const saved = finishWorkout();
    if (saved) {
      router.dismissAll?.();
      router.replace({ pathname: '/workout/complete', params: { sid: saved.id } });
    } else {
      Alert.alert('Nothing logged', 'Complete at least one set before finishing.');
    }
  };

  const confirmCancel = () => {
    Alert.alert('Discard workout?', 'Your logged sets will be lost.', [
      { text: 'Keep going', style: 'cancel' },
      { text: 'Discard', style: 'destructive', onPress: () => { cancelWorkout(); router.back(); } },
    ]);
  };

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: true,
          title: '',
          headerStyle: { backgroundColor: colors.bg },
          headerShadowVisible: false,
          headerLeft: () => (
            <Pressable onPress={confirmCancel} hitSlop={10}>
              <Text style={[type.headline, { color: colors.danger }]}>Discard</Text>
            </Pressable>
          ),
          headerTitle: () => (
            <View style={{ alignItems: 'center' }}>
              <Text style={type.headline}>{day.name}</Text>
              <Text style={[type.caption, { color: accent }]}>{formatDuration(elapsed)}</Text>
            </View>
          ),
          headerRight: () => (
            <Pressable onPress={onFinish} hitSlop={10}>
              <Text style={[type.headline, { color: colors.good }]}>Finish</Text>
            </Pressable>
          ),
        }}
      />
      <View style={styles.container}>
        {/* progress dots */}
        <View style={styles.dots}>
          {entries.map((e, i) => {
            const done = doneCount(e) >= e.sets.length;
            const on = i === safeIdx;
            return (
              <Pressable key={e.exerciseId} onPress={() => goto(i)} style={{ flex: 1 }}>
                <View
                  style={[
                    styles.dot,
                    { backgroundColor: done ? accent : colors.surface2 },
                    on && { backgroundColor: done ? accent : colors.borderHi, height: 6 },
                  ]}
                />
              </Pressable>
            );
          })}
        </View>

        <Animated.ScrollView
          key={entry.exerciseId}
          entering={FadeIn.duration(180)}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scroll}>
          <Text style={type.caption}>
            Exercise {safeIdx + 1} of {entries.length}
          </Text>
          <Pressable onPress={() => router.push(`/exercise/${entry.exerciseId}`)}>
            <Text style={styles.exName}>{ex?.name}</Text>
            <Text style={type.bodyDim}>{ex?.regionOrHead}</Text>
          </Pressable>

          <ExerciseGif exerciseId={entry.exerciseId} height={180} style={{ marginVertical: space.lg }} />

          {/* current set big editor */}
          <View style={styles.editor}>
            <Text style={[type.label, { color: accent }]}>
              {allDone ? 'All sets done' : `Set ${curSetIdx + 1} of ${entry.sets.length}`}
            </Text>
            <View style={styles.steppers}>
              <Stepper
                label={units.toUpperCase()}
                value={toDisplay(editSet.weight, units)}
                onMinus={() => bumpWeight(-step)}
                onPlus={() => bumpWeight(step)}
              />
              <Stepper
                label="REPS"
                value={editSet.reps}
                onMinus={() => bumpReps(-1)}
                onPlus={() => bumpReps(1)}
              />
            </View>
            {prev?.[editIdx] && (
              <Text style={[type.caption, { textAlign: 'center', marginTop: space.sm }]}>
                Last time · {toDisplay(prev[editIdx].weight, units)}
                {units} × {prev[editIdx].reps}
              </Text>
            )}
          </View>

          <PrimaryButton
            label={allDone ? 'Add Set' : 'Complete Set'}
            icon={allDone ? 'add' : 'checkmark'}
            color={allDone ? colors.surfaceHi : accent}
            textColor={allDone ? colors.text : colors.accentText}
            onPress={completeSet}
            style={{ marginTop: space.lg }}
          />

          {/* set list */}
          <View style={styles.setList}>
            {entry.sets.map((s, i) => (
              <Pressable
                key={i}
                onPress={() => toggleDone(entry.exerciseId, i)}
                style={[styles.setRow, i === editIdx && !allDone && { borderColor: accent }]}>
                <Text style={styles.setNo}>{i + 1}</Text>
                <Text style={styles.setVal}>
                  {toDisplay(s.weight, units)}
                  {units} × {s.reps}
                </Text>
                <Ionicons
                  name={s.done ? 'checkmark-circle' : 'ellipse-outline'}
                  size={24}
                  color={s.done ? colors.good : colors.textFaint}
                />
              </Pressable>
            ))}
          </View>

          {/* exercise nav */}
          <View style={styles.nav}>
            <Pressable
              onPress={() => goto(safeIdx - 1)}
              disabled={safeIdx === 0}
              style={[styles.navBtn, safeIdx === 0 && { opacity: 0.3 }]}>
              <Ionicons name="chevron-back" size={18} color={colors.text} />
              <Text style={type.caption}>Prev</Text>
            </Pressable>
            <Pressable
              onPress={() => goto(safeIdx + 1)}
              disabled={safeIdx === entries.length - 1}
              style={[styles.navBtn, safeIdx === entries.length - 1 && { opacity: 0.3 }]}>
              <Text style={type.caption}>Next</Text>
              <Ionicons name="chevron-forward" size={18} color={colors.text} />
            </Pressable>
          </View>
        </Animated.ScrollView>
      </View>

      <RestTimer
        endsAt={restEndsAt}
        onAdd={(sec) => setRestEndsAt((t) => (t ?? Date.now()) + sec * 1000)}
        onSkip={() => setRestEndsAt(null)}
      />
    </>
  );
}

function Stepper({
  label,
  value,
  onMinus,
  onPlus,
}: {
  label: string;
  value: number;
  onMinus: () => void;
  onPlus: () => void;
}) {
  return (
    <View style={styles.stepper}>
      <Pressable onPress={onMinus} style={styles.stepBtn} hitSlop={6}>
        <Ionicons name="remove" size={22} color={colors.text} />
      </Pressable>
      <View style={styles.stepCenter}>
        <Text style={styles.stepValue}>{value}</Text>
        <Text style={type.caption}>{label}</Text>
      </View>
      <Pressable onPress={onPlus} style={styles.stepBtn} hitSlop={6}>
        <Ionicons name="add" size={22} color={colors.text} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  loading: { flex: 1, backgroundColor: colors.bg, alignItems: 'center', justifyContent: 'center' },
  container: { flex: 1, backgroundColor: colors.bg },
  dots: { flexDirection: 'row', gap: 4, paddingHorizontal: space.lg, paddingTop: space.sm },
  dot: { height: 4, borderRadius: 2 },
  scroll: { padding: space.lg, paddingBottom: 140 },
  exName: { ...type.display, fontSize: 30, marginTop: space.sm },
  editor: {
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    padding: space.xl,
  },
  steppers: { flexDirection: 'row', gap: space.lg, marginTop: space.lg },
  stepper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.surface2,
    borderRadius: radius.lg,
    padding: space.sm,
  },
  stepBtn: {
    width: 44,
    height: 44,
    borderRadius: radius.md,
    backgroundColor: colors.surfaceHi,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepCenter: { alignItems: 'center', flex: 1 },
  stepValue: { ...type.display, fontSize: 28, fontVariant: ['tabular-nums'] },
  setList: { gap: space.sm, marginTop: space.xl },
  setRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.lg,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: 'transparent',
    paddingHorizontal: space.lg,
    paddingVertical: space.md,
  },
  setNo: { ...type.caption, width: 20, fontWeight: '800', color: colors.textDim },
  setVal: { ...type.headline, flex: 1, fontVariant: ['tabular-nums'] },
  nav: { flexDirection: 'row', justifyContent: 'space-between', marginTop: space.xl },
  navBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, padding: space.sm },
});
