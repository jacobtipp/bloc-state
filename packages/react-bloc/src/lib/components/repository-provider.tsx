import { ClassType } from '@jacobtipp/bloc';
import { PropsWithChildren, ReactNode } from 'react';
import { MultiProvider, Provider } from './provider';

export interface RepositoryProviderProps<Repository extends ClassType<any>> {
  repository: Repository;
  create: () => InstanceType<Repository>;
  children: ReactNode;
  dependencies?: any[];
}

export const RepositoryProvider = <Repository extends ClassType<any>>({
  repository,
  children,
  dependencies = [],
  create,
}: RepositoryProviderProps<Repository>) => {
  return Provider({
    classDef: repository,
    dependencies,
    create,
    children,
  });
};

type RepositoryProviderReturnType = ReturnType<typeof RepositoryProvider>;

export type MultiRepositoryProviderProps = {
  providers: Array<
    ({ children }: PropsWithChildren) => RepositoryProviderReturnType
  >;
};

export const MultiRepositoryProvider = ({
  providers,
  children,
}: PropsWithChildren<MultiRepositoryProviderProps>) => {
  return MultiProvider({
    providers,
    children,
  });
};
