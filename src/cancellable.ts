import { CancellableFunction, CancellablePromise, CancellationSignal, CancellationError } from './types';

/**
 * Creates a cancellable promise
 * 
 * @param fn Function that receives a cancellation signal and returns a promise
 * @returns Object containing the promise and a cancel function
 * 
 * @example
 * ```typescript
 * const { promise, cancel } = createCancellable(async (signal) => {
 *   // Check if cancelled during async operations
 *   if (signal.cancelled) return;
 *   
 *   // Long running operation...
 *   await someAsyncOperation();
 *   
 *   // Check again if cancelled
 *   if (signal.cancelled) return;
 *   
 *   return 'Operation completed';
 * });
 * 
 * // Later, if needed:
 * cancel('Operation no longer needed');
 * ```
 */
export function createCancellable<T>(fn: CancellableFunction<T>): CancellablePromise<T> {
  // Create a mutable signal object that will be passed to the function
  const signal: CancellationSignal = {
    cancelled: false,
    reason: undefined
  };

  // Create a promise that executes the function with the signal
  const promise = new Promise<T>((resolve, reject) => {
    // Execute the function and handle its result
    Promise.resolve()
      .then(() => fn(signal))
      .then(result => {
        // If the operation was cancelled, don't resolve
        if (signal.cancelled) return;
        resolve(result);
      })
      .catch(error => {
        // If the operation was cancelled, don't reject
        if (signal.cancelled) return;
        reject(error);
      });
  });

  // Create a cancel function that modifies the signal
  const cancel = (reason?: string) => {
    signal.cancelled = true;
    signal.reason = reason;
  };

  return { promise, cancel };
}

/**
 * Creates a cancellable promise that automatically rejects when cancelled
 * 
 * @param fn Function that receives a cancellation signal and returns a promise
 * @returns Object containing the promise and a cancel function
 * 
 * @example
 * ```typescript
 * const { promise, cancel } = createCancellableWithReject(async (signal) => {
 *   // Long running operation...
 *   await someAsyncOperation();
 *   
 *   return 'Operation completed';
 * });
 * 
 * // Later, if needed:
 * cancel('Operation no longer needed');
 * // The promise will be rejected with a CancellationError
 * ```
 */
export function createCancellableWithReject<T>(
  fn: CancellableFunction<T>
): CancellablePromise<T> {
  // Create a mutable signal object that will be passed to the function
  const signal: CancellationSignal = {
    cancelled: false,
    reason: undefined
  };
  
  // Create a promise that will be resolved or rejected
  let resolvePromise: (value: T | PromiseLike<T>) => void;
  let rejectPromise: (reason: any) => void;
  
  const wrappedPromise = new Promise<T>((resolve, reject) => {
    resolvePromise = resolve;
    rejectPromise = reject;
  });
  
  // Execute the function and handle its result
  Promise.resolve()
    .then(() => fn(signal))
    .then(result => {
      // If the operation was cancelled, don't resolve
      if (signal.cancelled) return;
      resolvePromise(result);
    })
    .catch(error => {
      // If the operation was cancelled, don't reject with the original error
      if (signal.cancelled) return;
      rejectPromise(error);
    });
  
  // Create a cancel function that modifies the signal and rejects the promise
  const cancel = (reason?: string) => {
    if (signal.cancelled) return; // Already cancelled
    
    signal.cancelled = true;
    signal.reason = reason;
    
    // Reject the promise with a CancellationError
    rejectPromise(new CancellationError(reason || 'Operation cancelled'));
  };
  
  return { promise: wrappedPromise, cancel };
} 