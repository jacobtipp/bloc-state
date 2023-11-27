import { waitFor, fireEvent, render, screen } from '@testing-library/react';
import { UserBlocErrorProvider } from './user';

describe('BlocErrorBoundary', () => {
  it('should trigger an Error Boundary when errorWhen callback returns true ', async () => {
    render(<UserBlocErrorProvider />);

    expect(screen.getByTestId('test-last-name').textContent).toBe(
      'bloc-listener'
    );

    await waitFor(
      () =>
        expect(screen.getByTestId('test-bloc-error').textContent).toBe(
          'error-triggered'
        ),
      {
        timeout: 2000,
      }
    );

    fireEvent.click(screen.getByTestId('test-reset-button'));

    await screen.findByText('error-reset');
  }, 6000);
});
