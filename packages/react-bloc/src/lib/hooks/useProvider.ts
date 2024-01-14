import { ClassType } from '@jacobtipp/bloc';
import { useContext } from 'react';
import { providerContextMap } from '../components/provider';

export const useProvider = <Class extends ClassType<any>>(classDef: Class) => {
  const context = providerContextMap.get(classDef.name);
  if (!context)
    throw new Error(`${classDef.name} does not exist in the context map.`);

  const providerContext = useContext(context);

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  return providerContext.instance.current! as InstanceType<Class>;
};
