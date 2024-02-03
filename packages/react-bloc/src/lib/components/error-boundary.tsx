import { BlocBase, ClassType } from '@jacobtipp/bloc';
import { PropsWithChildren, useCallback } from 'react';
import { ErrorBoundary, FallbackProps } from 'react-error-boundary';
import { useBlocInstance } from '../hooks';

/**
 * Props for the BlocErrorBoundary component, specifying the Bloc to observe,
 * a callback for reset logic, and a fallback UI component to render on error.
 *
 * @template Bloc The class type of the Bloc extending BlocBase with any type of state.
 */
export type BlocErrorBoundaryProps<Bloc extends ClassType<BlocBase<any>>> = {
  /** The Bloc class for which errors should be caught. */
  bloc: Bloc;
  /** Function to call when attempting to reset the error state, with the bloc instance as an argument. */
  onReset: (bloc: InstanceType<Bloc>) => void;
  /** A React component to render as a fallback UI when an error is caught. */
  fallback: React.ComponentType<FallbackProps>;
} & PropsWithChildren;

/**
 * A component that wraps its children in an error boundary specific to a Bloc. It uses
 * a provided Bloc instance to handle errors and define reset behavior, along with a fallback
 * UI component to display when an error occurs.
 *
 * @param {BlocErrorBoundaryProps<Bloc>} props The properties for the BlocErrorBoundary component.
 * @returns A React element wrapped in an ErrorBoundary, providing error handling for its children.
 * @template Bloc Extends ClassType<BlocBase<any>> to ensure the provided Bloc is based on BlocBase.
 */
export const BlocErrorBoundary = <Bloc extends ClassType<BlocBase<any>>>({
  bloc,
  fallback,
  onReset,
  children,
}: BlocErrorBoundaryProps<Bloc>) => {
  const blocInstance = useBlocInstance(bloc); // Get the instance of the specified Bloc.

  // Define a callback for resetting the error state, which calls onReset with the bloc instance.
  const reset = useCallback(() => {
    return onReset(blocInstance);
    // Dependencies list includes blocInstance to ensure the reset function is updated if the instance changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [blocInstance]);

  // Render the children within an ErrorBoundary, specifying the fallback component and reset behavior.
  return (
    <ErrorBoundary FallbackComponent={fallback} onReset={reset}>
      {children}
    </ErrorBoundary>
  );
};
