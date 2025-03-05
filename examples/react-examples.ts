/**
 * This file contains React hooks that use our library.
 * 
 * NOTE: This is just an example and requires React to be installed.
 * To use these hooks in a real project, you would need to install React:
 * npm install react
 * 
 * For TypeScript type checking, uncomment the import below and install the types:
 * npm install --save-dev @types/react
 */

// import { useEffect, useState, useRef, useCallback } from 'react';
import { 
  createCancellableWithTimeoutAndReject, 
  CancellationError, 
  TimeoutError 
} from '../src';

// The rest of the file is kept as a reference implementation
// but commented out to avoid TypeScript errors during build

/*
export function useCancellableAsync<T>(
  asyncFn: (signal: { cancelled: boolean; reason?: string }) => Promise<T>,
  deps: any[] = [],
  timeoutMs: number = 30000
) {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  
  // Use a ref to store the cancel function
  const cancelRef = useRef<((reason?: string) => void) | null>(null);
  
  // Function to execute the async operation
  const executeAsync = useCallback(() => {
    setLoading(true);
    setError(null);
    
    const { promise, cancel } = createCancellableWithTimeoutAndReject(
      asyncFn,
      timeoutMs,
      'Request timed out'
    );
    
    // Store the cancel function in the ref
    cancelRef.current = cancel;
    
    promise
      .then(result => {
        setData(result);
        setLoading(false);
      })
      .catch(err => {
        if (err instanceof CancellationError) {
          // Don't set error state for cancellations
          setLoading(false);
        } else if (err instanceof TimeoutError) {
          setError(err);
          setLoading(false);
        } else {
          setError(err instanceof Error ? err : new Error(String(err)));
          setLoading(false);
        }
      });
  }, [asyncFn, timeoutMs]);
  
  // Retry function
  const retry = useCallback(() => {
    executeAsync();
  }, [executeAsync]);
  
  // Execute the async operation when dependencies change
  useEffect(() => {
    executeAsync();
    
    // Cleanup function to cancel the operation when the component unmounts
    return () => {
      if (cancelRef.current) {
        cancelRef.current('Component unmounted');
      }
    };
  }, [executeAsync, ...deps]);
  
  return { data, error, loading, retry };
}

export function useCancellableFetch<T>(
  url: string,
  options: RequestInit = {},
  deps: any[] = [],
  timeoutMs: number = 30000
) {
  return useCancellableAsync<T>(
    async (signal) => {
      const response = await fetch(url, options);
      
      // Check if cancelled after fetch
      if (signal.cancelled) return null as unknown as T;
      
      const data = await response.json();
      
      // Check if cancelled after parsing JSON
      if (signal.cancelled) return null as unknown as T;
      
      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}: ${response.statusText}`);
      }
      
      return data as T;
    },
    [url, ...deps],
    timeoutMs
  );
}
*/ 