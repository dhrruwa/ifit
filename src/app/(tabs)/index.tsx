import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Screen } from '@/components/Screen';
import { Body, Card, Pill, Row, SectionTitle } from '@/components/ui';
import { PROGRAM } from '@/data/program';
import { isToday, todaysDay } from '@/lib/dates';
import { useWorkoutStore } from '@/store/useWorkoutStore';
import { colors, dayColors, font, radius, space } from '@/theme';

export default function WeekScreen() {
  const today = todaysDay();
  const active = useWorkoutStore((s) => s.active);

  return (
    <Screen>
      <View style={styles.header}>
        <Text style={styles.brand}>iFit</Text>
        <Text style={styles.tagline}>The 5-Day Training Bible</Text>
      </View>

      {/* Today's hero card */}
      <Pressable
        onPress={() => router.push(`/day/${today.id}`)}
        style={({ pressed }) => pressed && { opacity: 0.85 }}>
        <View style={[styles.hero, { borderColor: dayColors[today.id] + '66' }]}>
          <Row style={{ justifyContent: 'space-between' }}>
            <Pill label="TODAY" color={dayColors[today.id]} />
            <Text style={styles.heroEmoji}>{today.emoji}</Text>
          </Row>
          <Text style={styles.heroName}>{today.name}</Text>
          <Text style={styles.heroFocus}>{today.focus}</Text>

          {today.rest ? (
            <View style={styles.restRow}>
              <Ionicons name="bed-outline" size={18} color={colors.textDim} />
              <Body style={{ color: colors.textDim }}>Recovery — walk, stretch, sleep, eat.</Body>
            </View>
          ) : (
            <View
              style={[
                styles.cta,
                { backgroundColor: active?.dayId ? colors.good : dayColors[today.id] },
              ]}>
              <Ionicons name="play" size={16} color="#08121F" />
              <Text style={styles.ctaText}>
                {active ? 'Continue workout' : 'View & start workout'}
              </Text>
            </View>
          )}
        </View>
      </Pressable>

      {active && (
        <Card accent={colors.good} onPress={() => router.push(`/workout/${active.dayId}`)}>
          <Row style={{ justifyContent: 'space-between' }}>
            <View>
              <Text style={styles.resumeTitle}>Workout in progress</Text>
              <Body style={{ color: colors.textDim }}>Tap to resume logging</Body>
            </View>
            <Ionicons name="chevron-forward" size={22} color={colors.textDim} />
          </Row>
        </Card>
      )}

      <SectionTitle>The Week</SectionTitle>
      <View style={{ gap: space.sm }}>
        {PROGRAM.map((d) => (
          <Card
            key={d.id}
            accent={dayColors[d.id]}
            onPress={() => router.push(`/day/${d.id}`)}
            style={isToday(d) ? { borderColor: dayColors[d.id] + '88' } : undefined}>
            <Row style={{ justifyContent: 'space-between' }}>
              <View style={{ flex: 1 }}>
                <Row style={{ gap: space.sm }}>
                  <Text style={styles.dayName}>{d.name}</Text>
                  {isToday(d) && <Pill label="TODAY" color={dayColors[d.id]} />}
                </Row>
                <Text style={styles.dayFocus}>{d.focus}</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={colors.textFaint} />
            </Row>
          </Card>
        ))}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: { marginBottom: space.xs },
  brand: { color: colors.text, fontSize: 34, fontWeight: '900', letterSpacing: -1 },
  tagline: { color: colors.textDim, fontSize: font.small },
  hero: {
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    borderWidth: 1.5,
    padding: space.xl,
    gap: space.xs,
  },
  heroEmoji: { fontSize: 22 },
  heroName: { color: colors.text, fontSize: font.h1, fontWeight: '900', marginTop: space.sm },
  heroFocus: { color: colors.textDim, fontSize: font.body },
  cta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: space.sm,
    borderRadius: radius.md,
    paddingVertical: space.md,
    marginTop: space.lg,
  },
  ctaText: { color: '#08121F', fontWeight: '800', fontSize: font.body },
  restRow: { flexDirection: 'row', alignItems: 'center', gap: space.sm, marginTop: space.md },
  resumeTitle: { color: colors.text, fontWeight: '800', fontSize: font.h3 },
  dayName: { color: colors.text, fontSize: font.h3, fontWeight: '800' },
  dayFocus: { color: colors.textDim, fontSize: font.small, marginTop: 2 },
});
