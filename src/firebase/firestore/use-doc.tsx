'use client';

import { useState, useEffect, useRef } from 'react';
import {
  doc,
  onSnapshot,
  getDoc,
  DocumentReference,
  DocumentData,
  FirestoreError,
  DocumentSnapshot,
} from 'firebase/firestore';
import { useFirestore } from '../provider';
import { useUser } from '../auth/use-user';
import { errorEmitter } from '../error-emitter';
import { FirestorePermissionError } from '../errors';

interface UseDocOptions<T> {
  live?: boolean;
  transform?: (data: DocumentData) => T;
}

interface UseDocResult<T> {
  data: T | null;
  loading: boolean;
  error: FirestoreError | null;
}

/**
 * A hook for fetching a single document from Firestore, with optional real-time updates.
 *
 * @param path The path to the document.
 * @param options Options for the hook, such as whether to listen for live updates.
 * @returns An object containing the document data, loading state, and any errors.
 */
export function useDoc<T = DocumentData>(
  docRef: DocumentReference | null,
  options: UseDocOptions<T> = { live: true }
): UseDocResult<T> {
  const { live = true, transform = (data: DocumentData) => data as T } =
    options;
  const db = useFirestore();
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<FirestoreError | null>(null);
  const { user } = useUser();
  const docRefRef = useRef(docRef);

  useEffect(() => {
    docRefRef.current = docRef;
  }, [docRef]);

  useEffect(() => {
    if (!db || !docRefRef.current) {
      setLoading(false);
      return;
    }

    setLoading(true);
    let unsubscribe: () => void = () => {};

    const processSnapshot = (snapshot: DocumentSnapshot<DocumentData>) => {
      if (snapshot.exists()) {
        setData(transform({ id: snapshot.id, ...snapshot.data() }));
      } else {
        setData(null);
      }
      setLoading(false);
    };

    const handleError = (err: FirestoreError) => {
      console.error('Firestore Error:', err);
      setError(err);

      // Create and emit a contextual permission error
      const permissionError = new FirestorePermissionError({
        path: docRefRef.current!.path,
        operation: 'get',
      });
      errorEmitter.emit('permission-error', permissionError);

      setLoading(false);
    };

    if (live) {
      unsubscribe = onSnapshot(docRefRef.current, processSnapshot, handleError);
    } else {
      getDoc(docRefRef.current)
        .then(processSnapshot)
        .catch(handleError);
    }

    return () => {
      if (live) {
        unsubscribe();
      }
    };
  }, [db, user, transform, live]); // Rerun on user change for security rules

  return { data, loading, error };
}
