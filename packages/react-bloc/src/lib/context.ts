import { AbstractClassType, ClassType } from '@jacobtipp/bloc';
import { createContext } from 'react';

/**
 * Root context for accessing the provider context map throughout the component tree.
 */
export const rootContext = createContext<ProviderContextMap | undefined>(
  undefined
);

/**
 * Interface defining the structure of the provider context, holding any instance.
 */
export type ProviderContext = {
  instance: any;
} | null;

/**
 * Type definition for any class type, including both concrete and abstract classes.
 */
export type AnyClassType = ClassType<any> | AbstractClassType<any>;

/**
 * Type definition for the map that holds context objects for providers.
 */
export type ProviderContextMap = Map<string, React.Context<ProviderContext>>;

/**
 * A function that adds a newly created provider context to a context map
 */
export const createCachedContext = (
  contextMap: ProviderContextMap,
  classDef: AnyClassType
) => {
  const cachedContext = createContext<ProviderContext>(null);
  contextMap.set(classDef.name, cachedContext);
  return cachedContext;
};
