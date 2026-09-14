import { 
  GoogleAuthProvider, 
  signInWithPopup, 
  signInAnonymously, 
  signOut, 
  onAuthStateChanged,
  User,
  UserCredential,
  Unsubscribe
} from 'firebase/auth';
import { auth } from './config';

/**
 * Sign in using Google OAuth provider.
 * @returns {Promise<UserCredential>} The user credential on success.
 */
export const signInWithGoogle = async (): Promise<UserCredential> => {
  const provider = new GoogleAuthProvider();
  return signInWithPopup(auth, provider);
};

/**
 * Sign in as a guest (anonymously).
 * @returns {Promise<UserCredential>} The anonymous user credential.
 */
export const signInAsGuest = async (): Promise<UserCredential> => {
  return signInAnonymously(auth);
};

/**
 * Sign out the currently authenticated user.
 * @returns {Promise<void>}
 */
export const signOutUser = async (): Promise<void> => {
  return signOut(auth);
};

/**
 * Get the currently authenticated user synchronously.
 * @returns {User | null} The current user or null if not authenticated.
 */
export const getCurrentUser = (): User | null => {
  return auth.currentUser;
};

/**
 * Listen for authentication state changes.
 * @param callback The function to call when auth state changes.
 * @returns {Unsubscribe} A function to unsubscribe from the listener.
 */
export const onAuthChange = (callback: (user: User | null) => void): Unsubscribe => {
  return onAuthStateChanged(auth, callback);
};
