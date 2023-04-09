import { CreatorKey } from './types';

/**
 * `extractKey` is a function that takes a `CreatorKey` type parameter, which can either be a string or an object with a `name` property. If the parameter is a string, it returns the same string. But if the parameter is an object with a `name` property, it returns the value of that property as a string.
 *
 * @param {CreatorKey<unknown>} key A CreatorKey type parameter that can either be a string or an object with a `name` property.
 * @returns {string} A string representation of the parameter key.
 */
export const extractKey = (key: CreatorKey<unknown>): string =>
  typeof key === 'string' ? `${key}` : `${key.name}`;
