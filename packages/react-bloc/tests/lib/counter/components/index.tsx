import { FallbackProps } from 'react-error-boundary';
import {
  BlocBuilder,
  BlocConsumer,
  BlocErrorBoundary,
  BlocProvider,
  ContextMapProvider,
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

export const CounterExampleSuspense = ({ count }: CounterExampleProps) => (
  <ContextMapProvider>
    <CounterExample count={count} />
  </ContextMapProvider>
);

export const CounterExampleGroup = () => {
  return (
    <ContextMapProvider>
      <CounterExample count={0} />
      <CounterExample count={0} />
    </ContextMapProvider>
  );
};

export const CounterBuilderParent = () => {
  return (
    <ContextMapProvider>
      <BlocProvider bloc={CounterBloc} create={() => new CounterBloc(0)}>
        <CounterBuilderChild />
      </BlocProvider>
    </ContextMapProvider>
  );
};

export const CounterBuilderChild = () => {
  const counter = useBlocInstance(CounterBloc);
  return (
    <>
      <BlocBuilder
        bloc={CounterBloc}
        buildWhen={(previous, current) => (previous + current) % 3 === 0}
        builder={(count) => {
          return <div data-testid="count">{count}</div>;
        }}
      />
      <BlocBuilder
        bloc={CounterBloc}
        builder={(count) => {
          return <div data-testid="count-default">{count}</div>;
        }}
      />
      <BlocConsumer
        bloc={CounterBloc}
        builder={(count) => {
          return <div data-testid="count-consumer">{count}</div>;
        }}
        listenWhen={(_, current) => current % 2 === 0}
        listener={() => {
          window.alert('consumer listener has been called');
        }}
      />
      <button data-testid="increment" onClick={counter.increment}>
        increment
      </button>
    </>
  );
};
