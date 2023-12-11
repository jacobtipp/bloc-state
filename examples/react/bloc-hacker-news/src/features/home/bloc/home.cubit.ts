import { Cubit } from '@jacobtipp/bloc';

export class HomeBloc extends Cubit<number> {
  constructor() {
    super(9001);
  }

  incrementId = () => this.emit(this.state + 1);
}
