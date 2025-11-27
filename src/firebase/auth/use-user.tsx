
'use client';

import React, {
  useState,
  useEffect,
  createContext,
  useContext,
  useMemo,
} from 'react';
import type { User } from 'firebase/auth';
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

    // This is the key part: we use a flag to prevent onAuthStateChanged
    // from firing before we've processed the redirect result.
    let isProcessingRedirect = true;

    // First, check for the redirect result
    getRedirectResult(auth)
      .catch((error) => {
        console.error("Error processing redirect result:", error);
      })
      .finally(() => {
        isProcessingRedirect = false;
        // If onAuthStateChanged has already fired and set the user,
        // we don't need to do anything. If not, the listener will handle it.
        // This ensures we don't get a flicker of being logged out.
        if (auth.currentUser) {
            setUser(auth.currentUser);
            setLoading(false);
        }
      });

    // Set up the onAuthStateChanged listener
    const unsubscribe = auth.onAuthStateChanged(
      (user) => {
        // Only update the state if we're not in the middle of processing a redirect.
        if (!isProcessingRedirect) {
          setUser(user);
          setLoading(false);
        }
      },
      (error) => {
        console.error('Auth state change error:', error);
        setUser(null);
        setLoading(false);
      }
    );

    // Cleanup the listener when the component unmounts
    return () => unsubscribe();
  }, [auth]);

  const value = useMemo(() => ({ user, loading }), [user, loading]);

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};
