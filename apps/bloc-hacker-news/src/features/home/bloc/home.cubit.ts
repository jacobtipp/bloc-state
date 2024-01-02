import { Cubit } from '@jacobtipp/bloc';

export class HomeBloc extends Cubit<{
  previousId?: number;
  currentId: number;
}> {
  constructor() {
    super({ currentId: 9001 });
  }

  incrementId = () =>
    this.emit({
      previousId: this.state.currentId,
      currentId: this.state.currentId + 1,
    });
}
