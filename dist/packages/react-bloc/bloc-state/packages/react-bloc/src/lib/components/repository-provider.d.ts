import { ClassType } from '@jacobtipp/bloc';
import { PropsWithChildren, ReactNode } from 'react';
export interface RepositoryProviderProps<Repository extends ClassType<any>> {
    repository: Repository;
    create: () => InstanceType<Repository>;
    onMount?: (repository: InstanceType<Repository>) => void;
    onUnmount?: (repository: InstanceType<Repository>) => void;
    children: ReactNode;
    dependencies?: any[];
}
export declare const RepositoryProvider: <Repository extends ClassType<any>>({ repository, children, dependencies, create, onMount, onUnmount, }: RepositoryProviderProps<Repository>) => import("react").FunctionComponentElement<import("react").ProviderProps<import("./root-provider").ProviderContext>>;
type RepositoryProviderReturnType = ReturnType<typeof RepositoryProvider>;
export type MultiRepositoryProviderProps = {
    providers: Array<({ children }: PropsWithChildren) => RepositoryProviderReturnType>;
};
export declare const MultiRepositoryProvider: ({ providers, children, }: PropsWithChildren<MultiRepositoryProviderProps>) => import("react/jsx-runtime").JSX.Element;
export {};
