import { BlocBase, StateType, ClassType } from '@jacobtipp/bloc';
import { UseBlocSelectorConfig } from './useBlocSelector';
export declare const useBloc: <Bloc extends ClassType<BlocBase<any>>, SelectedState = StateType<InstanceType<Bloc>>>(bloc: Bloc, config?: UseBlocSelectorConfig<InstanceType<Bloc>, SelectedState> | undefined) => readonly [SelectedState, InstanceType<Bloc>];
