import { BlocBase, ClassType } from '@jacobtipp/bloc';
import {
  PropsWithChildren,
  ReactNode,
  createContext,
  createElement,
  useEffect,
  useMemo,
  useState,
} from 'react';

export type BlocContextMap = Map<string, React.Context<BlocBase<any>>>;

export interface BlocCreatorProvider<Bloc extends ClassType<BlocBase<any>>> {
  bloc: Bloc;
  create: () => InstanceType<Bloc>;
  children: ReactNode;
  dependencies?: any[];
}

export const blocContextMap: BlocContextMap = new Map();

export const BlocProvider = <Bloc extends ClassType<BlocBase<any>>>({
  bloc,
  children,
  dependencies = [],
  create,
}: BlocCreatorProvider<Bloc>) => {
  const [instance, setInstance] = useState(() => create());

  const context = useMemo(() => {
    let context = blocContextMap.get(bloc.name);
    if (!context) {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      context = createContext<BlocBase<any>>(instance);
      blocContextMap.set(bloc.name, context);
    }
    return context;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (instance.isClosed) {
      setInstance(create());
    }
    return () => {
      if (!instance.isClosed) {
        instance.close();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, dependencies);

  return createElement(
    context.Provider,
    {
      value: instance,
    },
    children
  );
};

type BlocProviderReturnType = ReturnType<typeof BlocProvider>;

export type MultiBlocProviderProps = {
  providers: Array<({ children }: PropsWithChildren) => BlocProviderReturnType>;
};

export const MultiBlocProvider = ({
  providers,
  children,
}: PropsWithChildren<MultiBlocProviderProps>) => {
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
