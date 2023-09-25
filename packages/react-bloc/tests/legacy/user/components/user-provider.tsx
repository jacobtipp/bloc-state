import { Suspense } from 'react';
import {
  UserErrorEvent,
  UserLastNameAsyncChangedEvent,
  UserNameChangedEvent,
} from '../../../legacy/user/user-event';
import {
  UserBlocErrorFallback,
  UserBlocValueConsumer,
  UserBlocListenerConsumer,
  UserBlocErrorConsumer,
  UserBlocSelectorConsumer,
  UserBlocSuspenseFallback,
} from './user-consumer';
import { BlocErrorBoundary, BlocProvider } from '../../../../src';
import { UserBloc } from '../../../legacy/user/user-bloc';

export const UserBlocListenerProvider = () => (
  <BlocProvider
    bloc={UserBloc}
    create={() =>
      new UserBloc().add(new UserLastNameAsyncChangedEvent('richards'))
    }
  >
    <Suspense fallback={<UserBlocSuspenseFallback />}>
      <UserBlocListenerConsumer />
    </Suspense>
  </BlocProvider>
);

export const UserBlocValueProvider = () => (
  <BlocProvider
    bloc={UserBloc}
    create={() => {
      const userBloc = new UserBloc();
      return userBloc.add(
        new UserNameChangedEvent({
          first: 'bob',
          last: userBloc.state.data.name.last,
        })
      );
    }}
  >
    <UserBlocValueConsumer />
  </BlocProvider>
);

export const UserBlocErrorProvider = () => (
  <BlocProvider
    bloc={UserBloc}
    create={() => new UserBloc().add(new UserErrorEvent())}
  >
    <BlocErrorBoundary
      bloc={UserBloc}
      fallback={UserBlocErrorFallback}
      onReset={(userBloc) =>
        userBloc.add(
          new UserNameChangedEvent({
            ...userBloc.state.data.name,
            last: 'error-reset',
          })
        )
      }
    >
      <UserBlocErrorConsumer />
    </BlocErrorBoundary>
  </BlocProvider>
);

export const UserBlocSuspenseProvider = () => (
  <BlocProvider bloc={UserBloc} create={() => new UserBloc()}>
    <Suspense fallback={<UserBlocSuspenseFallback />}>
      <UserBlocSelectorConsumer />
    </Suspense>
  </BlocProvider>
);
