import { BlocBase, StateType, ClassType } from '@jacobtipp/bloc';
import { useBlocInstance } from './useBlocInstance';
import { UseBlocSelectorConfig, useBlocSelector } from './useBlocSelector';

export const useBloc = <
  Bloc extends ClassType<BlocBase<any>>,
  SelectedState = StateType<InstanceType<Bloc>>
>(
  bloc: Bloc,
  config: UseBlocSelectorConfig<InstanceType<Bloc>, SelectedState>
): readonly [SelectedState, InstanceType<Bloc>] => {
  const selectedState = useBlocSelector(bloc, config);
  const providedBloc = useBlocInstance(bloc);

  return [selectedState, providedBloc] as const;
};
