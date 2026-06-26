import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { colors } from '@/theme';

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <StatusBar style="light" />
        <Stack
          screenOptions={{
            headerStyle: { backgroundColor: colors.bg },
            headerTintColor: colors.text,
            headerTitleStyle: { fontWeight: '800' },
            headerShadowVisible: false,
            contentStyle: { backgroundColor: colors.bg },
          }}>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="day/[id]" options={{ title: '' }} />
          <Stack.Screen
            name="workout/[id]"
            options={{ title: 'Workout', headerBackVisible: false }}
          />
          <Stack.Screen name="workout/complete" options={{ headerShown: false, gestureEnabled: false }} />
          <Stack.Screen name="exercise/[id]" options={{ title: '' }} />
          <Stack.Screen name="learn" options={{ title: 'Learn' }} />
        </Stack>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
