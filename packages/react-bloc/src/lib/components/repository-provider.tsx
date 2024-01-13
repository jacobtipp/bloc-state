import { ClassType } from '@jacobtipp/bloc';
import {
  MutableRefObject,
  PropsWithChildren,
  ReactNode,
  createContext,
  createElement,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

export type Closable = {
  close?: () => void;
};

export type RepositoryContext = {
  initialized: boolean;
  instance: MutableRefObject<Closable | null>;
};

export type RepositoryContextMap = WeakMap<
  ClassType<any>,
  React.Context<RepositoryContext>
>;

export interface RepositoryCreatorProvider<Repository extends ClassType<any>> {
  repository: Repository;
  create: () => InstanceType<Repository>;
  children: ReactNode;
  dependencies?: any[];
}

export const repositoryContextMap: RepositoryContextMap = new WeakMap();

export const RepositoryProvider = <Repository extends ClassType<any>>({
  repository,
  children,
  dependencies = [],
  create,
}: RepositoryCreatorProvider<Repository>) => {
  const [initialized, setInitialized] = useState(false);
  const instanceRef = useRef<Closable | null>(null);

  if (instanceRef.current === null) {
    instanceRef.current = create();
  }

  const context = useMemo(() => {
    let context = repositoryContextMap.get(repository);
    if (!context) {
      context = createContext<RepositoryContext>({
        initialized,
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        instance: instanceRef,
      });
      repositoryContextMap.set(repository, context);
      return context;
    } else {
      return context;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (instanceRef.current === null) {
      instanceRef.current = create();
      setInitialized(!initialized);
    }
    return () => {
      instanceRef.current?.close?.();
      instanceRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, dependencies);

  return createElement(
    context.Provider,
    {
      value: {
        initialized,
        instance: instanceRef,
      },
    },
    children
  );
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
