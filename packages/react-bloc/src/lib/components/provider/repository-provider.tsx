import React, { PropsWithChildren, useMemo } from 'react';
import { MultiCreator } from '../../types';
import { createProvider } from './provider';

/**
 * MultiRepositoryProvider is a type that represents an object containing a `repositories` property of type `MultiCreator<any>` and an optional `React.DependencyList`.
 *
 * @property {MultiCreator<any>} repositories - The list of repositories to provide.
 *
 * @property {React.DependencyList?} deps - A list of dependencies that the repositories depend on.
 */
export type MultiRepositoryProvider = {
  repositories: MultiCreator<any>;
  deps?: React.DependencyList;
};

/**
 * Provider is a constant that takes in no parameters and returns a new provider component for repository data.
 *
 * @returns A new provider component for repository data.
 */
const Provider = createProvider();

/**
 * RepositoryProvider is a functional component that takes a `PropsWithChildren<MultiRepositoryProvider>` object as its props and returns a provider component `Providers`.
 *
 * @function
 *
 * @param {PropsWithChildren<MultiRepositoryProvider>} props - The props passed into the `RepositoryProvider` component.
 *
 * @returns A new `Providers` component provided with children.
 */
export const RepositoryProvider = (
  props: PropsWithChildren<MultiRepositoryProvider>
) => {
  /**
   * A useMemo hook that takes in an array of `repositories` from the props and creates an array of provider components with each creator.
   *
   * @const components
   *
   * @type {Array<() => ReactElement|undefined>} - An array of provider components that provide component types.
   */
  const components = useMemo(() => {
    return props.repositories.map((creator) => {
      return ({ children }: PropsWithChildren) => (
        <Provider creator={creator} deps={props.deps}>
          {children}
        </Provider>
      );
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, props.deps);

  /**
   * A useMemo hook that takes in the array of provider components created above and reduces it to a single `Providers` component.
   *
   * @const Providers
   *
   * @type {() => JSX.Element | undefined} - A function that returns a `Providers` component that provides data of multiple types.
   */
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [components]);

  return <Providers>{props.children}</Providers>;
};
