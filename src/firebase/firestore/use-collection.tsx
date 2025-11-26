'use client';

import { useState, useEffect, useRef } from 'react';
import {
  collection,
  query,
  onSnapshot,
  getDocs,
  Query,
  DocumentData,
  FirestoreError,
  QuerySnapshot,
} from 'firebase/firestore';
import { useFirestore } from '../provider';
import { useUser } from '../auth/use-user';
import { errorEmitter } from '../error-emitter';
import { FirestorePermissionError } from '../errors';

interface UseCollectionOptions<T> {
  live?: boolean;
  transform?: (data: DocumentData) => T;
}

interface UseCollectionResult<T> {
  data: T[] | null;
  loading: boolean;
  error: FirestoreError | null;
}

/**
 * A hook for fetching a collection from Firestore, with optional real-time updates.
 *
 * @param path The path to the collection.
 * @param options Options for the hook, such as whether to listen for live updates.
 * @returns An object containing the collection data, loading state, and any errors.
 */
export function useCollection<T = DocumentData>(
  q: Query | null,
  options: UseCollectionOptions<T> = { live: true }
): UseCollectionResult<T> {
  const { live = true, transform = (data: DocumentData) => data as T } =
    options;
  const db = useFirestore();
  const [data, setData] = useState<T[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<FirestoreError | null>(null);
  const { user } = useUser();
  const qRef = useRef(q);

  useEffect(() => {
    qRef.current = q;
  }, [q]);

  useEffect(() => {
    if (!db || !qRef.current) {
      setLoading(false);
      return;
    }

    setLoading(true);
    let unsubscribe: () => void = () => {};

    const processSnapshot = (snapshot: QuerySnapshot<DocumentData>) => {
      const result: T[] = [];
      snapshot.forEach((doc) => {
        result.push(transform({ id: doc.id, ...doc.data() }));
      });
      setData(result);
      setLoading(false);
    };

    const handleError = (err: FirestoreError) => {
      console.error('Firestore Error:', err);
      setError(err);

      // Create and emit a contextual permission error
      const permissionError = new FirestorePermissionError({
        path: 'path' in qRef.current! ? qRef.current.path : 'unknown',
        operation: 'list',
      });
      errorEmitter.emit('permission-error', permissionError);

      setLoading(false);
    };

    if (live) {
      unsubscribe = onSnapshot(qRef.current, processSnapshot, handleError);
    } else {
      getDocs(qRef.current)
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
