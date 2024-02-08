import { BlocBase, StateType, ClassType } from '@jacobtipp/bloc';
import { UseBlocSelectorConfig } from './useBlocSelector';
/**
 * A custom React hook that combines the functionalities of `useBlocInstance` and `useBlocSelector`.
 * It provides both the Bloc instance and the selected state, allowing components to easily interact
 * with a Bloc's state and methods.
 *
 * @template Bloc The class type of the Bloc extending BlocBase with any type of state.
 * @template SelectedState The type of state selected or derived from the Bloc's state. This is determined
 * by the optional `selector` provided in the `config` parameter. If no `selector` is specified, the entire
 * state of the Bloc is used.
 *
 * @param {Bloc} bloc The class of the Bloc for which the instance and selected state are desired.
 * @param {UseBlocSelectorConfig<InstanceType<Bloc>, SelectedState>} [config] Optional configuration for
 * selecting and transforming the Bloc's state, and for specifying conditions under which to listen for
 * state changes, suspend rendering, or throw errors based on the state.
 *
 * @returns {readonly [SelectedState, InstanceType<Bloc>]} A tuple containing the selected state and the Bloc instance.
 * The selected state is the result of applying the `selector` function to the Bloc's current state, if specified;
 * otherwise, it is the Bloc's current state itself. The second element of the tuple is the Bloc instance, allowing
 * direct access to its methods and properties.
 */
export declare const useBloc: <Bloc extends ClassType<BlocBase<any>>, SelectedState = StateType<InstanceType<Bloc>>>(bloc: Bloc, config?: UseBlocSelectorConfig<InstanceType<Bloc>, SelectedState> | undefined) => readonly [SelectedState, InstanceType<Bloc>];
