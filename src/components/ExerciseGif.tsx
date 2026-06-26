import { Image } from 'expo-image';
import { useState } from 'react';
import { ActivityIndicator, StyleSheet, View, ViewStyle } from 'react-native';

import { gifUrl } from '@/data/exerciseGifs';
import { colors, radius } from '@/theme';

/**
 * Animated exercise demonstration. Streams a GIF from the jsDelivr CDN and
 * caches it on disk (works offline after first view). Renders nothing if the
 * exercise has no mapped animation or the image fails to load.
 */
export function ExerciseGif({
  exerciseId,
  height = 230,
  style,
}: {
  exerciseId: string;
  height?: number;
  style?: ViewStyle;
}) {
  const uri = gifUrl(exerciseId);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);

  if (!uri || failed) return null;

  return (
    <View style={[styles.wrap, { height }, style]}>
      {loading && (
        <ActivityIndicator style={StyleSheet.absoluteFill} color={colors.accent} />
      )}
      <Image
        source={{ uri }}
        style={StyleSheet.absoluteFill}
        contentFit="contain"
        cachePolicy="memory-disk"
        transition={150}
        onLoadEnd={() => setLoading(false)}
        onError={() => {
          setFailed(true);
          setLoading(false);
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    backgroundColor: '#FFFFFF',
    borderRadius: radius.lg,
    overflow: 'hidden',
  },
});
