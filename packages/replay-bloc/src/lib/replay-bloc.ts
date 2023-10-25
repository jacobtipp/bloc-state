import { Bloc, ClassType, StateType, Transition } from '@jacobtipp/bloc';
import { ReplayMixin } from './replay-mixin';
import { Change, ChangeStack } from './change-stack';

export abstract class ReplayEvent {
  protected _!: void;
}

export class RedoEvent extends ReplayEvent {}

export class UndoEvent extends ReplayEvent {}

export const WithReplayBloc = <
  BaseBloc extends ClassType<Bloc<ReplayEvent, any>>,
  State = StateType<InstanceType<BaseBloc>>
>(
  Base: BaseBloc
): BaseBloc & ClassType<ReplayMixin<State>> => {
  return class ReplayBlocMixin extends Base implements ReplayMixin<State> {
    constructor(...args: any[]) {
      super(...args);

      this.undo = this.undo.bind(this);
      this.redo = this.redo.bind(this);
      this.clearHistory = this.clearHistory.bind(this);
    }

    private readonly _changeStack = new ChangeStack<State>(
      this.shouldReplay.bind(this)
    );

    protected override onTransition(
      transition: Transition<ReplayEvent, any>
    ): void {
      super.onTransition(transition);
    }

    protected override onEvent(event: ReplayEvent): void {
      super.onEvent(event);
    }

    protected override emit(newState: any): void {
      this._changeStack.add(
        new Change(
          this.state,
          newState,
          () => {
            const event = new RedoEvent();
            this.onEvent(event);
            this.onTransition(new Transition(this.state, event, newState));
            super.emit(newState);
          },
          (old) => {
            const event = new UndoEvent();
            this.onEvent(event);
            this.onTransition(new Transition(this.state, event, old));
            super.emit(old);
          }
        )
      );
      super.emit(newState);
    }

    undo() {
      this._changeStack.undo();
    }

    redo() {
      this._changeStack.redo();
    }

    get canUndo() {
      return this._changeStack.canUndo;
    }

    get canRedo() {
      return this._changeStack.canRedo;
    }

    clearHistory() {
      return this._changeStack.clear();
    }

    set limit(newLimit: number) {
      this._changeStack.limit = newLimit;
    }

    shouldReplay(_state: State) {
      return true;
    }
  };
};
