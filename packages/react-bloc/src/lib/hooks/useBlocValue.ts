import { BlocBase, StateType, ClassType } from '@jacobtipp/bloc';
import { useCallback, useSyncExternalStore, useDebugValue } from 'react';
import { useBlocInstance } from './useBlocInstance';

export const useBlocValue = <
  Bloc extends ClassType<BlocBase<any>>,
  Value = StateType<InstanceType<Bloc>>
>(
  bloc: Bloc
): Value => {
  const blocInstance = useBlocInstance(bloc);
  const subscriptionCallback = useCallback((notify: () => void) => {
    const subscription = blocInstance.state$.subscribe(notify);
    return () => subscription.unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const state = useSyncExternalStore<Value>(
    // Use the memoized subscription function here.
    subscriptionCallback,
    () => blocInstance.state as Value
  );

  useDebugValue(state);
  return state;
};
