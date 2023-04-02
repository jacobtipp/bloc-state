import { StrictMode } from 'react';
import * as ReactDOM from 'react-dom/client';

import App from './app/app';
import {
  BlocObserver,
  BlocBase,
  Bloc,
  Change,
  Transition,
} from '@jacobtipp/bloc';

export class AppBlocObserver extends BlocObserver {
  override onCreate(bloc: BlocBase<any>): void {
    console.log(`created bloc: ${bloc.constructor.name}`);
  }
  override onEvent(_bloc: Bloc<any, any>, event: any): void {
    console.log(event);
  }

  override onError(_bloc: BlocBase<any>, error: any): void {
    console.error(error);
  }

  override onChange(_bloc: BlocBase<any>, change: Change<any>): void {
    console.log(change);
  }

  override onTransition(
    _bloc: Bloc<any, any>,
    _transition: Transition<any, any>
  ): void {
    //console.log(transition.currentState)
    //console.log(transition.nextState)
  }

  override onClose(bloc: BlocBase<any>): void {
    console.log(`closed bloc: ${bloc.constructor.name}`);
  }
}

Bloc.observer = new AppBlocObserver();

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <StrictMode>
    <App />
  </StrictMode>
);
