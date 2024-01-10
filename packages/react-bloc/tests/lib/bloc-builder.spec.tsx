import { fireEvent, render } from '@testing-library/react';

import { CounterBuilderParent } from './counter';

describe('BlocBuilder', () => {
  const originalConsoleError = console.error;

  beforeAll(() => {
    console.error = () => {
      return;
    };
  });

  afterAll(() => {
    console.error = originalConsoleError;
  });

  it('should rebuild accordingly when buildWhen is provided', async () => {
    const { findByTestId } = render(<CounterBuilderParent />);

    const count1 = await findByTestId('count');
    const incrementButton = await findByTestId('increment');

    expect(count1.textContent).toBe('0');

    fireEvent.click(incrementButton);

    const count2 = await findByTestId('count');
    expect(count2.textContent).toBe('0');

    fireEvent.click(incrementButton);

    const count3 = await findByTestId('count');
    expect(count3.textContent).toBe('2');

    fireEvent.click(incrementButton);

    const count4 = await findByTestId('count');
    expect(count4.textContent).toBe('2');

    fireEvent.click(incrementButton);

    const count5 = await findByTestId('count');
    expect(count5.textContent).toBe('2');

    fireEvent.click(incrementButton);

    const count6 = await findByTestId('count');
    expect(count6.textContent).toBe('5');
  }, 6000);

  it('should rebuild accordingly when buildWhen is not provided', async () => {
    const { findByTestId } = render(<CounterBuilderParent />);

    const count1 = await findByTestId('count-default');
    const incrementButton = await findByTestId('increment');

    expect(count1.textContent).toBe('0');

    fireEvent.click(incrementButton);

    const count2 = await findByTestId('count-default');
    expect(count2.textContent).toBe('1');

    fireEvent.click(incrementButton);

    const count3 = await findByTestId('count-default');
    expect(count3.textContent).toBe('2');

    fireEvent.click(incrementButton);

    const count4 = await findByTestId('count-default');
    expect(count4.textContent).toBe('3');

    fireEvent.click(incrementButton);

    const count5 = await findByTestId('count-default');
    expect(count5.textContent).toBe('4');

    fireEvent.click(incrementButton);

    const count6 = await findByTestId('count-default');
    expect(count6.textContent).toBe('5');
  }, 6000);
});
