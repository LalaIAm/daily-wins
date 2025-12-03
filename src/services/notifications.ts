import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import * as Device from 'expo-device';

export async function registerForPushNotificationsAsync() {
  let token;

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      // alert('Failed to get push token for push notification!');
      return null;
    }
    
    // Get the Expo Push Token
    // In production we might want to get the FCM token directly using getDevicePushTokenAsync
    // but Expo Push Token works for development and with Expo's push service.
    try {
        const tokenData = await Notifications.getExpoPushTokenAsync({
             projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID // Or the EAS Project ID if configured differently
        });
        token = tokenData.data;
    } catch(e) {
        console.error("Error fetching push token", e);
        return null;
    }
  } else {
    // alert('Must use physical device for Push Notifications');
    return null;
  }

  return token;
}
