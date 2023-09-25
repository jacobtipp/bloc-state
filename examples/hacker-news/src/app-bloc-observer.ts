import {
  BlocObserver,
  BlocBase,
  Bloc,
  Change,
  Transition,
} from '@jacobtipp/bloc';

export class AppBlocObserver extends BlocObserver {
  override onCreate(_bloc: BlocBase<any>): void {
    return;
  }

  override onEvent(_bloc: Bloc<any, any>, _event: any): void {
    return;
  }

  override onError(_bloc: BlocBase<any>, _error: Error): void {
    return;
  }

  override onChange(_bloc: BlocBase<any>, _change: Change<any>): void {
    return;
  }

  override onTransition(
    _bloc: Bloc<any, any>,
    _transition: Transition<any, any>
  ): void {
    return;
  }

  override onClose(bloc: BlocBase<any>): void {
    console.log(`closed bloc: ${bloc.constructor.name}`);
  }
}
