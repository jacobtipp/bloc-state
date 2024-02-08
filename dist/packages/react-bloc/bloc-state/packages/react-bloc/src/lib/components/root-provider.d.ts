import { AbstractClassType, ClassType } from '@jacobtipp/bloc';
import { PropsWithChildren } from 'react';
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
export declare const clientContextMap: ProviderContextMap;
/**
 * Type definition for the map that holds context objects for providers.
 */
export type ProviderContextMap = Map<string, React.Context<ProviderContext>>;
/**
 * Context for accessing the provider context map throughout the component tree.
 */
export declare const contextMapContext: import("react").Context<ProviderContextMap | undefined>;
/**
 * A root provider component that sets up the context for accessing provider instances.
 *
 * @param {PropsWithChildren} props The props that include children components.
 * @returns A component that provides a context map to its children.
 */
export declare const RootProvider: ({ children }: PropsWithChildren) => import("react").FunctionComponentElement<import("react").ProviderProps<ProviderContextMap | undefined>>;
