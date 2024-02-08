import { BlocBase, ClassType, StateType } from '@jacobtipp/bloc';
/**
 * Props for BlocBuilder component, specifying how to build UI based on Bloc's state changes.
 *
 * @template Bloc The class type of the Bloc extending BlocBase with any type of state.
 * @template State The state type that the Bloc manages, defaults to the Bloc's state type.
 */
export interface BlocBuilderProps<Bloc extends ClassType<BlocBase<any>>, State = StateType<InstanceType<Bloc>>> {
    /** The Bloc class to observe for state changes. */
    bloc: Bloc;
    /** Function to build the UI based on the current state. */
    builder: (state: State) => JSX.Element;
    /** Optional function to determine if the UI should be rebuilt when the state changes. */
    buildWhen?: (previous: State, current: State) => boolean;
}
/**
 * A component that listens to state changes from a Bloc and rebuilds its UI accordingly.
 *
 * This component uses a provided `bloc` to listen for state changes and uses the `builder`
 * function to rebuild the UI based on the current state. An optional `buildWhen` function
 * can be provided to determine if the UI should rebuild on a state change.
 *
 * @param {BlocBuilderProps<Bloc>} props The properties for configuring the BlocBuilder.
 * @returns A JSX.Element built from the current state of the Bloc.
 * @template Bloc Extends ClassType<BlocBase<any>> to ensure the provided Bloc is based on BlocBase.
 */
export declare function BlocBuilder<Bloc extends ClassType<BlocBase<any>>>({ bloc, builder, buildWhen, }: BlocBuilderProps<Bloc>): JSX.Element;
