import { AnyClassType } from '../context';
import { useProvider } from './useProvider';

export const useRepository = <Repository extends AnyClassType>(
  repository: Repository
) => {
  return useProvider(repository);
};
