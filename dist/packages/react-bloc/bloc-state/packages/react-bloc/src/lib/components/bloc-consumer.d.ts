import { BlocBase, ClassType, StateType } from '@jacobtipp/bloc';
import { BlocListenerProps } from '../hooks';
import { BlocBuilderProps } from './bloc-builder';
export type BlocConsumerProps<Bloc extends ClassType<BlocBase<any>>, State = StateType<InstanceType<Bloc>>> = {
    bloc: Bloc;
} & BlocBuilderProps<Bloc, State> & BlocListenerProps<Bloc, State>;
export declare function BlocConsumer<Bloc extends ClassType<BlocBase<any>>>({ bloc, builder, buildWhen, listenWhen, listener, }: BlocConsumerProps<Bloc>): JSX.Element;
