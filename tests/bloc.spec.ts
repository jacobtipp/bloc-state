import { skip, take, tap } from "rxjs/operators";
import { CounterBloc } from "./counter/counter.bloc";
import { UserAgeChangedEvent, UserBloc, UserNameChangedEvent } from "./user";
import { NameBloc, UpperCaseBloc } from "./name";
import {
  CounterEvent,
  IncrementCounterEvent,
  DecrementCounterEvent,
} from "./counter/counter.event";
import { CounterState } from "./counter/counter.state";

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

  describe("BlocBase.select", () => {
    it("should return an observable with selectable state", () => {
      const userBloc = new UserBloc();

      const names: { first: string; last: string }[] = [];
      const bobs: { first: string; last: string }[] = [];
      const ages: number[] = [];

      userBloc.age$.subscribe({
        next: (age) => ages.push(age),
        complete: () => {
          const [a, b] = ages;

          expect(a).toBe(0);
          expect(b).toBe(1);
        },
      });

      userBloc.name$.subscribe({
        next: (name) => names.push(name),
        complete: () => {
          const [a, b, c] = names;

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

          expect(a.first).toBe("bob");
        },
      });

      userBloc.add(new UserNameChangedEvent({ first: "bob", last: "parker" }));
      userBloc.add(new UserAgeChangedEvent(1));
      userBloc.add(new UserNameChangedEvent({ first: "eric", last: "smith" })); // this should trigger a new state change in name$
      userBloc.close();
    });
  });
});
