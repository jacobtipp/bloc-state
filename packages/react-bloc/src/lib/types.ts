import { BlocBase, Bloc, Cubit } from '@jacobtipp/bloc';
import { State } from '@jacobtipp/state';

/**
 * StateType is a generic type that returns the state type of the given bloc object.
 * If T extends Cubit, it returns the inferred state U.
 * If T extends Bloc, it returns the inferred event D.
 * Otherwise, it returns never.
 *
 * @typeParam T - The type of the bloc object.
 */
export type StateType<T extends BlocBase<any>> = T extends Cubit<infer U>
  ? U
  : T extends Bloc<any, infer D>
  ? D
  : never;

/**
 * SuspenseDataType is a generic type that unwraps the wrapped data within a SuspenseState object.
 * If T extends State, it returns the inferred type U.
 * Otherwise, it returns T.
 *
 * @typeParam T - The type of the data to be unwrapped.
 */
export type SuspenseDataType<T> = T extends State<infer U> ? U : T;
