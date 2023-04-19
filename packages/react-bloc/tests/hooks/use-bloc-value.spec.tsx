import { cubitCounterWrapper as ccw } from '../test-helpers/wrappers';
import { cleanup, renderHook } from '@testing-library/react';
import { getProviderContext, useBlocValue } from '../../src';
import CounterCubit from '../test-helpers/counter/counter.cubit';

describe('useBlocValue', () => {
  let cubitCounterWrapper: ({ children }: any) => JSX.Element;

  beforeEach(() => {
    getProviderContext().clear();
    cubitCounterWrapper = ccw;
  });

  afterEach(() => {
    getProviderContext().clear();
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
