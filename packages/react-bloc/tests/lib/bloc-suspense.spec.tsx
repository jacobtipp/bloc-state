import { fireEvent, render } from '@testing-library/react';

import { CounterExample } from './counter';

describe('BlocSuspense', () => {
  const originalConsoleError = console.error;

  beforeEach(() => {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    console.error = () => {};
  });

  afterEach(() => {
    console.error = originalConsoleError;
  });

  it('should trigger a suspense with useBlocSelector and useBlocListener', async () => {
    const { findByTestId, getByText } = render(<CounterExample count={0} />);

    getByText('error');

    const reset = await findByTestId('reset');

    expect(reset.textContent).toBe('reset');

    fireEvent.click(reset);

    getByText('loading...');

    const button = await findByTestId('increment-suspense');

    fireEvent.click(button);

    const count = await findByTestId('count');

    expect(count.textContent).toBe('2');

    const increment = await findByTestId('increment');

    fireEvent.click(increment);

    const count2 = await findByTestId('count');

    expect(count2.textContent).toBe('10');
  }, 6000);
});
