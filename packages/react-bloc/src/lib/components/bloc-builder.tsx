import { BlocBase, ClassType, StateType } from '@jacobtipp/bloc';
import { defaultBuildWhen, useBlocInstance } from '../hooks';
import { useLayoutEffect, useRef, useState } from 'react';
import { Subscription, filter, map, pairwise, startWith } from 'rxjs';

export interface BlocBuilderProps<
  Bloc extends ClassType<BlocBase<any>>,
  State = StateType<InstanceType<Bloc>>
> {
  bloc: Bloc;
  builder: (state: State) => JSX.Element;
  buildWhen?: (previous: State, current: State) => boolean;
}

export function BlocBuilder<Bloc extends ClassType<BlocBase<any>>>({
  bloc,
  builder,
  buildWhen,
}: BlocBuilderProps<Bloc>): JSX.Element {
  const blocInstance = useBlocInstance(bloc);
  const when = buildWhen ?? defaultBuildWhen;
  const listenerSubscription = useRef<Subscription | null>(null);
  const [state, setState] = useState(() => blocInstance.state);

  useLayoutEffect(() => {
    listenerSubscription.current = blocInstance.state$
      .pipe(
        startWith(state),
        pairwise(),
        filter(([previous, current]) => {
          return when(previous, current);
        }),
        map(([_, current]) => {
          setState(current);
        })
      )
      .subscribe();

    return () => {
      listenerSubscription.current?.unsubscribe();
      listenerSubscription.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return builder(state);
}
