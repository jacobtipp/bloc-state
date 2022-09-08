import { BlocState, Cubit, BlocListener } from "../lib";

describe("BlocListener", () => {
  it("should listen to the state of multiple blocs", (done) => {
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

        this.on(UserState, (state) => {
          if (state.info.hasData) {
            this.uppercaseBloc.emit(UpperCaseState.ready(state.info.data.toUpperCase()));
            expect(state.info.data).toBe("Bob");
          }
        });

        this.on(UpperCaseState, (state) => {
          expect(state.info.data).toBe("BOB");
          done();
        });
      }
    }

    const usernameBloc = new UsernameBloc();
    const uppercaseUsernameBloc = new UpperCaseBloc();
    const usernameListener = new UsernameListener(usernameBloc, uppercaseUsernameBloc).listen();
    uppercaseUsernameBloc.close();
  });
});
