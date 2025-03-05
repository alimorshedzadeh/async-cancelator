# Async Cancelator

A minimal, zero-dependency library for managing asynchronous tasks with built-in support for cancellation and timeout management.

## Features

- **Promise Cancellation**: Easily cancel long-running or obsolete async operations
- **Timeout Management**: Automatically reject promises after a given timeout
- **Cross-Platform**: Works in Node.js, browsers, and React applications
- **TypeScript Support**: Full type definitions included
- **Zero Dependencies**: Lightweight and focused

## Installation

```bash
npm install async-cancelator
```

## Usage

### Basic Cancellable Promise

```typescript
import { createCancellable } from 'async-cancelator';

const { promise, cancel } = createCancellable(async (signal) => {
  // Check if cancelled during async operations
  if (signal.cancelled) return;
  
  // Long running operation...
  await someAsyncOperation();
  
  // Check again if cancelled
  if (signal.cancelled) return;
  
  return 'Operation completed';
});

// Later, if needed:
cancel('Operation no longer needed');
```

### Cancellable Promise with Automatic Rejection

```typescript
import { createCancellableWithReject, CancellationError } from 'async-cancelator';

const { promise, cancel } = createCancellableWithReject(async (signal) => {
  // No need to check signal.cancelled as the promise will be rejected
  
  // Long running operation...
  await someAsyncOperation();
  
  return 'Operation completed';
});

try {
  // Later, if needed:
  cancel('Operation no longer needed');
  
  const result = await promise;
  // Handle result
} catch (error) {
  if (error instanceof CancellationError) {
    // Handle cancellation
    console.log(`Operation was cancelled: ${error.message}`);
  } else {
    // Handle other errors
  }
}
```

### With Timeout

```typescript
import { withTimeout, TimeoutError } from 'async-cancelator';

// Automatically rejects after 5000ms
const timeoutPromise = withTimeout(
  fetch('https://api.example.com/data'),
  5000,
  'Request timed out'
);

try {
  const result = await timeoutPromise;
  // Handle result
} catch (error) {
  if (error instanceof TimeoutError) {
    // Handle timeout
    console.log(`Operation timed out: ${error.message}`);
  } else {
    // Handle other errors
  }
}
```

### Combining Features

```typescript
import { createCancellable, withTimeout } from 'async-cancelator';

const { promise, cancel } = createCancellable(async (signal) => {
  // Your async operation
  // Remember to check signal.cancelled at appropriate points
});

// Add timeout to a cancellable promise
const timeoutPromise = withTimeout(promise, 3000, 'Operation timed out');

// You can still cancel manually
setTimeout(() => cancel('No longer needed'), 1000);
```

### Using with React Hooks

```typescript
import { useEffect, useState, useRef } from 'react';
import { createCancellableWithReject, TimeoutError, CancellationError } from 'async-cancelator';

function useFetchData(url) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const cancelRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      const { promise, cancel } = createCancellableWithReject(async (signal) => {
        const response = await fetch(url);
        const data = await response.json();
        return data;
      });
      
      // Store the cancel function for cleanup
      cancelRef.current = cancel;
      
      try {
        const result = await promise;
        setData(result);
        setLoading(false);
      } catch (error) {
        if (error instanceof CancellationError) {
          // Don't set error state for cancellations
        } else {
          setError(error);
          setLoading(false);
        }
      }
    };
    
    fetchData();
    
    // Cleanup function to cancel the operation when the component unmounts
    return () => {
      if (cancelRef.current) {
        cancelRef.current('Component unmounted');
      }
    };
  }, [url]);
  
  return { data, loading, error };
}
```

## API Reference

### `createCancellable(fn)`

Creates a cancellable promise wrapper.

**Parameters:**
- `fn`: Function that receives a cancellation signal and returns a Promise

**Returns:**
- Object with `promise` and `cancel` function

### `createCancellableWithReject(fn)`

Creates a cancellable promise wrapper that automatically rejects when cancelled.

**Parameters:**
- `fn`: Function that receives a cancellation signal and returns a Promise

**Returns:**
- Object with `promise` and `cancel` function

### `withTimeout(promise, ms, message)`

Adds a timeout to any promise.

**Parameters:**
- `promise`: The promise to add a timeout to
- `ms`: Timeout in milliseconds
- `message`: Optional message for the timeout error

**Returns:**
- A new promise that rejects after the specified timeout

### `withTimeoutFn(fn, ms, message)`

Creates a function that adds a timeout to a promise-returning function.

**Parameters:**
- `fn`: Function that returns a promise
- `ms`: Timeout in milliseconds
- `message`: Optional message for the timeout error

**Returns:**
- A new function that returns a promise with a timeout

### `createCancellableWithTimeout(fn, ms, message)`

Creates a cancellable promise with a timeout.

**Parameters:**
- `fn`: Function that receives a cancellation signal and returns a Promise
- `ms`: Timeout in milliseconds
- `message`: Optional message for the timeout error

**Returns:**
- Object with `promise` and `cancel` function

### Error Types

- `CancellationError`: Error thrown when a promise is cancelled
- `TimeoutError`: Error thrown when a promise times out

## License

MIT 