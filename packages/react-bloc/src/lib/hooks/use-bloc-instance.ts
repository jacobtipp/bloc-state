import { BlocBase, ClassType } from '@jacobtipp/bloc';
import { getProviderContext } from '../context';
import { useContext } from 'react';

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
  const blocContextContainer = getProviderContext<Bloc>().get(bloc.name);
  if (!blocContextContainer) {
    throw new UseBlocInstanceError(bloc.name);
  }

  return useContext(blocContextContainer.context);
};

export class UseBlocInstanceError extends Error {
  constructor(name: string) {
    super(
      `useBlocInstance: Context does not exist for ${name} in the current provider`
    );

    Object.setPrototypeOf(this, UseBlocInstanceError.prototype);
  }
}
