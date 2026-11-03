import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  type User,
} from 'firebase/auth';
import { auth } from '@/lib/firebase';

type AuthContextValue = {
  user: User | null;
  authLoading: boolean;
  // True from the start of a sign-up until the success message has been seen.
  // Signing up also logs the user in, and without this every screen would
  // leave for the list before Registration successful could be shown.
  registering: boolean;
  finishRegistering: () => void;
  signUp: (email: string, password: string) => Promise<User>;
  signIn: (email: string, password: string) => Promise<User>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [registering, setRegistering] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setAuthLoading(false);
    });
    return unsubscribe;
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      authLoading,
      registering,
      finishRegistering: () => setRegistering(false),
      signUp: async (email, password) => {
        setRegistering(true);
        try {
          const credential = await createUserWithEmailAndPassword(
            auth,
            email,
            password,
          );
          return credential.user;
        } catch (err) {
          setRegistering(false);
          throw err;
        }
      },
      signIn: async (email, password) => {
        const credential = await signInWithEmailAndPassword(
          auth,
          email,
          password,
        );
        return credential.user;
      },
      logout: async () => {
        await firebaseSignOut(auth);
      },
    }),
    [user, authLoading, registering],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const value = useContext(AuthContext);
  if (!value) {
    throw new Error('useAuth must be used inside AuthProvider');
  }
  return value;
}
