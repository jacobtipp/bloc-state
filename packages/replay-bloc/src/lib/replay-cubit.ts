import { ClassType, Cubit, StateType } from '@jacobtipp/bloc';
import { ReplayMixin } from './replay-mixin';
import { Change, ChangeStack } from './change-stack';

export const WithReplayCubit = <
  BaseCubit extends ClassType<Cubit<any>>,
  State = StateType<InstanceType<BaseCubit>>
>(
  Base: BaseCubit
): BaseCubit & ClassType<ReplayMixin<State>> => {
  return class ReplayCubitMixin extends Base {
    constructor(...args: any[]) {
      super(...args);
    }

    private readonly _changeStack = new ChangeStack<State>(
      this.shouldReplay.bind(this)
    );

    protected override emit(newState: any): void {
      this._changeStack.add(
        new Change(
          this.state,
          newState,
          () => super.emit(newState),
          (old) => super.emit(old)
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
