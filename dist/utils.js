"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createCancellableWithTimeout = createCancellableWithTimeout;
exports.createCancellableWithTimeoutAndReject = createCancellableWithTimeoutAndReject;
const cancellable_1 = require("./cancellable");
const timeout_1 = require("./timeout");
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
function createCancellableWithTimeout(fn, ms, message) {
    // Create a cancellable promise
    const { promise: innerPromise, cancel } = (0, cancellable_1.createCancellable)(fn);
    // Add a timeout to the promise
    const timeoutPromise = (0, timeout_1.withTimeout)(innerPromise, ms, message);
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
function createCancellableWithTimeoutAndReject(fn, ms, timeoutMessage) {
    // Create a cancellable promise that rejects when cancelled
    const { promise: innerPromise, cancel: innerCancel } = (0, cancellable_1.createCancellableWithReject)(fn);
    // Add a timeout to the promise
    const timeoutPromise = (0, timeout_1.withTimeout)(innerPromise, ms, timeoutMessage);
    // Create a wrapper promise to handle cancellation properly
    let resolveWrapper;
    let rejectWrapper;
    const wrapperPromise = new Promise((resolve, reject) => {
        resolveWrapper = resolve;
        rejectWrapper = reject;
    });
    // Chain the timeout promise to the wrapper promise
    timeoutPromise
        .then(result => resolveWrapper(result))
        .catch(error => rejectWrapper(error));
    // Create a cancel function that cancels the inner promise
    const cancel = (reason) => {
        innerCancel(reason);
    };
    return { promise: wrapperPromise, cancel };
}
