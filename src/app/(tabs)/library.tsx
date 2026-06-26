import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

import { Screen } from '@/components/Screen';
import { ListRow, SectionHeader, Surface, Tag } from '@/components/kit';
import { EXERCISES, getExercise } from '@/data/exercises';
import { difficultyOf } from '@/lib/difficulty';
import { recentExerciseIds } from '@/lib/stats';
import { haptic } from '@/lib/motion';
import { useWorkoutStore } from '@/store/useWorkoutStore';
import { Exercise, MuscleGroup } from '@/types';
import { colors, radius, space, type } from '@/theme';

const GROUPS: MuscleGroup[] = [
  'Chest', 'Shoulders', 'Triceps', 'Back', 'Biceps',
  'Quads', 'Hamstrings', 'Glutes', 'Calves', 'Core',
];

function rowTags(ex: Exercise) {
  const diff = difficultyOf(ex);
  return (
    <>
      {ex.compound && <Tag label="Compound" color={colors.warn} />}
      <Tag label={ex.equipment} color={colors.textDim} />
      <Tag label={diff.label} color={diff.color} />
    </>
  );
}

export default function LibraryScreen() {
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<MuscleGroup | null>(null);
  const sessions = useWorkoutStore((s) => s.sessions);

  const recents = useMemo(
    () => recentExerciseIds(sessions, 6).map(getExercise).filter(Boolean) as Exercise[],
    [sessions]
  );

  const grouped = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = EXERCISES.filter((e) => {
      if (filter && e.muscleGroup !== filter) return false;
      if (!q) return true;
      return (
        e.name.toLowerCase().includes(q) ||
        e.muscleGroup.toLowerCase().includes(q) ||
        e.regionOrHead.toLowerCase().includes(q)
      );
    });
    return GROUPS.map((g) => ({ group: g, items: list.filter((e) => e.muscleGroup === g) })).filter(
      (s) => s.items.length > 0
    );
  }, [query, filter]);

  const go = (id: string) => router.push(`/exercise/${id}`);
  const searching = query.trim().length > 0;

  return (
    <Screen>
      <Text style={[type.display, { marginTop: space.sm }]}>Library</Text>

      <View style={styles.search}>
        <Ionicons name="search" size={18} color={colors.textFaint} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search exercises…"
          placeholderTextColor={colors.textFaint}
          value={query}
          onChangeText={setQuery}
          autoCorrect={false}
        />
        {searching && (
          <Pressable onPress={() => setQuery('')} hitSlop={8}>
            <Ionicons name="close-circle" size={18} color={colors.textFaint} />
          </Pressable>
        )}
      </View>

      {!searching && (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filters}>
          <Chip label="All" on={filter === null} onPress={() => setFilter(null)} />
          {GROUPS.map((g) => (
            <Chip key={g} label={g} on={filter === g} onPress={() => setFilter(filter === g ? null : g)} />
          ))}
        </ScrollView>
      )}

      {/* Recently used */}
      {!searching && !filter && recents.length > 0 && (
        <View>
          <SectionHeader title="Recently used" />
          <Surface padded={false} style={styles.group}>
            {recents.map((ex, i) => (
              <View key={ex.id} style={i > 0 ? styles.divider : undefined}>
                <ListRow title={ex.name} subtitle={ex.regionOrHead} tags={rowTags(ex)} onPress={() => go(ex.id)} />
              </View>
            ))}
          </Surface>
        </View>
      )}

      {/* Grouped catalog */}
      {grouped.map(({ group, items }) => (
        <View key={group}>
          <SectionHeader title={group} />
          <Surface padded={false} style={styles.group}>
            {items.map((ex, i) => (
              <View key={ex.id} style={i > 0 ? styles.divider : undefined}>
                <ListRow title={ex.name} subtitle={ex.regionOrHead} tags={rowTags(ex)} onPress={() => go(ex.id)} />
              </View>
            ))}
          </Surface>
        </View>
      ))}

      {grouped.length === 0 && (
        <Text style={[type.bodyDim, { textAlign: 'center', marginTop: space.xl }]}>
          No exercises match “{query}”.
        </Text>
      )}
    </Screen>
  );
}

function Chip({ label, on, onPress }: { label: string; on: boolean; onPress: () => void }) {
  return (
    <Pressable
      onPress={() => {
        haptic.select();
        onPress();
      }}
      style={[styles.chip, on && { backgroundColor: colors.accent }]}>
      <Text style={[styles.chipText, on && { color: colors.accentText }]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  search: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.sm,
    backgroundColor: colors.surface2,
    borderRadius: radius.md,
    paddingHorizontal: space.lg,
  },
  searchInput: { flex: 1, color: colors.text, fontSize: 15, paddingVertical: space.md },
  filters: { flexGrow: 0 },
  chip: {
    backgroundColor: colors.surface2,
    paddingHorizontal: space.lg,
    paddingVertical: space.sm,
    borderRadius: radius.pill,
    marginRight: space.sm,
  },
  chipText: { color: colors.textDim, fontSize: 13, fontWeight: '700' },
  group: { paddingHorizontal: space.lg },
  divider: { borderTopWidth: 1, borderTopColor: colors.border },
});
