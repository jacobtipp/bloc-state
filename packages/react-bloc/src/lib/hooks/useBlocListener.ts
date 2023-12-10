import { BlocBase, StateType, ClassType } from '@jacobtipp/bloc';
import { useRef, useEffect } from 'react';
import { useBlocInstance } from './useBlocInstance';
import { defaultListenWhen } from './defaults';
import { Subscription, filter, map, pairwise, startWith } from 'rxjs';

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
      listenerSubscription.current?.unsubscribe();
      listenerSubscription.current = null;
    },
    [bloc]
  );
};
