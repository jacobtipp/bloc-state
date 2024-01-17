import { AbstractClassType, ClassType } from '@jacobtipp/bloc';
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

export type AnyClassType = ClassType<any> | AbstractClassType<any>;

export type Closable = {
  close?: () => void;
} & InstanceType<AnyClassType>;

export type ProviderContext = {
  initialized: boolean;
  instance: MutableRefObject<Closable | null>;
};

export type ProviderContextMap = Map<string, React.Context<ProviderContext>>;

export interface ProviderProps<Class extends AnyClassType> {
  classDef: Class;
  create: () => InstanceType<Class>;
  onMount?: (instance: InstanceType<Class>) => void;
  onUnmount?: (instance: InstanceType<Class>) => void;
  children: ReactNode;
  dependencies?: any[];
}

export const providerContextMap: ProviderContextMap = new Map();

export type InstanceMap = {
  lastCreatedTimeStamp: number;
  instance: Closable;
};

export const Provider = <Class extends AnyClassType>({
  children,
  classDef,
  dependencies = [],
  create,
  onMount,
  onUnmount,
}: ProviderProps<Class>) => {
  const [initialized, setInitialized] = useState(false);
  const instanceRef = useRef<Closable | null>(null);

  if (instanceRef.current === null) {
    instanceRef.current = create();
  }

  const context = useMemo(() => {
    let context = providerContextMap.get(classDef.name);
    if (!context) {
      context = createContext<ProviderContext>({
        initialized,
        instance: instanceRef,
      });
      providerContextMap.set(classDef.name, context);
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

    if (onMount) {
      onMount(instanceRef.current);
    }

    return () => {
      if (onUnmount) {
        onUnmount(instanceRef.current);
      }
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

type ProviderReturnType = ReturnType<typeof Provider>;

export type MultiProviderProps = {
  providers: Array<({ children }: PropsWithChildren) => ProviderReturnType>;
};

export const MultiProvider = ({
  providers,
  children,
}: PropsWithChildren<MultiProviderProps>) => {
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
