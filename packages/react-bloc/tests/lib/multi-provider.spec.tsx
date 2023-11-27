import { fireEvent, render } from '@testing-library/react';
import { CounterExampleGroup } from './counter';

describe('MultiProvider', () => {
  it('should support providing multiple instances of the same store', async () => {
    const { getAllByTestId, getByText, findByTestId } = render(
      <CounterExampleGroup />
    );
    const [resetA, resetB] = getAllByTestId('reset');

    if (resetA) fireEvent.click(resetA);

    getByText('loading...');

    const button = await findByTestId('increment-suspense');

    fireEvent.click(button);

    const count = await findByTestId('count');

    expect(count.textContent).toBe('2');

    if (resetB) fireEvent.click(resetB);

    getByText('loading...');
  });
});
