import { fireEvent, render } from '@testing-library/react';
import { CounterExampleGroup } from './counter';
import { CounterWithUserProvider } from './user';
import { StrictMode } from 'react';
import { clientContextMap } from '../../src';

describe('MultiProvider', () => {
  const consoleError = console.error;
  beforeAll(() => {
    console.error = () => {
      return;
    };

    clientContextMap.clear();
  });

  afterAll(() => {
    console.error = consoleError;
    jest.clearAllMocks();
  });
  it('should support providing multiple instances of the same bloc', async () => {
    const { getAllByTestId, getByText, findByTestId } = render(
      <StrictMode>
        <CounterExampleGroup />
      </StrictMode>
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
  }, 10000);

  it('should support providing multiple blocs with MultiBlocProvider', async () => {
    const { findByTestId } = render(<CounterWithUserProvider />);
    const count = (await findByTestId('count')).textContent;
    const first = (await findByTestId('first')).textContent;
    expect(count).toBe('0');
    expect(first).toBe('bob');
  });
});
