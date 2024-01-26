import { render, screen, waitFor } from '@testing-library/react';
import { UserBlocValueProvider } from './user/components';
import { renderToString } from 'react-dom/server';

describe('useBlocValue', () => {
  it('should listen to states', async () => {
    render(<UserBlocValueProvider />);

    await waitFor(
      () =>
        expect(screen.getByTestId('test-first-name').textContent).toBe('bob'),
      {
        timeout: 5000,
      }
    );
  }, 5000);

  it('should render on the server', async () => {
    expect.assertions(1);
    const ui = <UserBlocValueProvider />;
    const container = document.createElement('div');
    container.innerHTML = renderToString(ui);

    expect(container.innerHTML).toContain('rick');
  }, 5000);
});
