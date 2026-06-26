import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { Screen } from '@/components/Screen';
import { ListRow, PrimaryButton, SectionHeader, SegmentedControl, Surface } from '@/components/kit';
import { haptic } from '@/lib/motion';
import { currentStreak } from '@/lib/stats';
import { toDisplay, toKg } from '@/lib/units';
import { useSettingsStore } from '@/store/useSettingsStore';
import { useWorkoutStore } from '@/store/useWorkoutStore';
import { Units } from '@/types';
import { colors, radius, space, type } from '@/theme';

export default function ProfileScreen() {
  const name = useSettingsStore((s) => s.name);
  const setName = useSettingsStore((s) => s.setName);
  const units = useSettingsStore((s) => s.units);
  const setUnits = useSettingsStore((s) => s.setUnits);
  const bodyweightKg = useSettingsStore((s) => s.bodyweightKg);
  const setBodyweight = useSettingsStore((s) => s.setBodyweight);
  const logBodyweight = useSettingsStore((s) => s.logBodyweight);
  const sessions = useWorkoutStore((s) => s.sessions);

  const streak = currentStreak(sessions);
  const proteinLow = Math.round(bodyweightKg * 1.6);
  const proteinHigh = Math.round(bodyweightKg * 2.0);
  const step = units === 'kg' ? 0.5 : 1;
  const bumpWeight = (d: number) => {
    setBodyweight(Math.max(20, toKg(toDisplay(bodyweightKg, units) + d, units)));
    haptic.select();
  };
  const initial = (name.trim()[0] || 'A').toUpperCase();

  return (
    <Screen>
      <Text style={[type.display, { marginTop: space.sm }]}>Profile</Text>

      {/* Identity */}
      <Surface style={styles.idCard}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{initial}</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={type.label}>Your name</Text>
          <TextInput
            style={styles.nameInput}
            value={name}
            onChangeText={setName}
            placeholder="Add your name"
            placeholderTextColor={colors.textFaint}
            returnKeyType="done"
          />
        </View>
        <View style={styles.idStat}>
          <Text style={styles.idStatVal}>{streak}</Text>
          <Text style={type.caption}>streak</Text>
        </View>
      </Surface>

      {/* Bodyweight */}
      <View>
        <SectionHeader title="Bodyweight" />
        <Surface>
          <View style={styles.bwRow}>
            <Pressable onPress={() => bumpWeight(-step)} style={styles.bwBtn} hitSlop={6}>
              <Ionicons name="remove" size={22} color={colors.text} />
            </Pressable>
            <View style={{ alignItems: 'center' }}>
              <Text style={styles.bwValue}>{toDisplay(bodyweightKg, units)}</Text>
              <Text style={type.caption}>{units}</Text>
            </View>
            <Pressable onPress={() => bumpWeight(step)} style={styles.bwBtn} hitSlop={6}>
              <Ionicons name="add" size={22} color={colors.text} />
            </Pressable>
          </View>
          <PrimaryButton
            label="Log today's weight"
            icon="trending-up"
            color={colors.surfaceHi}
            textColor={colors.text}
            onPress={() => {
              logBodyweight(bodyweightKg);
              haptic.success();
            }}
            style={{ marginTop: space.lg }}
          />
          <Text style={[type.caption, { textAlign: 'center', marginTop: space.sm }]}>
            Logs a dated entry for your Progress → Weight chart.
          </Text>
        </Surface>
      </View>

      {/* Preferences */}
      <View>
        <SectionHeader title="Preferences" />
        <Surface style={{ gap: space.lg }}>
          <View style={styles.prefRow}>
            <Text style={type.body}>Units</Text>
            <View style={{ width: 140 }}>
              <SegmentedControl
                value={units}
                onChange={(u: Units) => setUnits(u)}
                options={[
                  { value: 'kg', label: 'kg' },
                  { value: 'lb', label: 'lb' },
                ]}
              />
            </View>
          </View>
          <View style={styles.divider} />
          <View style={styles.prefRow}>
            <Text style={type.body}>Daily protein target</Text>
            <Text style={[type.headline, { color: colors.good }]}>
              {proteinLow}–{proteinHigh} g
            </Text>
          </View>
        </Surface>
      </View>

      {/* Learn */}
      <View>
        <SectionHeader title="Learn" />
        <Surface padded={false} style={{ paddingHorizontal: space.lg }}>
          <ListRow
            title="Training principles"
            subtitle="Selection & ordering rules, the non-negotiables"
            left={<Ionicons name="bulb-outline" size={22} color={colors.accent} />}
            onPress={() => router.push('/learn')}
          />
        </Surface>
      </View>

      <Text style={styles.footer}>
        iFit · The 5-Day Training Bible{'\n'}
        Exercise animations & cues: ExerciseGymGifsDB · © their authors
      </Text>
    </Screen>
  );
}

const styles = StyleSheet.create({
  idCard: { flexDirection: 'row', alignItems: 'center', gap: space.lg },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.accentDim,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { ...type.title, color: colors.accent, fontWeight: '800' },
  nameInput: { ...type.headline, color: colors.text, paddingVertical: 2, marginTop: 2 },
  idStat: { alignItems: 'center' },
  idStatVal: { ...type.title, fontWeight: '800', color: colors.text },
  bwRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  bwBtn: {
    width: 52,
    height: 52,
    borderRadius: radius.lg,
    backgroundColor: colors.surface2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bwValue: { ...type.display, fontSize: 36, fontVariant: ['tabular-nums'] },
  prefRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  divider: { height: 1, backgroundColor: colors.border },
  footer: { ...type.caption, textAlign: 'center', marginTop: space.lg, lineHeight: 18 },
});
