import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getApps, initializeApp } from 'firebase/app';
import * as firebaseAuth from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

function required(name: string, value: string | undefined): string {
  if (!value) {
    throw new Error(`Missing Firebase config: set ${name} in .env`);
  }
  return value;
}

const firebaseConfig = {
  apiKey: required(
    'EXPO_PUBLIC_FIREBASE_API_KEY',
    process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  ),
  authDomain: required(
    'EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN',
    process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  ),
  projectId: required(
    'EXPO_PUBLIC_FIREBASE_PROJECT_ID',
    process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  ),
  storageBucket: required(
    'EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET',
    process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  ),
  messagingSenderId: required(
    'EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID',
    process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  ),
  appId: required(
    'EXPO_PUBLIC_FIREBASE_APP_ID',
    process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
  ),
};

export const app = getApps().length
  ? getApps()[0]
  : initializeApp(firebaseConfig);

function createAuth(): firebaseAuth.Auth {
  if (Platform.OS === 'web') {
    return firebaseAuth.getAuth(app);
  }
  // Only the React Native build of firebase/auth has this export, and the
  // package's public types do not declare it. Without it, phones forget the
  // login every time the app restarts.
  const { getReactNativePersistence } = firebaseAuth as unknown as {
    getReactNativePersistence: (
      storage: typeof AsyncStorage,
    ) => firebaseAuth.Persistence;
  };
  try {
    return firebaseAuth.initializeAuth(app, {
      persistence: getReactNativePersistence(AsyncStorage),
    });
  } catch {
    // Fast Refresh re-runs this module after auth was already initialized.
    return firebaseAuth.getAuth(app);
  }
}

export const auth = createAuth();
export const db = getFirestore(app);
