import { BlocBase, ClassType } from '@jacobtipp/bloc';
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

export type BlocContextMap = WeakMap<
  ClassType<BlocBase<any>>,
  { count: number; blocContext: React.Context<BlocBase<any> | undefined> }
>;

export interface BlocCreatorProvider<Bloc extends ClassType<BlocBase<any>>> {
  bloc: Bloc;
  create: () => InstanceType<Bloc>;
  children: ReactNode;
  dependencies?: any[];
}

export const contextMap: BlocContextMap = new WeakMap();

const getStateFromProps = <Bloc extends ClassType<BlocBase<any>>>(
  bloc: Bloc,
  create: () => InstanceType<Bloc>
) => {
  const blocInstance = create();

  const blocContainer = contextMap.get(bloc);

  let context: Context<BlocBase<any> | undefined>;
  if (blocContainer) {
    blocContainer.count++;
    context = blocContainer.blocContext;
  } else {
    context = createContext<BlocBase<any> | undefined>(undefined);
    contextMap.set(bloc, {
      count: 1,
      blocContext: context,
    });
  }

  return {
    bloc: blocInstance,
    context,
  } as {
    bloc: InstanceType<Bloc>;
    context: Context<InstanceType<Bloc> | undefined>;
  };
};

export const BlocProvider = <Bloc extends ClassType<BlocBase<any>>>({
  bloc,
  dependencies = [],
  children,
  create,
}: BlocCreatorProvider<Bloc>): FunctionComponentElement<{
  value: InstanceType<Bloc> | undefined;
}> => {
  const [state, setState] = useState<{
    bloc: InstanceType<Bloc>;
    context: Context<InstanceType<Bloc> | undefined>;
  } | null>(null);

  useEffect(
    () => {
      const providerState = getStateFromProps(bloc, create);

      setState(providerState);

      return () => {
        providerState.bloc.close();
        const blocContainer = contextMap.get(bloc);
        if (blocContainer !== undefined && --blocContainer.count <= 0) {
          contextMap.delete(bloc);
        }
      };
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    dependencies
  );

  if (state) {
    return createElement(
      state.context.Provider,
      { value: state.bloc },
      children
    );
  }

  // eslint-disable-next-line react/jsx-no-useless-fragment
  return <Fragment></Fragment>;
};

export interface MultiBlocProviderProps {
  providers: Array<
    ({ children }: PropsWithChildren) => FunctionComponentElement<{
      value: BlocBase<any> | undefined;
    }>
  >;
}

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
