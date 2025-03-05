// Simple test script to verify that our library works as expected
const {
    createCancellable,
    withTimeout,
    TimeoutError
} = require('./dist');

console.log('Testing promise-control library...');

// Test: Promise with timeout
console.log('\nTest: Promise with timeout');

const slowPromise = new Promise(resolve => {
    console.log('Starting slow operation...');
    setTimeout(() => {
        console.log('Slow operation completed');
        resolve('Slow operation result');
    }, 3000);
});

const timeoutPromise = withTimeout(slowPromise, 1000, 'Operation took too long');

timeoutPromise
    .then(result => {
        console.log(`Result: ${result}`);
    })
    .catch(error => {
        if (error instanceof TimeoutError) {
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
}, 2000);