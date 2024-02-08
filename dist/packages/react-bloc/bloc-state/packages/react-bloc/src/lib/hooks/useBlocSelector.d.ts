import { BlocBase, StateType, ClassType } from '@jacobtipp/bloc';
/**
 * Configuration options for `useBlocSelector` hook to customize behavior for selecting,
 * listening, suspending, and error handling based on the state of a Bloc.
 *
 * @template Bloc The type of Bloc being interacted with, extending BlocBase.
 * @template SelectedState The type of state after being transformed by the `selector`.
 */
export type UseBlocSelectorConfig<Bloc extends BlocBase<any>, SelectedState> = {
    /**
     * A function that takes the current state of the Bloc and returns a transformed version of it.
     * This allows for selecting a specific part of the state or deriving new values from it.
     *
     * @param state The current state of the Bloc.
     * @returns The transformed or selected state.
     */
    selector?: (state: StateType<Bloc>) => SelectedState;
    /**
     * A function that determines whether the listener should be notified of the state change.
     * This can be used to optimize performance by avoiding unnecessary updates and re-renders.
     *
     * @param state The current state of the Bloc.
     * @returns `true` if the listener should be notified, otherwise `false`.
     */
    listenWhen?: (state: StateType<Bloc>) => boolean;
    /**
     * A function that determines whether the component using this hook should trigger React suspense.
     * This is useful for delaying the rendering of the component until certain conditions are met.
     *
     * @param state The current state of the Bloc.
     * @returns `true` to suspend rendering, otherwise `false`.
     */
    suspendWhen?: (state: StateType<Bloc>) => boolean;
    /**
     * A function that determines whether an error should be thrown based on the current state of the Bloc.
     * This allows for error boundaries to catch and handle errors related to state conditions.
     *
     * @param state The current state of the Bloc.
     * @returns `true` to throw an error, otherwise `false`.
     */
    errorWhen?: (state: StateType<Bloc>) => boolean;
};
/**
 * Custom hook to select and use a specific piece of state from a Bloc, with support for suspense and error handling.
 *
 * @template Bloc Type of Bloc being monitored.
 * @template SelectedState The type of the selected state.
 * @template State The state type of the Bloc instance.
 */
export declare const useBlocSelector: <Bloc extends ClassType<BlocBase<any>>, SelectedState, State extends StateType<InstanceType<Bloc>> = StateType<InstanceType<Bloc>>>(bloc: Bloc, config?: UseBlocSelectorConfig<InstanceType<Bloc>, SelectedState> | undefined) => SelectedState;
export declare class BlocRenderError<State> extends Error {
    readonly state: State;
    name: string;
    constructor(state: State, _reload?: () => void);
}
