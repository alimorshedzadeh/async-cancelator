// Simple test script to verify cancellation functionality
const {
    createCancellableWithReject,
    CancellationError
} = require('./dist');

console.log('Testing cancellation functionality...');

// Test: Cancellable promise with rejection
console.log('\nTest: Cancellable promise with rejection');

const { promise, cancel } = createCancellableWithReject(async(signal) => {
    console.log('Starting operation...');

    // Simulate a long-running operation
    for (let i = 0; i < 5; i++) {
        console.log(`Working... (${i + 1}/5)`);
        await new Promise(resolve => setTimeout(resolve, 500));
    }

    return 'Operation completed successfully';
});

// Cancel after 1 second
setTimeout(() => {
    console.log('Calling cancel...');
    cancel('No longer needed');
}, 1000);

promise
    .then(result => {
        console.log(`Result: ${result}`);
    })
    .catch(error => {
        if (error instanceof CancellationError) {
            console.log(`Operation was cancelled: ${error.message}`);
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
}, 3000);