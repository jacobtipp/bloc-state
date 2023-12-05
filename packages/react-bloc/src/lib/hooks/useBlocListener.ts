import { BlocBase, StateType, ClassType } from '@jacobtipp/bloc';
import { useRef, useEffect } from 'react';
import { defaultListenWhen } from './defaults';
import { useBloc } from './useBloc';

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
  const [state, blocInstance] = useBloc(bloc, {
    selector: (state) => state,
  });

  const previous = useRef<StateType<InstanceType<Bloc>> | null>(null);

  const when = listenWhen ?? defaultListenWhen;

  useEffect(() => {
    const previousState = previous.current;
    if (previousState && when(previousState, state)) {
      listener(blocInstance, state);
    }
    previous.current = state;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);
};
