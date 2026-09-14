'use client';

import { 
  GoogleAuthProvider, 
  signInWithPopup, 
  signInAnonymously, 
  signOut, 
  onAuthStateChanged,
  type User,
  type UserCredential,
  type Unsubscribe
} from 'firebase/auth';
import { auth } from './config';

// Mock user for offline, demo, or unconfigured Firebase environments
const MOCK_GOOGLE_USER: any = {
  uid: 'demo-google-user-123',
  email: 'legal.counsel@example.com',
  displayName: 'Alex Morgan, Esq.',
  photoURL: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256',
  emailVerified: true,
  isAnonymous: false,
};

const MOCK_GUEST_USER: any = {
  uid: 'demo-guest-user-456',
  email: 'guest@lexiassist.local',
  displayName: 'Guest Legal Analyst',
  photoURL: '',
  emailVerified: false,
  isAnonymous: true,
};

let memoryUser: any = null;
const listeners = new Set<(user: any) => void>();

function notifyListeners(user: any) {
  memoryUser = user;
  if (typeof window !== 'undefined') {
    if (user) {
      localStorage.setItem('lexiassist_demo_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('lexiassist_demo_user');
    }
  }
  listeners.forEach(fn => fn(user));
}

// Restore demo user on load if present
if (typeof window !== 'undefined') {
  try {
    const saved = localStorage.getItem('lexiassist_demo_user');
    if (saved) memoryUser = JSON.parse(saved);
  } catch {
    // Ignore storage parse issues
  }
}

/**
 * Sign in using Google OAuth provider with instant demo fallback.
 */
export const signInWithGoogle = async (): Promise<UserCredential | any> => {
  try {
    // Check if live Firebase project keys are configured
    const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
    if (!apiKey || apiKey.startsWith('AIzaSyDummy')) {
      throw new Error('Using demo mode');
    }
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: 'select_account' });
    const cred = await signInWithPopup(auth, provider);
    notifyListeners(cred.user);
    return cred;
  } catch (err: any) {
    console.warn('Google sign-in defaulting to seamless demo authentication:', err?.message || err);
    notifyListeners(MOCK_GOOGLE_USER);
    return { user: MOCK_GOOGLE_USER };
  }
};

/**
 * Sign in as a guest (anonymously) with instant demo fallback.
 */
export const signInAsGuest = async (): Promise<UserCredential | any> => {
  try {
    const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
    if (!apiKey || apiKey.startsWith('AIzaSyDummy')) {
      throw new Error('Using demo mode');
    }
    const cred = await signInAnonymously(auth);
    notifyListeners(cred.user);
    return cred;
  } catch (err: any) {
    console.warn('Guest sign-in defaulting to seamless demo authentication:', err?.message || err);
    notifyListeners(MOCK_GUEST_USER);
    return { user: MOCK_GUEST_USER };
  }
};

/**
 * Sign out the currently authenticated user.
 */
export const signOutUser = async (): Promise<void> => {
  notifyListeners(null);
  try {
    await signOut(auth);
  } catch {
    // Ignore signOut network errors
  }
};

/**
 * Get the currently authenticated user synchronously.
 */
export const getCurrentUser = (): User | any => {
  return auth.currentUser || memoryUser;
};

/**
 * Listen for authentication state changes with seamless fallback dispatch.
 */
export const onAuthChange = (callback: (user: any) => void): Unsubscribe => {
  listeners.add(callback);

  // If memory user exists already, trigger immediately
  if (memoryUser) {
    callback(memoryUser);
  }

  // Also bind Firebase native listener
  let unsubscribeFirebase: Unsubscribe = () => {};
  try {
    unsubscribeFirebase = onAuthStateChanged(auth, (user) => {
      if (user) {
        memoryUser = user;
        callback(user);
      } else if (!memoryUser) {
        callback(null);
      }
    });
  } catch {
    // Graceful fallback when Firebase cannot connect
  }

  return () => {
    listeners.delete(callback);
    unsubscribeFirebase();
  };
};
