import { BlocBase, ClassType } from '@jacobtipp/bloc';
import { PropsWithChildren } from 'react';
import { FallbackProps } from 'react-error-boundary';
export type BlocErrorBoundaryProps<Bloc extends ClassType<BlocBase<any>>> = {
    bloc: Bloc;
    onReset: (bloc: InstanceType<Bloc>) => void;
    fallback: React.ComponentType<FallbackProps>;
} & PropsWithChildren;
export declare const BlocErrorBoundary: <Bloc extends ClassType<BlocBase<any>>>({ bloc, fallback, onReset, children, }: BlocErrorBoundaryProps<Bloc>) => import("react/jsx-runtime").JSX.Element;
