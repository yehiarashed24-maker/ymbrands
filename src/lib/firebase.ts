import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const rawApiKey = (import.meta.env.VITE_FIREBASE_API_KEY || '').trim();

const isConfigured = Boolean(
  rawApiKey &&
  rawApiKey !== 'dummy-api-key' &&
  !rawApiKey.includes('dummy') &&
  rawApiKey.length > 10
);

const firebaseConfig = {
  apiKey: isConfigured ? rawApiKey : 'dummy-api-key',
  authDomain: (import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'dummy.firebaseapp.com').trim(),
  projectId: (import.meta.env.VITE_FIREBASE_PROJECT_ID || 'dummy-project-id').trim(),
  storageBucket: (import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'dummy.appspot.com').trim(),
  messagingSenderId: (import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '123456789').trim(),
  appId: (import.meta.env.VITE_FIREBASE_APP_ID || '1:12345:web:12345').trim(),
};

// Safe singleton initialization
export const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
export const db = getFirestore(app);

// Helper to check if Firebase is configured with real production credentials
export const isFirebaseConfigured = () => isConfigured;
