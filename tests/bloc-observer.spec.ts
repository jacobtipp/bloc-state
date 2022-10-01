import { Observable, interval, take } from "rxjs";
import { BlocState, BlocEvent, Bloc, Transition, BlocObserver, BlocBase } from "../lib";
import { restartable, sequential } from "../lib/transformer";
import { CounterBloc } from "./helpers/counter/counter.bloc";
import { IncrementCounterEvent } from "./helpers/counter/counter.event";
import { CounterState } from "./helpers/counter/counter.state";
import { delay } from "./helpers/counter/delay";
import { NameBloc } from "./helpers/name";
import { UserAgeChangedEvent, UserBloc } from "./helpers/user";

describe("bloc-observer", () => {
  let counterBloc: CounterBloc;
  let userBloc: UserBloc;
  let blocObserver: BlocObserver;

  beforeEach(() => {
    counterBloc = new CounterBloc();
    userBloc = new UserBloc();
    blocObserver = new BlocObserver();
  });

  it("should listen to events ", () => {
    const events: [bloc: Bloc<any, any>, event: any][] = [];
    const errors: [bloc: Bloc<any, any>, error: any][] = [];

    class TestBlocObserver extends BlocObserver {
      override onEvent(bloc: Bloc<any, any>, event: any): void {
        events.push([bloc, event]);
      }
    }

    expect(blocObserver.onEvent(counterBloc, new IncrementCounterEvent())).toBeUndefined();

    Bloc.observer = new TestBlocObserver();
    counterBloc.add(new IncrementCounterEvent());
    userBloc.add(new UserAgeChangedEvent(10));
    counterBloc.add(new IncrementCounterEvent());

    expect(events.length).toBe(3);
    expect(errors.length);

    userBloc.close();
    counterBloc.close();
  });

  it("should listen to errors ", () => {
    const errors: [bloc: BlocBase<any>, error: any][] = [];

    class TestBlocObserver extends BlocObserver {
      override onEvent(bloc: Bloc<any, any>, event: any): void {
        throw new Error("onevent error");
      }

      override onError(bloc: BlocBase<any>, error: any): void {
        errors.push([bloc, error]);
      }
    }

    class CounterBlocError extends Error {}

    expect(blocObserver.onError(counterBloc, new CounterBlocError("oops"))).toBeUndefined();

    Bloc.observer = new TestBlocObserver();
    counterBloc.add(new IncrementCounterEvent());

    const [err] = errors;
    const [bloc, error] = err;

    expect(bloc).toBeInstanceOf(CounterBloc);
    expect(errors.length).toBe(1);
    expect(error.message).toBe("onevent error");
  });

  it("should listen to transitions ", () => {
    const transitions: [bloc: Bloc<any, any>, transition: Transition<any, any>][] = [];

    class TestBlocObserver extends BlocObserver {
      override onTransition(bloc: Bloc<any, any>, transition: Transition<any, any>): void {
        transitions.push([bloc, transition]);
      }
    }

    expect(
      blocObserver.onTransition(
        counterBloc,
        new Transition(CounterState.ready(0), new IncrementCounterEvent(), CounterState.ready(1))
      )
    ).toBeUndefined();

    Bloc.observer = new TestBlocObserver();
    counterBloc.add(new IncrementCounterEvent());

    expect(transitions.length).toBe(1);

    const [bloc, transition] = transitions[0];

    expect(bloc).toBe(counterBloc);
    expect(transition.currentState.payload.data).toBe(0);
    expect(transition.event).toBeInstanceOf(IncrementCounterEvent);
    expect(transition.nextState.payload.data).toBe(1);
  });
});
