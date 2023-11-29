import { render } from '@testing-library/react';
import { useCounter } from './counter';

const CounterComponent = () => {
  const { count } = useCounter();
  return <div>{count}</div>;
};
describe('useBloc', () => {
  it('should throw an error if a bloc is not wrapped in a Provider', () => {
    expect(() => render(<CounterComponent />)).toThrow();
  });
});
