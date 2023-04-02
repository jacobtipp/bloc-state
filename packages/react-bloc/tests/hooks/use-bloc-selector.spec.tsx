import {
  cleanup,
  screen,
  render,
  renderHook,
  waitFor,
  act,
  fireEvent,
} from '@testing-library/react';
import { useBlocSelector } from '../../src';
import { UserBloc, UserBlocProvider } from '../test-helpers';
import CounterCubit from '../test-helpers/counter/counter.cubit';
import {
  blocUserWrapper as buw,
  cubitCounterWrapper as ccw,
} from '../test-helpers/wrappers';
import { State } from '@jacobtipp/state';
import { CounterBlocProvider } from '../test-helpers/counter/components/counter-cubit-provider';
import { globalContext } from '../../src';

describe('useBlocSelector', () => {
  let cubitCounterWrapper: ({ children }: any) => JSX.Element;
  let blocUserWrapper: ({ children }: any) => JSX.Element;
  const originalConsoleError = console.error;
  let bloc: CounterCubit;

  beforeEach(() => {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    console.error = () => {};
    cubitCounterWrapper = ccw;
    blocUserWrapper = buw;
    bloc = new CounterCubit();
  });

  afterEach(() => {
    console.error = originalConsoleError;
    globalContext.clear();
    bloc.close();
    cleanup();
  });

  it('should return derived state for non loadable State types', () => {
    expect.assertions(1);
    const { result } = renderHook(
      () =>
        useBlocSelector(CounterCubit, {
          selector: (state) => ({
            randomProp: state,
          }),
        }),
      { wrapper: cubitCounterWrapper }
    );
    expect(result.current.randomProp).toBe(0);
  });

  it('should return derived state', () => {
    expect.assertions(1);
    const { result } = renderHook(
      () =>
        useBlocSelector(UserBloc, {
          selector: (state) => state.age,
        }),
      { wrapper: blocUserWrapper }
    );

    expect(result.current).toBe(0);
  });

  describe('suspense', () => {
    it('should work with suspense', async () => {
      expect.assertions(2);
      render(UserBlocProvider((state: State) => state.status === 'loading'));

      await waitFor(
        () => {
          screen.getByText('...loading');
          expect(screen.getByTestId('test-loading').textContent).toBe(
            '...loading'
          );
        },
        {
          timeout: 3000,
        }
      );

      await waitFor(
        () => {
          screen.getByText('loaded');
          expect(screen.getByTestId('test-loaded').textContent).toBe('loaded');
        },
        {
          timeout: 3000,
        }
      );
    });

    it('should suspend with non loadable states', async () => {
      expect.assertions(2);
      render(CounterBlocProvider(bloc, (state: number) => state === 0));

      act(() => {
        bloc.increment();
      });

      await waitFor(
        () => {
          screen.getByText('...loading');
          expect(screen.getByTestId('test-loading').textContent).toBe(
            '...loading'
          );
        },
        {
          timeout: 3000,
        }
      );

      await waitFor(
        () => {
          screen.getByTestId('test-counter');
        },
        {
          timeout: 3000,
        }
      );

      expect(screen.getByTestId('test-counter').textContent).toBe('1');
    });
  });

  describe('errorWhen', () => {
    it('should throw a render error when it returns true ', async () => {
      expect.assertions(2);
      render(CounterBlocProvider(bloc, undefined, (state) => state === 0));

      await waitFor(
        () => {
          screen.getByRole('alert');
        },
        {
          timeout: 3000,
        }
      );

      expect(screen.getByTestId('test-count').textContent).toBe('0');

      const testCountButton = screen.getByTestId('test-count-button');

      act(() => {
        fireEvent(
          testCountButton,
          new MouseEvent('click', {
            bubbles: true,
            cancelable: true,
          })
        );
      });

      await waitFor(
        () => {
          screen.getByTestId('test-counter');
          expect(screen.getByTestId('test-counter').textContent).toBe('1');
        },
        {
          timeout: 3000,
        }
      );
    });
  });
});
