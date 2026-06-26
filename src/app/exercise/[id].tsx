import { Stack, useLocalSearchParams } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { ExerciseGif } from '@/components/ExerciseGif';
import { MiniLineChart } from '@/components/MiniLineChart';
import { Screen } from '@/components/Screen';
import { Body, Card, Pill, Row, SectionTitle } from '@/components/ui';
import { getExercise } from '@/data/exercises';
import { PROGRAM } from '@/data/program';
import { ANATOMY } from '@/data/rules';
import { bestSet, progressSeries } from '@/lib/prs';
import { toDisplay } from '@/lib/units';
import { useSettingsStore } from '@/store/useSettingsStore';
import { useWorkoutStore } from '@/store/useWorkoutStore';
import { colors, font, radius, space } from '@/theme';

export default function ExerciseScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const ex = getExercise(id);
  const sessions = useWorkoutStore((s) => s.sessions);
  const units = useSettingsStore((s) => s.units);

  if (!ex) {
    return (
      <Screen>
        <Body>Exercise not found.</Body>
      </Screen>
    );
  }

  const anatomy = ANATOMY[ex.muscleGroup] ?? [];
  const pr = bestSet(sessions, ex.id);
  const series = progressSeries(sessions, ex.id);
  const appearsIn = PROGRAM.filter((d) => d.slots.some((s) => s.exerciseId === ex.id));

  return (
    <>
      <Stack.Screen options={{ title: ex.muscleGroup }} />
      <Screen>
        <View>
          <Text style={styles.name}>{ex.name}</Text>
          <Row style={{ gap: space.sm, marginTop: space.sm, flexWrap: 'wrap' }}>
            <Pill label={ex.muscleGroup} color={colors.accent} />
            <Pill label={ex.equipment} color={colors.textDim} />
            {ex.compound && <Pill label="COMPOUND" color={colors.warn} />}
          </Row>
        </View>

        <ExerciseGif exerciseId={ex.id} height={240} />

        <Card accent={colors.accent}>
          <SectionTitle style={{ marginBottom: space.xs }}>Targets · {ex.regionOrHead}</SectionTitle>
          <Body>{ex.why}</Body>
        </Card>

        {/* Personal progress */}
        {pr ? (
          <View>
            <SectionTitle>Your progress</SectionTitle>
            <Card>
              <Row style={{ justifyContent: 'space-between', marginBottom: space.sm }}>
                <Pill
                  label={`PR  ${toDisplay(pr.weight, units)}${units} × ${pr.reps}`}
                  color={colors.warn}
                />
                <Text style={styles.e1rm}>
                  est. 1RM {toDisplay(pr.e1rm, units)}
                  {units}
                </Text>
              </Row>
              {series.length >= 2 ? (
                <MiniLineChart
                  data={series.map((p) => ({ value: toDisplay(p.value, units), label: p.label }))}
                  color={colors.accent}
                  height={140}
                  suffix={units}
                />
              ) : (
                <Body style={{ color: colors.textDim }}>
                  Log this exercise again to chart your trend.
                </Body>
              )}
            </Card>
          </View>
        ) : null}

        {/* Anatomy */}
        <View>
          <SectionTitle>{ex.muscleGroup} anatomy</SectionTitle>
          <Card>
            {anatomy.map((row, i) => (
              <View key={i} style={[styles.anRow, i > 0 && styles.divided]}>
                <Text style={styles.anPart}>{row.part}</Text>
                <Row style={{ justifyContent: 'space-between', marginTop: 2 }}>
                  <Text style={styles.anDoes}>{row.does}</Text>
                  <Text style={styles.anTarget}>{row.target}</Text>
                </Row>
              </View>
            ))}
          </Card>
        </View>

        {appearsIn.length > 0 && (
          <View>
            <SectionTitle>In your program</SectionTitle>
            <Row style={{ gap: space.sm, flexWrap: 'wrap' }}>
              {appearsIn.map((d) => (
                <Pill key={d.id} label={`${d.name}`} color={colors.good} />
              ))}
            </Row>
          </View>
        )}
      </Screen>
    </>
  );
}

const styles = StyleSheet.create({
  name: { color: colors.text, fontSize: font.h1, fontWeight: '900' },
  e1rm: { color: colors.textDim, fontSize: font.small, fontWeight: '600' },
  anRow: { paddingVertical: space.sm },
  divided: { borderTopWidth: 1, borderTopColor: colors.border },
  anPart: { color: colors.text, fontSize: font.body, fontWeight: '700' },
  anDoes: { color: colors.textDim, fontSize: font.small, flex: 1 },
  anTarget: { color: colors.accent, fontSize: font.small, fontWeight: '600', textAlign: 'right', flex: 1 },
});
