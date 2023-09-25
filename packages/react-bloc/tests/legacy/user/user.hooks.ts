import { useBlocListener, useBlocSelector, useBlocValue } from '../../../src';
import { UserBloc } from './user-bloc';
import { UserLastNameAsyncChangedEvent } from './user-event';

export const useUserLastName = () => {
  return useBlocSelector(UserBloc, {
    selector: (state) => state.data.name.last,
    errorWhen: (state) => state.data.name.last === 'bloc-error',
    suspendWhen: (state) => state.status === 'loading',
  });
};

export const useUserFirstName = () => {
  const user = useBlocValue(UserBloc);
  return user.data.name.first;
};

export const useUserLastNameListener = () => {
  useBlocListener(UserBloc, {
    listener: (bloc, _state) => {
      bloc.add(new UserLastNameAsyncChangedEvent('richards-two'));
    },
    listenWhen(_previous, current) {
      return (
        current.status === 'ready' && current.data.name.last !== 'richards-two'
      );
    },
  });

  return useUserLastName();
};
