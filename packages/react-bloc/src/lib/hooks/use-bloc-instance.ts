import { BlocBase, ClassType } from '@jacobtipp/bloc';
import { useContext } from 'react';
import { globalContext } from '../context';

/**
 * This function returns a bloc instance based on the provided bloc class type.
 * @template Bloc - The type of the bloc that is being requested.
 * @param {ClassType<Bloc>} bloc - The class type of the bloc that is being requested.
 * @returns {Bloc} - An instance of the requested bloc type.
 * @throws {Error} - When the context for the requested bloc does not exist in the current provider.
 */
export const useBlocInstance = <Bloc extends BlocBase<any>>(
  bloc: ClassType<Bloc>
): Bloc => {
  const blocContext = globalContext.get(bloc.name);

  if (!blocContext) {
    throw new UseBlocInstanceError(bloc.name);
  }

  const blocInstance = useContext(blocContext.context);

  return blocInstance as Bloc;
};

export class UseBlocInstanceError extends Error {
  constructor(name: string) {
    super(
      `useBlocInstance: Context does not exist for ${name} in the current provider`
    );

    Object.setPrototypeOf(this, UseBlocInstanceError.prototype);
  }
}
