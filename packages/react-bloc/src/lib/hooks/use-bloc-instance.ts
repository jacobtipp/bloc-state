import { BlocBase, ClassType } from '@jacobtipp/bloc';
import { useContext, useMemo } from 'react';
import { globalContext } from '../context/bloc-context';
import { extractKey } from '../util';

export const useBlocInstance = <B extends BlocBase<any>>(
  bloc: ClassType<B>
): B => {
  const name = useMemo(() => extractKey(bloc), [bloc]);
  const blocContext = useMemo(() => globalContext.get(name), [name]);

  if (!blocContext) {
    throw new Error(
      `Context does not exist for ${name} in the current provider`
    );
  }

  const blocInstance = useContext(blocContext.context);

  return blocInstance as B;
};
