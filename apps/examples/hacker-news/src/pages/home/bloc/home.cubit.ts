import { Cubit } from '@jacobtipp/bloc';
import { HomeState } from './home.state';

export class HomeBloc extends Cubit<HomeState> {
  constructor() {
    super(
      new HomeState({
        transformer: 'concurrent',
        id: 9001,
      })
    );
  }

  setHomeState = (set: (state: HomeState) => HomeState) =>
    this.emit(set(this.state));

  override fromJson(json: string): HomeState {
    const parsed = super.fromJson(json);
    return new HomeState(parsed.data, parsed.status);
  }
}
