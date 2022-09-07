import { BlocBase } from "./base";
import { BlocState } from "./state";

export abstract class Cubit<State> extends BlocBase<State> {
  constructor(_state: State) {
    super(_state);
  }
}
