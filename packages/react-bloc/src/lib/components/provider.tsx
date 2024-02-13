'use client';

import {
  PropsWithChildren,
  ReactNode,
  createElement,
  useContext,
  useEffect,
  useMemo,
} from 'react';

import { useDisposable } from 'use-disposable';
import { AnyClassType, createCachedContext, rootContext } from '../context';

/**
 * Interface defining properties for a Provider component.
 *
 * @template Class The class type for the provider.
 */
export interface ProviderProps<Class extends AnyClassType> {
  /** The class definition to be used. */
  classDef: Class;
  /** Function to create an instance or an instance of the class. */
  create: (() => InstanceType<Class>) | InstanceType<Class>;
  /** Optional callback executed when the component mounts. */
  onMount?: (instance: InstanceType<Class>) => void;
  /** Optional callback executed when the component unmounts. */
  onUnmount?: (instance: InstanceType<Class>) => void;
  /** Time in milliseconds to wait before disposing of a non-mounted instance. */
  disposeTime?: number;
  /** Child nodes to be rendered. */
  children: ReactNode;
  /** Dependencies to trigger re-creation of the instance. */
  dependencies?: any[];
}

const mounted = new WeakSet<any>();

/**
 * A Provider component that manages the lifecycle of a provided class instance.
 *
 * @param {ProviderProps<Class>} props The properties for the Provider.
 * @returns The Provider component rendering its children within the provided context.
 * @template Class Extends from AnyClassType to enforce type checking on class definitions.
 */
export const Provider = <Class extends AnyClassType>({
  children,
  classDef,
  dependencies = [],
  disposeTime = 5 * 1000,
  create,
  onMount,
  onUnmount,
}: ProviderProps<Class>) => {
  const isDisposable = typeof create === 'function';

  const createInstance = () => {
    const instance = isDisposable
      ? (create as () => InstanceType<Class>)()
      : create;

    if (isDisposable) {
      setTimeout(() => {
        /* istanbul ignore else */
        if (!mounted.has(instance)) {
          onUnmount?.(instance);
        }
      }, disposeTime);
    }

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
    const provided = instance;

    onMount?.(provided);

    /* istanbul ignore else */
    if (!mounted.has(provided) && isDisposable) {
      mounted.add(provided);
    }

    return () => {
      mounted.delete(provided);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [instance]);

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const contextMap = useContext(rootContext)!;

  const context = useMemo(() => {
    return (
      contextMap.get(classDef.name) ??
      createCachedContext(contextMap, classDef, instance)
    );
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

/**
 * Interface defining properties for the MultiProvider component.
 */
export type MultiProviderProps = {
  /** Array of provider components to be composed together. */
  providers: Array<
    ({ children }: { children: ReactNode }) => ProviderReturnType
  >;
};

/**
 * A component that composes multiple provider components together.
 *
 * @param {MultiProviderProps & { children: ReactNode }} props The properties for the MultiProvider, including the providers and children.
 * @returns The composed providers wrapped around the children.
 */
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
