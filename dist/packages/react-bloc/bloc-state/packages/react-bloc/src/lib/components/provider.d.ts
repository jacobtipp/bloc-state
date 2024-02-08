import { ReactNode } from 'react';
import { AnyClassType, ProviderContext } from './root-provider';
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
/**
 * A Provider component that manages the lifecycle of a provided class instance.
 *
 * @param {ProviderProps<Class>} props The properties for the Provider.
 * @returns The Provider component rendering its children within the provided context.
 * @template Class Extends from AnyClassType to enforce type checking on class definitions.
 */
export declare const Provider: <Class extends AnyClassType>({ children, classDef, dependencies, disposeTime, create, onMount, onUnmount, }: ProviderProps<Class>) => import("react").FunctionComponentElement<import("react").ProviderProps<ProviderContext>>;
type ProviderReturnType = ReturnType<typeof Provider>;
/**
 * Interface defining properties for the MultiProvider component.
 */
export type MultiProviderProps = {
    /** Array of provider components to be composed together. */
    providers: Array<({ children }: {
        children: ReactNode;
    }) => ProviderReturnType>;
};
/**
 * A component that composes multiple provider components together.
 *
 * @param {MultiProviderProps & { children: ReactNode }} props The properties for the MultiProvider, including the providers and children.
 * @returns The composed providers wrapped around the children.
 */
export declare const MultiProvider: ({ providers, children, }: MultiProviderProps & {
    children: ReactNode;
}) => import("react/jsx-runtime").JSX.Element;
export {};
