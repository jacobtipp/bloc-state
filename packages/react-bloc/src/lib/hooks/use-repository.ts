import { useContext, useMemo } from 'react';
import { globalContext } from '../context/bloc-context';
import { extractKey } from '../util';
import { CreatorKey } from '../types';

export const useRepository = <B = any>(repository: CreatorKey<B>): B => {
  const name = useMemo(() => extractKey(repository), [repository]);
  const repositoryContext = useMemo(() => globalContext.get(name), [name]);

  if (!repositoryContext) {
    throw new Error(
      `Context does not exist for ${name} in the current provider`
    );
  }

  const repositoryInstance = useContext(repositoryContext.context);

  return repositoryInstance as B;
};
