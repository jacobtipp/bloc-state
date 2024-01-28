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
import {
  BlocErrorBoundary,
  BlocProvider,
  ContextMapProvider,
} from '../../../../src';
import { UserBloc } from '../user-bloc';

export const UserBlocListenerProvider = () => (
  <ContextMapProvider>
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
  </ContextMapProvider>
);

export const UserBlocListenerProviderWithDefaultListenWhen = () => (
  <ContextMapProvider>
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
  </ContextMapProvider>
);

export const UserBlocListenerWithComnponentProvider = () => (
  <ContextMapProvider>
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
  </ContextMapProvider>
);

export const UserBlocValueProvider = () => (
  <ContextMapProvider>
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
  </ContextMapProvider>
);

export const UserBlocErrorProvider = () => (
  <ContextMapProvider>
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
  </ContextMapProvider>
);

export const UserBlocSuspenseProvider = () => (
  <ContextMapProvider>
    <BlocProvider bloc={UserBloc} create={() => new UserBloc()}>
      <Suspense fallback={<UserBlocSuspenseFallback />}>
        <UserBlocSelectorConsumer />
      </Suspense>
    </BlocProvider>
  </ContextMapProvider>
);
