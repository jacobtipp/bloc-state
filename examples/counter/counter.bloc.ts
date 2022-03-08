import { TestScheduler } from "rxjs/testing";
import { Bloc, Emitter } from "../../lib";
import { CounterEvent, DecrementCounterEvent, IncrementCounterEvent } from "./counter.event";
import { CounterState } from "./counter.state";

export class CounterBloc extends Bloc<CounterEvent, number> {
  constructor() {
    super(0);

    this.on(IncrementCounterEvent, (event, emit) => {
      emit(this.state + 1)
    })
    this.on(DecrementCounterEvent, (event, emit) => {
      emit(this.state - 1)
    })
  }

  protected onEvent(event: CounterEvent): void {
      console.log(`OnEvent -> Event: ${event.constructor.name}`)
  }

  protected onTransition(current: number, next: number, event: CounterEvent): void {
    console.log(`onTransition -> Current: ${current} -> Next: ${next} -> event: ${event.constructor.name} `)
  }
}
