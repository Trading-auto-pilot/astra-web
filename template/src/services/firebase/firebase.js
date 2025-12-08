import { initializeApp } from 'firebase/app';
import { GoogleAuthProvider, OAuthProvider, getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

export let firebaseApp;
export let firebaseAuth;
export let currentUser;

try {
  firebaseApp = initializeApp(firebaseConfig);
  firebaseAuth = getAuth(firebaseApp);
  currentUser = firebaseAuth.currentUser;
} catch (error) {
  console.log({ error });
}

export const googleProvider = new GoogleAuthProvider();
export const microsoftProvider = new OAuthProvider('microsoft.com');

microsoftProvider.setCustomParameters({
  tenant: 'f8cdef31-a31e-4b4a-93e4-5f571e91255a',
});
