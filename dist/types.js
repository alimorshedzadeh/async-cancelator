"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TimeoutError = exports.CancellationError = void 0;
/**
 * Error thrown when a promise is cancelled
 */
class CancellationError extends Error {
    constructor(message = 'Operation cancelled') {
        super(message);
        this.name = 'CancellationError';
    }
}
exports.CancellationError = CancellationError;
/**
 * Error thrown when a promise times out
 */
class TimeoutError extends Error {
    constructor(message = 'Operation timed out') {
        super(message);
        this.name = 'TimeoutError';
    }
}
exports.TimeoutError = TimeoutError;
