import { fireEvent, render } from '@testing-library/react';
import { useState } from 'react';
import {
  BlocProvider,
  RootProvider,
  useBloc,
  usePropListener,
} from '../../src/lib';
import { CounterBloc } from './counter';

describe('useBlocValue', () => {
  const consoleLog = console.log;
  const mockLog = jest.fn();
  console.log = mockLog;

  afterAll(() => {
    console.log = consoleLog;
  });

  const CounterChild = () => {
    const [blocCount, counterBloc] = useBloc(CounterBloc);
    const [count, setCount] = useState(blocCount);
    const { setCount: setBlocCount } = counterBloc;

    usePropListener(
      count,
      {
        listener: (current) => setBlocCount(current),
      },
      [counterBloc]
    );

    usePropListener(count, {
      listenWhen: (_, current) => current === 1,
      listener: (current) => console.log(current),
    });

    return (
      <div
        data-testid="increment"
        onClick={() => setCount((count) => count + 1)}
      >
        <p data-testid="count">{blocCount}</p>
        <p data-testid="count-minus-one">{blocCount}</p>
      </div>
    );
  };

  it('should listen to states', async () => {
    const { findByTestId } = render(
      <RootProvider>
        <BlocProvider bloc={CounterBloc} create={() => new CounterBloc(0)}>
          <CounterChild />
        </BlocProvider>
      </RootProvider>
    );

    const inc1 = await findByTestId('increment');
    const count = await findByTestId('count');

    expect(count.textContent).toBe('0');

    fireEvent.click(inc1);

    const count2 = await findByTestId('count');
    expect(count2.textContent).toBe('1');
    expect(mockLog).toHaveBeenLastCalledWith(1);
  }, 5000);
});
