/**
 * Represents a cancellation signal that can be passed to async operations
 */
export interface CancellationSignal {
  /**
   * Whether the operation has been cancelled
   */
  cancelled: boolean;
  
  /**
   * The reason for cancellation, if any
   */
  reason?: string;
}

/**
 * Result of creating a cancellable promise
 */
export interface CancellablePromise<T> {
  /**
   * The promise that can be cancelled
   */
  promise: Promise<T>;
  
  /**
   * Function to cancel the promise
   * @param reason Optional reason for cancellation
   */
  cancel: (reason?: string) => void;
}

/**
 * Function that receives a cancellation signal and returns a promise
 */
export type CancellableFunction<T> = (signal: CancellationSignal) => Promise<T>;

/**
 * Error thrown when a promise is cancelled
 */
export class CancellationError extends Error {
  constructor(message: string = 'Operation cancelled') {
    super(message);
    this.name = 'CancellationError';
  }
}

/**
 * Error thrown when a promise times out
 */
export class TimeoutError extends Error {
  constructor(message: string = 'Operation timed out') {
    super(message);
    this.name = 'TimeoutError';
  }
} 