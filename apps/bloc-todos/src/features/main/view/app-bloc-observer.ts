import { BlocBase } from '@jacobtipp/bloc';
import { DevtoolsObserver } from '@jacobtipp/bloc-devtools';

export class AppBlocObserver extends DevtoolsObserver {
  override onError(_bloc: BlocBase<any>, error: Error): void {
    console.error(error.name, {
      error: error,
    });
  }
}
