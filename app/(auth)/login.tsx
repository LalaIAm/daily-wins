import React, { useState } from 'react';
import { StyleSheet, TextInput, Button, Alert, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { loginWithEmail } from '@/services/auth';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();
  const { isLoading, error } = useSelector((state: RootState) => state.auth);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }
    try {
      await loginWithEmail(email, password);
      // Navigation is handled by root _layout based on auth state
    } catch (e: any) {
      Alert.alert('Login Failed', e.message);
    }
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title" style={styles.title}>Welcome Back</ThemedText>
      
      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#999"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      
      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="#999"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      {isLoading ? (
        <ActivityIndicator size="large" color="#0a7ea4" />
      ) : (
        <Button title="Login" onPress={handleLogin} />
      )}

      <TouchableOpacity onPress={() => router.push('/(auth)/register')} style={styles.linkButton}>
        <ThemedText type="link">Don't have an account? Sign up</ThemedText>
      </TouchableOpacity>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    textAlign: 'center',
    marginBottom: 40,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 20,
    color: '#000', // Need to handle dark mode color properly in TextInput or use a ThemedTextInput
    backgroundColor: '#fff',
  },
  linkButton: {
    marginTop: 20,
    alignItems: 'center',
  },
});
