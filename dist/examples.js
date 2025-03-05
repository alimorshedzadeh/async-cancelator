"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("./index");
/**
 * Example 1: Basic Cancellable Promise
 */
async function basicCancellableExample() {
    console.log('Example 1: Basic Cancellable Promise');
    const { promise, cancel } = (0, index_1.createCancellable)(async (signal) => {
        console.log('Starting long operation...');
        // Simulate a long-running operation
        for (let i = 0; i < 5; i++) {
            // Check if cancelled
            if (signal.cancelled) {
                console.log(`Operation cancelled: ${signal.reason}`);
                return 'Cancelled';
            }
            console.log(`Working... (${i + 1}/5)`);
            await new Promise(resolve => setTimeout(resolve, 1000));
        }
        return 'Operation completed successfully';
    });
    // Cancel after 2 seconds
    setTimeout(() => {
        console.log('Calling cancel...');
        cancel('No longer needed');
    }, 2000);
    try {
        const result = await promise;
        console.log(`Result: ${result}`);
    }
    catch (error) {
        console.error(`Error: ${error}`);
    }
}
/**
 * Example 2: Cancellable Promise with Rejection
 */
async function cancellableWithRejectExample() {
    console.log('\nExample 2: Cancellable Promise with Rejection');
    const { promise, cancel } = (0, index_1.createCancellableWithReject)(async (signal) => {
        console.log('Starting long operation...');
        // Simulate a long-running operation
        for (let i = 0; i < 5; i++) {
            // No need to check signal.cancelled here as the promise will be rejected
            console.log(`Working... (${i + 1}/5)`);
            await new Promise(resolve => setTimeout(resolve, 1000));
        }
        return 'Operation completed successfully';
    });
    // Cancel after 2 seconds
    setTimeout(() => {
        console.log('Calling cancel...');
        cancel('No longer needed');
    }, 2000);
    try {
        const result = await promise;
        console.log(`Result: ${result}`);
    }
    catch (error) {
        if (error instanceof index_1.CancellationError) {
            console.log(`Operation was cancelled: ${error.message}`);
        }
        else {
            console.error(`Error: ${error}`);
        }
    }
}
/**
 * Example 3: Promise with Timeout
 */
async function timeoutExample() {
    console.log('\nExample 3: Promise with Timeout');
    const slowPromise = new Promise(resolve => {
        console.log('Starting slow operation...');
        setTimeout(() => {
            console.log('Slow operation completed');
            resolve('Slow operation result');
        }, 5000);
    });
    const timeoutPromise = (0, index_1.withTimeout)(slowPromise, 2000, 'Operation took too long');
    try {
        const result = await timeoutPromise;
        console.log(`Result: ${result}`);
    }
    catch (error) {
        if (error instanceof index_1.TimeoutError) {
            console.log(`Operation timed out: ${error.message}`);
        }
        else {
            console.error(`Error: ${error}`);
        }
    }
}
/**
 * Example 4: Cancellable Promise with Timeout
 */
async function cancellableWithTimeoutExample() {
    console.log('\nExample 4: Cancellable Promise with Timeout');
    const { promise, cancel } = (0, index_1.createCancellableWithTimeoutAndReject)(async (signal) => {
        console.log('Starting long operation...');
        // Simulate a long-running operation
        for (let i = 0; i < 10; i++) {
            console.log(`Working... (${i + 1}/10)`);
            await new Promise(resolve => setTimeout(resolve, 1000));
        }
        return 'Operation completed successfully';
    }, 5000, 'Operation took too long');
    try {
        const result = await promise;
        console.log(`Result: ${result}`);
    }
    catch (error) {
        if (error instanceof index_1.CancellationError) {
            console.log(`Operation was cancelled: ${error.message}`);
        }
        else if (error instanceof index_1.TimeoutError) {
            console.log(`Operation timed out: ${error.message}`);
        }
        else {
            console.error(`Error: ${error}`);
        }
    }
}
// Run all examples
async function runExamples() {
    await basicCancellableExample();
    await cancellableWithRejectExample();
    await timeoutExample();
    await cancellableWithTimeoutExample();
}
// Uncomment to run examples
// runExamples().catch(console.error); 
