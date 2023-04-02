import { useBlocSelector } from '../../../../src';
import CounterCubit from '../counter.cubit';

type CounterBlocConsumerProps = {
  suspendWhen?: (state: number) => boolean;
  errorWhen?: (state: number) => boolean;
};

export const CounterBlocConsumer = ({
  suspendWhen,
  errorWhen,
}: CounterBlocConsumerProps) => {
  const count = useBlocSelector(CounterCubit, {
    selector: (state) => state,
    suspendWhen,
    errorWhen,
  });
  return <p data-testid="test-counter">{count}</p>;
};
