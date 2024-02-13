import { isServer } from '@jacobtipp/bloc';
import { PropsWithChildren, createElement } from 'react';
import { ProviderContextMap, rootContext } from '../context';

/**
 * Global map to hold provider contexts, keyed by a string identifier.
 */
export const clientContextMap: ProviderContextMap = new Map();

/**
 * A root provider component that sets up the context for accessing provider instances.
 *
 * @param {PropsWithChildren} props The props that include children components.
 * @returns A component that provides a context map to its children.
 */
export const RootProvider = ({ children }: PropsWithChildren) => {
  /* istanbul ignore next */
  return createElement(
    rootContext.Provider,
    {
      // Provide a new map for server-side or a shared map for client-side.
      value: isServer() ? new Map() : clientContextMap,
    },
    children
  );
};
