import { ClassType } from '@jacobtipp/bloc';
import { useContext } from 'react';
import { repositoryContextMap } from '../components';

export const useRepository = <Repository extends ClassType<any>>(
  repository: Repository
) => {
  const context = repositoryContextMap.get(repository);
  if (!context)
    throw new Error(`${repository.name} does not exist in the context map.`);

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  return useContext(context.repositoryContext)! as InstanceType<Repository>;
};
