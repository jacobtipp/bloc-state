import { useContext } from 'react';
import { getProviderContext } from '../context/provider-context';
import { AbstractClassType, ClassType } from '@jacobtipp/bloc';
import { CreatorKey } from '../types';

export type RepositoryKey<T> = CreatorKey<T>;

export type RepositoryReturnType<T> = T extends ClassType<infer C>
  ? C
  : T extends AbstractClassType<infer A>
  ? A
  : T;

export const useRepository = <Repo>(
  repository: CreatorKey<Repo>
): RepositoryReturnType<Repo> => {
  const name = typeof repository === 'string' ? repository : repository.name;

  const repositoryContextContainer = getProviderContext<Repo>().get(name);

  if (!repositoryContextContainer) {
    throw new UseRepositoryError(name);
  }

  return useContext(
    repositoryContextContainer.context
  ) as RepositoryReturnType<Repo>;
};

export class UseRepositoryError extends Error {
  constructor(name: string) {
    super(
      `useRepository: Context does not exist for ${name} in the current provider`
    );

    Object.setPrototypeOf(this, UseRepositoryError.prototype);
  }
}
