import { render } from '@testing-library/react';
import { useCounter } from './counter';

const StoreComponent = () => {
  const { count } = useCounter();
  return <div>{count}</div>;
};
describe('useBlocStore', () => {
  it('should throw an error if a blocStore is not mapped to a react context', () => {
    expect(() => render(<StoreComponent />)).toThrow();
  });
});
