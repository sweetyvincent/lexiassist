'use client';

import * as React from 'react';
import { createContext, useContext, useEffect, useState } from 'react';
import { signInWithGoogle, signInAsGuest, signOutUser, onAuthChange } from '@/lib/firebase/auth';
import type { User } from 'firebase/auth';
import { toast } from 'sonner';

interface AuthState {
  user: User | any | null;
  loading: boolean;
  error: Error | null;
}

export interface AuthContextType extends AuthState {
  signInWithGoogle: () => Promise<void>;
  signInAsGuest: () => Promise<void>;
  signOut: () => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * Authentication Provider Component.
 * Wraps the app to provide robust auth state and methods via React Context.
 */
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    const unsubscribe = onAuthChange((user) => {
      setState({ user, loading: false, error: null });
    });
    return () => unsubscribe();
  }, []);

  const handleSignInWithGoogle = async () => {
    try {
      setState((prev) => ({ ...prev, loading: true }));
      const result = await signInWithGoogle();
      if (result?.user) {
        setState({ user: result.user, loading: false, error: null });
        toast.success(`Welcome, ${result.user.displayName || 'Counsel'}! Signed in with Google.`);
      }
    } catch (error) {
      const err = error instanceof Error ? error : new Error(String(error));
      setState((prev) => ({ ...prev, loading: false, error: err }));
      toast.error('Sign in failed: ' + err.message);
    }
  };

  const handleSignInAsGuest = async () => {
    try {
      setState((prev) => ({ ...prev, loading: true }));
      const result = await signInAsGuest();
      if (result?.user) {
        setState({ user: result.user, loading: false, error: null });
        toast.success('Signed in as Guest Legal Analyst.');
      }
    } catch (error) {
      const err = error instanceof Error ? error : new Error(String(error));
      setState((prev) => ({ ...prev, loading: false, error: err }));
      toast.error('Guest sign-in failed: ' + err.message);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOutUser();
      setState({ user: null, loading: false, error: null });
      toast.info('Signed out successfully.');
    } catch (error) {
      setState((prev) => ({ ...prev, error: error instanceof Error ? error : new Error(String(error)) }));
    }
  };

  const value: AuthContextType = {
    ...state,
    signInWithGoogle: handleSignInWithGoogle,
    signInAsGuest: handleSignInAsGuest,
    signOut: handleSignOut,
    isAuthenticated: !!state.user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/**
 * Hook to access Auth context.
 * Must be used within an AuthProvider.
 */
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
