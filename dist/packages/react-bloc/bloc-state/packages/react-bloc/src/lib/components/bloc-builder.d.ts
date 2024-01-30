import { BlocBase, ClassType, StateType } from '@jacobtipp/bloc';
export interface BlocBuilderProps<Bloc extends ClassType<BlocBase<any>>, State = StateType<InstanceType<Bloc>>> {
    bloc: Bloc;
    builder: (state: State) => JSX.Element;
    buildWhen?: (previous: State, current: State) => boolean;
}
export declare function BlocBuilder<Bloc extends ClassType<BlocBase<any>>>({ bloc, builder, buildWhen, }: BlocBuilderProps<Bloc>): JSX.Element;
