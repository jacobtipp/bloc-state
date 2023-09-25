import { BlocBase, ClassType } from '@jacobtipp/bloc';
import { StateType } from '../types';
import {
  useRef,
  useMemo,
  useEffect,
  useContext,
  useCallback,
  useDebugValue,
  useSyncExternalStore,
} from 'react';
import {
  Observable,
  Subscription,
  filter,
  map,
  pairwise,
  startWith,
} from 'rxjs';
import { contextMap } from '../provider';
import { useSyncExternalStoreWithSelector } from 'use-sync-external-store/with-selector';

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

const defaultSuspendWhen = () => false;
const defaultListenWhen = () => true;
const defaultErrorWhen = () => false;

type UseBlocSelectorConfig<Bloc extends BlocBase<any>, SelectedState> = {
  selector: (state: StateType<Bloc>) => SelectedState;
  listenWhen?: (state: StateType<Bloc>) => boolean;
  suspendWhen?: (state: StateType<Bloc>) => boolean;
  errorWhen?: (state: StateType<Bloc>) => boolean;
};

export const useBlocInstance = <Bloc extends ClassType<BlocBase<any>>>(
  bloc: Bloc
) => {
  const context = contextMap.get(bloc);
  if (!context)
    throw new Error(`${bloc.name} does not exist in the context map.`);

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  return useContext(context.blocContext)! as InstanceType<Bloc>;
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
          if (!suspenseHandler.current) {
            suspenseHandler.current = createHandler();
          }
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
      if (suspsenseSubscription.current)
        suspsenseSubscription.current.unsubscribe();
      if (suspenseHandler.current) suspenseHandler.current.resolve_();
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
      .pipe(filter((state: State): state is State => listenWhen(state)))
      .subscribe(notify);
    return () => {
      subscription.unsubscribe();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const selected = useSyncExternalStoreWithSelector<
    StateType<InstanceType<Bloc>>,
    SelectedState
  >(
    subscriptionCallback,
    () => blocInstance.state as StateType<InstanceType<Bloc>>,
    null,
    selector
  );

  useDebugValue(selected);
  return selected;
};

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

export interface BlocListenerProps<
  Bloc extends BlocBase<any>,
  State = StateType<Bloc>
> {
  listener: (bloc: Bloc, state: State) => void;
  listenWhen?: (previous: State, current: State) => boolean;
}

export const useBlocListener = <Bloc extends ClassType<BlocBase<any>>>(
  bloc: Bloc,
  { listener, listenWhen }: BlocListenerProps<InstanceType<Bloc>>
) => {
  const blocInstance = useBlocInstance(bloc);
  const when = listenWhen ?? defaultListenWhen;
  const listenerSubscription = useRef<Subscription | null>(null);

  if (!listenerSubscription.current)
    listenerSubscription.current = blocInstance.state$
      .pipe(
        startWith(blocInstance.state),
        pairwise(),
        filter(([previous, current]) => {
          return when(previous, current);
        }),
        map(([_, current]) => listener(blocInstance, current))
      )
      .subscribe();

  useEffect(
    () => () => {
      if (listenerSubscription.current) {
        listenerSubscription.current.unsubscribe();
      }
      listenerSubscription.current = null;
    },
    [bloc]
  );
};

export const useBloc = <
  Bloc extends ClassType<BlocBase<any>>,
  SelectedState = StateType<InstanceType<Bloc>>
>(
  bloc: Bloc,
  config: UseBlocSelectorConfig<InstanceType<Bloc>, SelectedState>
): readonly [SelectedState, InstanceType<Bloc>] => {
  const selectedState = useBlocSelector(bloc, config);
  const providedBloc = useBlocInstance(bloc);

  return [selectedState, providedBloc] as const;
};

export class BlocRenderError<State> extends Error {
  constructor(public readonly state: State, _reload?: () => void) {
    super('useBlocSelector: errorWhen triggered a new render Error');
    Object.setPrototypeOf(this, BlocRenderError.prototype);
  }
}
