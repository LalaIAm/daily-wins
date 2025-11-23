import React, { useState } from 'react';
import { StyleSheet, Button, Alert, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import * as Notifications from 'expo-notifications';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useDispatch } from 'react-redux';
import { completeOnboarding } from '@/store/authSlice';

export default function OnboardingPermissions() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const handleEnableNotifications = async () => {
    setLoading(true);
    try {
      if (Platform.OS === 'web') {
        alert('Push notifications are not fully supported on web for this demo.');
        finishOnboarding();
        return;
      }

      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== 'granted') {
        Alert.alert('Permission needed', 'Enable notifications to stay on track with your wins!');
        // We let them proceed anyway, or we could block. For now, let's proceed.
      }
      
      // Here we would get the token and save it to Firestore
      // const token = (await Notifications.getExpoPushTokenAsync()).data;
      // await savePushToken(token);

      finishOnboarding();
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to enable notifications');
      setLoading(false);
    }
  };

  const handleSkip = () => {
    finishOnboarding();
  };

  const finishOnboarding = () => {
    dispatch(completeOnboarding());
    // Root layout will see the state change and redirect to tabs
    // But we can also explicitly replace
    router.replace('/(tabs)');
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
