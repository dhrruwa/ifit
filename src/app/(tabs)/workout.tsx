import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { Screen } from '@/components/Screen';
import { PrimaryButton, SectionHeader, Surface, Tag } from '@/components/kit';
import { getExercise } from '@/data/exercises';
import { PROGRAM } from '@/data/program';
import { ProgramDay } from '@/types';
import { todaysDay } from '@/lib/dates';
import { haptic } from '@/lib/motion';
import { useWorkoutStore } from '@/store/useWorkoutStore';
import { colors, dayColors, space, type } from '@/theme';

function estMinutes(day: ProgramDay): number {
  const sets = day.slots.reduce((n, s) => n + s.sets, 0);
  return Math.round(sets * 2.5 + 10);
}

export default function WorkoutTab() {
  const today = todaysDay();
  const active = useWorkoutStore((s) => s.active);
  const startWorkout = useWorkoutStore((s) => s.startWorkout);

  const activeDay = active ? PROGRAM.find((d) => d.id === active.dayId) : null;

  const begin = (day: ProgramDay) => {
    if (!active) startWorkout(day.id);
    haptic.press();
    router.push(`/workout/${day.id}`);
  };

  return (
    <Screen>
      <Text style={[type.display, { marginTop: space.sm }]}>Workout</Text>

      {/* Resume banner */}
      {activeDay && (
        <Surface onPress={() => router.push(`/workout/${activeDay.id}`)} style={styles.resume}>
          <View style={{ flex: 1 }}>
            <Text style={[type.label, { color: colors.good }]}>In progress</Text>
            <Text style={[type.title, { marginTop: 4 }]}>{activeDay.name}</Text>
            <Text style={type.bodyDim}>Tap to resume logging</Text>
          </View>
          <Ionicons name="play-circle" size={40} color={colors.good} />
        </Surface>
      )}

      {/* Today's session hero */}
      {!today.rest ? (
        <Surface padded style={styles.hero}>
          <View style={styles.heroTop}>
            <Tag label="TODAY" color={dayColors[today.id]} />
            <Text style={type.caption}>{estMinutes(today)} min</Text>
          </View>
          <Text style={styles.heroName}>{today.name}</Text>
          <Text style={type.bodyDim}>{today.focus}</Text>
          <Text style={[type.caption, { marginTop: space.sm }]}>
            {today.slots.length} exercises ·{' '}
            {today.slots.reduce((n, s) => n + s.sets, 0)} sets
          </Text>
          <PrimaryButton
            label={active ? 'Continue Workout' : 'Start Workout'}
            icon="play"
            color={active ? colors.good : colors.accent}
            onPress={() => begin(today)}
            style={{ marginTop: space.lg }}
          />
        </Surface>
      ) : (
        <Surface style={styles.rest}>
          <Ionicons name="bed-outline" size={28} color={colors.textDim} />
          <View style={{ flex: 1 }}>
            <Text style={type.title}>Rest Day</Text>
            <Text style={type.bodyDim}>Recover — walk, stretch, sleep, hit your protein.</Text>
          </View>
        </Surface>
      )}

      {/* Pick another day */}
      <View>
        <SectionHeader title="Train another day" />
        <View style={{ gap: space.sm }}>
          {PROGRAM.filter((d) => !d.rest).map((d) => (
            <Surface key={d.id} onPress={() => router.push(`/day/${d.id}`)} style={styles.dayRow} padded={false}>
              <View style={[styles.dot, { backgroundColor: dayColors[d.id] }]} />
              <View style={{ flex: 1 }}>
                <Text style={type.headline}>{d.name}</Text>
                <Text style={type.caption}>{d.focus}</Text>
              </View>
              <Text style={[type.caption, { marginRight: space.sm }]}>{d.slots.length} ex</Text>
              <Ionicons name="chevron-forward" size={18} color={colors.textFaint} />
            </Surface>
          ))}
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  resume: { flexDirection: 'row', alignItems: 'center', gap: space.lg },
  hero: { gap: 4 },
  heroTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: space.sm },
  heroName: { ...type.display, fontSize: 40, marginTop: space.xs },
  rest: { flexDirection: 'row', alignItems: 'center', gap: space.lg },
  dayRow: { flexDirection: 'row', alignItems: 'center', gap: space.lg, padding: space.lg },
  dot: { width: 10, height: 10, borderRadius: 5 },
});
