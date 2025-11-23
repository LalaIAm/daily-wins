import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import { GoogleAuthProvider, signInWithCredential } from 'firebase/auth';
import { auth } from './firebase';
import { store } from '@/store/store';
import { setError, setLoading, setUser } from '@/store/authSlice';

WebBrowser.maybeCompleteAuthSession();

export function useGoogleAuth() {
  const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
    // Client IDs must be obtained from Google Cloud Console
    clientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
    iosClientId: process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID,
    androidClientId: process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID,
  });

  const signInWithGoogle = async () => {
    store.dispatch(setLoading(true));
    try {
      const result = await promptAsync();
      
      if (result?.type === 'success') {
        const { id_token } = result.params;
        const credential = GoogleAuthProvider.credential(id_token);
        const userCredential = await signInWithCredential(auth, credential);
        
        // User state is handled by onAuthStateChanged in auth.ts
        return userCredential.user;
      } else {
        store.dispatch(setLoading(false));
        if (result?.type !== 'dismiss') {
            store.dispatch(setError('Google Sign-In was cancelled or failed.'));
        }
      }
    } catch (error: any) {
        store.dispatch(setError(error.message));
        store.dispatch(setLoading(false));
    }
  };

  return { signInWithGoogle, request };
}
