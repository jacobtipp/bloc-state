import { useContext } from 'react';
import { globalContext } from '../context/bloc-context';
import { extractKey } from '../util';
import { CreatorKey } from '../types';

/**
 * Custom hook that returns an instance of a repository from a Provider
 *
 * @template B Type parameter for the returned value.
 * @param {CreatorKey<B>} repository The repository to extract the instance from
 * @returns {B} The instance of the repository
 * @throws {Error} If the context for the given repository name does not exist in the current provider
 */
export const useRepository = <B>(repository: CreatorKey<B>): B => {
  /**
   * Extracts the key from the given repository and memoizes it
   * using its dependencies
   */
  const name = extractKey(repository);

  /**
   * Gets the context associated with the given repository name
   * and memoizes it using its dependencies
   */
  const repositoryContext = globalContext.get(name);

  if (!repositoryContext) {
    throw new UseRepositoryError(name);
  }

  /**
   * Gets the instance of the repository from the context and
   * returns it as the specified type parameter
   */
  const repositoryInstance = useContext(repositoryContext.context);

  return repositoryInstance as B;
};

export class UseRepositoryError extends Error {
  constructor(name: string) {
    super(
      `useRepository: Context does not exist for ${name} in the current provider`
    );

    Object.setPrototypeOf(this, UseRepositoryError.prototype);
  }
}
