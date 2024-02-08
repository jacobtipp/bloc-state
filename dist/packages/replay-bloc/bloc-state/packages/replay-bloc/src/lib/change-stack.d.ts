export declare class ChangeStack<State> {
    private readonly _shouldReplay;
    limit?: number | undefined;
    constructor(_shouldReplay: (change: State) => boolean, limit?: number | undefined);
    private _history;
    private _redos;
    get canRedo(): boolean;
    get canUndo(): boolean;
    add(change: Change<State>): void;
    clear(): void;
    redo(): void;
    undo(): void;
}
export declare class Change<State> {
    readonly oldValue: State;
    readonly newValue: State;
    private _execute;
    private _undo;
    constructor(oldValue: State, newValue: State, _execute: () => void, _undo: (oldValue: State) => void);
    execute: () => void;
    undo: () => void;
}
