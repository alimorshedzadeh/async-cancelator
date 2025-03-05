// Test script for combined functionality (cancellation with timeout)
const {
    createCancellable,
    withTimeout,
    CancellationError,
    TimeoutError
} = require('./dist');

console.log('Testing combined functionality (cancellation with timeout)...');

// Test: Cancellable promise with timeout
console.log('\nTest: Cancellable promise with timeout');

// Create a cancellable promise
const { promise: cancellablePromise, cancel } = createCancellable(async(signal) => {
    console.log('Starting operation...');

    // Simulate a long-running operation
    for (let i = 0; i < 10; i++) {
        // Check if cancelled
        if (signal.cancelled) {
            console.log(`Operation cancelled during iteration ${i + 1}: ${signal.reason}`);
            return 'Cancelled';
        }

        console.log(`Working... (${i + 1}/10)`);
        await new Promise(resolve => setTimeout(resolve, 500));
    }

    return 'Operation completed successfully';
});

// Add a timeout to the cancellable promise
const timeoutPromise = withTimeout(cancellablePromise, 3000, 'Operation took too long');

// Cancel after 1 second (before timeout)
setTimeout(() => {
    console.log('Calling cancel...');
    cancel('No longer needed');
}, 1000);

timeoutPromise
    .then(result => {
        console.log(`Result: ${result}`);
    })
    .catch(error => {
        if (error instanceof CancellationError) {
            console.log(`Operation was cancelled: ${error.message}`);
        } else if (error instanceof TimeoutError) {
            console.log(`Operation timed out: ${error.message}`);
        } else {
            console.error(`Error: ${error}`);
        }
    })
    .finally(() => {
        console.log('Test completed!');
    });

// Keep the process running for a bit longer to see the results
setTimeout(() => {
    console.log('Exiting...');
}, 4000);