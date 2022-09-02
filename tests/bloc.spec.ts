import { skip, take } from "rxjs/operators";
import { Bloc, BlocListener, BlocState, Cubit } from "../lib";
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
        expect(state.data).toBe(0);
      },
      complete: () => done(),
    });

    bloc.close();
  });

  it("should map events to state", (done) => {
    const states: CounterState[] = [];
    bloc.state$.pipe(skip(1), take(4)).subscribe({
      next: (state) => {
        states.push(state);
      },
      complete: () => {
        const [first, second, third, fourth] = states;
        expect(first.data).toBe(1);
        expect(second.data).toBe(2);
        expect(third.data).toBe(3);
        expect(fourth.data).toBe(2);
        bloc.close();
        done();
      },
    });
    bloc.addEvent(new IncrementCounterEvent());
    bloc.addEvent(new IncrementCounterEvent());
    bloc.addEvent(new IncrementCounterEvent());
    bloc.addEvent(new DecrementCounterEvent());
  });

  it("should subscribe to state changes and send them to listen method", (done) => {
    class TestBloc extends CounterBloc {
      protected override listen(state: CounterState): void {
        expect(state.data).toBe(0);
        done();
      }
    }

    const bloc = new TestBloc();

    bloc.close();
  });

  describe("BlocListener", () => {
    it("should listen to the state of multiple blocs", () => {
      class UserState extends BlocState<string> {}
      class UsernameBloc extends Cubit<UserState> {
        constructor() {
          super(UserState.ready("Bob"));
        }
      }

      class UpperCaseState extends BlocState<string> {}
      class UpperCaseBloc extends Cubit<UpperCaseState> {
        constructor() {
          super(UpperCaseState.ready(""));
        }
      }

      class UsernameListener extends BlocListener<UsernameBloc | UpperCaseBloc> {
        constructor(private usernameBloc, private uppercaseBloc: UpperCaseBloc) {
          super(usernameBloc, uppercaseBloc);
          this.subscribe();
        }

        protected override listen(state: UserState | UpperCaseState): void {
          if (state instanceof UserState && state.hasData) {
            this.uppercaseBloc.emit(UpperCaseState.ready(state.data.toUpperCase()));
            expect(state.data).toBe("Bob");
          }

          if (state instanceof UpperCaseState) {
            expect(state.data).toBe("BOB");
          }
        }
      }

      const usernameBloc = new UsernameBloc();
      const uppercaseUsernameBloc = new UpperCaseBloc();
      const usernameListener = new UsernameListener(usernameBloc, uppercaseUsernameBloc);
      uppercaseUsernameBloc.close();
    });
  });
});
