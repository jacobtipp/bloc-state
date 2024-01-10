import { fireEvent, render } from '@testing-library/react';

import { CounterBuilderParent } from './counter';

describe('BlocConsumer', () => {
  const originalConsoleError = console.error;

  beforeAll(() => {
    console.error = () => {
      return;
    };
  });

  afterAll(() => {
    console.error = originalConsoleError;
  });

  it('should rebuild accordingly when buildWhen is not provided', async () => {
    const alertMock = jest.spyOn(window, 'alert').mockImplementation();
    const { findByTestId } = render(<CounterBuilderParent />);

    const count1 = await findByTestId('count-consumer');
    const incrementButton = await findByTestId('increment');

    expect(count1.textContent).toBe('0');

    fireEvent.click(incrementButton);

    const count2 = await findByTestId('count-consumer');
    expect(count2.textContent).toBe('1');
    expect(alertMock).toHaveBeenCalledTimes(0);

    fireEvent.click(incrementButton);

    const count3 = await findByTestId('count-consumer');
    expect(count3.textContent).toBe('2');
    expect(alertMock).toHaveBeenCalledTimes(1);

    fireEvent.click(incrementButton);

    const count4 = await findByTestId('count-consumer');
    expect(count4.textContent).toBe('3');
    expect(alertMock).toHaveBeenCalledTimes(1);

    fireEvent.click(incrementButton);

    const count5 = await findByTestId('count-consumer');
    expect(count5.textContent).toBe('4');
    expect(alertMock).toHaveBeenCalledTimes(2);

    fireEvent.click(incrementButton);

    const count6 = await findByTestId('count-consumer');
    expect(count6.textContent).toBe('5');
    expect(alertMock).toHaveBeenCalledTimes(2);
  }, 6000);
});
