import { Bloc, BlocBase, Transition } from "./";
import { Change } from "./";

export class BlocObserver {
  onEvent(bloc: Bloc<any, any>, event: any): void {
    return;
  }

  onTransition(bloc: Bloc<any, any>, transition: Transition<any, any>): void {
    return;
  }

  onError(bloc: BlocBase<any>, error: any): void {
    return;
  }

  onChange(bloc: BlocBase<any>, change: Change<any>) {
    return;
  }
}
