import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Screen } from '@/components/Screen';
import { Body, Card, Row, SectionTitle } from '@/components/ui';
import { ABS_NOTE, NON_NEGOTIABLES, ORDERING_RULES, SELECTION_RULES } from '@/data/rules';
import { useSettingsStore } from '@/store/useSettingsStore';
import { Units } from '@/types';
import { colors, font, radius, space } from '@/theme';

export default function InfoScreen() {
  const units = useSettingsStore((s) => s.units);
  const setUnits = useSettingsStore((s) => s.setUnits);
  const bodyweightKg = useSettingsStore((s) => s.bodyweightKg);
  const setBodyweight = useSettingsStore((s) => s.setBodyweight);

  // Protein target derived from bodyweight (1.8 g/kg midpoint of 1.6–2.0).
  const proteinLow = Math.round(bodyweightKg * 1.6);
  const proteinHigh = Math.round(bodyweightKg * 2.0);

  return (
    <Screen>
      {/* Settings */}
      <SectionTitle>Settings</SectionTitle>
      <Card>
        <Row style={{ justifyContent: 'space-between' }}>
          <Body style={{ fontWeight: '700' }}>Units</Body>
          <Row style={styles.toggle}>
            {(['kg', 'lb'] as Units[]).map((u) => (
              <Pressable
                key={u}
                onPress={() => setUnits(u)}
                style={[styles.toggleBtn, units === u && { backgroundColor: colors.accent }]}>
                <Text style={[styles.toggleText, units === u && { color: '#08121F' }]}>{u}</Text>
              </Pressable>
            ))}
          </Row>
        </Row>
        <View style={styles.divider} />
        <Row style={{ justifyContent: 'space-between' }}>
          <Body style={{ fontWeight: '700' }}>Bodyweight</Body>
          <Row style={{ gap: space.md, alignItems: 'center' }}>
            <Pressable hitSlop={8} onPress={() => setBodyweight(Math.max(30, bodyweightKg - 1))}>
              <Ionicons name="remove-circle-outline" size={26} color={colors.textDim} />
            </Pressable>
            <Text style={styles.bwValue}>
              {units === 'kg' ? Math.round(bodyweightKg) : Math.round(bodyweightKg / 0.45359237)}
              {units}
            </Text>
            <Pressable hitSlop={8} onPress={() => setBodyweight(bodyweightKg + 1)}>
              <Ionicons name="add-circle-outline" size={26} color={colors.textDim} />
            </Pressable>
          </Row>
        </Row>
        <View style={styles.divider} />
        <Row style={{ justifyContent: 'space-between' }}>
          <Body style={{ fontWeight: '700' }}>Daily protein target</Body>
          <Text style={[styles.bwValue, { color: colors.good }]}>
            {proteinLow}–{proteinHigh} g
          </Text>
        </Row>
      </Card>

      {/* Non-negotiables */}
      <SectionTitle>The Non-Negotiables</SectionTitle>
      <Card accent={colors.good}>
        {NON_NEGOTIABLES.map((n, i) => (
          <View key={n.title} style={[styles.nnRow, i > 0 && styles.divided]}>
            <Text style={styles.nnTitle}>{n.title}</Text>
            <Body style={{ color: colors.textDim }}>{n.detail}</Body>
          </View>
        ))}
      </Card>

      {/* Selection rules */}
      <SectionTitle>How to select exercises</SectionTitle>
      <Card>
        {SELECTION_RULES.map((r, i) => (
          <RuleRow key={i} n={i + 1} text={r} />
        ))}
      </Card>

      {/* Ordering rules */}
      <SectionTitle>How to order them (the flow)</SectionTitle>
      <Card>
        {ORDERING_RULES.map((r, i) => (
          <RuleRow key={i} n={i + 1} text={r} />
        ))}
      </Card>

      {/* Abs note */}
      <SectionTitle>On abs</SectionTitle>
      <Card accent={colors.warn}>
        <Body style={{ color: colors.textDim }}>{ABS_NOTE}</Body>
      </Card>

      <Text style={styles.footer}>
        iFit · built from The Complete 5-Day Training Bible{'\n'}
        Exercise animations: ExerciseGymGifsDB (jsDelivr) · GIFs © their authors
      </Text>
    </Screen>
  );
}

function RuleRow({ n, text }: { n: number; text: string }) {
  return (
    <Row style={[styles.ruleRow, n > 1 && styles.divided]}>
      <View style={styles.ruleNum}>
        <Text style={styles.ruleNumText}>{n}</Text>
      </View>
      <Body style={{ flex: 1 }}>{text}</Body>
    </Row>
  );
}

const styles = StyleSheet.create({
  toggle: { backgroundColor: colors.surface2, borderRadius: radius.sm, padding: 2 },
  toggleBtn: { paddingHorizontal: space.lg, paddingVertical: space.xs, borderRadius: radius.sm - 2 },
  toggleText: { color: colors.textDim, fontWeight: '800', fontSize: font.small },
  divider: { height: 1, backgroundColor: colors.border, marginVertical: space.md },
  bwValue: { color: colors.text, fontSize: font.h3, fontWeight: '800', minWidth: 64, textAlign: 'center' },
  nnRow: { paddingVertical: space.sm },
  divided: { borderTopWidth: 1, borderTopColor: colors.border },
  nnTitle: { color: colors.text, fontSize: font.body, fontWeight: '800' },
  ruleRow: { gap: space.md, paddingVertical: space.sm, alignItems: 'flex-start' },
  ruleNum: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.accentDim,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 1,
  },
  ruleNumText: { color: colors.accent, fontWeight: '800', fontSize: font.small },
  footer: {
    color: colors.textFaint,
    fontSize: font.tiny,
    textAlign: 'center',
    marginTop: space.lg,
  },
});
