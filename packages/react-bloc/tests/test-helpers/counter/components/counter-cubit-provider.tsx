import { Suspense } from 'react';
import { BlocProvider, useBlocInstance } from '../../../../src';
import { CounterBlocConsumer } from './counter-cubit-consumer';
import CounterCubit from '../counter.cubit';
import { ErrorBoundary } from 'react-error-boundary';
import { CounterErrorFallback } from './counter-error-boundary';

export const CounterBlocProvider = (
  bloc: CounterCubit,
  suspendWhen?: (state: number) => boolean,
  errorWhen?: (state: number) => boolean
) => (
  <BlocProvider
    blocs={[
      {
        key: CounterCubit,
        create: () => bloc,
      },
    ]}
  >
    <CounterBlocWrapper suspendWhen={suspendWhen} errorWhen={errorWhen} />
  </BlocProvider>
);

type CounterBlocWrapperProps = {
  suspendWhen?: (state: number) => boolean;
  errorWhen?: (state: number) => boolean;
};

const CounterBlocWrapper = ({
  suspendWhen,
  errorWhen,
}: CounterBlocWrapperProps) => {
  const { setCounter } = useBlocInstance(CounterCubit);

  return (
    <ErrorBoundary
      FallbackComponent={CounterErrorFallback}
      onReset={() => setCounter((state) => state + 1)}
    >
      <Suspense fallback={<div data-testid="test-loading">...loading</div>}>
        <CounterBlocConsumer suspendWhen={suspendWhen} errorWhen={errorWhen} />
      </Suspense>
    </ErrorBoundary>
  );
};
