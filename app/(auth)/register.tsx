import React, { useState } from 'react';
import { StyleSheet, TextInput, Button, Alert, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { registerWithEmail } from '@/services/auth';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';

export default function RegisterScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();
  const { isLoading } = useSelector((state: RootState) => state.auth);

  const handleRegister = async () => {
    if (!email || !password || !name) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }
    try {
      await registerWithEmail(email, password, name);
      // Navigation is handled by root _layout
    } catch (e: any) {
      Alert.alert('Registration Failed', e.message);
    }
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title" style={styles.title}>Create Account</ThemedText>

      <TextInput
        style={styles.input}
        placeholder="Full Name"
        placeholderTextColor="#999"
        value={name}
        onChangeText={setName}
      />
      
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
        <Button title="Sign Up" onPress={handleRegister} />
      )}

      <TouchableOpacity onPress={() => router.back()} style={styles.linkButton}>
        <ThemedText type="link">Already have an account? Login</ThemedText>
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
    color: '#000',
    backgroundColor: '#fff',
  },
  linkButton: {
    marginTop: 20,
    alignItems: 'center',
  },
});
