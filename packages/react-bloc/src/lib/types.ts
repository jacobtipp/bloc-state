import {
  BlocBase,
  Bloc,
  Cubit,
  ClassType,
  AbstractClassType,
} from '@jacobtipp/bloc';
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

/**
 * CreatorKey is a generic type that can represent one of three different types:
 * A class type,
 * An abstract class type, or
 * A string.
 *
 * @typeParam T - The type that the CreatorKey represents.
 */
export type CreatorKey<T> = ClassType<T> | AbstractClassType<T> | string;

/**
 * Create represents a function that creates a new instance of an object of type T.
 *
 * @typeParam T - The type of object that the Create function creates.
 */
export type Create<T> = () => T;

/**
 * Creator is an interface that defines an object that can create and dispose of objects of type T.
 *
 * @typeParam T - The type of object that the Creator can create and dispose of.
 */
export type Creator<T = unknown> = {
  key: CreatorKey<T>; // The key that identifies the Creator.
  create: Create<T>; // The function that creates the new instance of T.
  dispose?: (value: T) => void; // An optional dispose function to dispose of instances of T.
};

/**
 * MultiCreator is a generic type that represents an array of one or more Creator objects of type T.
 *
 * @typeParam T - The type of object that the creators can create and dispose of.
 */
export type MultiCreator<T> = [Creator<T>, ...Creator<T>[]];
