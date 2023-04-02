import { BlocProvider } from '../../src';
import { CounterBloc } from './counter/counter.bloc';
import CounterCubit from './counter/counter.cubit';
import { UserBloc, UserLastNameAsyncChangedEvent } from './user/user';

export const cubitCounterWrapper = ({ children }: any) => (
  <BlocProvider
    blocs={[
      {
        key: CounterCubit,
        create: () => new CounterCubit(),
      },
    ]}
  >
    {children}
  </BlocProvider>
);

export const blocCounterWrapper = ({ children }: any) => (
  <BlocProvider
    blocs={[
      {
        key: CounterBloc,
        create: () => new CounterBloc(),
      },
    ]}
  >
    {children}
  </BlocProvider>
);

export const blocUserWrapper = ({ children }: any) => (
  <BlocProvider
    blocs={[
      {
        key: UserBloc,
        create: () => new UserBloc(),
      },
    ]}
  >
    {children}
  </BlocProvider>
);

export const blocSuspendableUserWrapper = ({ children }: any) => (
  <BlocProvider
    blocs={[
      {
        key: UserBloc,
        create: () =>
          new UserBloc().add(new UserLastNameAsyncChangedEvent('richards')),
      },
    ]}
  >
    {children}
  </BlocProvider>
);
