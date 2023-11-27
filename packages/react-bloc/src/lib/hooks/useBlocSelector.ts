import { BlocBase, StateType, ClassType } from '@jacobtipp/bloc';
import {
  useCallback,
  useSyncExternalStore,
  useDebugValue,
  useEffect,
  useMemo,
  useRef,
} from 'react';
import { useBlocInstance } from './useBlocInstance';
import {
  Observable,
  Subscription,
  distinctUntilChanged,
  filter,
  map,
  startWith,
} from 'rxjs';
import {
  defaultSuspendWhen,
  defaultErrorWhen,
  defaultListenWhen,
} from './defaults';

export type UseBlocSelectorConfig<Bloc extends BlocBase<any>, SelectedState> = {
  selector: (state: StateType<Bloc>) => SelectedState;
  listenWhen?: (state: StateType<Bloc>) => boolean;
  suspendWhen?: (state: StateType<Bloc>) => boolean;
  errorWhen?: (state: StateType<Bloc>) => boolean;
};

interface Handler<T = any> {
  suspender_: Promise<T>;
  resolve_: (value?: T) => void;
}

const createHandler = (): Handler => {
  const handler: Partial<Handler> = {};
  handler.suspender_ = new Promise((resolve) => {
    handler.resolve_ = resolve;
  });
  return handler as Handler;
};

const useSuspenseOrError = <
  Bloc extends ClassType<BlocBase<any>>,
  State extends StateType<InstanceType<Bloc>> = StateType<InstanceType<Bloc>>
>(
  bloc: InstanceType<Bloc>,
  config: {
    suspendWhen?: (state: State) => boolean;
    errorWhen?: (state: State) => boolean;
  }
) => {
  const suspenseHandler = useRef<Handler | null>(null);

  const suspsenseSubscription = useRef<Subscription | null>(null);

  if (!suspsenseSubscription.current) {
    const suspendWhen = config.suspendWhen ?? defaultSuspendWhen;
    suspsenseSubscription.current = (bloc.state$ as Observable<State>)
      .pipe(startWith(bloc.state as State))
      .subscribe((state) => {
        if (suspendWhen(state)) {
          suspenseHandler.current = createHandler();
        } else if (suspenseHandler.current) {
          suspenseHandler.current.resolve_();
          suspenseHandler.current = null;
        }
      });
  }

  useMemo(() => {
    const errorWhen = config.errorWhen ?? defaultErrorWhen;
    if (errorWhen(bloc.state as State)) {
      throw new BlocRenderError(bloc.state);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bloc.state]);

  if (suspenseHandler.current) throw suspenseHandler.current.suspender_;

  useEffect(() => {
    return () => {
      suspsenseSubscription.current?.unsubscribe();
      suspenseHandler.current?.resolve_();
      suspenseHandler.current = null;
      suspsenseSubscription.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
};

export const useBlocSelector = <
  Bloc extends ClassType<BlocBase<any>>,
  SelectedState,
  State extends StateType<InstanceType<Bloc>> = StateType<InstanceType<Bloc>>
>(
  bloc: Bloc,
  config: UseBlocSelectorConfig<InstanceType<Bloc>, SelectedState>
): SelectedState => {
  const blocInstance = useBlocInstance(bloc);
  const selector = config.selector;
  const listenWhen = config.listenWhen ?? defaultListenWhen;

  useSuspenseOrError(blocInstance, {
    suspendWhen: config.suspendWhen,
    errorWhen: config.errorWhen,
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
      .subscribe(notify);
    return () => {
      subscription.unsubscribe();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const selected = useSyncExternalStore<SelectedState>(
    subscriptionCallback,
    () => selector(blocInstance.state)
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
