import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { Provider, useSelector } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { useEffect } from 'react';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { store, persistor, RootState } from '@/store/store';

export const unstable_settings = {
  anchor: '(tabs)',
};

function RootLayoutNav() {
  const colorScheme = useColorScheme();
  const { user, hasCompletedOnboarding, isLoading } = useSelector((state: RootState) => state.auth);
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;

    const inAuthGroup = segments[0] === '(auth)';
    const inOnboardingGroup = segments[0] === '(onboarding)';

    if (!user && !inAuthGroup) {
      // Redirect to login if not logged in and not already in auth group
      router.replace('/(auth)/login');
    } else if (user && !hasCompletedOnboarding && !inOnboardingGroup) {
      // Redirect to onboarding if logged in but not onboarded
      router.replace('/(onboarding)');
    } else if (user && hasCompletedOnboarding && (inAuthGroup || inOnboardingGroup)) {
      // Redirect to home if logged in and onboarded but in auth/onboarding
      router.replace('/(tabs)');
    }
  }, [user, hasCompletedOnboarding, segments, isLoading]);

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="(onboarding)" options={{ headerShown: false }} />
        <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}

export default function RootLayout() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <RootLayoutNav />
      </PersistGate>
    </Provider>
  );
}
