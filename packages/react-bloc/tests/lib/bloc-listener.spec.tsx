import { render, screen, waitFor } from '@testing-library/react';
import {
  UserBlocListenerProvider,
  UserBlocListenerProviderWithDefaultListenWhen,
  UserBlocListenerWithComnponentProvider,
} from './user';

describe('BlocListener', () => {
  it('should listen to states with useBlocListener', async () => {
    render(<UserBlocListenerProvider />);

    await waitFor(
      () =>
        expect(screen.getByTestId('test-last-name').textContent).toBe(
          'richards-two'
        ),
      {
        timeout: 5000,
      }
    );
  });

  it('should listen to states with BlocListener component', async () => {
    render(<UserBlocListenerWithComnponentProvider />);

    await waitFor(
      () =>
        expect(screen.getByTestId('test-last-name').textContent).toBe(
          'richards-two'
        ),
      {
        timeout: 5000,
      }
    );
  });

  it('should listen to states with default listenWhen', async () => {
    render(<UserBlocListenerProviderWithDefaultListenWhen />);

    await waitFor(
      () =>
        expect(screen.getByTestId('test-last-name').textContent).toBe(
          'richards-two'
        ),
      {
        timeout: 5000,
      }
    );
  });
});
