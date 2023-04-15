import React, { PropsWithChildren } from 'react';
import { MultiCreator } from '../../types';
import { MultiProvider } from './provider';

export type MultiRepositoryProviderProps = {
  repositories: MultiCreator<any>;
  dispose?: (value: any) => void;
  deps?: React.DependencyList;
};

export const RepositoryProvider = (
  props: PropsWithChildren<MultiRepositoryProviderProps>
) => {
  return (
    <MultiProvider
      creators={props.repositories}
      dispose={props.dispose}
      deps={props.deps}
    >
      {props.children}
    </MultiProvider>
  );
};
