import { BlocBase, ClassType } from '@jacobtipp/bloc';
import { PropsWithChildren, useCallback } from 'react';
import { ErrorBoundary, FallbackProps } from 'react-error-boundary';
import { useBlocInstance } from '../hooks';

export type BlocErrorBoundaryProps<Bloc extends ClassType<BlocBase<any>>> = {
  bloc: Bloc;
  onReset: (bloc: InstanceType<Bloc>) => void;
  fallback: React.ComponentType<FallbackProps>;
} & PropsWithChildren;

export const BlocErrorBoundary = <Bloc extends ClassType<BlocBase<any>>>({
  bloc,
  fallback,
  onReset,
  children,
}: BlocErrorBoundaryProps<Bloc>) => {
  const blocInstance = useBlocInstance(bloc);
  const reset = useCallback(() => {
    return onReset(blocInstance);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [blocInstance]);

  return (
    <ErrorBoundary FallbackComponent={fallback} onReset={reset}>
      {children}
    </ErrorBoundary>
  );
};
