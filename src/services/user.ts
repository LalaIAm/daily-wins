import { doc, setDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { firestore } from './firebase';

export const createUserDocument = async (uid: string, data: any) => {
  const userRef = doc(firestore, 'users', uid);
  await setDoc(userRef, {
    ...data,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  }, { merge: true });
};

export const updateUserProfile = async (uid: string, data: any) => {
  const userRef = doc(firestore, 'users', uid);
  await updateDoc(userRef, {
    ...data,
    updatedAt: serverTimestamp(),
  });
};

export const savePushToken = async (uid: string, token: string) => {
  const userRef = doc(firestore, 'users', uid);
  await setDoc(userRef, {
    pushToken: token,
    updatedAt: serverTimestamp(),
  }, { merge: true });
};
