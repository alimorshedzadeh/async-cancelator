# async-cancelator Examples

This document contains examples of how to use the async-cancelator library in different environments.

## Basic Usage

### Cancellable Promise

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

## With Timeout

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

## React Hooks Example

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

## Node.js Example

```typescript
import { createCancellableWithTimeout } from 'async-cancelator';
import * as fs from 'fs/promises';

async function readLargeFile(path) {
  const { promise, cancel } = createCancellableWithTimeout(
    async (signal) => {
      // Read file with cancellation support
      const fileHandle = await fs.open(path, 'r');
      try {
        if (signal.cancelled) {
          await fileHandle.close();
          return null;
        }
        
        const stats = await fileHandle.stat();
        const buffer = Buffer.alloc(stats.size);
        await fileHandle.read(buffer, 0, stats.size, 0);
        
        if (signal.cancelled) {
          await fileHandle.close();
          return null;
        }
        
        await fileHandle.close();
        return buffer.toString('utf8');
      } catch (error) {
        await fileHandle.close();
        throw error;
      }
    },
    10000, // 10 second timeout
    'File read operation timed out'
  );
  
  // Set up cancellation after 5 seconds for demo purposes
  setTimeout(() => {
    cancel('Operation cancelled manually');
  }, 5000);
  
  return promise;
}
``` 