'use client';
import * as React from 'react';
import { createContext, useContext, useEffect, useState } from 'react';
import { signInWithGoogle, signInAsGuest, signOutUser, onAuthChange } from '@/lib/firebase/auth';
import type { User } from 'firebase/auth';

interface AuthState {
  user: User | null;
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
 * Wraps the app to provide auth state and methods via React Context.
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
      await signInWithGoogle();
    } catch (error) {
      setState((prev) => ({ ...prev, error: error instanceof Error ? error : new Error(String(error)) }));
    }
  };

  const handleSignInAsGuest = async () => {
    try {
      await signInAsGuest();
    } catch (error) {
      setState((prev) => ({ ...prev, error: error instanceof Error ? error : new Error(String(error)) }));
    }
  };

  const handleSignOut = async () => {
    try {
      await signOutUser();
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
