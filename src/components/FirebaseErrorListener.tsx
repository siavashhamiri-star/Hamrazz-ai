'use client';

import React, { useEffect } from 'react';
import { errorEmitter } from '@/firebase/error-emitter';
import { useToast } from '@/hooks/use-toast';
import { FirestorePermissionError } from '@/firebase/errors';
import { isDev } from '@/lib/utils';

/**
 * A client component that listens for Firestore permission errors and displays them
 * in a toast notification. This provides immediate feedback to the developer
 * in the UI when a security rule is violated.
 *
 * It also re-throws the error in development to leverage Next.js's error overlay
 * for a better debugging experience.
 */
const FirebaseErrorListener: React.FC = () => {
  const { toast } = useToast();

  useEffect(() => {
    const handleError = (error: FirestorePermissionError) => {
      console.warn('Firestore Permission Error:', error);

      toast({
        variant: 'destructive',
        title: 'Firestore Permission Denied',
        description: (
          <div className="mt-2 w-full rounded-md bg-destructive/90 p-4 text-destructive-foreground">
            <p className="mb-2 font-semibold">
              The request was denied by Firestore Security Rules.
            </p>
            <pre className="whitespace-pre-wrap text-xs">
              <code>{error.toString()}</code>
            </pre>
          </div>
        ),
        duration: 10000, // Show for 10 seconds
      });

      // In development, re-throw the error to trigger the Next.js error overlay.
      // This provides a more immediate and detailed debugging experience.
      if (isDev) {
        // We throw in a timeout to escape the React render cycle and allow the toast to appear.
        setTimeout(() => {
          throw error;
        }, 0);
      }
    };

    errorEmitter.on('permission-error', handleError);

    return () => {
      errorEmitter.off('permission-error', handleError);
    };
  }, [toast]);

  return null;
};

export default FirebaseErrorListener;
