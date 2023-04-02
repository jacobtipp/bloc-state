import { cubitCounterWrapper as ccw } from '../test-helpers/wrappers';
import { cleanup, renderHook } from '@testing-library/react';
import { useBlocValue } from '../../src';
import CounterCubit from '../test-helpers/counter/counter.cubit';
import { globalContext } from '../../src';

describe('useBlocValue', () => {
  let cubitCounterWrapper: ({ children }: any) => JSX.Element;

  beforeEach(() => {
    globalContext.clear();
    cubitCounterWrapper = ccw;
  });

  afterEach(() => {
    globalContext.clear();
    cleanup();
  });

  it('should return the current state of a bloc', () => {
    expect.assertions(1);
    const { result } = renderHook(() => useBlocValue(CounterCubit), {
      wrapper: cubitCounterWrapper,
    });
    expect(result.current).toBe(0);
  });
});
