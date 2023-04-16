import { cleanup, renderHook } from '@testing-library/react';
import '@testing-library/jest-dom';
import { useRepository } from '../../src';
import {
  cubitCounterWrapper as ccw,
  blocUserWrapper as buw,
} from '../test-helpers/wrappers';
import { UseRepositoryError, getProviderContext } from '../../src/lib';
import { CounterRepository, UserRepository } from '../test-helpers';

describe('useRepository', () => {
  let cubitCounterWrapper: ({ children }: any) => JSX.Element;
  let blocUserWrapper: ({ children }: any) => JSX.Element;
  const originalConsoleError = console.error;

  beforeEach(() => {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    console.error = () => {};
    cubitCounterWrapper = ccw;
    blocUserWrapper = buw;
  });

  afterEach(() => {
    console.error = originalConsoleError;
    getProviderContext().clear();
    cleanup();
  });

  it('should return a created repository', () => {
    expect.assertions(1);
    const { result } = renderHook(() => useRepository(CounterRepository), {
      wrapper: cubitCounterWrapper,
    });

    expect(result.current).toBeInstanceOf(CounterRepository);
  });

  it('should throw an error if a repository does not exist in the provider context', () => {
    expect.assertions(1);
    const errorResult = () => {
      renderHook(() => useRepository(UserRepository), {
        wrapper: cubitCounterWrapper,
      });
    };
    expect(errorResult).toThrowError(UseRepositoryError);
  });
});
