import { skip, take, tap } from "rxjs/operators";
import { Bloc, BlocEvent, BlocListener, BlocState, Cubit } from "../lib";
import { CounterBloc } from "./counter/counter.bloc";
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
        expect(state.info.data).toBe(0);
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
        expect(first.info.data).toBe(1);
        expect(second.info.data).toBe(2);
        expect(third.info.data).toBe(3);
        expect(fourth.info.data).toBe(2);
        bloc.close();
        done();
      },
    });
    bloc.add(new IncrementCounterEvent());
    bloc.add(new IncrementCounterEvent());
    bloc.add(new IncrementCounterEvent());
    bloc.add(new DecrementCounterEvent());
  });

  it("should subscribe to state changes and send them to listen method", (done) => {
    class TestBloc extends CounterBloc {
      protected override listen(state: CounterState): void {
        expect(state.info.data).toBe(0);
        done();
      }
    }

    const bloc = new TestBloc();

    bloc.close();
  });

  describe("BlocBase.select", () => {
    it("should return an observable with selectable state", () => {
      interface User {
        name: {
          first: string;
          last: string;
        };
        age: number;
      }

      class UserState extends BlocState<User> {}
      class UserEvent extends BlocEvent {}
      class UserNameChangedEvent extends UserEvent {
        constructor(public name: { first: string; last: string }) {
          super();
        }
      }
      class UserAgeChangedEvent extends UserEvent {
        constructor(public age: number) {
          super();
        }
      }
      class UserBloc extends Bloc<UserEvent, UserState> {
        constructor() {
          super(
            UserState.init({
              name: {
                first: "",
                last: "",
              },
              age: 0,
            })
          );

          this.on(UserNameChangedEvent, (event, emit) => {
            emit((previousState) => {
              if (previousState.info.hasData) {
                const data = previousState.info.data;
                return UserState.ready({ ...data, name: event.name });
              }
            });
          });

          this.on(UserAgeChangedEvent, (event, emit) => {
            emit((previousState) => {
              if (previousState.info.hasData) {
                const data = previousState.info.data;
                return UserState.ready({ ...data, age: data.age + 1 });
              }
            });
          });
        }

        protected override onError(error: Error): void {
          console.log(error);
        }

        name$ = this.select((data) => data.name);

        age$ = this.select((data) => data.age);
      }

      const userBloc = new UserBloc();

      const names: { first: string; last: string }[] = [];
      const ages: number[] = [];

      userBloc.age$.subscribe({
        next: (age) => ages.push(age),
        complete: () => {
          const [a, b] = ages;

          //expect(a).toBe(0)
        },
      });

      userBloc.name$.subscribe({
        next: (name) => names.push(name),
        complete: () => {
          const [a, b, c] = names;

          /*expect(a.first).toBe("")
          expect(a.last).toBe("")

          expect( b.first ).toBe( "bob" )
          expect(b.last).toBe("parker")

          expect(c.first).toBe("eric")
          expect(c.last).toBe("smith")*/
        },
      });
      userBloc.add(new UserNameChangedEvent({ first: "bob", last: "parker" }));
      userBloc.add(new UserNameChangedEvent({ first: "bob", last: "parker" })); // fast-deep-equal prevents unchanged state from emitting
      userBloc.add(new UserAgeChangedEvent(1));
      userBloc.add(new UserNameChangedEvent({ first: "eric", last: "smith" })); // this should trigger a new state change in name$
      userBloc.close();
    });
  });
});
