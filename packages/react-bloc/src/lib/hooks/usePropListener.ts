import { useEffect, useRef } from 'react';
import { defaultListenWhen } from './defaults';
import { Subject, Subscription, filter, map, pairwise, startWith } from 'rxjs';
import { Bloc } from '@jacobtipp/bloc';
import { useIsomorphicLayoutEffect } from '../util';

export interface PropListener<Prop> {
  listener: (prop: Prop) => void;
  listenWhen?: (previous: Prop, current: Prop) => boolean;
}

export const usePropListener = <Prop>(
  prop: Prop,
  { listener, listenWhen }: PropListener<Prop>,
  deps?: any[]
) => {
  const when = listenWhen ?? defaultListenWhen;
  const listenerSubscription = useRef<Subscription | null>(null);
  const listenerSubject = useRef<Subject<Prop> | null>(null);

  useEffect(() => {
    listenerSubject.current?.next(prop);
  }, [prop]);

  useIsomorphicLayoutEffect(() => {
    listenerSubject.current = new Subject<Prop>();
    listenerSubscription.current = listenerSubject.current
      .pipe(
        startWith(prop),
        pairwise(),
        filter(([previous, current]) => {
          return !Bloc.ignoreListeners && when(previous, current);
        }),
        map(([_, current]) => listener(current))
      )
      .subscribe();

    return () => {
      listenerSubscription.current?.unsubscribe();
      listenerSubscription.current = null;
      listenerSubject.current?.complete();
      listenerSubject.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps ?? []);
};
