import { Ionicons } from '@expo/vector-icons';
import { ReactNode } from 'react';
import {
  Pressable,
  StyleProp,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from 'react-native';
import Animated from 'react-native-reanimated';

import { haptic, usePressScale } from '@/lib/motion';
import { colors, elevation, radius, space, type } from '@/theme';

/** Floating card — shadow + spacing, nothing glued to edges. */
export function Surface({
  children,
  style,
  onPress,
  padded = true,
  raised = false,
}: {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
  onPress?: () => void;
  padded?: boolean;
  raised?: boolean;
}) {
  const press = usePressScale(0.985);
  const body = (
    <View
      style={[
        styles.surface,
        raised ? elevation.raised : elevation.card,
        padded && { padding: space.xl },
        style,
      ]}>
      {children}
    </View>
  );
  if (!onPress) return body;
  return (
    <Animated.View style={press.style}>
      <Pressable
        onPress={() => {
          haptic.tap();
          onPress();
        }}
        onPressIn={press.onPressIn}
        onPressOut={press.onPressOut}>
        {body}
      </Pressable>
    </Animated.View>
  );
}

/** Uppercase section header with optional trailing action. */
export function SectionHeader({
  title,
  action,
  onAction,
}: {
  title: string;
  action?: string;
  onAction?: () => void;
}) {
  return (
    <View style={styles.sectionHeader}>
      <Text style={type.label}>{title}</Text>
      {action && (
        <Pressable onPress={onAction} hitSlop={8}>
          <Text style={[type.label, { color: colors.accent }]}>{action}</Text>
        </Pressable>
      )}
    </View>
  );
}

/** Compact stat tile for dashboards. */
export function StatTile({
  value,
  label,
  icon,
  accent = colors.text,
  style,
}: {
  value: ReactNode;
  label: string;
  icon?: keyof typeof Ionicons.glyphMap;
  accent?: string;
  style?: StyleProp<ViewStyle>;
}) {
  return (
    <Surface style={[styles.tile, style]} padded={false}>
      {icon && <Ionicons name={icon} size={18} color={accent} style={{ marginBottom: space.sm }} />}
      {typeof value === 'string' || typeof value === 'number' ? (
        <Text style={[styles.tileValue, { color: accent }]}>{value}</Text>
      ) : (
        value
      )}
      <Text style={styles.tileLabel}>{label}</Text>
    </Surface>
  );
}

/** Small subtle tag (equipment, difficulty, day). */
export function Tag({ label, color = colors.textDim }: { label: string; color?: string }) {
  return (
    <View style={[styles.tag, { borderColor: color + '40' }]}>
      <Text style={[styles.tagText, { color }]}>{label}</Text>
    </View>
  );
}

/** Thin progress bar. */
export function ProgressBar({
  progress,
  color = colors.accent,
  height = 8,
}: {
  progress: number;
  color?: string;
  height?: number;
}) {
  return (
    <View style={[styles.barTrack, { height, borderRadius: height / 2 }]}>
      <View
        style={{
          width: `${Math.max(0, Math.min(1, progress)) * 100}%`,
          backgroundColor: color,
          height,
          borderRadius: height / 2,
        }}
      />
    </View>
  );
}

/** Compact tappable list row (library, settings). */
export function ListRow({
  title,
  subtitle,
  left,
  right,
  tags,
  onPress,
}: {
  title: string;
  subtitle?: string;
  left?: ReactNode;
  right?: ReactNode;
  tags?: ReactNode;
  onPress?: () => void;
}) {
  return (
    <Pressable
      onPress={() => {
        if (onPress) {
          haptic.tap();
          onPress();
        }
      }}
      style={({ pressed }) => [styles.row, pressed && onPress ? { opacity: 0.6 } : null]}>
      {left}
      <View style={{ flex: 1 }}>
        <Text style={type.headline} numberOfLines={1}>
          {title}
        </Text>
        {subtitle && (
          <Text style={[type.caption, { marginTop: 2 }]} numberOfLines={1}>
            {subtitle}
          </Text>
        )}
        {tags && <View style={styles.rowTags}>{tags}</View>}
      </View>
      {right ?? <Ionicons name="chevron-forward" size={18} color={colors.textFaint} />}
    </Pressable>
  );
}

/** Segmented control / pill toggle. */
export function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
}: {
  options: { value: T; label: string }[];
  value: T;
  onChange: (v: T) => void;
}) {
  return (
    <View style={styles.segment}>
      {options.map((o) => {
        const on = o.value === value;
        return (
          <Pressable
            key={o.value}
            onPress={() => {
              haptic.select();
              onChange(o.value);
            }}
            style={[styles.segItem, on && styles.segItemOn]}>
            <Text style={[styles.segText, on && { color: colors.text }]}>{o.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

/** Big primary action button with press scale + haptic. */
export function PrimaryButton({
  label,
  onPress,
  icon,
  color = colors.accent,
  textColor = colors.accentText,
  style,
}: {
  label: string;
  onPress: () => void;
  icon?: keyof typeof Ionicons.glyphMap;
  color?: string;
  textColor?: string;
  style?: StyleProp<ViewStyle>;
}) {
  const press = usePressScale(0.97);
  return (
    <Animated.View style={press.style}>
      <Pressable
        onPress={() => {
          haptic.press();
          onPress();
        }}
        onPressIn={press.onPressIn}
        onPressOut={press.onPressOut}
        style={[styles.primary, { backgroundColor: color }, style]}>
        {icon && <Ionicons name={icon} size={20} color={textColor} />}
        <Text style={[styles.primaryText, { color: textColor }]}>{label}</Text>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  surface: { backgroundColor: colors.surface, borderRadius: radius.xl },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: space.md,
  },
  tile: { padding: space.lg, flex: 1, minHeight: 96, justifyContent: 'center' },
  tileValue: { ...type.title, fontSize: 26, fontWeight: '800' },
  tileLabel: { ...type.caption, marginTop: 2 },
  tag: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: radius.pill,
    borderWidth: 1,
    alignSelf: 'flex-start',
  },
  tagText: { fontSize: 11, fontWeight: '700', letterSpacing: 0.3 },
  barTrack: { backgroundColor: colors.surface2, overflow: 'hidden', width: '100%' },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.lg,
    paddingVertical: space.md,
  },
  rowTags: { flexDirection: 'row', gap: space.sm, marginTop: space.sm },
  segment: {
    flexDirection: 'row',
    backgroundColor: colors.surface2,
    borderRadius: radius.md,
    padding: 3,
  },
  segItem: {
    flex: 1,
    paddingVertical: space.sm,
    alignItems: 'center',
    borderRadius: radius.sm,
  },
  segItemOn: { backgroundColor: colors.surfaceHi },
  segText: { ...type.caption, fontWeight: '700', color: colors.textDim },
  primary: {
    height: 56,
    borderRadius: radius.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: space.sm,
  },
  primaryText: { fontSize: 17, fontWeight: '800', letterSpacing: 0.2 },
});
