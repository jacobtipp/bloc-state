import React, {
  Context,
  createContext,
  Fragment,
  PropsWithChildren,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {
  ContextContainer,
  getProviderContext,
} from '../../context/provider-context';
import { Creator, MultiCreator } from '../../types';

/**
 * Disposable is a generic type that defines a function that disposes of a resource of type T.
 *
 * @typeParam T - The type of resource to be disposed of.
 */
export type Disposable<T> = (value: T) => void;

/**
 * ProviderProps is a generic type that represents the properties of the Provider component.
 *
 * @typeParam T - The type of object that the Provider component provides.
 */
export type ProviderProps<T> = {
  creator: Creator<T>; // The Creator object used to create instances of T.
  dispose?: Disposable<T>;
  deps?: React.DependencyList;
};

export type MultiProviderProps<T> = {
  creators: MultiCreator<T>;
  dispose?: Disposable<T>;
  deps?: React.DependencyList;
};

/**
 * ProviderState is an interface that represents the state of the Provider component.
 */
export type ProviderState = {
  context: Context<any>; // The React context object associated with the Provider.
  value: any; // The value provided by the Provider.
  name: string; // The name of the Provider.
  dispose?: Disposable<any>; // An optional dispose function to dispose of instances of T.
};

/**
 * getStateFromProps is a function that takes in the props of a Provider component and returns the Provider state.
 *
 * @typeParam T - The type of the data that the Provider provides.
 *
 * @param {ProviderProps<T>} props - The props of the Provider component.
 * @param {Disposable<T>} [dispose] - An optional dispose function to dispose of instances of T.
 *
 * @returns The ProviderState object representing the current state of the Provider component.
 */
function getStateFromProps<T>(
  { creator }: ProviderProps<T>,
  dispose?: Disposable<T>
): ProviderState {
  const name = typeof creator.key === 'string' ? creator.key : creator.key.name;
  const value = creator.create();
  const container: ContextContainer<T> = getProviderContext<T>().get(name) ?? {
    context: createContext(value),
    count: 0,
  };

  container.context.displayName = name;

  getProviderContext<T>().add(name, container);

  return {
    context: container.context,
    name,
    value,
    dispose: creator.dispose ?? dispose,
  };
}

/**
 * createProvider is a function that creates a Provider component.
 *
 * @typeParam T - The type of the data that the Provider provides.
 *
 * @param {Disposable<T>} [dispose] - An optional dispose function to dispose of instances of T.
 *
 * @returns A Provider component that provides the data of type T.
 */
export function createProvider<T>(dispose?: Disposable<T>) {
  return function (props: React.PropsWithChildren<ProviderProps<T>>) {
    const [state, setState] = useState<ProviderState | null>(null);

    useEffect(() => {
      const stateFromProps = getStateFromProps(props, dispose);

      setState(stateFromProps);

      return () => {
        getProviderContext<T>().remove(stateFromProps.name);
        if (dispose) {
          dispose(stateFromProps.value);
        }
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, props.deps ?? []);

    if (state) {
      return (
        <state.context.Provider value={state.value}>
          {props.children}
        </state.context.Provider>
      );
    }

    // eslint-disable-next-line react/jsx-no-useless-fragment
    return <Fragment></Fragment>;
  };
}

export function MultiProvider<T>(
  props: PropsWithChildren<MultiProviderProps<T>>
) {
  const components = useMemo(() => {
    return props.creators.map((creator) => {
      const Provider = createProvider<T>(creator.dispose ?? props.dispose);
      return ({ children }: PropsWithChildren) => (
        <Provider creator={creator} deps={props.deps}>
          {children}
        </Provider>
      );
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, props.deps);

  // https://javascript.plainenglish.io/how-to-combine-context-providers-for-cleaner-react-code-9ed24f20225e
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

  return <Providers>{props.children}</Providers>;
}
