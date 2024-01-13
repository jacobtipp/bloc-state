import { BlocBase, ClassType } from '@jacobtipp/bloc';
import { useContext } from 'react';
import { blocContextMap } from '../components/bloc-provider';

export const useBlocInstance = <Bloc extends ClassType<BlocBase<any>>>(
  bloc: Bloc
) => {
  const context = blocContextMap.get(bloc.name);
  if (!context)
    throw new Error(`${bloc.name} does not exist in the context map.`);

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  return useContext(context)! as InstanceType<Bloc>;
};
