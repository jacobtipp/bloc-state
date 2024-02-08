import { BlocBase, ClassType } from '@jacobtipp/bloc';
import { PropsWithChildren, ReactNode } from 'react';
/**
 * Props definition for BlocProvider, specifying the requirements for utilizing a Bloc within the provider.
 *
 * @template Bloc The class type of the Bloc extending BlocBase with any type of state.
 */
export interface BlocProviderProps<Bloc extends ClassType<BlocBase<any>>> {
    /** The Bloc class to be provided. */
    bloc: Bloc;
    /** Function to create an instance of the Bloc or the instance itself. */
    create: (() => InstanceType<Bloc>) | InstanceType<Bloc>;
    /** Optional callback to be executed when the Bloc is mounted. */
    onMount?: (bloc: InstanceType<Bloc>) => void;
    /** ReactNode children to be rendered within the provider. */
    children: ReactNode;
    /** Optional dependencies array to trigger re-creation of the Bloc instance. */
    dependencies?: any[];
}
/**
 * Component that provides a Bloc instance to its children, utilizing the generic Provider component.
 *
 * @param {BlocProviderProps<Bloc>} props The properties required to create and provide a Bloc instance.
 * @returns A Provider component configured to manage and provide a Bloc instance.
 * @template Bloc Extends ClassType<BlocBase<any>> to ensure the provided Bloc is based on BlocBase.
 */
export declare const BlocProvider: <Bloc extends ClassType<BlocBase<any>>>({ bloc, children, dependencies, create, onMount, }: BlocProviderProps<Bloc>) => import("react").FunctionComponentElement<import("react").ProviderProps<import("./root-provider").ProviderContext>>;
/**
 * Type definition for the return type of the BlocProvider component.
 */
type BlocProviderReturnType = ReturnType<typeof BlocProvider>;
/**
 * Props definition for MultiBlocProvider, which allows multiple BlocProviders to be combined.
 */
export type MultiBlocProviderProps = {
    /** An array of functions that return BlocProvider components. */
    providers: Array<({ children }: PropsWithChildren) => BlocProviderReturnType>;
};
/**
 * Component that combines multiple BlocProviders into a single provider component.
 *
 * @param {PropsWithChildren<MultiBlocProviderProps>} props The properties including the providers and children.
 * @returns A MultiProvider component that composes multiple BlocProviders.
 */
export declare const MultiBlocProvider: ({ providers, children, }: PropsWithChildren<MultiBlocProviderProps>) => import("react/jsx-runtime").JSX.Element;
export {};
