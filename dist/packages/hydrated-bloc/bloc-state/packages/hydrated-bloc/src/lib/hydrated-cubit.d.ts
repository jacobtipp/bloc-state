import { ClassType, Cubit, StateType } from '@jacobtipp/bloc';
import { HydratedMixin } from '.';
export declare const WithHydratedCubit: <BaseCubit extends ClassType<Cubit<any>>, State = StateType<InstanceType<BaseCubit>>>(Base: BaseCubit) => BaseCubit & ClassType<HydratedMixin<State>>;
