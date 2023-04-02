import { BlocBase, ClassType } from '@jacobtipp/bloc';
import { isStateInstance } from '@jacobtipp/state';
import { ObservableResource, useObservable } from 'observable-hooks';
import { useDebugValue, useMemo } from 'react';
import { filter, Observable, startWith, tap } from 'rxjs';
import { StateType, SuspenseDataType } from '../types';
import { useBlocInstance } from './use-bloc-instance';
import { useSyncExternalStoreWithSelector } from 'use-sync-external-store/with-selector';

export type SelectorStateType<B extends BlocBase<any>> = SuspenseDataType<
  StateType<B>
>;

export type UseBlocSelectorConfig<B extends BlocBase<any>, P> = {
  selector: (state: SelectorStateType<B>) => P;
  listenWhen?: (state: StateType<B>) => boolean;
  suspendWhen?: (state: StateType<B>) => boolean;
  errorWhen?: (state: StateType<B>) => boolean;
};

export function useBlocSelector<P, B extends BlocBase<any>>(
  bloc: ClassType<B>,
  config: UseBlocSelectorConfig<B, P>
): P {
  const providedBloc = useBlocInstance(bloc);

  const selector = useMemo(
    () => config?.selector ?? ((state: any) => state),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const listenWhen = config.listenWhen ?? (() => true);
  const suspendWhen = config.suspendWhen ?? (() => false);

  const listenWhenState$ = useObservable(() => {
    return providedBloc.state$.pipe(
      startWith(providedBloc.state),
      filter(listenWhen)
    );
  });

  const errorWhenState$ = useObservable(() => {
    return listenWhenState$.pipe(
      tap((state) => {
        if (config.errorWhen && config.errorWhen(state)) {
          throw new BlocRenderError(state);
        }
      })
    );
  });

  const resource = useMemo(() => {
    return new ObservableResource(
      errorWhenState$ as Observable<any>,
      (value) => !suspendWhen(value)
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  resource.read();

  const selected = useSyncExternalStoreWithSelector<
    SuspenseDataType<StateType<B>>,
    P
  >(
    (notify) => {
      const subscription = providedBloc.state$.subscribe(notify);
      return () => subscription.unsubscribe();
    },
    () => providedBloc.state,
    null,
    (state) => (isStateInstance(state) ? selector(state.data) : selector(state))
  );

  useDebugValue(selected);
  return selected;
}

export class BlocRenderError<State> extends Error {
  constructor(public readonly state: State, _reload?: () => void) {
    super('useBlocSelector: errorWhen triggered a new render Error');

    Object.setPrototypeOf(this, BlocRenderError.prototype);
  }
}
