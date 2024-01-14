import { ClassType } from '@jacobtipp/bloc';
import { useProvider } from './useProvider';

export const useRepository = <Repository extends ClassType<any>>(
  repository: Repository
) => {
  return useProvider(repository);
};
