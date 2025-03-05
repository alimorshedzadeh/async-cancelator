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
export declare function withTimeout<T>(promise: Promise<T>, ms: number, message?: string): Promise<T>;
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
export declare function withTimeoutFn<T, Args extends any[]>(fn: (...args: Args) => Promise<T>, ms: number, message?: string): (...args: Args) => Promise<T>;
