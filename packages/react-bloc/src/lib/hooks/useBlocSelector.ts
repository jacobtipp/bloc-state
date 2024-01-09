import { BlocBase, StateType, ClassType } from '@jacobtipp/bloc';
import {
  useCallback,
  useDebugValue,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
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

const { useSyncExternalStoreWithSelector } = useSyncExternalStoreExports;

export type UseBlocSelectorConfig<Bloc extends BlocBase<any>, SelectedState> = {
  selector?: (state: StateType<Bloc>) => SelectedState;
  listenWhen?: (state: StateType<Bloc>) => boolean;
  suspendWhen?: (state: StateType<Bloc>) => boolean;
  errorWhen?: (state: StateType<Bloc>) => boolean;
};

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

  const [suspend, setSuspend] = useState(() => suspendWhen(bloc.state));

  const promise = useRef<Promise<any> | null>(null);

  const suspendedState = useRef<State>(bloc.state);

  const suspsenseSubscription = useRef<Subscription | null>(null);

  useLayoutEffect(() => {
    suspsenseSubscription.current = (bloc.state$ as Observable<State>)
      .pipe(startWith(bloc.state as State))
      .subscribe((state) => {
        if (suspendWhen(state)) {
          suspendedState.current = state;
          setSuspend(true);
        }
      });

    return () => {
      suspsenseSubscription.current?.unsubscribe();
      suspsenseSubscription.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (errorWhen(bloc.state as State)) {
    throw new BlocRenderError(bloc.state);
  }

  if (suspend) {
    promise.current = firstValueFrom(
      bloc.state$.pipe(
        startWith(suspendedState.current),
        filter((state) => !suspendWhen(state))
      )
    ).then(() => {
      promise.current = null;
      setSuspend(false);
    });

    throw promise.current;
  }
};

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

  const subscriptionCallback = useCallback((notify: () => void) => {
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
  }, []);

  const selected = useSyncExternalStoreWithSelector(
    subscriptionCallback,
    () => blocInstance.state,
    null,
    selector
  );

  useDebugValue(selected);
  return selected;
};

export class BlocRenderError<State> extends Error {
  constructor(public readonly state: State, _reload?: () => void) {
    super('useBlocSelector: errorWhen triggered a new render Error');
    Object.setPrototypeOf(this, BlocRenderError.prototype);
  }
}
