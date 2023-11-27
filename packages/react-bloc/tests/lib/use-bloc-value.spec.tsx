import { render, screen, waitFor } from '@testing-library/react';
import { UserBlocValueProvider } from './user/components';

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
});
