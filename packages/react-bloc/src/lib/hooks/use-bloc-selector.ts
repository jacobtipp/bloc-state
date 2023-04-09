import { BlocBase, ClassType } from '@jacobtipp/bloc';
import { isStateInstance } from '@jacobtipp/state';
import { useCallback, useDebugValue, useMemo } from 'react';
import { filter, startWith } from 'rxjs';
import { StateType, SuspenseDataType } from '../types';
import { useBlocInstance } from './use-bloc-instance';
import useSyncExternalStoreExports from 'use-sync-external-store/shim/with-selector';
import {
  ObservableResource,
  useObservable,
  useObservableSuspense,
} from 'observable-hooks';

const { useSyncExternalStoreWithSelector } = useSyncExternalStoreExports;

/**
 * SelectorStateType describes the return type of selector in UseBlocSelectorConfig interface.
 */
export type SelectorStateType<B extends BlocBase<any>> = SuspenseDataType<
  StateType<B>
>;

/**
 * This object holds optional functions for filtering and suspending state inside the observable resource provided by observable-hooks.
 */
export const defaultSuspendWhen = () => false;
const defaultListenWhen = () => true;
const defaultErrorWhen = () => false;

/**
 * UseBlocSelectorConfig is an interface for configuring options to function useBlocSelector.
 */
export type UseBlocSelectorConfig<Bloc extends BlocBase<any>, SelectedState> = {
  selector: (state: SelectorStateType<Bloc>) => SelectedState;
  listenWhen?: (state: StateType<Bloc>) => boolean;
  suspendWhen?: (state: StateType<Bloc>) => boolean;
  errorWhen?: (state: StateType<Bloc>) => boolean;
};

/**
 * This is a custom hook that subscribes to bloc instance and returns selected state.
 */
/**
 * useBlocSelector is a custom hook which takes in a Bloc class and returns the selected state from the bloc instance using provided selector.
 * @template SelectedState - The type of the selected state.
 * @template Bloc - The type of the bloc instance.
 * @param bloc - The Bloc class to fetch the bloc instance from.
 * @param config - The configuration object which consists of selector, listenWhen function, suspendWhen function, and errorWhen function.
 * @returns The selected state from the bloc instance using provided selector.
 */
export function useBlocSelector<SelectedState, Bloc extends BlocBase<any>>(
  bloc: ClassType<Bloc>,
  config: UseBlocSelectorConfig<Bloc, SelectedState>
): SelectedState {
  /**
   * Fetches the bloc instance using providedBloc.
   */
  const providedBloc = useBlocInstance(bloc);

  /**
   * Destructures config and sets default values if not specified.
   */
  const selector = config.selector;
  const listenWhen = config.listenWhen ?? defaultListenWhen;
  const suspendWhen = config.suspendWhen ?? defaultSuspendWhen;
  const errorWhen = config.errorWhen ?? defaultErrorWhen;

  /**
   *  Filtered observable blocSelectorState$ used by ObservableResource.
   */
  const blocSelectorState$ = useObservable(() => {
    return providedBloc.state$.pipe(
      startWith(providedBloc.state),
      filter((state) => {
        if (errorWhen && errorWhen(state)) {
          throw new BlocRenderError(state);
        }

        return listenWhen(state);
      })
    );
  });

  /**
   * Creates an ObservableResource which handles the suspension
   */
  const resource = useMemo(
    () => {
      return new ObservableResource(
        blocSelectorState$,
        (value) => !suspendWhen(value)
      );
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  /**
   * This hook will throw a Promise if the ObservableResource is suspended.
   */
  useObservableSuspense(resource);

  // Memoize the subscription callback function using useCallback.
  const subscriptionCallback = useCallback((notify: () => void) => {
    const subscription = resource.valueRef$$.subscribe(notify);
    return () => subscription.unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /**
   * Syncs external store with selector for selected state.
   */
  const selected = useSyncExternalStoreWithSelector<
    SuspenseDataType<StateType<Bloc>>,
    SelectedState
  >(
    subscriptionCallback,
    () => providedBloc.state,
    null,
    (state) => (isStateInstance(state) ? selector(state.data) : selector(state))
  );

  /**
   * Uses react's useDebugValue Hook to display selected state.
   */
  useDebugValue(selected);
  return selected;
}

/**
 * BlocRenderError class extends the Error object and is thrown by observables when errorWhen is triggered.
 * @template State - The type of the state in the bloc instance.
 */
export class BlocRenderError<State> extends Error {
  /**
   * Creates an instance of BlocRenderError.
   * @param state - The state that caused the error.
   * @_reload - A function used to reload the component.
   */
  constructor(public readonly state: State, _reload?: () => void) {
    super('useBlocSelector: errorWhen triggered a new render Error');

    Object.setPrototypeOf(this, BlocRenderError.prototype);
  }
}
