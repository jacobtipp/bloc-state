import { Bloc, ClassType, StateType } from '@jacobtipp/bloc';
import { ReplayMixin } from './replay-mixin';
export declare abstract class ReplayEvent {
    protected _: void;
}
export declare class RedoEvent extends ReplayEvent {
}
export declare class UndoEvent extends ReplayEvent {
}
export declare const WithReplayBloc: <BaseBloc extends ClassType<Bloc<ReplayEvent, any>>, State = StateType<InstanceType<BaseBloc>>>(Base: BaseBloc) => BaseBloc & ClassType<ReplayMixin<State>>;
