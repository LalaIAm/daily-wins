import React, { useState } from 'react';
import { StyleSheet, TextInput, Button, Alert, Modal, View, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useDispatch } from 'react-redux';
import { completeOnboarding } from '@/store/authSlice';
import LottieView from 'lottie-react-native';

export default function OnboardingDemo() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [winText, setWinText] = useState('');
  const [showCelebration, setShowCelebration] = useState(false);

  const handleLogWin = () => {
    if (!winText.trim()) {
      Alert.alert('Empty Win', 'Please type something!');
      return;
    }

    // In a real app, we might save this first win to Redux or Firestore here.
    // For now, it's just a demo.
    
    setShowCelebration(true);
    
    // Delay to show celebration before finishing
    setTimeout(() => {
      finishOnboarding();
    }, 2500);
  };

  const finishOnboarding = () => {
    setShowCelebration(false);
    dispatch(completeOnboarding());
    router.replace('/(tabs)');
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title" style={styles.title}>Log Your First Win</ThemedText>
      <ThemedText style={styles.description}>
        What's one small thing you accomplished today?
      </ThemedText>

      <TextInput
        style={styles.input}
        placeholder="e.g. Drank a glass of water"
        placeholderTextColor="#999"
        value={winText}
        onChangeText={setWinText}
        autoFocus
      />
      
      <Button title="Log Win!" onPress={handleLogWin} />

      {showCelebration && (
        <View style={styles.celebrationOverlay}>
           {/* Placeholder for Lottie Animation if asset exists */}
           {/* <LottieView source={require('@/assets/lottie/confetti.json')} autoPlay loop={false} style={styles.lottie} /> */}
           <Text style={styles.celebrationText}>🎉 Great Job! 🎉</Text>
        </View>
      )}
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
    marginBottom: 30,
    textAlign: 'center',
  },
  input: {
    width: '100%',
    height: 50,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 20,
    color: '#000',
    backgroundColor: '#fff',
  },
  celebrationOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  celebrationText: {
    color: 'white',
    fontSize: 32,
    fontWeight: 'bold',
  },
  lottie: {
    width: 200,
    height: 200,
  }
});
