import { render } from '@testing-library/react';
import { useCounter } from './counter';

const CounterComponent = () => {
  const { count } = useCounter();
  return <div>{count}</div>;
};
describe('useBloc', () => {
  const consoleError = console.error;
  beforeAll(() => {
    console.error = () => {
      return;
    };
  });

  afterAll(() => {
    console.error = consoleError;
  });

  it('should throw an error if a bloc is not wrapped in a Provider', () => {
    expect(() => render(<CounterComponent />)).toThrow();
  });
});
