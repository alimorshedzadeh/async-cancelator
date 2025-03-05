import { CancellableFunction, CancellablePromise } from './types';
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
export declare function createCancellable<T>(fn: CancellableFunction<T>): CancellablePromise<T>;
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
export declare function createCancellableWithReject<T>(fn: CancellableFunction<T>): CancellablePromise<T>;
