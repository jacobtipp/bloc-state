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
/**
 * Custom hook that returns an instance of a repository from a Provider
 *
 * @template B Type parameter for the returned value.
 * @param {CreatorKey<B>} repository The repository to extract the instance from
 * @returns {B} The instance of the repository
 * @throws {Error} If the context for the given repository name does not exist in the current provider
 */
export const useRepository = <Repo>(
  repository: CreatorKey<Repo>
): RepositoryReturnType<Repo> => {
  const name = typeof repository === 'string' ? repository : repository.name;
  /**
   * Extracts the key from the given repository and memoizes it
   * using its dependencies
   */
  /**
   * Gets the context associated with the given repository name
   * and memoizes it using its dependencies
   */
  const repositoryContextContainer = getProviderContext<Repo>().get(name);

  if (!repositoryContextContainer) {
    throw new UseRepositoryError(name);
  }

  return useContext(
    repositoryContextContainer.context
  ) as RepositoryReturnType<Repo>;

  /**
   * Gets the instance of the repository from the context and
   * returns it as the specified type parameter
   */
};

export class UseRepositoryError extends Error {
  constructor(name: string) {
    super(
      `useRepository: Context does not exist for ${name} in the current provider`
    );

    Object.setPrototypeOf(this, UseRepositoryError.prototype);
  }
}
