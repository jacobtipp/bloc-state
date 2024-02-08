import { BlocBase, ClassType, StateType } from '@jacobtipp/bloc';
import { BlocListenerProps } from '../hooks';
import { BlocBuilderProps } from './bloc-builder';
/**
 * Type definition for props accepted by BlocConsumer. It combines props for both
 * BlocBuilder and BlocListener for a component that needs to both listen to and
 * rebuild based on Bloc state changes.
 *
 * @template Bloc The class type of the Bloc extending BlocBase with any type of state.
 * @template State The state type that the Bloc manages, defaults to the Bloc's state type.
 */
export type BlocConsumerProps<Bloc extends ClassType<BlocBase<any>>, State = StateType<InstanceType<Bloc>>> = {
    /** The Bloc class to observe for state changes and to listen for specific events. */
    bloc: Bloc;
} & BlocBuilderProps<Bloc, State> & BlocListenerProps<Bloc, State>;
/**
 * A component that combines the functionalities of both BlocBuilder and BlocListener.
 * It listens to state changes and events from a specified Bloc and rebuilds its children
 * based on the current state, while also allowing for side-effects based on the same or
 * different conditions.
 *
 * @param {BlocConsumerProps<Bloc>} props The properties for configuring the BlocConsumer.
 * @returns A JSX.Element that is built from the current state of the Bloc and can react to specific Bloc events.
 * @template Bloc Extends ClassType<BlocBase<any>> to ensure the provided Bloc is based on BlocBase.
 */
export declare function BlocConsumer<Bloc extends ClassType<BlocBase<any>>>({ bloc, builder, buildWhen, listenWhen, listener, }: BlocConsumerProps<Bloc>): JSX.Element;
