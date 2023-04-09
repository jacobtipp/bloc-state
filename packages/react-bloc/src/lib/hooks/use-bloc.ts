import { BlocBase, ClassType } from '@jacobtipp/bloc';
import { StateType } from '../types';
import { useBlocInstance } from './use-bloc-instance';
import {
  defaultSuspendWhen,
  useBlocSelector,
  UseBlocSelectorConfig,
} from './use-bloc-selector';

/**
 * Returns a tuple containing the selected state and provided Bloc instance.
 *
 * @typeparam Bloc The type of the Bloc instance.
 * @typeparam SelectedState The type of the selected state.
 * @param bloc The class of the Bloc instance.
 * @param config A configuration object for selecting the desired state.
 * @returns A tuple containing the selected state and provided Bloc instance.
 */
export function useBloc<
  Bloc extends BlocBase<any>,
  SelectedState = StateType<Bloc>
>(
  bloc: ClassType<Bloc>,
  config: UseBlocSelectorConfig<Bloc, SelectedState> = {
    selector: (state) => state,
    suspendWhen: defaultSuspendWhen,
  }
): readonly [SelectedState, Bloc] {
  const selectedState = useBlocSelector(bloc, config);
  const providedBloc = useBlocInstance(bloc);

  return [selectedState, providedBloc] as const;
}
