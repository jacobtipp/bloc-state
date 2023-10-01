import { State } from '@jacobtipp/state';

/**
 * SuspenseDataType is a generic type that unwraps the wrapped data within a SuspenseState object.
 * If T extends State, it returns the inferred type U.
 * Otherwise, it returns T.
 *
 * @typeParam T - The type of the data to be unwrapped.
 */
export type SuspenseDataType<T> = T extends State<infer U> ? U : T;
