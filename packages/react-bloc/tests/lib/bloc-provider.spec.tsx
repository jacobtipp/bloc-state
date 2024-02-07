import { fireEvent, render } from '@testing-library/react';
import { CounterExampleGroup } from './counter';
import { CounterWithUserProvider } from './user';
import { PropsWithChildren, StrictMode, useEffect } from 'react';
import {
  BlocProvider,
  RootProvider,
  clientContextMap,
  useBlocInstance,
} from '../../src';
import { Cubit } from '@jacobtipp/bloc';

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

  it('should support passing an instance to a bloc to create', () => {
    expect.assertions(3);
    class TestBloc extends Cubit<number> {
      setState = (state: number) => {
        this.emit(state);
      };
    }

    const bloc = new TestBloc(0);

    const IncrementProvider = ({ children }: PropsWithChildren) => {
      return (
        <RootProvider>
          <BlocProvider bloc={TestBloc} create={bloc}>
            {children}
          </BlocProvider>
        </RootProvider>
      );
    };

    const Increment = () => {
      const { setState } = useBlocInstance(TestBloc);

      useEffect(() => {
        setState(1);
        // eslint-disable-next-line react-hooks/exhaustive-deps
      }, []);

      // eslint-disable-next-line react/jsx-no-useless-fragment
      return <></>;
    };

    expect(bloc.state).toBe(0);

    const { unmount } = render(
      <IncrementProvider>
        <Increment />
      </IncrementProvider>
    );

    unmount();

    expect(bloc.isClosed).toBe(false);
    expect(bloc.state).toBe(1);
  });
});
