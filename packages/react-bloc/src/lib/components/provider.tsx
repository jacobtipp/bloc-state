import { BlocBase } from '@jacobtipp/bloc';
import {
  PropsWithChildren,
  ReactNode,
  createContext,
  createElement,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  AnyClassType,
  Closable,
  ProviderContext,
  contextMapContext,
} from './context-map-provider';

export type BaseList = ReadonlyArray<unknown>;

export interface ProviderProps<Class extends AnyClassType> {
  classDef: Class;
  create: () => InstanceType<Class>;
  onMount?: (instance: InstanceType<Class>) => void;
  onUnmount?: (instance: InstanceType<Class>) => void;
  disposeTimeout?: number;
  hydrate?: boolean;
  children: ReactNode;
  dependencies?: any[];
}

const mounted: WeakSet<BlocBase<any>> = new WeakSet();

export const Provider = <Class extends AnyClassType>({
  children,
  classDef,
  dependencies = [],
  create,
  hydrate = false,
  disposeTimeout = 5000,
  onMount,
  onUnmount,
}: ProviderProps<Class>) => {
  const [{ isHydrated }, setHydration] = useState({
    isHydrated: false,
  });
  const instanceRef = useRef<Closable | null>(null);

  const createInstance = () => {
    const instance = create();
    setTimeout(() => {
      if (!instance.isClosed && !mounted.has(instance)) {
        console.warn(
          `provider instance ${
            instance.name ?? instance.constructor.name
          } was never mounted and will be closed.`
        );
        instance?.close?.();
      }
    }, disposeTimeout);
    return instance;
  };

  if (instanceRef.current === null) {
    instanceRef.current = createInstance();
  }

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const contextMap = useContext(contextMapContext)!;

  const context = useMemo(() => {
    let cachedContext = contextMap.get(classDef.name);
    if (!cachedContext) {
      cachedContext = createContext<ProviderContext>({
        isHydrated,
        instance: instanceRef,
      });
      contextMap.set(classDef.name, cachedContext);
      return cachedContext;
    } else {
      return cachedContext;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!hydrate) return;

    if (isHydrated && instanceRef.current !== null) {
      onMount?.(instanceRef.current);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isHydrated, hydrate]);

  useEffect(() => {
    let instance = instanceRef.current;

    if (instance === null) {
      instance = instanceRef.current = createInstance();
      mounted.add(instance);
      setHydration({
        isHydrated: true,
      });
    } else {
      mounted.add(instance);
    }

    if (hydrate) {
      setHydration({
        isHydrated: true,
      });
    }

    if (!hydrate) {
      onMount?.(instance);
    }

    return () => {
      onUnmount?.(instance);
      instanceRef.current = null;
      mounted.delete(instance);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, dependencies);

  return createElement(
    context.Provider,
    {
      value: {
        isHydrated,
        instance: instanceRef,
      },
    },
    children
  );
};

type ProviderReturnType = ReturnType<typeof Provider>;

export type MultiProviderProps = {
  providers: Array<
    ({ children }: { children: ReactNode }) => ProviderReturnType
  >;
};

export const MultiProvider = ({
  providers,
  children,
}: MultiProviderProps & { children: ReactNode }) => {
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
