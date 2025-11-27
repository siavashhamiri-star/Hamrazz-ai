
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
    let authStateListenerUnsubscribe: (() => void) | null = null;

    // First, check for the redirect result
    getRedirectResult(auth)
      .then((result) => {
        if (result) {
          // User signed in via redirect.
          // onAuthStateChanged will also fire, but we can set the user here for a faster UI update.
          setUser(result.user);
        }
      })
      .catch((error) => {
        console.error("Error processing redirect result:", error);
      })
      .finally(() => {
        // Now that the redirect is processed, we can safely listen to auth state changes.
        isProcessingRedirect = false;
        
        // If the listener already ran and set the user, we can stop loading.
        // Otherwise, the listener will handle it.
        if (user !== null || auth.currentUser !== null) {
            setLoading(false);
        }

        // It's possible the auth state has already been determined while we were
        // processing the redirect. If so, use the current user.
        if (auth.currentUser) {
            setUser(auth.currentUser);
            setLoading(false);
        }

        // Set up the onAuthStateChanged listener
        authStateListenerUnsubscribe = auth.onAuthStateChanged(
          (user) => {
            setUser(user);
            // This is the definitive point where loading is complete after initial check.
            setLoading(false);
          },
          (error) => {
            console.error('Auth state change error:', error);
            setUser(null);
            setLoading(false);
          }
        );
      });

    return () => {
      // Cleanup the listener when the component unmounts
      if (authStateListenerUnsubscribe) {
        authStateListenerUnsubscribe();
      }
    };
  }, [auth]); // Dependency on auth instance

  const value = useMemo(() => ({ user, loading }), [user, loading]);

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};
