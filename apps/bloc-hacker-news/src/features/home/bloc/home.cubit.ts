import { Cubit } from '@jacobtipp/bloc';

export class HomeBloc extends Cubit<number> {
  constructor() {
    super(9001);
  }

  setHomeState = (set: (state: number) => number) =>
    this.emit(set(this.state));

}
