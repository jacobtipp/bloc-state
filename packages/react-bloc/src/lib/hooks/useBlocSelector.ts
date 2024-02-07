/// <reference types="react/experimental" />

import { BlocBase, StateType, ClassType } from '@jacobtipp/bloc';
import { useCallback, useDebugValue, useRef, useState } from 'react';
import useSyncExternalStoreExports from 'use-sync-external-store/shim/with-selector';
import { useBlocInstance } from './useBlocInstance';
import {
  Observable,
  Subscription,
  distinctUntilChanged,
  filter,
  firstValueFrom,
  map,
  startWith,
} from 'rxjs';
import {
  defaultSuspendWhen,
  defaultErrorWhen,
  defaultListenWhen,
  defaultSelector,
} from './defaults';
import { use, useIsomorphicLayoutEffect } from '../util';

const { useSyncExternalStoreWithSelector } = useSyncExternalStoreExports;

/**
 * Configuration options for `useBlocSelector` hook to customize behavior for selecting,
 * listening, suspending, and error handling based on the state of a Bloc.
 *
 * @template Bloc The type of Bloc being interacted with, extending BlocBase.
 * @template SelectedState The type of state after being transformed by the `selector`.
 */
export type UseBlocSelectorConfig<Bloc extends BlocBase<any>, SelectedState> = {
  /**
   * A function that takes the current state of the Bloc and returns a transformed version of it.
   * This allows for selecting a specific part of the state or deriving new values from it.
   *
   * @param state The current state of the Bloc.
   * @returns The transformed or selected state.
   */
  selector?: (state: StateType<Bloc>) => SelectedState;

  /**
   * A function that determines whether the listener should be notified of the state change.
   * This can be used to optimize performance by avoiding unnecessary updates and re-renders.
   *
   * @param state The current state of the Bloc.
   * @returns `true` if the listener should be notified, otherwise `false`.
   */
  listenWhen?: (state: StateType<Bloc>) => boolean;

  /**
   * A function that determines whether the component using this hook should trigger React suspense.
   * This is useful for delaying the rendering of the component until certain conditions are met.
   *
   * @param state The current state of the Bloc.
   * @returns `true` to suspend rendering, otherwise `false`.
   */
  suspendWhen?: (state: StateType<Bloc>) => boolean;

  /**
   * A function that determines whether an error should be thrown based on the current state of the Bloc.
   * This allows for error boundaries to catch and handle errors related to state conditions.
   *
   * @param state The current state of the Bloc.
   * @returns `true` to throw an error, otherwise `false`.
   */
  errorWhen?: (state: StateType<Bloc>) => boolean;
};

/**
 * Custom hook to trigger suspense or errors based on Bloc state.
 *
 * @template Bloc Type of Bloc being monitored.
 * @template State The state type of the Bloc instance.
 */
const useSuspenseOrError = <
  Bloc extends ClassType<BlocBase<any>>,
  State extends StateType<InstanceType<Bloc>> = StateType<InstanceType<Bloc>>
>(
  bloc: InstanceType<Bloc>,
  config: {
    suspendWhen: (state: State) => boolean;
    errorWhen: (state: State) => boolean;
  }
) => {
  const suspendWhen = config.suspendWhen;

  const errorWhen = config.errorWhen;

  const [{ shouldSuspend }, setSuspend] = useState(() => ({
    shouldSuspend: suspendWhen(bloc.state),
  }));

  const suspendedState = useRef<State | null>(bloc.state);

  const promise = useRef<Promise<any> | null>(null);

  const suspsenseSubscription = useRef<Subscription | null>(null);

  const createSuspense = () => {
    return firstValueFrom(
      bloc.state$.pipe(
        startWith(bloc.state),
        filter((state) => {
          return !suspendWhen(bloc.state) || !suspendWhen(state);
        })
      )
    )
      .then(() => {
        promise.current = null;
        suspendedState.current = null;
      })
      .catch(() => {
        promise.current = null;
        suspendedState.current = null;
      });
  };

  if (shouldSuspend && !promise.current && suspendedState.current) {
    promise.current = createSuspense();
  }

  useIsomorphicLayoutEffect(() => {
    suspsenseSubscription.current = (bloc.state$ as Observable<State>)
      .pipe(startWith(bloc.state as State))
      .subscribe((state) => {
        if (suspendWhen(state)) {
          suspendedState.current = state;
          setSuspend({
            shouldSuspend: true,
          });
        }
      });

    return () => {
      suspsenseSubscription.current?.unsubscribe();
      suspsenseSubscription.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bloc]);

  if (errorWhen(bloc.state as State)) {
    throw new BlocRenderError(bloc.state);
  }

  if (promise.current) {
    use(promise.current);
  }
};

/**
 * Custom hook to select and use a specific piece of state from a Bloc, with support for suspense and error handling.
 *
 * @template Bloc Type of Bloc being monitored.
 * @template SelectedState The type of the selected state.
 * @template State The state type of the Bloc instance.
 */
export const useBlocSelector = <
  Bloc extends ClassType<BlocBase<any>>,
  SelectedState,
  State extends StateType<InstanceType<Bloc>> = StateType<InstanceType<Bloc>>
>(
  bloc: Bloc,
  config?: UseBlocSelectorConfig<InstanceType<Bloc>, SelectedState>
): SelectedState => {
  const blocInstance = useBlocInstance(bloc);
  const selector =
    config?.selector ??
    (defaultSelector as (
      state: StateType<InstanceType<Bloc>>
    ) => StateType<InstanceType<Bloc>>);
  const listenWhen = config?.listenWhen ?? defaultListenWhen;
  const suspendWhen = config?.suspendWhen ?? defaultSuspendWhen;
  const errorWhen = config?.errorWhen ?? defaultErrorWhen;

  useSuspenseOrError(blocInstance, {
    suspendWhen,
    errorWhen,
  });

  const subscriptionCallback = useCallback(
    (notify: () => void) => {
      const subscription = (blocInstance.state$ as Observable<State>)
        .pipe(
          startWith(blocInstance.state),
          distinctUntilChanged(),
          filter((state: State): state is State => listenWhen(state)),
          map((state) => selector(state)),
          distinctUntilChanged()
        )
        // queue state emissions for next tick to prevent tearing
        .subscribe(() => setTimeout(() => notify(), 0));
      return () => {
        subscription.unsubscribe();
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [blocInstance]
  );

  const selected = useSyncExternalStoreWithSelector(
    subscriptionCallback,
    () => blocInstance.state,
    () => blocInstance.state,
    selector
  );

  useDebugValue(selected);
  return selected;
};

export class BlocRenderError<State> extends Error {
  override name = 'BlocRenderError';
  constructor(public readonly state: State, _reload?: () => void) {
    super('useBlocSelector: errorWhen triggered a new render Error');
  }
}
