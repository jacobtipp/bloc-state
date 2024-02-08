import { ClassType, Cubit, StateType } from '@jacobtipp/bloc';
import { ReplayMixin } from './replay-mixin';
export declare const WithReplayCubit: <BaseCubit extends ClassType<Cubit<any>>, State = StateType<InstanceType<BaseCubit>>>(Base: BaseCubit) => BaseCubit & ClassType<ReplayMixin<State>>;
