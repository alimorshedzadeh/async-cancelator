import { CancellableFunction, CancellablePromise } from './types';
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
export declare function createCancellableWithTimeout<T>(fn: CancellableFunction<T>, ms: number, message?: string): CancellablePromise<T>;
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
export declare function createCancellableWithTimeoutAndReject<T>(fn: CancellableFunction<T>, ms: number, timeoutMessage?: string): CancellablePromise<T>;
