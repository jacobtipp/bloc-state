import {
  BlocBase,
  Bloc,
  Cubit,
  ClassType,
  AbstractClassType,
} from '@jacobtipp/bloc';
import { State } from '@jacobtipp/state';

export type StateType<T extends BlocBase<any>> = T extends Cubit<infer U>
  ? U
  : T extends Bloc<any, infer D>
  ? D
  : never;

export type SuspenseDataType<T> = T extends State<infer U> ? U : T;

export type CreatorKey<T> = ClassType<T> | AbstractClassType<T> | string;

export type Create<T> = () => T;

export type Creator<T = unknown> = {
  key: CreatorKey<T>;
  create: Create<T>;
  dispose?: (value: T) => void;
};

export type MultiCreator<T> = [Creator<T>, ...Creator<T>[]];
