import { BlocBase, ClassType } from '@jacobtipp/bloc';
import { useMemo } from 'react';
import { StateType } from '../types';
import { useBlocInstance } from './use-bloc-instance';
import { useBlocSelector, UseBlocSelectorConfig } from './use-bloc-selector';

export function useBloc<B extends BlocBase<any>, P = StateType<B>>(
  bloc: ClassType<B>,
  config?: UseBlocSelectorConfig<B, P>
): ReturnType<() => [P, B]> {
  const providedBloc = useBlocInstance(bloc);
  const selector = useMemo(
    () => config?.selector ?? ((state: any) => state),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );
  const memoizedConfig = useMemo(
    () => ({ ...config, selector }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );
  return [useBlocSelector(bloc, memoizedConfig), providedBloc];
}
