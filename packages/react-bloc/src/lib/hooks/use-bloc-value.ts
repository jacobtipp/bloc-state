import { BlocBase, ClassType } from '@jacobtipp/bloc';
import { useCallback, useDebugValue } from 'react';
import { StateType } from '../types';
import { useBlocInstance } from './use-bloc-instance';
import { useSyncExternalStore } from 'use-sync-external-store/shim';

/**
 * A hook that returns the current state of a bloc instance.
 *
 * @typeparam Bloc The type of the bloc instance.
 * @param bloc The class type of the bloc.
 * @returns The current state of the bloc instance.
 */
export const useBlocValue = <Bloc extends BlocBase<any>>(
  bloc: ClassType<Bloc>
): ReturnType<() => StateType<Bloc>> => {
  const providedBloc = useBlocInstance(bloc);

  // Memoize the subscription function using useCallback.
  const subscriptionCallback = useCallback((notify: () => void) => {
    const subscription = providedBloc.state$.subscribe(notify);
    return () => subscription.unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const state = useSyncExternalStore<StateType<Bloc>>(
    // Use the memoized subscription function here.
    subscriptionCallback,
    () => providedBloc.state
  );

  useDebugValue(state);

  return state;
};
