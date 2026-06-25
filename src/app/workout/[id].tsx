import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useKeepAwake } from 'expo-keep-awake';
import { router, Stack, useLocalSearchParams } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { RestTimer } from '@/components/RestTimer';
import { Screen } from '@/components/Screen';
import { Body, Pill, Row } from '@/components/ui';
import { getExercise } from '@/data/exercises';
import { getDay } from '@/data/program';
import { formatDuration } from '@/lib/dates';
import { toDisplay, toKg } from '@/lib/units';
import { useSettingsStore } from '@/store/useSettingsStore';
import { useWorkoutStore } from '@/store/useWorkoutStore';
import { colors, dayColors, font, radius, space } from '@/theme';

const REST_SEC = 120;

export default function WorkoutScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  useKeepAwake();

  const active = useWorkoutStore((s) => s.active);
  const startWorkout = useWorkoutStore((s) => s.startWorkout);
  const finishWorkout = useWorkoutStore((s) => s.finishWorkout);
  const cancelWorkout = useWorkoutStore((s) => s.cancelWorkout);
  const units = useSettingsStore((s) => s.units);

  const [restEndsAt, setRestEndsAt] = useState<number | null>(null);
  const [elapsed, setElapsed] = useState(0);

  // Ensure a session exists (e.g. on deep link / reload).
  useEffect(() => {
    if (!active && id) startWorkout(id);
  }, [active, id, startWorkout]);

  // Elapsed timer.
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
      <Screen scroll={false}>
        <Body>Starting workout…</Body>
      </Screen>
    );
  }

  const onFinish = () => {
    const saved = finishWorkout();
    if (saved) {
      router.dismissAll?.();
      router.replace('/history');
    } else {
      Alert.alert('Nothing logged', 'Complete at least one set before finishing.');
    }
  };

  const confirmCancel = () => {
    Alert.alert('Discard workout?', 'Your logged sets will be lost.', [
      { text: 'Keep going', style: 'cancel' },
      {
        text: 'Discard',
        style: 'destructive',
        onPress: () => {
          cancelWorkout();
          router.back();
        },
      },
    ]);
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: `${day.name} Workout`,
          headerTintColor: accent,
          headerLeft: () => (
            <Pressable onPress={confirmCancel} hitSlop={10}>
              <Text style={{ color: colors.danger, fontWeight: '700', fontSize: font.body }}>
                Discard
              </Text>
            </Pressable>
          ),
          headerRight: () => (
            <Pressable onPress={onFinish} hitSlop={10}>
              <Text style={{ color: colors.good, fontWeight: '800', fontSize: font.body }}>
                Finish
              </Text>
            </Pressable>
          ),
        }}
      />
      <Screen>
        <Row style={styles.timerRow}>
          <Ionicons name="time-outline" size={18} color={colors.textDim} />
          <Text style={styles.timer}>{formatDuration(elapsed)}</Text>
          <Text style={styles.timerLabel}>elapsed</Text>
        </Row>

        {active.entries.map((entry) => (
          <ExerciseBlock
            key={entry.exerciseId}
            exerciseId={entry.exerciseId}
            target={slotMap[entry.exerciseId]}
            accent={accent}
            units={units}
            onSetCompleted={() => {
              Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
              setRestEndsAt(Date.now() + REST_SEC * 1000);
            }}
          />
        ))}
      </Screen>

      <RestTimer
        endsAt={restEndsAt}
        onAdd={(sec) => setRestEndsAt((t) => (t ?? Date.now()) + sec * 1000)}
        onSkip={() => setRestEndsAt(null)}
      />
    </>
  );
}

function ExerciseBlock({
  exerciseId,
  target,
  accent,
  units,
  onSetCompleted,
}: {
  exerciseId: string;
  target?: { sets: number; reps: string };
  accent: string;
  units: 'kg' | 'lb';
  onSetCompleted: () => void;
}) {
  const ex = getExercise(exerciseId);
  const entry = useWorkoutStore((s) => s.active?.entries.find((e) => e.exerciseId === exerciseId));
  const updateSet = useWorkoutStore((s) => s.updateSet);
  const toggleDone = useWorkoutStore((s) => s.toggleDone);
  const addSet = useWorkoutStore((s) => s.addSet);
  const removeSet = useWorkoutStore((s) => s.removeSet);

  if (!ex || !entry) return null;

  return (
    <View style={styles.block}>
      <Pressable onPress={() => router.push(`/exercise/${ex.id}`)}>
        <Row style={{ justifyContent: 'space-between' }}>
          <Text style={styles.blockName}>{ex.name}</Text>
          {target && <Pill label={`target ${target.sets}×${target.reps}`} color={accent} />}
        </Row>
        <Text style={styles.blockMeta}>{ex.regionOrHead}</Text>
      </Pressable>

      <Row style={styles.colHead}>
        <Text style={[styles.colSet]}>SET</Text>
        <Text style={[styles.colInput, styles.colLbl]}>{units.toUpperCase()}</Text>
        <Text style={[styles.colInput, styles.colLbl]}>REPS</Text>
        <View style={styles.colDone} />
      </Row>

      {entry.sets.map((set, i) => (
        <Row key={i} style={[styles.setRow, set.done && { backgroundColor: accent + '14' }]}>
          <Text style={styles.colSet}>{i + 1}</Text>
          <TextInput
            style={[styles.input, styles.colInput]}
            keyboardType="decimal-pad"
            placeholder="0"
            placeholderTextColor={colors.textFaint}
            defaultValue={set.weight ? String(toDisplay(set.weight, units)) : ''}
            onChangeText={(t) =>
              updateSet(exerciseId, i, { weight: toKg(parseFloat(t) || 0, units) })
            }
          />
          <TextInput
            style={[styles.input, styles.colInput]}
            keyboardType="number-pad"
            placeholder="0"
            placeholderTextColor={colors.textFaint}
            defaultValue={set.reps ? String(set.reps) : ''}
            onChangeText={(t) => updateSet(exerciseId, i, { reps: parseInt(t, 10) || 0 })}
          />
          <Pressable
            style={styles.colDone}
            onPress={() => {
              const wasDone = set.done;
              toggleDone(exerciseId, i);
              if (!wasDone) onSetCompleted();
            }}
            onLongPress={() => removeSet(exerciseId, i)}>
            <Ionicons
              name={set.done ? 'checkmark-circle' : 'ellipse-outline'}
              size={28}
              color={set.done ? colors.good : colors.textFaint}
            />
          </Pressable>
        </Row>
      ))}

      <Pressable onPress={() => addSet(exerciseId)} style={styles.addSet}>
        <Ionicons name="add" size={16} color={accent} />
        <Text style={[styles.addSetText, { color: accent }]}>Add set</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  timerRow: { gap: space.xs, alignItems: 'center' },
  timer: { color: colors.text, fontSize: font.h3, fontWeight: '800', fontVariant: ['tabular-nums'] },
  timerLabel: { color: colors.textFaint, fontSize: font.small },
  block: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: space.lg,
    gap: space.xs,
  },
  blockName: { color: colors.text, fontSize: font.h3, fontWeight: '800', flex: 1 },
  blockMeta: { color: colors.textDim, fontSize: font.small, marginBottom: space.sm },
  colHead: { marginTop: space.xs, paddingHorizontal: space.xs },
  colLbl: { color: colors.textFaint, fontSize: font.tiny, fontWeight: '700', textAlign: 'center' },
  colSet: { width: 36, color: colors.textDim, fontWeight: '700', textAlign: 'center', fontSize: font.small },
  colInput: { flex: 1 },
  colDone: { width: 44, alignItems: 'center', justifyContent: 'center' },
  setRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: space.xs,
    borderRadius: radius.sm,
  },
  input: {
    backgroundColor: colors.surface2,
    borderRadius: radius.sm,
    marginHorizontal: space.xs,
    paddingVertical: space.sm,
    color: colors.text,
    fontSize: font.body,
    fontWeight: '700',
    textAlign: 'center',
  },
  addSet: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: space.xs,
    paddingVertical: space.sm,
    marginTop: space.xs,
  },
  addSetText: { fontWeight: '700', fontSize: font.small },
});
