import { BlocBase, StateType, ClassType } from '@jacobtipp/bloc';
/**
 * Interface for the properties accepted by the useBlocListener hook. It defines how to listen
 * to state changes in a Bloc and trigger side effects based on those changes.
 *
 * @template Bloc The class type of the Bloc extending BlocBase with any type of state.
 * @template State The state type that the Bloc manages, defaults to the Bloc's state type.
 */
export interface BlocListenerProps<Bloc extends ClassType<BlocBase<any>>, State = StateType<InstanceType<Bloc>>> {
    /** Function to be called when the specified conditions are met. */
    listener: (bloc: InstanceType<Bloc>, state: State) => void;
    /** Optional function to determine whether the listener should be called based on state changes. */
    listenWhen?: (previous: State, current: State) => boolean;
}
/**
 * A custom hook that listens to state changes in a Bloc and triggers a callback function based
 * on those changes. It provides a mechanism to perform side effects in response to Bloc state updates.
 *
 * @param {Bloc} bloc The Bloc class to listen to.
 * @param {BlocListenerProps<Bloc>} options An object containing the listener callback function
 * and an optional condition function to decide when the listener should be triggered.
 * @template Bloc Extends ClassType<BlocBase<any>> to ensure the provided Bloc is based on BlocBase.
 */
export declare const useBlocListener: <Bloc_1 extends ClassType<BlocBase<any>>>(bloc: Bloc_1, { listener, listenWhen }: BlocListenerProps<Bloc_1, StateType<InstanceType<Bloc_1>>>) => void;
