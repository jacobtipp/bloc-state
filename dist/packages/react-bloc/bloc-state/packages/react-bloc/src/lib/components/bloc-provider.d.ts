import { BlocBase, ClassType } from '@jacobtipp/bloc';
import { PropsWithChildren, ReactNode } from 'react';
export interface BlocProviderProps<Bloc extends ClassType<BlocBase<any>>> {
    bloc: Bloc;
    create: () => InstanceType<Bloc>;
    onMount?: (bloc: InstanceType<Bloc>) => void;
    children: ReactNode;
    dependencies?: any[];
}
export declare const BlocProvider: <Bloc extends ClassType<BlocBase<any>>>({ bloc, children, dependencies, create, onMount, }: BlocProviderProps<Bloc>) => import("react").FunctionComponentElement<import("react").ProviderProps<import("./provider").ProviderContext>>;
type BlocProviderReturnType = ReturnType<typeof BlocProvider>;
export type MultiBlocProviderProps = {
    providers: Array<({ children }: PropsWithChildren) => BlocProviderReturnType>;
};
export declare const MultiBlocProvider: ({ providers, children, }: PropsWithChildren<MultiBlocProviderProps>) => import("react/jsx-runtime").JSX.Element;
export {};
