import { CancellableFunction, CancellablePromise, CancellationError } from './types';
import { createCancellable, createCancellableWithReject } from './cancellable';
import { withTimeout } from './timeout';

/**
 * Creates a cancellable promise with a timeout
 * 
 * @param fn Function that receives a cancellation signal and returns a promise
 * @param ms Timeout in milliseconds
 * @param message Optional message for the timeout error
 * @returns Object containing the promise and a cancel function
 * 
 * @example
 * ```typescript
 * const { promise, cancel } = createCancellableWithTimeout(
 *   async (signal) => {
 *     // Your async operation
 *     await someAsyncOperation();
 *     return 'Operation completed';
 *   },
 *   5000,
 *   'Operation timed out'
 * );
 * 
 * // You can still cancel manually
 * setTimeout(() => cancel('No longer needed'), 1000);
 * ```
 */
export function createCancellableWithTimeout<T>(
  fn: CancellableFunction<T>,
  ms: number,
  message?: string
): CancellablePromise<T> {
  // Create a cancellable promise
  const { promise: innerPromise, cancel } = createCancellable(fn);
  
  // Add a timeout to the promise
  const timeoutPromise = withTimeout(innerPromise, ms, message);
  
  return { promise: timeoutPromise, cancel };
}

/**
 * Creates a cancellable promise with a timeout that automatically rejects when cancelled
 * 
 * @param fn Function that receives a cancellation signal and returns a promise
 * @param ms Timeout in milliseconds
 * @param timeoutMessage Optional message for the timeout error
 * @returns Object containing the promise and a cancel function
 * 
 * @example
 * ```typescript
 * const { promise, cancel } = createCancellableWithTimeoutAndReject(
 *   async (signal) => {
 *     // Your async operation
 *     await someAsyncOperation();
 *     return 'Operation completed';
 *   },
 *   5000,
 *   'Operation timed out'
 * );
 * 
 * // You can still cancel manually
 * setTimeout(() => cancel('No longer needed'), 1000);
 * ```
 */
export function createCancellableWithTimeoutAndReject<T>(
  fn: CancellableFunction<T>,
  ms: number,
  timeoutMessage?: string
): CancellablePromise<T> {
  // Create a cancellable promise that rejects when cancelled
  const { promise: innerPromise, cancel: innerCancel } = createCancellableWithReject(fn);
  
  // Add a timeout to the promise
  const timeoutPromise = withTimeout(innerPromise, ms, timeoutMessage);
  
  // Create a wrapper promise to handle cancellation properly
  let resolveWrapper: (value: T | PromiseLike<T>) => void;
  let rejectWrapper: (reason: any) => void;
  
  const wrapperPromise = new Promise<T>((resolve, reject) => {
    resolveWrapper = resolve;
    rejectWrapper = reject;
  });
  
  // Chain the timeout promise to the wrapper promise
  timeoutPromise
    .then(result => resolveWrapper(result))
    .catch(error => rejectWrapper(error));
  
  // Create a cancel function that cancels the inner promise
  const cancel = (reason?: string) => {
    innerCancel(reason);
  };
  
  return { promise: wrapperPromise, cancel };
} 