import { Suspense } from 'react';
import {
  UserErrorEvent,
  UserLastNameAsyncChangedEvent,
  UserNameChangedEvent,
} from '../user-event';
import {
  UserBlocErrorFallback,
  UserBlocValueConsumer,
  UserBlocListenerConsumer,
  UserBlocErrorConsumer,
  UserBlocSelectorConsumer,
  UserBlocSuspenseFallback,
  UserBlocListenerConsumerWithListenerComponent,
  UserBlocListenerConsumerWithDefaultListenWhen,
} from './user-consumer';
import { BlocErrorBoundary, BlocProvider, RootProvider } from '../../../../src';
import { UserBloc } from '../user-bloc';

export const UserBlocListenerProvider = () => (
  <RootProvider>
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
  </RootProvider>
);

export const UserBlocListenerProviderWithDefaultListenWhen = () => (
  <RootProvider>
    <BlocProvider
      bloc={UserBloc}
      create={() =>
        new UserBloc().add(new UserLastNameAsyncChangedEvent('richards'))
      }
    >
      <Suspense fallback={<UserBlocSuspenseFallback />}>
        <UserBlocListenerConsumerWithDefaultListenWhen />
      </Suspense>
    </BlocProvider>
  </RootProvider>
);

export const UserBlocListenerWithComnponentProvider = () => (
  <RootProvider>
    <BlocProvider
      bloc={UserBloc}
      create={() =>
        new UserBloc().add(new UserLastNameAsyncChangedEvent('richards'))
      }
    >
      <Suspense fallback={<UserBlocSuspenseFallback />}>
        <UserBlocListenerConsumerWithListenerComponent />
      </Suspense>
    </BlocProvider>
  </RootProvider>
);

export const UserBlocValueProvider = () => (
  <RootProvider>
    <BlocProvider
      bloc={UserBloc}
      create={() => new UserBloc()}
      onMount={(bloc) => {
        bloc.add(
          new UserNameChangedEvent({
            first: 'bob',
            last: bloc.state.data.name.last,
          })
        );
      }}
    >
      <UserBlocValueConsumer />
    </BlocProvider>
  </RootProvider>
);

export const UserBlocErrorProvider = () => (
  <RootProvider>
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
  </RootProvider>
);

export const UserBlocSuspenseProvider = () => (
  <RootProvider>
    <BlocProvider bloc={UserBloc} create={() => new UserBloc()}>
      <Suspense fallback={<UserBlocSuspenseFallback />}>
        <UserBlocSelectorConsumer />
      </Suspense>
    </BlocProvider>
  </RootProvider>
);
