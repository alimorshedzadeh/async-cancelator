/**
 * This file contains Node.js examples that use our library.
 */

import * as fs from 'fs/promises';
import * as http from 'http';
import { 
  createCancellable, 
  createCancellableWithReject,
  withTimeout,
  createCancellableWithTimeoutAndReject,
  CancellationError,
  TimeoutError
} from '../src';

/**
 * Example 1: Cancellable file read
 */
async function cancellableFileRead(filePath: string) {
  console.log(`Reading file: ${filePath}`);
  
  const { promise, cancel } = createCancellableWithReject(async (signal) => {
    // Start reading the file
    const fileHandle = await fs.open(filePath, 'r');
    
    try {
      // Check if cancelled after opening the file
      if (signal.cancelled) {
        console.log('File read cancelled after opening');
        return null;
      }
      
      // Read the file content
      const content = await fileHandle.readFile('utf-8');
      
      // Check if cancelled after reading the file
      if (signal.cancelled) {
        console.log('File read cancelled after reading');
        return null;
      }
      
      return content;
    } finally {
      // Always close the file handle
      await fileHandle.close();
    }
  });
  
  // Set up a timeout to cancel the operation after 2 seconds
  const timeoutId = setTimeout(() => {
    console.log('Cancelling file read due to timeout');
    cancel('Timeout reached');
  }, 2000);
  
  try {
    const content = await promise;
    clearTimeout(timeoutId);
    return content;
  } catch (error) {
    clearTimeout(timeoutId);
    if (error instanceof CancellationError) {
      console.log(`File read cancelled: ${error.message}`);
    } else {
      console.error(`Error reading file: ${error}`);
    }
    return null;
  }
}

/**
 * Example 2: Cancellable HTTP request
 */
function httpGet(url: string): Promise<string> {
  return new Promise((resolve, reject) => {
    http.get(url, (res) => {
      if (res.statusCode !== 200) {
        reject(new Error(`HTTP error: ${res.statusCode}`));
        res.resume(); // Consume the response to free up memory
        return;
      }
      
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        resolve(data);
      });
    }).on('error', (err) => {
      reject(err);
    });
  });
}

async function cancellableHttpRequest(url: string, timeoutMs: number = 5000) {
  console.log(`Making HTTP request to: ${url}`);
  
  const { promise, cancel } = createCancellableWithTimeoutAndReject(
    async (signal) => {
      // Make the HTTP request
      const response = await httpGet(url);
      
      // Check if cancelled after making the request
      if (signal.cancelled) {
        console.log('HTTP request cancelled after receiving response');
        return null;
      }
      
      return response;
    },
    timeoutMs,
    'HTTP request timed out'
  );
  
  try {
    const response = await promise;
    return response;
  } catch (error) {
    if (error instanceof CancellationError) {
      console.log(`HTTP request cancelled: ${error.message}`);
    } else if (error instanceof TimeoutError) {
      console.log(`HTTP request timed out: ${error.message}`);
    } else {
      console.error(`Error making HTTP request: ${error}`);
    }
    return null;
  }
}

/**
 * Example 3: Cancellable database query (simulated)
 */
function simulateDbQuery(query: string): Promise<any> {
  return new Promise((resolve) => {
    console.log(`Executing query: ${query}`);
    // Simulate a database query that takes 3 seconds
    setTimeout(() => {
      resolve({ rows: [{ id: 1, name: 'Example' }], rowCount: 1 });
    }, 3000);
  });
}

async function cancellableDbQuery(query: string, timeoutMs: number = 2000) {
  console.log(`Starting database query: ${query}`);
  
  // Use withTimeout directly on the simulated database query
  const timeoutPromise = withTimeout(
    simulateDbQuery(query),
    timeoutMs,
    'Database query timed out'
  );
  
  try {
    const result = await timeoutPromise;
    console.log('Query completed successfully');
    return result;
  } catch (error) {
    if (error instanceof TimeoutError) {
      console.log(`Query timed out: ${error.message}`);
    } else {
      console.error(`Error executing query: ${error}`);
    }
    return null;
  }
}

// Export the examples
export {
  cancellableFileRead,
  cancellableHttpRequest,
  cancellableDbQuery
};

// Uncomment to run examples
/*
async function runNodeExamples() {
  // Example 1: Cancellable file read
  await cancellableFileRead('package.json');
  
  // Example 2: Cancellable HTTP request
  await cancellableHttpRequest('http://example.com', 3000);
  
  // Example 3: Cancellable database query
  await cancellableDbQuery('SELECT * FROM users');
}

runNodeExamples().catch(console.error);
*/ 