import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

import { Screen } from '@/components/Screen';
import { Card, Pill, Row } from '@/components/ui';
import { EXERCISES } from '@/data/exercises';
import { MuscleGroup } from '@/types';
import { colors, font, radius, space } from '@/theme';

const GROUPS: MuscleGroup[] = [
  'Chest',
  'Shoulders',
  'Triceps',
  'Back',
  'Biceps',
  'Quads',
  'Hamstrings',
  'Glutes',
  'Calves',
  'Core',
];

export default function LibraryScreen() {
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<MuscleGroup | null>(null);

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

  return (
    <Screen>
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
        {query.length > 0 && (
          <Pressable onPress={() => setQuery('')} hitSlop={8}>
            <Ionicons name="close-circle" size={18} color={colors.textFaint} />
          </Pressable>
        )}
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filters}>
        <Chip label="All" on={filter === null} onPress={() => setFilter(null)} />
        {GROUPS.map((g) => (
          <Chip key={g} label={g} on={filter === g} onPress={() => setFilter(filter === g ? null : g)} />
        ))}
      </ScrollView>

      {grouped.map(({ group, items }) => (
        <View key={group} style={{ gap: space.sm }}>
          <Text style={styles.groupHead}>{group}</Text>
          {items.map((ex) => (
            <Card key={ex.id} onPress={() => router.push(`/exercise/${ex.id}`)}>
              <Row style={{ justifyContent: 'space-between' }}>
                <View style={{ flex: 1, paddingRight: space.sm }}>
                  <Text style={styles.exName}>{ex.name}</Text>
                  <Text style={styles.exMeta}>{ex.regionOrHead}</Text>
                </View>
                <Row style={{ gap: space.sm }}>
                  {ex.compound && <Pill label="COMPOUND" color={colors.warn} />}
                  <Pill label={ex.equipment} color={colors.accent} />
                </Row>
              </Row>
            </Card>
          ))}
        </View>
      ))}
    </Screen>
  );
}

function Chip({ label, on, onPress }: { label: string; on: boolean; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} style={[styles.chip, on && { backgroundColor: colors.accent }]}>
      <Text style={[styles.chipText, on && { color: '#08121F' }]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  search: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.sm,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: space.md,
  },
  searchInput: { flex: 1, color: colors.text, fontSize: font.body, paddingVertical: space.md },
  filters: { flexGrow: 0 },
  chip: {
    backgroundColor: colors.surface2,
    paddingHorizontal: space.md,
    paddingVertical: space.sm,
    borderRadius: radius.pill,
    marginRight: space.sm,
  },
  chipText: { color: colors.textDim, fontSize: font.small, fontWeight: '700' },
  groupHead: {
    color: colors.textDim,
    fontSize: font.small,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    marginTop: space.sm,
  },
  exName: { color: colors.text, fontSize: font.body, fontWeight: '700' },
  exMeta: { color: colors.textDim, fontSize: font.small, marginTop: 2 },
});
