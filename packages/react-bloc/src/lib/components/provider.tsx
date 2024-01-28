import {
  PropsWithChildren,
  ReactNode,
  createContext,
  createElement,
  useContext,
  useEffect,
  useMemo,
} from 'react';
import {
  AnyClassType,
  ProviderContext,
  contextMapContext,
} from './root-provider';
import { useDisposable } from 'use-disposable';

export type BaseList = ReadonlyArray<unknown>;

export interface ProviderProps<Class extends AnyClassType> {
  classDef: Class;
  create: () => InstanceType<Class>;
  onMount?: (instance: InstanceType<Class>) => void;
  onUnmount?: (instance: InstanceType<Class>) => void;
  disposeTime?: number;
  children: ReactNode;
  dependencies?: any[];
}

const mounted = new WeakSet<any>();

export const Provider = <Class extends AnyClassType>({
  children,
  classDef,
  dependencies = [],
  disposeTime = 5 * 1000,
  create,
  onMount,
  onUnmount,
}: ProviderProps<Class>) => {
  const createInstance = () => {
    const instance = create();
    setTimeout(() => {
      /* istanbul ignore else */
      if (!mounted.has(instance)) {
        onUnmount?.(instance);
      }
    }, disposeTime);
    return instance;
  };

  const instance = useDisposable(() => {
    const instance = createInstance();
    return [
      instance,
      () => {
        onUnmount?.(instance);
      },
    ];
  }, dependencies) as InstanceType<Class>;

  useEffect(() => {
    const created = instance;

    onMount?.(created);

    /* istanbul ignore else */
    if (!mounted.has(created)) {
      mounted.add(created);
    }

    return () => {
      mounted.delete(created);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [instance]);

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const contextMap = useContext(contextMapContext)!;

  const context = useMemo(() => {
    let cachedContext = contextMap.get(classDef.name);
    if (!cachedContext) {
      cachedContext = createContext<ProviderContext>({
        instance,
      });
      contextMap.set(classDef.name, cachedContext);
      return cachedContext;
    } else {
      return cachedContext;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return createElement(
    context.Provider,
    {
      value: {
        instance,
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
