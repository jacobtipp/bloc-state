import { useProvider } from './useProvider';
import { AnyClassType } from '../components';

export const useRepository = <Repository extends AnyClassType>(
  repository: Repository
) => {
  return useProvider(repository);
};
