import { BlocBase } from "./base";

export abstract class Cubit<State> extends BlocBase<State> {
  constructor(_state: State) {
    super(_state);
  }
}
