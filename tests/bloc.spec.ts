import { skip, take, tap } from "rxjs/operators";
import { CounterBloc } from "./helpers/counter/counter.bloc";
import {
  UserAgeChangedEvent,
  UserBloc,
  UserNameChangedEvent,
  UserNameChangeState,
  UserState,
} from "./helpers/user";
import { NameBloc, UpperCaseBloc } from "./helpers/name";
import {
  CounterEvent,
  IncrementCounterEvent,
  DecrementCounterEvent,
  NoEmitDataEvent,
} from "./helpers/counter/counter.event";
import { CounterState } from "./helpers/counter/counter.state";
import { delay } from "./helpers/counter/delay";
import { Bloc, BlocDataType, BlocEvent, BlocState, Transition } from "../lib";
import { interval, Observable } from "rxjs";

describe("bloc", () => {
  let bloc: CounterBloc;

  beforeEach(() => {
    bloc = new CounterBloc();
  });

  it("should be defined", () => {
    expect(bloc).toBeDefined();
  });

  it("should have initial state", (done) => {
    bloc.state$.subscribe({
      next: (state) => {
        expect(state.payload.data).toBe(0);
      },
      complete: () => done(),
    });

    bloc.close();
  });

  it("should map events to state", (done) => {
    const states: CounterState[] = [];
    bloc.state$.pipe(skip(1), take(4)).subscribe({
      next: (state) => states.push(state),
      complete: () => {
        const [first, second, third, fourth] = states;
        expect(first.payload.data).toBe(1);
        expect(second.payload.data).toBe(2);
        expect(third.payload.data).toBe(3);
        expect(fourth.payload.data).toBe(2);
        bloc.close();
        done();
      },
    });
    bloc.add(new IncrementCounterEvent());
    bloc.add(new IncrementCounterEvent());
    bloc.add(new IncrementCounterEvent());
    bloc.add(new DecrementCounterEvent());
  });

  it("should push new data changes to data$ observable", (done) => {
    const data: BlocDataType<CounterState>[] = [];
    bloc.data$.pipe(take(5)).subscribe({
      next: (val) => data.push(val),
      complete: () => {
        console.log(data);
        const [first, second, third, fourth, fifth] = data;
        expect(first).toBe(0);
        expect(second).toBe(1);
        expect(third).toBe(2);
        expect(fourth).toBe(3);
        expect(fifth).toBe(2);
        bloc.close();
        done();
      },
    });
    bloc.add(new IncrementCounterEvent());
    bloc.add(new IncrementCounterEvent());
    bloc.add(new NoEmitDataEvent()); // we add a random event that does not emit new data, to demonstrate data is only changed when state has data
    bloc.add(new IncrementCounterEvent());
    bloc.add(new DecrementCounterEvent());
  });

  describe("Bloc.select & Bloc.filter", () => {
    let userBloc: UserBloc;

    beforeEach(() => {
      userBloc?.close();
      userBloc = new UserBloc();
    });

    it("should select age with bloc state", (done) => {
      const agesWithBlocState: number[] = [];

      userBloc.ageWithBlocState$.subscribe({
        next: (age) => agesWithBlocState.push(age),
        complete: () => {
          const [a] = agesWithBlocState;

          expect(a).toBe(1);
          done();
        },
      });

      userBloc.add(new UserNameChangedEvent({ first: "bob", last: "parker" }));
      userBloc.add(new UserAgeChangedEvent(1));
      userBloc.add(new UserNameChangedEvent({ first: "eric", last: "smith" }));
      userBloc.close();
    });

    it("should select age without bloc state", (done) => {
      const ages: number[] = [];

      userBloc.age$.subscribe({
        next: (state) => ages.push(state),
        complete: () => {
          const [a, b] = ages;

          expect(a).toBe(0);
          expect(b).toBe(1);
          expect(ages.length).toBe(2);
          done();
        },
      });

      userBloc.add(new UserNameChangedEvent({ first: "bob", last: "parker" }));
      userBloc.add(new UserAgeChangedEvent(1));
      userBloc.add(new UserNameChangedEvent({ first: "eric", last: "smith" }));
      userBloc.close();
    });

    it("should filter by age > 0", (done) => {
      const ages: number[] = [];

      userBloc.ageGreaterThanZero$.subscribe({
        next: (user) => {
          ages.push(user.age);
        },
        complete: () => {
          const [a, b, c] = ages;

          expect(ages.length).toBe(3);
          expect(a).toBe(1);
          expect(b).toBe(1);
          expect(c).toBe(3);
          done();
        },
      });

      userBloc.add(new UserNameChangedEvent({ first: "bob", last: "parker" }));
      userBloc.add(new UserAgeChangedEvent(1));
      userBloc.add(new UserNameChangedEvent({ first: "eric", last: "smith" }));
      userBloc.add(new UserAgeChangedEvent(0));
      userBloc.add(new UserNameChangedEvent({ first: "eric", last: "smith" }));
      userBloc.add(new UserAgeChangedEvent(3));
      userBloc.close();
    });

    it("should filter by age > 0 with type", (done) => {
      const ages: number[] = [];

      userBloc.ageGreaterThanZeroWithType$.subscribe({
        next: (user) => ages.push(user.age),
        complete: () => {
          const [a] = ages;

          expect(a).toBe(1);
          expect(ages.length).toBe(1);
          done();
        },
      });

      userBloc.state$.subscribe();

      userBloc.add(new UserNameChangedEvent({ first: "bob", last: "parker" }));
      userBloc.add(new UserAgeChangedEvent(1));
      userBloc.add(new UserNameChangedEvent({ first: "eric", last: "smith" }));
      userBloc.close();
    });

    it("should select name", (done) => {
      const names: { first: string; last: string }[] = [];
      userBloc.name$.subscribe({
        next: (name) => names.push(name),
        complete: () => {
          const [a, b, c] = names;

          expect(names.length).toBe(3);
          expect(a.first).toBe("");
          expect(a.last).toBe("");

          expect(b.first).toBe("bob");
          expect(b.last).toBe("parker");

          expect(c.first).toBe("eric");
          expect(c.last).toBe("smith");
          done();
        },
      });

      userBloc.add(new UserNameChangedEvent({ first: "bob", last: "parker" }));
      userBloc.add(new UserAgeChangedEvent(1));
      userBloc.add(new UserNameChangedEvent({ first: "eric", last: "smith" }));
      userBloc.close();
    });

    it("should names filter by filterType", (done) => {
      const names: UserState[] = [];
      userBloc.nameChangeFilter$.subscribe({
        next: (name) => names.push(name),
        complete: () => {
          const [a, b, c] = names;

          expect(names.length).toBe(3);
          expect(a).toBeInstanceOf(UserNameChangeState);
          expect(b).toBeInstanceOf(UserNameChangeState);
          expect(c).toBeInstanceOf(UserNameChangeState);
          done();
        },
      });

      userBloc.add(new UserNameChangedEvent({ first: "bob", last: "parker" }));
      userBloc.add(new UserAgeChangedEvent(1));
      userBloc.add(new UserNameChangedEvent({ first: "eric", last: "smith" }));
      userBloc.close();
    });

    it("should select first names", (done) => {
      const first: string[] = [];
      userBloc.firstName$.subscribe({
        next: (name) => first.push(name),
        complete: () => {
          const [a, b, c] = first;

          expect(first.length).toBe(3);
          expect(a).toBe("");
          expect(b).toBe("bob");
          expect(c).toBe("eric");
          done();
        },
      });

      userBloc.add(new UserNameChangedEvent({ first: "bob", last: "parker" }));
      userBloc.add(new UserAgeChangedEvent(1));
      userBloc.add(new UserNameChangedEvent({ first: "eric", last: "smith" }));
      userBloc.close();
    });

    it("should select names filtered by 'bob'", (done) => {
      const bobs: string[] = [];
      userBloc.bob$.subscribe({
        next: (name) => bobs.push(name),
        complete: () => {
          const [a] = bobs;

          expect(bobs.length).toBe(1);
          expect(a).toBe("bob");
          expect(bobs.length).toBe(1);
          done();
        },
      });

      userBloc.add(new UserNameChangedEvent({ first: "bob", last: "parker" }));
      userBloc.add(new UserAgeChangedEvent(1));
      userBloc.add(new UserNameChangedEvent({ first: "eric", last: "smith" }));
      userBloc.close();
    });
  });

  describe("Bloc.on", () => {
    it("should throw an error if attempting to subscribe to the same event more than once", () => {
      class TestState extends BlocState<null> {}
      class TestEvent extends BlocEvent {}

      class TestBloc extends Bloc<TestEvent, TestState> {
        constructor() {
          super(TestState.init(null));

          this.on(TestEvent, (event, emit) => {});

          this.on(TestEvent, (event, emit) => {});
        }
      }

      expect(() => new TestBloc()).toThrowError("TestEvent can only have one EventHandler");
    });
  });

  describe("Bloc.onError", () => {
    it("should be invoked when an error is thrown from Bloc.onEvent", (done) => {
      class TestState extends BlocState<null> {}
      class TestEvent extends BlocEvent {}

      class TestBloc extends Bloc<TestEvent, TestState> {
        constructor() {
          super(TestState.init(null));
          this.on(TestEvent, (event, emit) => {});
        }

        protected override onEvent(event: TestEvent): void {
          throw new Error("onevent error");
        }

        protected override onError(error: Error): void {
          expect(error.message).toBe("onevent error");
        }
      }

      const testBloc = new TestBloc();
      testBloc.state$.subscribe({ complete: () => done() });
      testBloc.add(new TestEvent());
      testBloc.close();
    });

    it("should be invoked when an error is thrown inside an event callback", (done) => {
      class TestState extends BlocState<null> {}
      class TestEvent extends BlocEvent {}

      class TestBloc extends Bloc<TestEvent, TestState> {
        constructor() {
          super(TestState.init(null));
          this.on(TestEvent, (event, emit) => {
            throw new Error("eventcallback error");
          });
        }

        protected override onError(error: Error): void {
          expect(error.message).toBe("eventcallback error");
          bloc.close();
          done();
        }
      }

      const testBloc = new TestBloc();
      testBloc.add(new TestEvent());
    });

    it("should be invoked when an error is thrown from onTransition", (done) => {
      class TestState extends BlocState<null> {}
      class TestEvent extends BlocEvent {}

      class TestBloc extends Bloc<TestEvent, TestState> {
        constructor() {
          super(TestState.init(null));
          this.on(TestEvent, (event, emit) => {
            emit(TestState.loading());
          });
        }

        protected override onTransition(transition: Transition<TestEvent, TestState>): void {
          throw new Error("ontransition error");
        }

        protected override onError(error: Error): void {
          expect(error.message).toBe("ontransition error");
          bloc.close();
          done();
        }
      }

      const testBloc = new TestBloc();
      testBloc.add(new TestEvent());
    });
  });
});
