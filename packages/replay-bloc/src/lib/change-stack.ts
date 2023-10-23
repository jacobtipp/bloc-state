export class ChangeStack<State> {
  constructor(
    private readonly _shouldReplay: (change: State) => boolean,
    public limit?: number
  ) {}

  private _history: Change<State>[] = [];
  private _redos: Change<State>[] = [];

  get canRedo() {
    return this._redos.some((change) => this._shouldReplay(change.newValue));
  }
  get canUndo() {
    return this._history.some((change) => this._shouldReplay(change.oldValue));
  }

  add(change: Change<State>) {
    if (this.limit !== undefined && this.limit === 0) return;

    this._history.push(change);
    this._redos = [];

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    if (this.limit !== undefined && this._history.length > this.limit!) {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      if (this.limit! > 0) this._history.shift();
    }
  }

  clear() {
    this._history = [];
    this._redos = [];
  }

  redo(): void {
    if (this.canRedo) {
      const change = this._redos.shift();
      if (change) {
        this._history.push(change);
        return this._shouldReplay(change.newValue)
          ? change.execute()
          : this.redo();
      }
    }
  }

  undo(): void {
    if (this.canUndo) {
      const change = this._history.pop();
      if (change) {
        this._redos.unshift(change);
        return this._shouldReplay(change.oldValue)
          ? change.undo()
          : this.undo();
      }
    }
  }
}

export class Change<State> {
  constructor(
    public readonly oldValue: State,
    public readonly newValue: State,
    private _execute: () => void,
    private _undo: (oldValue: State) => void
  ) {}

  execute = () => this._execute();

  undo = () => this._undo(this.oldValue);
}
