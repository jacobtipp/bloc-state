import React, {
  Context,
  createContext,
  Fragment,
  useEffect,
  useState,
} from 'react';
import { globalContext } from '../../context/bloc-context';
import { Creator } from '../../types';
import { extractKey } from '../../util';

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
  deps?: React.DependencyList; // An optional array of dependencies used to recompute the Provider state.
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
  const name = extractKey(creator.key);
  const value = creator.create();
  const container = globalContext.get(name) ?? {
    creator: creator.dispose ? creator : { ...creator, dispose },
    context: createContext(value),
    count: 0,
  };

  container.context.displayName = name;
  globalContext.add(name, container);

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
        globalContext.remove(stateFromProps.name);
        if (stateFromProps.dispose) {
          stateFromProps.dispose(stateFromProps.value);
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
