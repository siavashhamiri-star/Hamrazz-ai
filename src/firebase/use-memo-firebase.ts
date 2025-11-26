'use client';

import { useMemo } from 'react';
import {
  collection,
  doc,
  query,
  where,
  orderBy,
  limit,
  startAt,
  startAfter,
  endAt,
  endBefore,
  QueryConstraint,
  DocumentReference,
  Query,
} from 'firebase/firestore';
import type { Firestore } from 'firebase/firestore';

// This file is a workaround for a limitation in the Firebase SDK where
// query and doc objects are not memoized, leading to infinite loops in React.
// By wrapping them in useMemo, we can ensure that they are only recreated when
// their dependencies change.

type MemoizableFunction<T> = () => T | null;

/**
 * A hook that memoizes a Firebase query or document reference. This is crucial
 * for preventing infinite loops in React components that use Firestore hooks,
 * as query and doc objects are not memoized by default.
 *
 * @param factory A function that returns a Firestore query or document reference.
 * @param deps The dependency array for the useMemo hook.
 * @returns The memoized query or document reference.
 */
export const useMemoFirebase = <T extends DocumentReference | Query>(
  factory: MemoizableFunction<T>,
  deps: React.DependencyList
) => {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  return useMemo(factory, deps);
};
