import { ClassType } from '@jacobtipp/bloc';
import {
  Context,
  Fragment,
  FunctionComponentElement,
  PropsWithChildren,
  ReactNode,
  createContext,
  createElement,
  useEffect,
  useMemo,
  useState,
} from 'react';

export type RepositoryContextMap = WeakMap<
  ClassType<any>,
  { repositoryContext: React.Context<any | undefined> }
>;

export interface RepositoryCreatorProvider<Repository extends ClassType<any>> {
  repository: Repository;
  create: () => InstanceType<Repository>;
  children: ReactNode;
  dependencies?: any[];
}

export const repositoryContextMap: RepositoryContextMap = new WeakMap();

const getStateFromProps = <Repository extends ClassType<any>>(
  repository: Repository,
  create: () => InstanceType<Repository>
) => {
  const repositoryInstance = create();

  const context = createContext<InstanceType<Repository> | undefined>(
    undefined
  );
  repositoryContextMap.set(repository, {
    repositoryContext: context,
  });

  return {
    repository: repositoryInstance,
    context,
  } as {
    repository: InstanceType<Repository>;
    context: Context<InstanceType<Repository> | undefined>;
  };
};

export const RepositoryProvider = <Repository extends ClassType<any>>({
  repository,
  dependencies = [],
  children,
  create,
}: RepositoryCreatorProvider<Repository>): FunctionComponentElement<{
  value: InstanceType<Repository> | undefined;
}> => {
  const [state, setState] = useState<{
    repository: InstanceType<Repository>;
    context: Context<InstanceType<Repository> | undefined>;
  } | null>(null);

  useEffect(
    () => {
      const providerState = getStateFromProps(repository, create);

      setState(providerState);

      return () => {
        repositoryContextMap.delete(repository);
      };
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    dependencies
  );

  if (state) {
    return createElement(
      state.context.Provider,
      { value: state.repository },
      children
    );
  }

  // eslint-disable-next-line react/jsx-no-useless-fragment
  return <Fragment></Fragment>;
};

type RepositoryProviderReturnType = ReturnType<typeof RepositoryProvider>;

export type MultiRepositoryProviderProps = {
  providers: Array<
    ({ children }: PropsWithChildren) => RepositoryProviderReturnType
  >;
};

export const MultiRepositoryProvider = ({
  providers,
  children,
}: PropsWithChildren<MultiRepositoryProviderProps>) => {
  const components = useMemo(() => {
    return providers.map((Provider) => {
      return ({ children }: PropsWithChildren) => (
        <Provider>{children}</Provider>
      );
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const Providers = useMemo(() => {
    return components.reduce(
      (Acc, Current) => {
        return ({ children }) => {
          return (
            <Acc>
              <Current>{children}</Current>
            </Acc>
          );
        };
      },
      // eslint-disable-next-line react/jsx-no-useless-fragment
      ({ children }) => <>{children}</>
    );
  }, [components]);

  return <Providers>{children}</Providers>;
};
