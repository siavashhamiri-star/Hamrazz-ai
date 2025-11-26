import mitt from 'mitt';
import type { FirestorePermissionError } from './errors';

type Events = {
  'permission-error': FirestorePermissionError;
};

/**
 * A global event emitter for handling specific, application-wide errors.
 * This is particularly useful for centralizing the handling of Firestore
 * permission errors, allowing components to react to them without complex
- * prop-drilling or context dependencies.
 */
export const errorEmitter = mitt<Events>();
