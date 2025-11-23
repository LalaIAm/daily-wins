import React, { useState } from 'react';
import { StyleSheet, Button, Alert, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { registerForPushNotificationsAsync } from '@/services/notifications';
import { savePushToken } from '@/services/user';

export default function OnboardingPermissions() {
  const router = useRouter();
  const { user } = useSelector((state: RootState) => state.auth);
  const [loading, setLoading] = useState(false);

  const handleEnableNotifications = async () => {
    setLoading(true);
    try {
      if (Platform.OS === 'web') {
        alert('Push notifications are not fully supported on web for this demo.');
        nextStep();
        return;
      }

      const token = await registerForPushNotificationsAsync();
      if (token && user?.uid) {
        await savePushToken(user.uid, token);
      } else {
         // Proceed even if failed, but maybe warn?
         // Alert.alert('Notice', 'Could not get push token.');
      }

      nextStep();
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to enable notifications');
      setLoading(false);
    }
  };

  const handleSkip = () => {
    nextStep();
  };

  const nextStep = () => {
    router.push('/(onboarding)/demo');
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title" style={styles.title}>Stay Consistent</ThemedText>
      <ThemedText style={styles.description}>
        Enable notifications to get daily reminders and streak alerts. We won't spam you.
      </ThemedText>
      
      <Button title="Enable Notifications" onPress={handleEnableNotifications} disabled={loading} />
      <Button title="Skip for now" onPress={handleSkip} color="#999" />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 20,
  },
  title: {
    marginBottom: 20,
    textAlign: 'center',
  },
  description: {
    marginBottom: 20,
    textAlign: 'center',
  },
});
