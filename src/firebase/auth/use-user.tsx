
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

    // Check for redirect result
    getRedirectResult(auth)
      .then((result) => {
        if (result) {
          // This is the signed-in user
          setUser(result.user);
        }
      })
      .catch((error) => {
        console.error("Error getting redirect result:", error);
      })
      .finally(() => {
         // Even if there's no redirect result, we continue to set up the listener.
         // The listener will handle the case where the user is already signed in.
      });

    const unsubscribe = auth.onAuthStateChanged(
      (user) => {
        setUser(user);
        setLoading(false);
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
