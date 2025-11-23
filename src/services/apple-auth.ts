import * as AppleAuthentication from 'expo-apple-authentication';
import { OAuthProvider, signInWithCredential } from 'firebase/auth';
import { auth } from './firebase';
import { store } from '@/store/store';
import { setError, setLoading } from '@/store/authSlice';

export async function signInWithApple() {
  store.dispatch(setLoading(true));
  try {
    const credential = await AppleAuthentication.signInAsync({
      requestedScopes: [
        AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
        AppleAuthentication.AppleAuthenticationScope.EMAIL,
      ],
    });

    const { identityToken, fullName } = credential;

    if (!identityToken) {
      throw new Error('Apple Sign-In failed - no identity token returned');
    }

    const provider = new OAuthProvider('apple.com');
    const firebaseCredential = provider.credential({
      idToken: identityToken,
      // rawNonce is needed if you provided a nonce in signInAsync
    });

    await signInWithCredential(auth, firebaseCredential);

    // Optionally update display name if it's the first sign in and fullName is available
    // Note: fullName is only returned on the VERY FIRST sign in.
  } catch (e: any) {
    if (e.code === 'ERR_REQUEST_CANCELED') {
      // handle that the user canceled the sign-in flow
    } else {
      store.dispatch(setError(e.message));
    }
  } finally {
    store.dispatch(setLoading(false));
  }
}
