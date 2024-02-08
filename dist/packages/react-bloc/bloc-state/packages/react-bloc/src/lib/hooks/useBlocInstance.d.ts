import { BlocBase, ClassType } from '@jacobtipp/bloc';
/**
 * A custom hook that retrieves an instance of a specified Bloc from the nearest provider up the component tree.
 * This hook abstracts the logic for accessing Bloc instances, making it easier to consume Blocs within React components.
 *
 * @template Bloc The class type of the Bloc extending BlocBase with any type of state. This ensures that the hook can work with any Bloc that extends from BlocBase.
 * @param {Bloc} bloc The class of the Bloc for which an instance is desired. This parameter is used to identify the correct provider from which to retrieve the Bloc instance.
 * @returns The instance of the specified Bloc. This instance is retrieved from the context provided by the nearest ancestor provider component in the component tree.
 */
export declare const useBlocInstance: <Bloc extends ClassType<BlocBase<any>>>(bloc: Bloc) => InstanceType<Bloc>;
