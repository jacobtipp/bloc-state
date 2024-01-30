import { Bloc, ClassType, StateType } from '@jacobtipp/bloc';
import { HydratedMixin } from '.';
export declare const WithHydratedBloc: <BaseBloc extends ClassType<Bloc<any, any>>, State = StateType<InstanceType<BaseBloc>>>(Base: BaseBloc) => BaseBloc & ClassType<HydratedMixin<State>>;
