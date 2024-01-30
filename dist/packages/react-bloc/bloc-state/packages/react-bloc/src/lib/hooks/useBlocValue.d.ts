import { BlocBase, StateType, ClassType } from '@jacobtipp/bloc';
export declare const useBlocValue: <Bloc extends ClassType<BlocBase<any>>, Value = StateType<InstanceType<Bloc>>>(bloc: Bloc) => Value;
