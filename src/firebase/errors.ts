/**
 * Represents the context of a Firestore security rule denial.
 * This information is crucial for debugging and providing clear
 * error messages to the developer.
 */
export type SecurityRuleContext = {
  path: string;
  operation: 'get' | 'list' | 'create' | 'update' | 'delete' | 'write';
  requestResourceData?: any;
};

/**
 * A custom error class for Firestore permission-denied errors.
 * It encapsulates the context of the failed operation, making it easier
 * to debug security rule violations.
 */
export class FirestorePermissionError extends Error {
  public context: SecurityRuleContext;

  constructor(context: SecurityRuleContext) {
    const message = `Firestore Permission Denied: The following request was denied by Firestore Security Rules:\n${JSON.stringify(
      {
        path: context.path,
        operation: context.operation,
        // We stringify the request data to make it easier to inspect.
        requestData: JSON.stringify(context.requestResourceData, null, 2),
      },
      null,
      2
    )}`;

    super(message);
    this.name = 'FirestorePermissionError';
    this.context = context;

    // This is for V8 environments (like Node.js and Chrome)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, FirestorePermissionError);
    }
  }

  toString() {
    return this.message;
  }
}
