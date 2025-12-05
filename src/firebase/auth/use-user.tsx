
'use client';

import React, {
  useState,
  useEffect,
  createContext,
  useContext,
  useMemo,
} from 'react';
import type { User } from 'firebase/auth';

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

// Create a mock "Owner" user object.
const ownerUser: User = {
  uid: 'owner-the-creator',
  email: 'owner@hamraz.ai',
  emailVerified: true,
  displayName: 'Ahura',
  photoURL: 'https://picsum.photos/seed/owner/200/200',
  isAnonymous: false,
  metadata: {},
  providerData: [],
  // Add dummy methods to satisfy the User interface
  delete: async () => {},
  getIdToken: async () => 'owner-token',
  getIdTokenResult: async () => ({
    token: 'owner-token',
    claims: {},
    authTime: new Date().toISOString(),
    issuedAtTime: new Date().toISOString(),
    signInProvider: 'custom',
    signInSecondFactor: null,
    expirationTime: new Date(Date.now() + 3600 * 1000).toISOString(),
  }),
  reload: async () => {},
  toJSON: () => ({}),
  providerId: 'firebase',
};


/**
 * This provider implements a special "God Mode" for the app owner.
 * It automatically signs in a special "Owner" user, bypassing the
 * normal Firebase authentication flow. This ensures the app owner
 * always has full access without needing to manually sign in.
 */
export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Automatically sign in the owner user on app load.
    setUser(ownerUser);
    setLoading(false);
  }, []);

  const value = useMemo(() => ({ user, loading }), [user, loading]);

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};
