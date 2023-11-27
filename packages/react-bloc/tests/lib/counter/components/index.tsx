import { FallbackProps } from 'react-error-boundary';
import {
  BlocErrorBoundary,
  BlocProvider,
  useBlocInstance,
} from '../../../../src';

import { Suspense } from 'react';
import { useCounter } from '../counter.hooks';
import { CounterBloc } from '../counter.cubit';

const Counter = () => {
  const { counterBloc, count } = useCounter();

  return (
    <>
      <button data-testid="increment" onClick={() => counterBloc.increment()}>
        increment
      </button>
      <div data-testid="count">{count}</div>
    </>
  );
};

const SuspenseFallback = () => {
  const counterBloc = useBlocInstance(CounterBloc);
  return (
    <>
      <button
        data-testid="increment-suspense"
        onClick={() => counterBloc.increment()}
      >
        click
      </button>
      <div data-testid="fallback">loading...</div>
    </>
  );
};

const ErrorFallback = ({ resetErrorBoundary }: FallbackProps) => (
  <>
    <div data-testid="error">error</div>
    <div data-testid="reset" onClick={resetErrorBoundary}>
      reset
    </div>
  </>
);

type CounterExampleProps = {
  count: number;
};

export const CounterExample = ({ count }: CounterExampleProps) => {
  return (
    <BlocProvider
      bloc={CounterBloc}
      create={() => {
        const counter = new CounterBloc(count);
        return counter;
      }}
    >
      <BlocErrorBoundary
        bloc={CounterBloc}
        fallback={ErrorFallback}
        onReset={(counterBloc) => {
          counterBloc.increment();
        }}
      >
        <Suspense fallback={<SuspenseFallback />}>
          <Counter />
        </Suspense>
      </BlocErrorBoundary>
    </BlocProvider>
  );
};

export const CounterExampleGroup = () => {
  return (
    <>
      <CounterExample count={0} />
      <CounterExample count={0} />
    </>
  );
};
