import { PropsWithChildren } from 'react';
import {
  BlocProvider,
  MultiBlocProvider,
  RepositoryProvider,
  useBlocValue,
} from '../../../../src';
import { UserBloc } from '../user-bloc';
import { UserNameChangedEvent } from '../user-event';
import { CounterBloc } from '../../counter';

const nameGetter = {
  getName() {
    return 'bob';
  },
};

class TestRepository {
  constructor(private nameGetter: { getName: () => string }) {}

  getName() {
    return this.nameGetter.getName();
  }
}

const TestRepositoryProvider = ({ children }: PropsWithChildren) => (
  <RepositoryProvider
    repository={TestRepository}
    create={() => new TestRepository(nameGetter)}
    children={children}
  />
);

const UserBlocProvider = ({ children }: PropsWithChildren) => (
  <BlocProvider
    bloc={UserBloc}
    create={() =>
      new UserBloc().add(
        new UserNameChangedEvent({
          first: 'bob',
          last: 'parker',
        })
      )
    }
    children={children}
  />
);

const CounterBlocProvider = ({ children }: PropsWithChildren) => (
  <BlocProvider
    bloc={CounterBloc}
    create={() => new CounterBloc(0)}
    children={children}
  />
);

export const CounterWithUserProvider = () => {
  return (
    <MultiBlocProvider providers={[CounterBlocProvider, UserBlocProvider]}>
      <MultiBlocConsumer />
    </MultiBlocProvider>
  );
};

export const MultiBlocConsumer = () => {
  const {
    data: {
      name: { first },
    },
  } = useBlocValue(UserBloc);
  const count = useBlocValue(CounterBloc);

  return (
    <>
      <div data-testid="count">{count}</div>
      <div data-testid="first">{first}</div>
    </>
  );
};
