import { useBloc, useBlocListener } from '../../../src';
import { CounterBloc } from './counter.cubit';

export const useCounter = () => {
  const [count, counterBloc] = useBloc(CounterBloc, {
    errorWhen(state) {
      return state === 0;
    },
    suspendWhen(state) {
      return state === 1 || state === 11;
    },
  });

  useBlocListener(CounterBloc, {
    listener(bloc, _state) {
      bloc.setCount(10);
    },
    listenWhen(_previous, current) {
      return current === 3;
    },
  });

  return {
    counterBloc,
    count,
  };
};
