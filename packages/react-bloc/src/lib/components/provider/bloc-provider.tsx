import React, { PropsWithChildren, useCallback } from 'react';
import { MultiCreator } from '../../types';
import { MultiProvider } from './provider';
import { BlocBase } from '@jacobtipp/bloc';

/**
 * MultiBlocProvider type defines the data structure for providing multiple Blocs at once.
 *
 * @property {MultiCreator<BlocBase<any>>} blocs - An array of creator functions that return a BlocBase instance.
 * @property {React.DependencyList | undefined} deps - (optional) An array of dependencies to be passed down to the provider.
 */
export type MultiBlocProviderProps = {
  blocs: MultiCreator<BlocBase<any>>;
  deps?: React.DependencyList;
};

export const BlocProvider = (
  props: PropsWithChildren<MultiBlocProviderProps>
) => {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const dispose = useCallback<(value: BlocBase<any>) => void>(
    (bloc) => bloc.close(),
    []
  );

  return (
    <MultiProvider creators={props.blocs} dispose={dispose} deps={props.deps}>
      {props.children}
    </MultiProvider>
  );
};
