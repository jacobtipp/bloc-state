import { BlocBase, ClassType } from '@jacobtipp/bloc';
import { useObservableState } from 'observable-hooks';
import { useDebugValue } from 'react';
import { StateType } from '../types';
import { useBlocInstance } from './use-bloc-instance';

export const useBlocValue = <B extends BlocBase<any>>(
  bloc: ClassType<B>
): ReturnType<() => StateType<B>> => {
  const providedBloc = useBlocInstance(bloc);
  const state = useObservableState(providedBloc.state$, providedBloc.state);
  useDebugValue(state);
  return state;
};
