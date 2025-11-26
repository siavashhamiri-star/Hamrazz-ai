import { getAuth, type Auth } from 'firebase/auth';
import { getFirestore, type Firestore } from 'firebase/firestore';
import { app } from './config';
import type { FirebaseApp } from 'firebase/app';

// Export the hooks and providers
export { FirebaseProvider, useFirebase, useFirebaseApp, useAuth, useFirestore } from './provider';
export { FirebaseClientProvider } from './client-provider';
export { useCollection } from './firestore/use-collection';
export { useDoc } from './firestore/use-doc';
export { useUser } from './auth/use-user';
export { useMemoFirebase } from './use-memo-firebase';

export interface FirebaseInstances {
  app: FirebaseApp;
  auth: Auth;
  db: Firestore;
}

/**
 * Initializes and returns Firebase services. This function is designed to be
 * called once and its result reused throughout the application, often via a
 * React Context provider.
 *
 * @returns An object containing the initialized Firebase App, Auth, and
 * Firestore instances.
 */
export function initializeFirebase(): FirebaseInstances {
  const auth = getAuth(app);
  const db = getFirestore(app);

  return { app, auth, db };
}
