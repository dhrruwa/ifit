import { Stack } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { Screen } from '@/components/Screen';
import { SectionHeader, Surface, Tag } from '@/components/kit';
import { ABS_NOTE, ANATOMY, NON_NEGOTIABLES, ORDERING_RULES, SELECTION_RULES } from '@/data/rules';
import { STRETCHES } from '@/data/stretches';
import { WARMUPS } from '@/data/warmups';
import { colors, space, type } from '@/theme';

export default function LearnScreen() {
  return (
    <>
      <Stack.Screen options={{ title: 'Learn' }} />
      <Screen>
        {/* Non-negotiables */}
        <View>
          <SectionHeader title="The non-negotiables" />
          <Surface>
            {NON_NEGOTIABLES.map((n, i) => (
              <View key={n.title} style={[styles.row, i > 0 && styles.divider]}>
                <Text style={type.headline}>{n.title}</Text>
                <Text style={[type.bodyDim, { marginTop: 2 }]}>{n.detail}</Text>
              </View>
            ))}
          </Surface>
        </View>

        {/* Selection rules */}
        <View>
          <SectionHeader title="How to select exercises" />
          <Surface>
            {SELECTION_RULES.map((r, i) => (
              <Rule key={i} n={i + 1} text={r} last={i === SELECTION_RULES.length - 1} />
            ))}
          </Surface>
        </View>

        {/* Ordering rules */}
        <View>
          <SectionHeader title="How to order them" />
          <Surface>
            {ORDERING_RULES.map((r, i) => (
              <Rule key={i} n={i + 1} text={r} last={i === ORDERING_RULES.length - 1} />
            ))}
          </Surface>
        </View>

        {/* Warm-ups */}
        <View>
          <SectionHeader title="Warm-ups" />
          <View style={{ gap: space.md }}>
            {Object.values(WARMUPS).map((w) => (
              <Surface key={w.id}>
                <Text style={type.headline}>{w.title}</Text>
                <View style={{ marginTop: space.md, gap: space.sm }}>
                  {w.steps.map((s, i) => (
                    <View key={i} style={styles.stepLine}>
                      <Text style={[type.body, { flex: 1 }]}>{s.movement}</Text>
                      <Text style={type.caption}>{s.amount}</Text>
                    </View>
                  ))}
                </View>
              </Surface>
            ))}
          </View>
        </View>

        {/* Stretches */}
        <View>
          <SectionHeader title="Post-workout stretches" />
          <View style={{ gap: space.md }}>
            {Object.values(STRETCHES).map((s) => (
              <Surface key={s.key}>
                <Text style={type.headline}>{s.title}</Text>
                <View style={styles.stretchTags}>
                  {s.stretches.map((st, i) => (
                    <Tag key={i} label={st} color={colors.good} />
                  ))}
                </View>
              </Surface>
            ))}
          </View>
        </View>

        {/* Anatomy */}
        <View>
          <SectionHeader title="Muscle anatomy" />
          <View style={{ gap: space.md }}>
            {Object.entries(ANATOMY).map(([muscle, rows]) => (
              <Surface key={muscle}>
                <Text style={type.headline}>{muscle}</Text>
                {rows.map((r, i) => (
                  <View key={i} style={[styles.anRow, i === 0 && { marginTop: space.sm }]}>
                    <Text style={[type.body, { flex: 1 }]}>{r.part}</Text>
                    <Text style={[type.caption, { flex: 1, textAlign: 'right', color: colors.accent }]}>
                      {r.target}
                    </Text>
                  </View>
                ))}
              </Surface>
            ))}
          </View>
        </View>

        {/* Abs note */}
        <Surface style={{ borderLeftWidth: 3, borderLeftColor: colors.warn }}>
          <Text style={type.label}>On abs</Text>
          <Text style={[type.bodyDim, { marginTop: space.sm }]}>{ABS_NOTE}</Text>
        </Surface>
      </Screen>
    </>
  );
}

function Rule({ n, text, last }: { n: number; text: string; last: boolean }) {
  return (
    <View style={[styles.ruleRow, !last && styles.divider]}>
      <View style={styles.ruleNum}>
        <Text style={styles.ruleNumText}>{n}</Text>
      </View>
      <Text style={[type.body, { flex: 1 }]}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { paddingVertical: space.md },
  divider: { borderTopWidth: 1, borderTopColor: colors.border },
  ruleRow: { flexDirection: 'row', gap: space.md, alignItems: 'flex-start', paddingVertical: space.md },
  ruleNum: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: colors.accentDim,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 1,
  },
  ruleNumText: { color: colors.accent, fontWeight: '800', fontSize: 13 },
  stepLine: { flexDirection: 'row', alignItems: 'center', gap: space.md },
  stretchTags: { flexDirection: 'row', flexWrap: 'wrap', gap: space.sm, marginTop: space.md },
  anRow: { flexDirection: 'row', alignItems: 'center', gap: space.md, paddingVertical: 6 },
});
