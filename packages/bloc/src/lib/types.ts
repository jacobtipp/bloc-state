import { Bloc, BlocBase, Cubit } from '.';

/**
 * A type definition for classes that can be instantiated.
 * `ClassType` is a generic interface.
 * @typeparam T - The type of the class that will be newable.
 */
// eslint-disable-next-line @typescript-eslint/ban-types
export interface ClassType<T> extends Function {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  new (...args: any[]): T;
}

/**
 * A type definition for abstract classes that can be instantiated.
 * `AbstractClassType` is a generic type.
 * @typeparam T - The type of the class that will be abstract and newable.
 */
export type AbstractClassType<T> = abstract new (...args: any[]) => T;

export type StateType<T extends BlocBase<any>> = T extends Cubit<infer U>
  ? U
  : T extends Bloc<any, infer D>
  ? D
  : never;
