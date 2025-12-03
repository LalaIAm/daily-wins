import React from 'react';
import { StyleSheet, Button } from 'react-native';
import { useRouter } from 'expo-router';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

export default function OnboardingWelcome() {
  const router = useRouter();

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title" style={styles.title}>Welcome to Daily Wins!</ThemedText>
      <ThemedText style={styles.description}>
        Celebrate your small victories every day. Build streaks, stay motivated, and achieve your goals.
      </ThemedText>
      
      <Button title="Get Started" onPress={() => router.push('/(onboarding)/permissions')} />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    marginBottom: 20,
    textAlign: 'center',
  },
  description: {
    marginBottom: 40,
    textAlign: 'center',
  },
});
