import { renderHook, act, cleanup } from '@testing-library/react';
import { getProviderContext } from '../../src';
import { useBloc } from '../../src';
import CounterCubit from '../test-helpers/counter/counter.cubit';
import { UserBloc, UserNameChangedEvent } from '../test-helpers/user/user';
import {
  cubitCounterWrapper as ccw,
  blocUserWrapper as buw,
} from '../test-helpers/wrappers';

describe('useBloc', () => {
  let cubitCounterWrapper: ({ children }: any) => JSX.Element;
  let blocUserWrapper: ({ children }: any) => JSX.Element;

  beforeEach(() => {
    cubitCounterWrapper = ccw;
    blocUserWrapper = buw;
  });

  afterEach(() => {
    getProviderContext().clear();
    cleanup();
  });

  it('should return tuple of current state and bloc', () => {
    expect.assertions(2);
    const { result } = renderHook(() => useBloc(CounterCubit), {
      wrapper: cubitCounterWrapper,
    });

    expect(result.current[0]).toBe(0);
    expect(result.current[1]).toBeInstanceOf(CounterCubit);
  });

  it('should return tuple with selected state if config is provided', async () => {
    expect.assertions(3);
    const { result } = renderHook(
      () =>
        useBloc(UserBloc, {
          selector: (state) => state.name.first,
        }),
      { wrapper: blocUserWrapper }
    );

    expect(result.current[0]).toBe('');
    expect(result.current[1]).toBeInstanceOf(UserBloc);

    act(() => {
      result.current[1].add(
        new UserNameChangedEvent({
          first: 'bob',
          last: 'parker',
        })
      );
      result.current[1].add(
        new UserNameChangedEvent({
          first: 'bob',
          last: 'stewart',
        })
      );
    });

    expect(result.current[0]).toBe('bob');
  });

  it('should return new state when state is changed', () => {
    expect.assertions(2);
    const { result } = renderHook(() => useBloc(CounterCubit), {
      wrapper: cubitCounterWrapper,
    });

    act(() => {
      result.current[1].increment();
    });

    expect(result.current[0]).toBe(1);

    act(() => {
      result.current[1].decrement();
    });

    expect(result.current[0]).toBe(0);
  });
});
