/**
 * @module Common
 */

/**
 * Defines a partial object
 */
export type DeepEntityPartial<T> = { [P in keyof T]?: DeepEntityPartial<T[P]> };
