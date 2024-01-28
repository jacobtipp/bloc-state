import { useContext } from 'react';
import { AnyClassType, contextMapContext } from '../components';

export const useProvider = <Class extends AnyClassType>(classDef: Class) => {
  const contextMap = useContext(contextMapContext);

  if (!contextMap) {
    throw new Error(`a contextMap does not exist`);
  }

  const context = contextMap.get(classDef.name);

  if (!context)
    throw new Error(`${classDef.name} does not exist in the context map.`);

  const providerContext = useContext(context);

  return providerContext.instance as InstanceType<Class>;
};
