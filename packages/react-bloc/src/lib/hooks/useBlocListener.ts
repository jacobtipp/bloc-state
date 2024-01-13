import { BlocBase, StateType, ClassType } from '@jacobtipp/bloc';
import { useRef, useLayoutEffect } from 'react';
import { useBlocInstance } from './useBlocInstance';
import { defaultListenWhen } from './defaults';
import { Subscription, filter, map, pairwise, startWith } from 'rxjs';

export interface BlocListenerProps<
  Bloc extends ClassType<BlocBase<any>>,
  State = StateType<InstanceType<Bloc>>
> {
  listener: (bloc: InstanceType<Bloc>, state: State) => void;
  listenWhen?: (previous: State, current: State) => boolean;
}

export const useBlocListener = <Bloc extends ClassType<BlocBase<any>>>(
  bloc: Bloc,
  { listener, listenWhen }: BlocListenerProps<Bloc>
) => {
  const blocInstance = useBlocInstance(bloc);
  const when = listenWhen ?? defaultListenWhen;
  const listenerSubscription = useRef<Subscription | null>(null);

  useLayoutEffect(() => {
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

    return () => {
      listenerSubscription.current?.unsubscribe();
      listenerSubscription.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [blocInstance]);
};
