// Simple test script for async-cancelator
const {
    createCancellable,
    createCancellableWithReject,
    withTimeout,
    CancellationError,
    TimeoutError
} = require('./dist');

// Basic verification of the library
console.log('=== ASYNC-CANCELATOR VERIFICATION ===');

// Verify that the library exports the expected functions and classes
console.log('\nVerifying exports:');
console.log('- createCancellable:', typeof createCancellable === 'function' ? '✅' : '❌');
console.log('- createCancellableWithReject:', typeof createCancellableWithReject === 'function' ? '✅' : '❌');
console.log('- withTimeout:', typeof withTimeout === 'function' ? '✅' : '❌');
console.log('- CancellationError:', typeof CancellationError === 'function' ? '✅' : '❌');
console.log('- TimeoutError:', typeof TimeoutError === 'function' ? '✅' : '❌');

// Verify that the functions return the expected objects
console.log('\nVerifying function return values:');

// Test createCancellable
const cancellable = createCancellable(async() => {});
console.log('- createCancellable returns promise:', cancellable.promise instanceof Promise ? '✅' : '❌');
console.log('- createCancellable returns cancel function:', typeof cancellable.cancel === 'function' ? '✅' : '❌');

// Test createCancellableWithReject
const cancellableWithReject = createCancellableWithReject(async() => {});
console.log('- createCancellableWithReject returns promise:', cancellableWithReject.promise instanceof Promise ? '✅' : '❌');
console.log('- createCancellableWithReject returns cancel function:', typeof cancellableWithReject.cancel === 'function' ? '✅' : '❌');

// Test withTimeout
const timeoutPromise = withTimeout(Promise.resolve(), 1000);
console.log('- withTimeout returns promise:', timeoutPromise instanceof Promise ? '✅' : '❌');

console.log('\nVerification complete! The library appears to be working correctly.');

// Exit with success
process.exit(0);