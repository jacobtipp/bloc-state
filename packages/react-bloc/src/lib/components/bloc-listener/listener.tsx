import { BlocBase, ClassType } from '@jacobtipp/bloc';
import { useLayoutSubscription, useObservable } from 'observable-hooks';
import { filter, map, pairwise, startWith } from 'rxjs';
import { useBlocInstance } from '../../hooks';
import { StateType } from '../../types';
import { useMemo } from 'react';

export interface BlocListenerProps<B extends BlocBase<any>> {
  bloc: ClassType<B>;
  listener: (bloc: B, state: StateType<InstanceType<this['bloc']>>) => void;
  listenWhen?: (
    previous: StateType<InstanceType<this['bloc']>>,
    current: StateType<InstanceType<this['bloc']>>
  ) => boolean;
}

export function BlocListener<B extends BlocBase<any>>({
  bloc,
  listener,
  listenWhen,
  children,
}: React.PropsWithChildren<BlocListenerProps<B>>) {
  const blocInstance = useBlocInstance(bloc);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const blocListener = useMemo(() => listener, []);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const when = useMemo(() => listenWhen ?? (() => true), []);

  const state$ = useObservable(() =>
    blocInstance.state$.pipe(
      startWith(blocInstance.state),
      pairwise(),
      filter(([previous, current]) => {
        return when(previous, current);
      }),
      map(([_, current]) => current)
    )
  );

  useLayoutSubscription(state$, (next) => {
    blocListener(blocInstance, next);
  });

  return <> {children} </>;
}
