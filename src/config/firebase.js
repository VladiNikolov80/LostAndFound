import { initializeApp, getApp, getApps } from 'firebase/app';
import { initializeAuth, getAuth, getReactNativePersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Настройките от Firebase конзолата (Project settings → Your apps → Web app).
// Те не са тайна: защитата на данните е в Firestore правилата.
const firebaseConfig = {
  apiKey: 'AIzaSyDB1Xl_J2HIURORNTwYdvWm9evMGIi7kXw',
  authDomain: 'lostandfound-1b873.firebaseapp.com',
  projectId: 'lostandfound-1b873',
  storageBucket: 'lostandfound-1b873.firebasestorage.app',
  messagingSenderId: '848605234825',
  appId: '1:848605234825:web:415ecc079cf7796d5a2858',
};

// getApps() пази от повторно стартиране при презареждане на кода.
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

// AsyncStorage кара Firebase да помни кой е вписан и след рестарт на приложението.
function createAuth() {
  try {
    return initializeAuth(app, { persistence: getReactNativePersistence(AsyncStorage) });
  } catch {
    return getAuth(app);
  }
}

export const auth = createAuth();
export const db = getFirestore(app);
