import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { AnimatedNumber } from '@/components/AnimatedNumber';
import { MiniLineChart } from '@/components/MiniLineChart';
import { Screen } from '@/components/Screen';
import { SectionHeader, SegmentedControl, StatTile, Surface, Tag } from '@/components/kit';
import { getExercise } from '@/data/exercises';
import { getDay } from '@/data/program';
import { formatDate, formatDuration } from '@/lib/dates';
import { haptic } from '@/lib/motion';
import { completedSetCount, est1RM, progressSeries, sessionVolume } from '@/lib/prs';
import {
  currentStreak,
  frequencySeries,
  recentExerciseIds,
  totalPRs,
  volumeSeries,
  weeklyVolume,
} from '@/lib/stats';
import { toDisplay } from '@/lib/units';
import { useSettingsStore } from '@/store/useSettingsStore';
import { useWorkoutStore } from '@/store/useWorkoutStore';
import { colors, dayColors, radius, space, type } from '@/theme';

type ChartKind = 'volume' | 'freq' | 'weight' | 'strength';

export default function ProgressScreen() {
  const sessions = useWorkoutStore((s) => s.sessions);
  const deleteSession = useWorkoutStore((s) => s.deleteSession);
  const units = useSettingsStore((s) => s.units);
  const bodyweightKg = useSettingsStore((s) => s.bodyweightKg);
  const bodyweightLog = useSettingsStore((s) => s.bodyweightLog);

  const [kind, setKind] = useState<ChartKind>('volume');
  const tracked = useMemo(() => recentExerciseIds(sessions, 20), [sessions]);
  const [exId, setExId] = useState<string | null>(null);
  const activeEx = exId && tracked.includes(exId) ? exId : tracked[0] ?? null;

  const streak = currentStreak(sessions);
  const wkVol = weeklyVolume(sessions);
  const prs = totalPRs(sessions);

  const chartData = useMemo(() => {
    if (kind === 'volume')
      return volumeSeries(sessions).map((p) => ({ value: toDisplay(p.value, units), label: p.label }));
    if (kind === 'freq') return frequencySeries(sessions);
    if (kind === 'weight')
      return bodyweightLog.map((e) => ({
        value: toDisplay(e.kg, units),
        label: `${new Date(e.dateISO).getMonth() + 1}/${new Date(e.dateISO).getDate()}`,
      }));
    return activeEx
      ? progressSeries(sessions, activeEx).map((p) => ({ value: toDisplay(p.value, units), label: p.label }))
      : [];
  }, [kind, sessions, units, bodyweightLog, activeEx]);

  const chartColor = kind === 'weight' ? colors.good : kind === 'freq' ? colors.warn : colors.accent;
  const chartSuffix = kind === 'freq' ? '' : units;

  if (sessions.length === 0 && bodyweightLog.length === 0) {
    return (
      <Screen>
        <Text style={[type.display, { marginTop: space.sm }]}>Progress</Text>
        <View style={styles.empty}>
          <Ionicons name="stats-chart" size={44} color={colors.textFaint} />
          <Text style={type.title}>No data yet</Text>
          <Text style={[type.bodyDim, { textAlign: 'center' }]}>
            Log your first workout and your streak, volume, PRs and charts will build here.
          </Text>
        </View>
      </Screen>
    );
  }

  return (
    <Screen>
      <Text style={[type.display, { marginTop: space.sm }]}>Progress</Text>

      {/* Stat tiles 2x2 */}
      <View style={{ gap: space.md }}>
        <View style={styles.tileRow}>
          <StatTile
            icon="flame"
            accent={colors.warn}
            value={<AnimatedNumber value={streak} style={styles.tileVal} />}
            label="Day streak"
          />
          <StatTile
            icon="barbell"
            accent={colors.accent}
            value={<AnimatedNumber value={toDisplay(wkVol, units)} style={styles.tileVal} format={(n) => `${Math.round(n).toLocaleString()}`} />}
            label={`Week vol (${units})`}
          />
        </View>
        <View style={styles.tileRow}>
          <StatTile
            icon="body"
            accent={colors.good}
            value={<AnimatedNumber value={toDisplay(bodyweightKg, units)} style={styles.tileVal} />}
            label={`Weight (${units})`}
          />
          <StatTile
            icon="trophy"
            accent={colors.warn}
            value={<AnimatedNumber value={prs} style={styles.tileVal} />}
            label="PRs set"
          />
        </View>
      </View>

      {/* Charts */}
      <View>
        <SectionHeader title="Analytics" />
        <Surface>
          <SegmentedControl
            value={kind}
            onChange={setKind}
            options={[
              { value: 'volume', label: 'Volume' },
              { value: 'freq', label: 'Sessions' },
              { value: 'weight', label: 'Weight' },
              { value: 'strength', label: 'Strength' },
            ]}
          />

          {kind === 'strength' && tracked.length > 0 && (
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.exChips}>
              {tracked.map((id) => {
                const ex = getExercise(id);
                if (!ex) return null;
                const on = id === activeEx;
                return (
                  <Pressable
                    key={id}
                    onPress={() => {
                      haptic.select();
                      setExId(id);
                    }}
                    style={[styles.exChip, on && { backgroundColor: colors.accent }]}>
                    <Text style={[styles.exChipText, on && { color: colors.accentText }]}>{ex.name}</Text>
                  </Pressable>
                );
              })}
            </ScrollView>
          )}

          <View style={{ marginTop: space.lg }}>
            {chartData.length >= 2 ? (
              <MiniLineChart data={chartData} color={chartColor} height={170} suffix={chartSuffix} />
            ) : (
              <Text style={[type.bodyDim, { paddingVertical: space.xl, textAlign: 'center' }]}>
                {kind === 'weight'
                  ? 'Log your bodyweight twice (in Profile) to see a trend.'
                  : 'Not enough data yet — keep logging.'}
              </Text>
            )}
          </View>
        </Surface>
      </View>

      {/* Session history */}
      {sessions.length > 0 && (
        <View>
          <SectionHeader title="History" />
          <View style={{ gap: space.md }}>
            {sessions.map((s) => {
              const day = getDay(s.dayId);
              const accent = day ? dayColors[day.id] : colors.accent;
              return (
                <Surface key={s.id} onPress={() => router.push(`/exercise/${s.entries[0]?.exerciseId ?? ''}`)}>
                  <View style={styles.sessHead}>
                    <View style={styles.sessLeft}>
                      <View style={[styles.dot, { backgroundColor: accent }]} />
                      <View>
                        <Text style={type.headline}>{day?.name ?? 'Workout'}</Text>
                        <Text style={type.caption}>{formatDate(s.dateISO)}</Text>
                      </View>
                    </View>
                    <Pressable hitSlop={8} onPress={() => deleteSession(s.id)}>
                      <Ionicons name="trash-outline" size={18} color={colors.textFaint} />
                    </Pressable>
                  </View>
                  <View style={styles.sessStats}>
                    <Mini label="sets" value={String(completedSetCount(s))} />
                    <Mini label={units} value={`${toDisplay(sessionVolume(s), units)}`} />
                    <Mini label="time" value={formatDuration(s.durationSec)} />
                  </View>
                  <View style={styles.sessTags}>
                    {s.entries.slice(0, 3).map((e) => {
                      const ex = getExercise(e.exerciseId);
                      const top = Math.max(...e.sets.map((st) => est1RM(st.weight, st.reps)), 0);
                      return (
                        <Tag
                          key={e.exerciseId}
                          label={`${ex?.name ?? e.exerciseId}${top > 0 ? ` · ${toDisplay(top, units)}${units}` : ''}`}
                        />
                      );
                    })}
                    {s.entries.length > 3 && <Tag label={`+${s.entries.length - 3}`} />}
                  </View>
                </Surface>
              );
            })}
          </View>
        </View>
      )}
    </Screen>
  );
}

function Mini({ value, label }: { value: string; label: string }) {
  return (
    <View style={{ alignItems: 'center' }}>
      <Text style={[type.headline, { fontVariant: ['tabular-nums'] }]}>{value}</Text>
      <Text style={type.caption}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  empty: { alignItems: 'center', gap: space.md, paddingTop: space.huge },
  tileRow: { flexDirection: 'row', gap: space.md },
  tileVal: { ...type.title, fontSize: 26, fontWeight: '800', color: colors.text },
  exChips: { flexGrow: 0, marginTop: space.lg },
  exChip: {
    backgroundColor: colors.surface2,
    paddingHorizontal: space.md,
    paddingVertical: space.sm,
    borderRadius: radius.pill,
    marginRight: space.sm,
  },
  exChipText: { color: colors.textDim, fontSize: 12, fontWeight: '700' },
  sessHead: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  sessLeft: { flexDirection: 'row', alignItems: 'center', gap: space.md },
  dot: { width: 10, height: 10, borderRadius: 5 },
  sessStats: { flexDirection: 'row', justifyContent: 'space-around', marginTop: space.lg },
  sessTags: { flexDirection: 'row', flexWrap: 'wrap', gap: space.sm, marginTop: space.lg },
});
