"use strict";
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
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createCancellableWithTimeoutAndReject = exports.createCancellableWithTimeout = exports.withTimeoutFn = exports.withTimeout = exports.createCancellableWithReject = exports.createCancellable = void 0;
// Export types
__exportStar(require("./types"), exports);
// Export cancellable promise functions
var cancellable_1 = require("./cancellable");
Object.defineProperty(exports, "createCancellable", { enumerable: true, get: function () { return cancellable_1.createCancellable; } });
Object.defineProperty(exports, "createCancellableWithReject", { enumerable: true, get: function () { return cancellable_1.createCancellableWithReject; } });
// Export timeout functions
var timeout_1 = require("./timeout");
Object.defineProperty(exports, "withTimeout", { enumerable: true, get: function () { return timeout_1.withTimeout; } });
Object.defineProperty(exports, "withTimeoutFn", { enumerable: true, get: function () { return timeout_1.withTimeoutFn; } });
// Export utility functions
var utils_1 = require("./utils");
Object.defineProperty(exports, "createCancellableWithTimeout", { enumerable: true, get: function () { return utils_1.createCancellableWithTimeout; } });
Object.defineProperty(exports, "createCancellableWithTimeoutAndReject", { enumerable: true, get: function () { return utils_1.createCancellableWithTimeoutAndReject; } });
