/**
 * This file contains Node.js examples that use our library.
 */
/**
 * Example 1: Cancellable file read
 */
declare function cancellableFileRead(filePath: string): Promise<string | null>;
declare function cancellableHttpRequest(url: string, timeoutMs?: number): Promise<string | null>;
declare function cancellableDbQuery(query: string, timeoutMs?: number): Promise<any>;
export { cancellableFileRead, cancellableHttpRequest, cancellableDbQuery };
