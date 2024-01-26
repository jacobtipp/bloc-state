import { useEffect, useLayoutEffect } from 'react';

export const isServer = typeof window === 'undefined';

export const useIsomorphicLayoutEffect = (() =>
  /* istanbul ignore next */
  typeof window === 'undefined' ? useEffect : useLayoutEffect)();
