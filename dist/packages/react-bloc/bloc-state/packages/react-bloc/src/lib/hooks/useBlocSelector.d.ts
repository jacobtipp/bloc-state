import { BlocBase, StateType, ClassType } from '@jacobtipp/bloc';
export declare function useIsMounted(): () => boolean;
export type UseBlocSelectorConfig<Bloc extends BlocBase<any>, SelectedState> = {
    selector?: (state: StateType<Bloc>) => SelectedState;
    listenWhen?: (state: StateType<Bloc>) => boolean;
    suspendWhen?: (state: StateType<Bloc>) => boolean;
    errorWhen?: (state: StateType<Bloc>) => boolean;
};
export declare const useBlocSelector: <Bloc extends ClassType<BlocBase<any>>, SelectedState, State extends StateType<InstanceType<Bloc>> = StateType<InstanceType<Bloc>>>(bloc: Bloc, config?: UseBlocSelectorConfig<InstanceType<Bloc>, SelectedState> | undefined) => SelectedState;
export declare class BlocRenderError<State> extends Error {
    readonly state: State;
    constructor(state: State, _reload?: () => void);
}
