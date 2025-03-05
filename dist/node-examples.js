"use strict";
/**
 * This file contains Node.js examples that use our library.
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.cancellableFileRead = cancellableFileRead;
exports.cancellableHttpRequest = cancellableHttpRequest;
exports.cancellableDbQuery = cancellableDbQuery;
const fs = __importStar(require("fs/promises"));
const http = __importStar(require("http"));
const index_1 = require("./index");
/**
 * Example 1: Cancellable file read
 */
async function cancellableFileRead(filePath) {
    console.log(`Reading file: ${filePath}`);
    const { promise, cancel } = (0, index_1.createCancellableWithReject)(async (signal) => {
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
        }
        finally {
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
    }
    catch (error) {
        clearTimeout(timeoutId);
        if (error instanceof index_1.CancellationError) {
            console.log(`File read cancelled: ${error.message}`);
        }
        else {
            console.error(`Error reading file: ${error}`);
        }
        return null;
    }
}
/**
 * Example 2: Cancellable HTTP request
 */
function httpGet(url) {
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
async function cancellableHttpRequest(url, timeoutMs = 5000) {
    console.log(`Making HTTP request to: ${url}`);
    const { promise, cancel } = (0, index_1.createCancellableWithTimeoutAndReject)(async (signal) => {
        // Make the HTTP request
        const response = await httpGet(url);
        // Check if cancelled after making the request
        if (signal.cancelled) {
            console.log('HTTP request cancelled after receiving response');
            return null;
        }
        return response;
    }, timeoutMs, 'HTTP request timed out');
    try {
        const response = await promise;
        return response;
    }
    catch (error) {
        if (error instanceof index_1.CancellationError) {
            console.log(`HTTP request cancelled: ${error.message}`);
        }
        else if (error instanceof index_1.TimeoutError) {
            console.log(`HTTP request timed out: ${error.message}`);
        }
        else {
            console.error(`Error making HTTP request: ${error}`);
        }
        return null;
    }
}
/**
 * Example 3: Cancellable database query (simulated)
 */
function simulateDbQuery(query) {
    return new Promise((resolve) => {
        console.log(`Executing query: ${query}`);
        // Simulate a database query that takes 3 seconds
        setTimeout(() => {
            resolve({ rows: [{ id: 1, name: 'Example' }], rowCount: 1 });
        }, 3000);
    });
}
async function cancellableDbQuery(query, timeoutMs = 2000) {
    console.log(`Starting database query: ${query}`);
    // Use withTimeout directly on the simulated database query
    const timeoutPromise = (0, index_1.withTimeout)(simulateDbQuery(query), timeoutMs, 'Database query timed out');
    try {
        const result = await timeoutPromise;
        console.log('Query completed successfully');
        return result;
    }
    catch (error) {
        if (error instanceof index_1.TimeoutError) {
            console.log(`Query timed out: ${error.message}`);
        }
        else {
            console.error(`Error executing query: ${error}`);
        }
        return null;
    }
}
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
