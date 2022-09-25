import { skip, take, tap } from "rxjs/operators";
import { CounterBloc } from "./counter/counter.bloc";
import {
  RandomDerivedUserState,
  TriggerRandomDerivedEvent,
  UserAgeChangedEvent,
  UserBloc,
  UserNameChangedEvent,
} from "./user";
import { NameBloc, UpperCaseBloc } from "./name";
import {
  CounterEvent,
  IncrementCounterEvent,
  DecrementCounterEvent,
} from "./counter/counter.event";
import { CounterState } from "./counter/counter.state";
import { delay } from "./counter/delay";
import { Bloc, BlocEvent, BlocState } from "../lib";

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

  describe("BlocBase.listen", () => {
    it("should listen to an array of blocs", () => {
      const nameBloc = new NameBloc();
      const uppercaseBloc = new UpperCaseBloc();

      uppercaseBloc.listen(nameBloc.state$, (state, bloc) => bloc.toUpperCase(state));

      uppercaseBloc.state$.subscribe((state) => expect(state).toBe("BOB"));
    });
  });

  describe("Bloc.select", () => {
    it("should return an observable with selectable state", async () => {
      const userBloc = new UserBloc();

      const names: { first: string; last: string }[] = [];
      const bobs: string[] = [];
      const agesWithBlocState: number[] = [];
      const ages: number[] = [];
      const random: RandomDerivedUserState[] = [];

      userBloc.ageWithBlocState$.subscribe({
        next: (age) => agesWithBlocState.push(age),
        complete: () => {
          const [a] = agesWithBlocState;

          expect(a).toBe(1);
        },
      });

      userBloc.age$.subscribe({
        next: (state) => ages.push(state),
        complete: () => {
          const [a, b] = ages;

          expect(a).toBe(0);
          expect(b).toBe(1);
          expect(ages.length).toBe(2);
        },
      });

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
        },
      });

      userBloc.bob$.subscribe({
        next: (name) => bobs.push(name),
        complete: () => {
          const [a] = bobs;

          expect(bobs.length).toBe(1);
          expect(a).toBe("bob");
          expect(bobs.length).toBe(1);
        },
      });

      userBloc.randomUserState$.subscribe({
        next: (state) => random.push(state),
        complete: () => {
          const [a, b] = random;

          expect(random.length).toBe(2);

          expect(a).toBeInstanceOf(RandomDerivedUserState);
          expect(a.payload.hasData).toBe(true);
          expect(a.payload.data?.payload).toBe("test");

          expect(b).toBeInstanceOf(RandomDerivedUserState);
          expect(b.payload.hasData).toBe(false);
        },
      });

      userBloc.add(new TriggerRandomDerivedEvent("test"));
      userBloc.add(new UserNameChangedEvent({ first: "bob", last: "parker" }));
      userBloc.add(new UserAgeChangedEvent(1));
      userBloc.add(new TriggerRandomDerivedEvent());
      userBloc.add(new UserNameChangedEvent({ first: "eric", last: "smith" })); // this should trigger a new state change in name$
      userBloc.close();
    });
  });

  describe("Bloc.on", () => {
    it("should throw an error if attempting to subscribe to the same event more than once", () => {
      class TestState extends BlocState {}
      class TestEvent extends BlocEvent {}

      class TestBloc extends Bloc<TestEvent, TestState> {
        constructor() {
          super(TestState.init());

          this.on(TestEvent, (event, emit) => {});

          this.on(TestEvent, (event, emit) => {});
        }
      }

      expect(() => new TestBloc()).toThrowError("TestEvent can only have one EventHandler");
    });
  });

  describe("Bloc.onError", () => {
    it("should be invoked when an error is thrown from Bloc.onEvent", () => {
      class TestState extends BlocState {}
      class TestEvent extends BlocEvent {}

      class TestBloc extends Bloc<TestEvent, TestState> {
        constructor() {
          super(TestState.init());
          this.on(TestEvent, (event, emit) => {});
        }

        protected override onEvent(event: TestEvent): void {
          throw new Error("onevent error");
        }

        protected override onError(error: Error): void {
          expect(error.message).toBe("onevent error");
        }
      }

      const bloc = new TestBloc();
      bloc.add(new TestEvent());
      bloc.close();
    });
  });
});
