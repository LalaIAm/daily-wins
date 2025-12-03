import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut,
  updateProfile,
  onAuthStateChanged,
  User as FirebaseUser
} from 'firebase/auth';
import { auth } from './firebase';
import { store } from '../store/store';
import { setUser, setLoading, setError, logout } from '../store/authSlice';

// Map Firebase user to our Redux user state
const mapUser = (user: FirebaseUser) => ({
  uid: user.uid,
  email: user.email,
  displayName: user.displayName,
  photoURL: user.photoURL,
  timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
});

// Listen for auth state changes
onAuthStateChanged(auth, (user) => {
  if (user) {
    store.dispatch(setUser(mapUser(user)));
  } else {
    store.dispatch(logout());
  }
});

export const loginWithEmail = async (email: string, pass: string) => {
  store.dispatch(setLoading(true));
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, pass);
    return mapUser(userCredential.user);
  } catch (error: any) {
    store.dispatch(setError(error.message));
    throw error;
  }
};

export const registerWithEmail = async (email: string, pass: string, name?: string) => {
  store.dispatch(setLoading(true));
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, pass);
    if (name) {
      await updateProfile(userCredential.user, { displayName: name });
      // Reload user to get updated profile
      // await userCredential.user.reload();
    }
    return mapUser(userCredential.user);
  } catch (error: any) {
    store.dispatch(setError(error.message));
    throw error;
  }
};

export const logOut = async () => {
  store.dispatch(setLoading(true));
  try {
    await signOut(auth);
    store.dispatch(logout());
  } catch (error: any) {
    store.dispatch(setError(error.message));
    throw error;
  }
};
