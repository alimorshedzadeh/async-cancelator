import { TimeoutError } from './types';

/**
 * Adds a timeout to a promise
 * 
 * @param promise The promise to add a timeout to
 * @param ms Timeout in milliseconds
 * @param message Optional message for the timeout error
 * @returns A new promise that rejects after the specified timeout
 * 
 * @example
 * ```typescript
 * // Automatically rejects after 5000ms
 * const timeoutPromise = withTimeout(
 *   fetch('https://api.example.com/data'),
 *   5000,
 *   'Request timed out'
 * );
 * ```
 */
export function withTimeout<T>(
  promise: Promise<T>,
  ms: number,
  message: string = 'Operation timed out'
): Promise<T> {
  // Create a promise that rejects after the specified timeout
  const timeoutPromise = new Promise<T>((_, reject) => {
    const timeoutId = setTimeout(() => {
      reject(new TimeoutError(message));
    }, ms);
    
    // Clear the timeout if the promise resolves or rejects before the timeout
    promise.finally(() => clearTimeout(timeoutId));
  });
  
  // Return a promise that resolves or rejects with the first of the two promises
  return Promise.race([promise, timeoutPromise]);
}

/**
 * Creates a function that adds a timeout to a promise-returning function
 * 
 * @param fn Function that returns a promise
 * @param ms Timeout in milliseconds
 * @param message Optional message for the timeout error
 * @returns A new function that returns a promise with a timeout
 * 
 * @example
 * ```typescript
 * const fetchWithTimeout = withTimeoutFn(
 *   (url) => fetch(url),
 *   5000,
 *   'Request timed out'
 * );
 * 
 * // Use the function
 * const result = await fetchWithTimeout('https://api.example.com/data');
 * ```
 */
export function withTimeoutFn<T, Args extends any[]>(
  fn: (...args: Args) => Promise<T>,
  ms: number,
  message: string = 'Operation timed out'
): (...args: Args) => Promise<T> {
  return (...args: Args) => {
    const promise = fn(...args);
    return withTimeout(promise, ms, message);
  };
} 