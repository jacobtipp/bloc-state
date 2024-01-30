import { BlocBase, StateType, ClassType } from '@jacobtipp/bloc';
export interface BlocListenerProps<Bloc extends ClassType<BlocBase<any>>, State = StateType<InstanceType<Bloc>>> {
    listener: (bloc: InstanceType<Bloc>, state: State) => void;
    listenWhen?: (previous: State, current: State) => boolean;
}
export declare const useBlocListener: <Bloc extends ClassType<BlocBase<any>>>(bloc: Bloc, { listener, listenWhen }: BlocListenerProps<Bloc, StateType<InstanceType<Bloc>>>) => void;
