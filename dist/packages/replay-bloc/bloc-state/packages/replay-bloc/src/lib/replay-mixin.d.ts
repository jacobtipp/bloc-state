export interface ReplayMixin<State> {
    undo(): void;
    redo(): void;
    get canUndo(): boolean;
    get canRedo(): boolean;
    set limit(limit: number);
    clearHistory(): void;
    shouldReplay(state: State): boolean;
}
