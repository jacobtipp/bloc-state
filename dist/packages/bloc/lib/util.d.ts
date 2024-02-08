/**
 * Checks if the current runtime environment is server-side (e.g., Node.js or SSR context).
 * This is commonly used in applications that support server-side rendering (SSR) to differentiate
 * between server-side and client-side execution contexts.
 *
 * @returns {boolean} `true` if the code is running on the server-side (where `window` is `undefined`),
 * otherwise `false`.
 */
export declare const isServer: () => boolean;
/**
 * Checks if the current runtime environment is client-side (e.g., a web browser).
 * This function is the inverse of `isServer`, providing a straightforward way to
 * determine if the code is executing in a client-side context.
 *
 * @returns {boolean} `true` if the code is running on the client-side (where `window` is defined),
 * otherwise `false`.
 */
export declare const isClient: () => boolean;
