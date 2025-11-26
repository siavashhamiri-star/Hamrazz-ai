'use client';

import React, { useMemo } from 'react';
import type { FirebaseApp } from 'firebase/app';
import type { Auth } from 'firebase/auth';
import type { Firestore } from 'firebase/firestore';

import { initializeFirebase } from '.';
import { FirebaseProvider } from './provider';
import { UserProvider } from './auth/use-user';

interface FirebaseClientProviderProps {
  children: React.ReactNode;
}

/**
 * Provides the Firebase app, auth, and firestore instances to the client-side
 * of the application. This ensures that Firebase is initialized only once.
 */
export function FirebaseClientProvider({
  children,
}: FirebaseClientProviderProps) {
  const { app, auth, db } = useMemo(initializeFirebase, []);

  return (
    <FirebaseProvider app={app} auth={auth} db={db}>
      <UserProvider>{children}</UserProvider>
    </FirebaseProvider>
  );
}
