import { BlocBase, ClassType } from '@jacobtipp/bloc';
import { useContext } from 'react';
import { contextMap } from '../provider';

export const useBlocInstance = <Bloc extends ClassType<BlocBase<any>>>(
  bloc: Bloc
) => {
  const context = contextMap.get(bloc);
  if (!context)
    throw new Error(`${bloc.name} does not exist in the context map.`);

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  return useContext(context.blocContext)! as InstanceType<Bloc>;
};
