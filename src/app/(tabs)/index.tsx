import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { AnimatedNumber } from '@/components/AnimatedNumber';
import { ProgressRing } from '@/components/ProgressRing';
import { Screen } from '@/components/Screen';
import { PrimaryButton, ProgressBar, Surface, Tag } from '@/components/kit';
import { getExercise } from '@/data/exercises';
import { todaysDay } from '@/lib/dates';
import { haptic } from '@/lib/motion';
import {
  currentStreak,
  recentPR,
  weekSessions,
  weeklyVolume,
} from '@/lib/stats';
import { toDisplay } from '@/lib/units';
import { useSettingsStore } from '@/store/useSettingsStore';
import { useWorkoutStore } from '@/store/useWorkoutStore';
import { colors, dayColors, space, type } from '@/theme';

function greeting(h = new Date().getHours()): string {
  if (h < 12) return 'Good Morning';
  if (h < 18) return 'Good Afternoon';
  return 'Good Evening';
}

export default function HomeScreen() {
  const today = todaysDay();
  const sessions = useWorkoutStore((s) => s.sessions);
  const active = useWorkoutStore((s) => s.active);
  const startWorkout = useWorkoutStore((s) => s.startWorkout);
  const name = useSettingsStore((s) => s.name);
  const units = useSettingsStore((s) => s.units);

  const streak = currentStreak(sessions);
  const week = weekSessions(sessions);
  const volume = weeklyVolume(sessions);
  const pr = recentPR(sessions);
  const prEx = pr ? getExercise(pr.exerciseId) : null;

  const sets = today.slots.reduce((n, s) => n + s.sets, 0);
  const estMin = Math.round(sets * 2.5 + 10);

  const begin = () => {
    if (!active) startWorkout(today.id);
    haptic.press();
    router.push(`/workout/${today.id}`);
  };

  return (
    <Screen>
      {/* Greeting + streak ring */}
      <Animated.View entering={FadeInDown.duration(260)} style={styles.headerRow}>
        <View style={{ flex: 1 }}>
          <Text style={type.caption}>{greeting()}</Text>
          <Text style={type.display}>{name || 'Athlete'}</Text>
        </View>
        <ProgressRing progress={Math.min(streak / 7, 1)} size={72} stroke={7} color={colors.accent}>
          <AnimatedNumber value={streak} style={styles.streakNum} />
          <Text style={styles.streakLbl}>day{streak === 1 ? '' : 's'}</Text>
        </ProgressRing>
      </Animated.View>

      {/* Today's workout hero */}
      <Animated.View entering={FadeInDown.duration(260).delay(60)}>
        <Surface padded style={styles.hero}>
          <View style={styles.heroTop}>
            <Tag label="TODAY" color={dayColors[today.id]} />
            {!today.rest && <Text style={type.caption}>{estMin} min</Text>}
          </View>
          <Text style={styles.heroName}>{today.name}</Text>
          <Text style={type.bodyDim}>{today.focus}</Text>

          {today.rest ? (
            <View style={styles.restRow}>
              <Ionicons name="bed-outline" size={18} color={colors.textDim} />
              <Text style={type.bodyDim}>Recovery day — rest, stretch, refuel.</Text>
            </View>
          ) : (
            <>
              <Text style={[type.caption, { marginTop: space.sm }]}>
                {today.slots.length} exercises · {sets} sets
              </Text>
              <PrimaryButton
                label={active ? 'Continue Workout' : 'Start Workout'}
                icon="play"
                color={active ? colors.good : colors.accent}
                onPress={begin}
                style={{ marginTop: space.lg }}
              />
            </>
          )}
        </Surface>
      </Animated.View>

      {/* This week */}
      <Animated.View entering={FadeInDown.duration(260).delay(120)}>
        <Surface style={styles.weekCard}>
          <View style={styles.weekHead}>
            <Text style={type.label}>This Week</Text>
            <Text style={type.caption}>
              {week.done} / {week.target} sessions
            </Text>
          </View>
          <ProgressBar progress={week.target ? week.done / week.target : 0} />
          <View style={styles.weekStats}>
            <View>
              <AnimatedNumber
                value={toDisplay(volume, units)}
                style={type.title}
                format={(n) => `${Math.round(n).toLocaleString()}`}
              />
              <Text style={type.caption}>Volume ({units})</Text>
            </View>
            <View style={styles.weekDivider} />
            <View>
              <Text style={type.title}>{sessions.length}</Text>
              <Text style={type.caption}>Total workouts</Text>
            </View>
          </View>
        </Surface>
      </Animated.View>

      {/* Recent PR */}
      <Animated.View entering={FadeInDown.duration(260).delay(180)}>
        {pr && prEx ? (
          <Surface
            onPress={() => router.push(`/exercise/${prEx.id}`)}
            style={styles.prCard}>
            <View style={styles.prIcon}>
              <Ionicons name="trophy" size={20} color={colors.warn} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={type.label}>Recent PR</Text>
              <Text style={type.headline}>{prEx.name}</Text>
            </View>
            <Text style={styles.prValue}>
              {toDisplay(pr.weight, units)}
              {units} × {pr.reps}
            </Text>
          </Surface>
        ) : (
          <Surface style={styles.prCard}>
            <View style={styles.prIcon}>
              <Ionicons name="trophy-outline" size={20} color={colors.textFaint} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={type.headline}>No PRs yet</Text>
              <Text style={type.bodyDim}>Log your first workout to set a record.</Text>
            </View>
          </Surface>
        )}
      </Animated.View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  headerRow: { flexDirection: 'row', alignItems: 'center', gap: space.lg, marginTop: space.sm },
  streakNum: { ...type.title, fontSize: 22, fontWeight: '800', color: colors.text },
  streakLbl: { ...type.caption, fontSize: 10, marginTop: -2 },
  hero: { gap: 4 },
  heroTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: space.sm,
  },
  heroName: { ...type.display, fontSize: 40 },
  restRow: { flexDirection: 'row', alignItems: 'center', gap: space.sm, marginTop: space.md },
  weekCard: { gap: space.lg },
  weekHead: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  weekStats: { flexDirection: 'row', alignItems: 'center', gap: space.xl },
  weekDivider: { width: 1, height: 36, backgroundColor: colors.border },
  prCard: { flexDirection: 'row', alignItems: 'center', gap: space.lg },
  prIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.surface2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  prValue: { ...type.title, fontSize: 18, color: colors.text },
});
