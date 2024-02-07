import { isServer } from '@jacobtipp/bloc';
import React, { useEffect, useLayoutEffect } from 'react';

export const useIsomorphicLayoutEffect = (() =>
  /* istanbul ignore next */
  isServer() ? useEffect : useLayoutEffect)();

// this is from jotai useAtomValue https://github.com/pmndrs/jotai/blob/main/src/react/useAtomValue.ts
/* istanbul ignore next */
export const use =
  React.use ||
  (<T>(
    promise: PromiseLike<T> & {
      status?: 'pending' | 'fulfilled' | 'rejected';
      value?: T;
      reason?: unknown;
    }
  ): T => {
    if (promise.status === 'pending') {
      throw promise;
    } else if (promise.status === 'fulfilled') {
      return promise.value as T;
    } else if (promise.status === 'rejected') {
      throw promise.reason;
    } else {
      promise.status = 'pending';
      promise.then(
        (v) => {
          promise.status = 'fulfilled';
          promise.value = v;
        },
        (e) => {
          promise.status = 'rejected';
          promise.reason = e;
        }
      );
      throw promise;
    }
  });
