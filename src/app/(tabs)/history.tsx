import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { LineChart } from 'react-native-gifted-charts';

import { Screen } from '@/components/Screen';
import { Body, Card, Pill, Row, SectionTitle, Stat } from '@/components/ui';
import { getExercise } from '@/data/exercises';
import { getDay } from '@/data/program';
import { formatDate, formatDuration } from '@/lib/dates';
import { bestSet, completedSetCount, est1RM, progressSeries, sessionVolume } from '@/lib/prs';
import { toDisplay } from '@/lib/units';
import { useSettingsStore } from '@/store/useSettingsStore';
import { useWorkoutStore } from '@/store/useWorkoutStore';
import { colors, dayColors, font, radius, space } from '@/theme';

export default function HistoryScreen() {
  const sessions = useWorkoutStore((s) => s.sessions);
  const deleteSession = useWorkoutStore((s) => s.deleteSession);
  const units = useSettingsStore((s) => s.units);

  // Exercises that have logged data, most-recent first.
  const trackedIds = useMemo(() => {
    const seen: string[] = [];
    for (const s of sessions) {
      for (const e of s.entries) {
        if (!seen.includes(e.exerciseId)) seen.push(e.exerciseId);
      }
    }
    return seen;
  }, [sessions]);

  const [selected, setSelected] = useState<string | null>(null);
  const activeId = selected && trackedIds.includes(selected) ? selected : trackedIds[0] ?? null;

  if (sessions.length === 0) {
    return (
      <Screen>
        <View style={styles.empty}>
          <Ionicons name="trending-up" size={48} color={colors.textFaint} />
          <Text style={styles.emptyTitle}>No workouts yet</Text>
          <Body style={{ color: colors.textDim, textAlign: 'center' }}>
            Log your first session from the Week tab. Your progress, PRs and charts will appear here.
          </Body>
        </View>
      </Screen>
    );
  }

  const totalVolume = sessions.reduce((v, s) => v + sessionVolume(s), 0);
  const series = activeId ? progressSeries(sessions, activeId) : [];
  const pr = activeId ? bestSet(sessions, activeId) : null;

  return (
    <Screen>
      <Row style={{ gap: space.sm }}>
        <Card style={styles.statCard}>
          <Stat value={String(sessions.length)} label="Workouts" />
        </Card>
        <Card style={styles.statCard}>
          <Stat
            value={`${Math.round(toDisplay(totalVolume, units) / 1000)}k`}
            label={`Volume ${units}`}
            color={colors.accent}
          />
        </Card>
      </Row>

      {/* Progress chart */}
      {activeId && (
        <View>
          <SectionTitle>Progress · est. 1RM ({units})</SectionTitle>
          <Card>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chips}>
              {trackedIds.map((id) => {
                const ex = getExercise(id);
                if (!ex) return null;
                const on = id === activeId;
                return (
                  <Pressable
                    key={id}
                    onPress={() => setSelected(id)}
                    style={[styles.chip, on && { backgroundColor: colors.accent }]}>
                    <Text style={[styles.chipText, on && { color: '#08121F' }]}>{ex.name}</Text>
                  </Pressable>
                );
              })}
            </ScrollView>

            {pr && (
              <Row style={{ justifyContent: 'space-between', marginVertical: space.sm }}>
                <Pill
                  label={`PR  ${toDisplay(pr.weight, units)}${units} × ${pr.reps}`}
                  color={colors.warn}
                />
                <Text style={styles.prE1rm}>
                  est. 1RM {toDisplay(pr.e1rm, units)}
                  {units}
                </Text>
              </Row>
            )}

            {series.length >= 2 ? (
              <LineChart
                data={series.map((p) => ({ value: toDisplay(p.value, units), label: p.label }))}
                color={colors.accent}
                thickness={3}
                dataPointsColor={colors.accent}
                hideRules
                yAxisColor="transparent"
                xAxisColor={colors.border}
                yAxisTextStyle={{ color: colors.textFaint, fontSize: 10 }}
                xAxisLabelTextStyle={{ color: colors.textFaint, fontSize: 9 }}
                height={150}
                adjustToWidth
                initialSpacing={12}
                noOfSections={3}
              />
            ) : (
              <Body style={{ color: colors.textDim, paddingVertical: space.md }}>
                Log this exercise at least twice to see a trend line.
              </Body>
            )}
          </Card>
        </View>
      )}

      {/* Session log */}
      <SectionTitle>History</SectionTitle>
      <View style={{ gap: space.sm }}>
        {sessions.map((s) => {
          const day = getDay(s.dayId);
          const accent = day ? dayColors[day.id] : colors.accent;
          return (
            <Card
              key={s.id}
              accent={accent}
              onPress={() =>
                router.push({ pathname: '/exercise/[id]', params: { id: s.entries[0]?.exerciseId ?? '' } })
              }>
              <Row style={{ justifyContent: 'space-between' }}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.sessName}>{day?.name ?? 'Workout'}</Text>
                  <Text style={styles.sessDate}>{formatDate(s.dateISO)}</Text>
                </View>
                <Row style={{ gap: space.lg }}>
                  <SessionStat value={String(completedSetCount(s))} label="sets" />
                  <SessionStat
                    value={`${toDisplay(sessionVolume(s), units)}`}
                    label={units}
                  />
                  <SessionStat value={formatDuration(s.durationSec)} label="time" />
                  <Pressable hitSlop={8} onPress={() => deleteSession(s.id)}>
                    <Ionicons name="trash-outline" size={18} color={colors.textFaint} />
                  </Pressable>
                </Row>
              </Row>
              <View style={styles.exLine}>
                {s.entries.slice(0, 4).map((e) => {
                  const ex = getExercise(e.exerciseId);
                  const top = Math.max(...e.sets.map((set) => est1RM(set.weight, set.reps)), 0);
                  return (
                    <Text key={e.exerciseId} style={styles.exItem} numberOfLines={1}>
                      {ex?.name ?? e.exerciseId}
                      {top > 0 ? `  ·  ${toDisplay(top, units)}${units}` : ''}
                    </Text>
                  );
                })}
                {s.entries.length > 4 && (
                  <Text style={styles.exItem}>+{s.entries.length - 4} more</Text>
                )}
              </View>
            </Card>
          );
        })}
      </View>
    </Screen>
  );
}

function SessionStat({ value, label }: { value: string; label: string }) {
  return (
    <View style={{ alignItems: 'center' }}>
      <Text style={styles.ssVal}>{value}</Text>
      <Text style={styles.ssLbl}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  empty: { alignItems: 'center', gap: space.md, paddingTop: space.xxl * 2, paddingHorizontal: space.lg },
  emptyTitle: { color: colors.text, fontSize: font.h2, fontWeight: '800' },
  statCard: { flex: 1, paddingVertical: space.md },
  chips: { flexGrow: 0, marginBottom: space.xs },
  chip: {
    backgroundColor: colors.surface2,
    paddingHorizontal: space.md,
    paddingVertical: space.sm,
    borderRadius: radius.pill,
    marginRight: space.sm,
  },
  chipText: { color: colors.textDim, fontSize: font.small, fontWeight: '700' },
  prE1rm: { color: colors.textDim, fontSize: font.small, fontWeight: '600' },
  sessName: { color: colors.text, fontSize: font.h3, fontWeight: '800' },
  sessDate: { color: colors.textDim, fontSize: font.small, marginTop: 2 },
  ssVal: { color: colors.text, fontWeight: '800', fontSize: font.body, fontVariant: ['tabular-nums'] },
  ssLbl: { color: colors.textFaint, fontSize: font.tiny },
  exLine: { marginTop: space.md, gap: 2 },
  exItem: { color: colors.textDim, fontSize: font.small },
});
