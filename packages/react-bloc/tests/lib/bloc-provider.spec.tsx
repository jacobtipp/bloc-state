import { fireEvent, render } from '@testing-library/react';
import { CounterExampleGroup } from './counter';
import { CounterWithUserProvider } from './user';

describe('MultiProvider', () => {
  it('should support providing multiple instances of the same bloc', async () => {
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

  it('should support providing multiple blocs with MultiBlocProvider', async () => {
    const { findByTestId } = render(<CounterWithUserProvider />);
    const count = (await findByTestId('count')).textContent;
    const first = (await findByTestId('first')).textContent;
    expect(count).toBe('0');
    expect(first).toBe('bob');
  });
});
