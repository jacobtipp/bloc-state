import { BlocBase, ClassType } from '@jacobtipp/bloc';
import { useProvider } from './useProvider';

export const useBlocInstance = <Bloc extends ClassType<BlocBase<any>>>(
  bloc: Bloc
) => {
  return useProvider(bloc);
};
