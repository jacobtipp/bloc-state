import { AbstractClassType, ClassType } from '@jacobtipp/bloc';
import { MutableRefObject, PropsWithChildren, ReactNode } from 'react';
export type AnyClassType = ClassType<any> | AbstractClassType<any>;
export type Closable = {
    close?: () => void;
} & InstanceType<AnyClassType>;
export type ProviderContext = {
    initialized: boolean;
    instance: MutableRefObject<Closable | null>;
};
export type ProviderContextMap = Map<string, React.Context<ProviderContext>>;
export interface ProviderProps<Class extends AnyClassType> {
    classDef: Class;
    create: () => InstanceType<Class>;
    onMount?: (instance: InstanceType<Class>) => void;
    onUnmount?: (instance: InstanceType<Class>) => void;
    children: ReactNode;
    dependencies?: any[];
}
export declare const providerContextMap: ProviderContextMap;
export type InstanceMap = {
    lastCreatedTimeStamp: number;
    instance: Closable;
};
export declare const Provider: <Class extends AnyClassType>({ children, classDef, dependencies, create, onMount, onUnmount, }: ProviderProps<Class>) => import("react").FunctionComponentElement<import("react").ProviderProps<ProviderContext>>;
type ProviderReturnType = ReturnType<typeof Provider>;
export type MultiProviderProps = {
    providers: Array<({ children }: PropsWithChildren) => ProviderReturnType>;
};
export declare const MultiProvider: ({ providers, children, }: PropsWithChildren<MultiProviderProps>) => import("react/jsx-runtime").JSX.Element;
export {};
