
'use client';

import React, {
  useState,
  useEffect,
  createContext,
  useContext,
  useMemo,
} from 'react';
import type { User, Auth } from 'firebase/auth';
import { getRedirectResult } from 'firebase/auth';
import { useAuth } from '../provider';

export interface UserContext {
  user: User | null;
  loading: boolean;
}

const UserContext = createContext<UserContext>({
  user: null,
  loading: true,
});

export const useUser = () => useContext(UserContext);

interface UserProviderProps {
  children: React.ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const auth = useAuth();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!auth) {
      setLoading(false);
      return;
    }

    let isProcessingRedirect = true;

    // Check for redirect result first
    getRedirectResult(auth)
      .then((result) => {
        if (result) {
          // This is the signed-in user from the redirect.
          // The onAuthStateChanged listener below will also fire, but this ensures
          // we have the user info as early as possible.
          setUser(result.user);
        }
      })
      .catch((error) => {
        console.error("Error getting redirect result:", error);
      })
      .finally(() => {
        isProcessingRedirect = false;
        // If onAuthStateChanged has already run, we might need to update loading state here.
        // However, the listener is set up right after, so it's safer to let it handle it.
      });

    const unsubscribe = auth.onAuthStateChanged(
      (user) => {
        setUser(user);
        // Don't stop loading until the redirect check is also complete.
        if (!isProcessingRedirect) {
          setLoading(false);
        }
      },
      (error) => {
        console.error('Auth state change error:', error);
        setUser(null);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [auth]);

  const value = useMemo(() => ({ user, loading }), [user, loading]);

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};
