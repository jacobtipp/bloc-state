import { Bloc } from "../../lib";
import { CounterEvent, DecrementCounterEvent, IncrementCounterEvent } from "./counter.event";

export class CounterBloc extends Bloc<CounterEvent, number> {
  protected onTransition(current: number, next: number, event?: CounterEvent): void {}

  protected onError(error: Error): void {}

  protected onEvent(event: CounterEvent): void {}

  constructor() {
    super(0);
  }

  protected async *mapEventToState(event: CounterEvent) {
    if (event instanceof IncrementCounterEvent) {
      yield this.state + 1;
    } else if (event instanceof DecrementCounterEvent) {
      yield this.state - 1;
    }
  }
}
