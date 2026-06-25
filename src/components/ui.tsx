import { ReactNode } from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native';

import { colors, font, radius, space } from '@/theme';

export function Card({
  children,
  style,
  onPress,
  accent,
}: {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
  onPress?: () => void;
  accent?: string;
}) {
  const content = (
    <View
      style={[
        styles.card,
        accent ? { borderLeftWidth: 3, borderLeftColor: accent } : null,
        style,
      ]}>
      {children}
    </View>
  );
  if (onPress) {
    return (
      <Pressable onPress={onPress} style={({ pressed }) => (pressed ? styles.pressed : null)}>
        {content}
      </Pressable>
    );
  }
  return content;
}

export function Pill({ label, color = colors.accent }: { label: string; color?: string }) {
  return (
    <View style={[styles.pill, { backgroundColor: color + '22', borderColor: color + '55' }]}>
      <Text style={[styles.pillText, { color }]}>{label}</Text>
    </View>
  );
}

export function SectionTitle({ children, style }: { children: ReactNode; style?: StyleProp<TextStyle> }) {
  return <Text style={[styles.sectionTitle, style]}>{children}</Text>;
}

export function Sub({ children, style }: { children: ReactNode; style?: StyleProp<TextStyle> }) {
  return <Text style={[styles.sub, style]}>{children}</Text>;
}

export function Title({ children, style }: { children: ReactNode; style?: StyleProp<TextStyle> }) {
  return <Text style={[styles.title, style]}>{children}</Text>;
}

export function Body({ children, style }: { children: ReactNode; style?: StyleProp<TextStyle> }) {
  return <Text style={[styles.body, style]}>{children}</Text>;
}

export function Button({
  label,
  onPress,
  color = colors.accent,
  variant = 'solid',
  loading,
  style,
}: {
  label: string;
  onPress: () => void;
  color?: string;
  variant?: 'solid' | 'outline' | 'ghost';
  loading?: boolean;
  style?: StyleProp<ViewStyle>;
}) {
  const isSolid = variant === 'solid';
  const isOutline = variant === 'outline';
  return (
    <Pressable
      onPress={onPress}
      disabled={loading}
      style={({ pressed }) => [
        styles.button,
        isSolid && { backgroundColor: color },
        isOutline && { borderWidth: 1.5, borderColor: color },
        pressed && { opacity: 0.7 },
        style,
      ]}>
      {loading ? (
        <ActivityIndicator color={isSolid ? '#000' : color} />
      ) : (
        <Text
          style={[
            styles.buttonText,
            { color: isSolid ? '#08121F' : color },
          ]}>
          {label}
        </Text>
      )}
    </Pressable>
  );
}

export function Divider() {
  return <View style={styles.divider} />;
}

export function Stat({ value, label, color = colors.text }: { value: string; label: string; color?: string }) {
  return (
    <View style={styles.stat}>
      <Text style={[styles.statValue, { color }]}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

export function Row({ children, style }: { children: ReactNode; style?: StyleProp<ViewStyle> }) {
  return <View style={[styles.row, style]}>{children}</View>;
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: space.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  pressed: { opacity: 0.75, transform: [{ scale: 0.99 }] },
  pill: {
    paddingHorizontal: space.sm,
    paddingVertical: 3,
    borderRadius: radius.pill,
    borderWidth: 1,
    alignSelf: 'flex-start',
  },
  pillText: { fontSize: font.tiny, fontWeight: '700' },
  sectionTitle: {
    color: colors.textDim,
    fontSize: font.small,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    marginBottom: space.sm,
  },
  title: { color: colors.text, fontSize: font.h2, fontWeight: '800' },
  sub: { color: colors.textDim, fontSize: font.small },
  body: { color: colors.text, fontSize: font.body, lineHeight: 21 },
  button: {
    height: 50,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: space.lg,
  },
  buttonText: { fontSize: font.body, fontWeight: '800' },
  divider: { height: 1, backgroundColor: colors.border, marginVertical: space.md },
  stat: { alignItems: 'center', flex: 1 },
  statValue: { fontSize: font.h2, fontWeight: '800' },
  statLabel: { color: colors.textDim, fontSize: font.tiny, marginTop: 2, textTransform: 'uppercase', letterSpacing: 0.5 },
  row: { flexDirection: 'row', alignItems: 'center' },
});
