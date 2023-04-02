import { Suspense } from 'react';
import { UserBloc, UserLastNameAsyncChangedEvent } from '../user';
import { BlocListener, BlocProvider } from '../../../../src';
import { UserBlocConsumer } from './user-bloc-consumer';
import CounterCubit from '../../counter/counter.cubit';

export const UserSingleBlocListenerProvider = () => (
  <BlocProvider
    blocs={[
      {
        key: UserBloc,
        create: () =>
          new UserBloc().add(new UserLastNameAsyncChangedEvent('richards')),
      },
    ]}
  >
    <BlocListener
      bloc={UserBloc}
      listener={(bloc, _state) => {
        bloc.add(new UserLastNameAsyncChangedEvent('bloc-listener'));
      }}
    >
      <UserBlocConsumer />
    </BlocListener>
  </BlocProvider>
);

export const UserBlocProvider = (suspendWhen?: (state: any) => boolean) => (
  <BlocProvider
    blocs={[
      {
        key: UserBloc,
        create: () =>
          new UserBloc().add(new UserLastNameAsyncChangedEvent('richards')),
      },
    ]}
  >
    <Suspense fallback={<div data-testid="test-loading">...loading</div>}>
      <UserBlocConsumer suspendWhen={suspendWhen} />
    </Suspense>
  </BlocProvider>
);

export const UserMultiBlocProvider = () => (
  <BlocProvider
    blocs={[
      {
        key: UserBloc,
        create: () => new UserBloc().add(new UserLastNameAsyncChangedEvent('')),
      },
      {
        key: CounterCubit,
        create: () => new CounterCubit(),
      },
    ]}
  >
    <Suspense fallback={<div data-testid="test-loading">loading</div>}>
      <UserBlocConsumer />
    </Suspense>
  </BlocProvider>
);
