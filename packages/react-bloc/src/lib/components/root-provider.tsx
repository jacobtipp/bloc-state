import { AbstractClassType, ClassType } from '@jacobtipp/bloc';
import { PropsWithChildren, createContext, createElement } from 'react';
import { isServer } from '../util';

/**
 * Type definition for any class type, including both concrete and abstract classes.
 */
export type AnyClassType = ClassType<any> | AbstractClassType<any>;

/**
 * Interface defining the structure of the provider context, holding any instance.
 */
export type ProviderContext = {
  instance: any;
};

/**
 * Global map to hold provider contexts, keyed by a string identifier.
 */
export const clientContextMap: ProviderContextMap = new Map();

/**
 * Type definition for the map that holds context objects for providers.
 */
export type ProviderContextMap = Map<string, React.Context<ProviderContext>>;

/**
 * Context for accessing the provider context map throughout the component tree.
 */
export const contextMapContext = createContext<ProviderContextMap | undefined>(
  undefined
);

/**
 * A root provider component that sets up the context for accessing provider instances.
 *
 * @param {PropsWithChildren} props The props that include children components.
 * @returns A component that provides a context map to its children.
 */
export const RootProvider = ({ children }: PropsWithChildren) => {
  /* istanbul ignore next */
  return createElement(
    contextMapContext.Provider,
    {
      // Provide a new map for server-side or a shared map for client-side.
      value: isServer() ? new Map() : clientContextMap,
    },
    children
  );
};
