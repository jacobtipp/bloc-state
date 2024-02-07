import { render } from '@testing-library/react';
import { CounterExample } from './counter';
import { renderToString } from 'react-dom/server';
import { RootProvider } from '../../src';

describe('useBlocSelector', () => {
  const consoleError = console.error;
  const mockError = jest.fn();
  console.error = mockError;

  afterAll(() => {
    console.error = consoleError;
  });

  it('should render on the server', async () => {
    expect.assertions(1);
    const ui = (
      <RootProvider>
        <CounterExample count={5} />
      </RootProvider>
    );
    const container = document.createElement('div');
    container.innerHTML = renderToString(ui);

    const { findByTestId } = render(ui, { hydrate: true, container });

    const count = await findByTestId('count');
    expect(count.textContent).toBe('5');
  }, 5000);
});
