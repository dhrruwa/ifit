import { Stack, useLocalSearchParams } from 'expo-router';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { ExerciseGif } from '@/components/ExerciseGif';
import { MiniLineChart } from '@/components/MiniLineChart';
import { Screen } from '@/components/Screen';
import { SectionHeader, Surface, Tag } from '@/components/kit';
import { getExercise } from '@/data/exercises';
import { getMeta } from '@/data/exerciseMeta';
import { PROGRAM } from '@/data/program';
import { difficultyOf } from '@/lib/difficulty';
import { bestSet, progressSeries } from '@/lib/prs';
import { toDisplay } from '@/lib/units';
import { useSettingsStore } from '@/store/useSettingsStore';
import { useWorkoutStore } from '@/store/useWorkoutStore';
import { colors, space, type } from '@/theme';

export default function ExerciseScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const ex = getExercise(id);
  const sessions = useWorkoutStore((s) => s.sessions);
  const units = useSettingsStore((s) => s.units);

  if (!ex) {
    return (
      <Screen>
        <Text style={type.body}>Exercise not found.</Text>
      </Screen>
    );
  }

  const meta = getMeta(ex.id);
  const diff = difficultyOf(ex);
  const pr = bestSet(sessions, ex.id);
  const series = progressSeries(sessions, ex.id);
  const appearsIn = PROGRAM.filter((d) => d.slots.some((s) => s.exerciseId === ex.id));

  return (
    <>
      <Stack.Screen options={{ title: '' }} />
      <Screen>
        <View>
          <Text style={type.display}>{ex.name}</Text>
          <View style={styles.tags}>
            <Tag label={ex.muscleGroup} color={colors.accent} />
            <Tag label={ex.equipment} color={colors.textDim} />
            <Tag label={diff.label} color={diff.color} />
            {ex.compound && <Tag label="Compound" color={colors.warn} />}
          </View>
        </View>

        <ExerciseGif exerciseId={ex.id} height={230} />

        {/* Primary / secondary muscles */}
        <Surface style={styles.muscles}>
          <View style={{ flex: 1 }}>
            <Text style={type.label}>Primary</Text>
            <Text style={[type.headline, { marginTop: 4 }]}>{ex.muscleGroup}</Text>
            <Text style={type.caption}>{ex.regionOrHead}</Text>
          </View>
          <View style={styles.muscleDivider} />
          <View style={{ flex: 1 }}>
            <Text style={type.label}>Secondary</Text>
            <Text style={[type.headline, { marginTop: 4 }]}>
              {meta?.secondaryMuscles.length ? meta.secondaryMuscles.join(', ') : '—'}
            </Text>
          </View>
        </Surface>

        {/* Why it's programmed */}
        <Surface>
          <Text style={type.label}>Why this exercise</Text>
          <Text style={[type.body, { marginTop: space.sm }]}>{ex.why}</Text>
        </Surface>

        {/* How to perform */}
        {meta?.instructions.length ? (
          <View>
            <SectionHeader title="How to perform" />
            <Surface>
              {meta.instructions.map((step, i) => (
                <View key={i} style={[styles.stepRow, i > 0 && styles.stepDivider]}>
                  <View style={styles.stepNum}>
                    <Text style={styles.stepNumText}>{i + 1}</Text>
                  </View>
                  <Text style={[type.body, { flex: 1 }]}>{step}</Text>
                </View>
              ))}
            </Surface>
          </View>
        ) : null}

        {/* Progress */}
        {pr && (
          <View>
            <SectionHeader title="Your progress" />
            <Surface>
              <View style={styles.prRow}>
                <Tag label={`PR · ${toDisplay(pr.weight, units)}${units} × ${pr.reps}`} color={colors.warn} />
                <Text style={type.caption}>
                  est. 1RM {toDisplay(pr.e1rm, units)}
                  {units}
                </Text>
              </View>
              {series.length >= 2 ? (
                <MiniLineChart
                  data={series.map((p) => ({ value: toDisplay(p.value, units), label: p.label }))}
                  color={colors.accent}
                  height={140}
                  suffix={units}
                />
              ) : (
                <Text style={[type.bodyDim, { marginTop: space.sm }]}>
                  Log this exercise again to chart your trend.
                </Text>
              )}
            </Surface>
          </View>
        )}

        {/* In program */}
        {appearsIn.length > 0 && (
          <View>
            <SectionHeader title="In your program" />
            <View style={styles.programTags}>
              {appearsIn.map((d) => (
                <Tag key={d.id} label={d.name} color={colors.good} />
              ))}
            </View>
          </View>
        )}
      </Screen>
    </>
  );
}

const styles = StyleSheet.create({
  tags: { flexDirection: 'row', flexWrap: 'wrap', gap: space.sm, marginTop: space.md },
  muscles: { flexDirection: 'row', alignItems: 'center' },
  muscleDivider: { width: 1, alignSelf: 'stretch', backgroundColor: colors.border, marginHorizontal: space.lg },
  stepRow: { flexDirection: 'row', gap: space.md, alignItems: 'flex-start', paddingVertical: space.md },
  stepDivider: { borderTopWidth: 1, borderTopColor: colors.border },
  stepNum: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: colors.accentDim,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepNumText: { color: colors.accent, fontWeight: '800', fontSize: 13 },
  prRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: space.md },
  programTags: { flexDirection: 'row', flexWrap: 'wrap', gap: space.sm },
});
