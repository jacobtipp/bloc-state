import { fireEvent, render } from '@testing-library/react';

import { CounterExample } from './counter';

describe('BlocSuspense', () => {
  const originalConsoleError = console.error;

  beforeAll(() => {
    console.error = () => {
      return;
    };
  });

  afterAll(() => {
    console.error = originalConsoleError;
  });

  it('should trigger a suspense with useBlocSelector and useBlocListener', async () => {
    const { findByTestId, getByText } = render(<CounterExample count={0} />);

    getByText('error');

    const reset = await findByTestId('reset');

    expect(reset.textContent).toBe('reset');

    fireEvent.click(reset);

    getByText('loading...');

    const suspenseIncrement = await findByTestId('increment-suspense');

    fireEvent.click(suspenseIncrement);

    const count = await findByTestId('count');

    expect(count.textContent).toBe('2');

    const increment = await findByTestId('increment');

    fireEvent.click(increment);

    const count2 = await findByTestId('count');

    expect(count2.textContent).toBe('10');

    fireEvent.click(increment);

    getByText('loading...');

    const suspenseIncrement2 = await findByTestId('increment-suspense');

    fireEvent.click(suspenseIncrement2);

    const count3 = await findByTestId('count');

    expect(count3.textContent).toBe('12');

    fireEvent.click(increment);

    const count4 = await findByTestId('count');

    expect(count4.textContent).toBe('13');
  }, 6000);
});
