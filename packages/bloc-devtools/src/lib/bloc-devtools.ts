import {
  BlocBase,
  BlocObserver,
  Bloc,
  Transition,
  Change,
} from '@jacobtipp/bloc';
import { Observable } from 'rxjs';

type Action = { type: string } & Record<string, any>;
type ActionsDispatcher = Observable<Action>;
interface DevtoolsOptions {
  maxAge?: number;
  name?: string;
  preAction?: () => void;
  actionsDispatcher?: ActionsDispatcher;
  logTrace?: boolean;
}

type Connection = {
  send(data: { type: string } & Record<string, any>, state: any): void;
  init(state: any): void;
  unsubscribe(): void;
  subscribe(
    cb: (message: {
      type: string;
      payload: { type: string };
      state: string;
    }) => void
  ): () => void;
};

type Extension = {
  connect(options?: DevtoolsOptions): Connection;
};

declare global {
  interface Window {
    __REDUX_DEVTOOLS_EXTENSION__: Extension;
  }
}

class DevtoolConnection {
  private lock = false;
  private bloc: BlocBase<any> | undefined = undefined;
  private initialState: any;
  private connectionUnsubscribe: () => void;

  constructor(
    private options: DevtoolsOptions,
    private connectionInstance: Connection
  ) {
    this.connectionUnsubscribe = this.connectionInstance.subscribe(
      (message) => {
        if (message.type === 'DISPATCH') {
          const payloadType = message.payload.type;

          if (payloadType === 'COMMIT') {
            if (this.bloc) {
              this.connectionInstance.init(this.bloc?.state);
              return;
            }
          }

          if (payloadType === 'RESET') {
            if (this.bloc) {
              this.lock = true;
              this.bloc.__unsafeEmit__(this.initialState);
              this.connectionInstance.init(this.bloc?.state);
              return;
            }
          }

          if (
            payloadType === 'JUMP_TO_STATE' ||
            payloadType === 'JUMP_TO_ACTION'
          ) {
            if (this.bloc) {
              this.lock = true;
              this.bloc.__unsafeEmit__(this.bloc.fromJson(message.state));
            }

            //options.postTimelineUpdate?.();
          }
        }
      }
    );
  }

  update = (state: any, action = 'onChange') => {
    if (this.lock) {
      this.lock = false;
      return;
    }

    const name = this.options.name;
    const msg = `[${name}] - ${action}`;

    if (this.options?.logTrace) {
      console.groupCollapsed(msg, state);
      console.trace();
      console.groupEnd();
    }

    this.options?.preAction?.();
    this.send({ type: msg }, state);
  };

  private send = (action: Action, state: any) => {
    this.connectionInstance.send(action, state);
  };

  close() {
    this.connectionInstance.unsubscribe();
    this.connectionUnsubscribe();
  }

  addBloc(bloc: BlocBase<any>, initialState: any) {
    this.bloc = bloc;
    this.initialState = initialState;
    const msg = `[${this.options.name}] - @Init`;
    if (this.options?.logTrace) {
      console.groupCollapsed(msg, initialState);
      console.trace();
      console.groupEnd();
    }

    this.options?.preAction?.();
    this.send({ type: msg }, initialState);
  }

  removeBloc() {
    const name = this.options.name;
    this.send({ type: `[${name}] - onClose` }, this.bloc?.state);
    this.bloc = undefined;
  }
}

export class DevtoolsObserver implements BlocObserver {
  private connections: Map<string, DevtoolConnection> = new Map();
  private isDev = process.env['NODE_ENV'] !== 'production';
  private options: DevtoolsOptions;

  constructor(options?: DevtoolsOptions) {
    const defaultOptions: DevtoolsOptions = {
      name: document.title,
      logTrace: false,
    };

    this.options = { ...defaultOptions, ...options };

    if (this.isDev && !window.__REDUX_DEVTOOLS_EXTENSION__) {
      throw new DevtoolsError(
        'DevtoolsObserver only works with Redux Devtools Extension installed in your web browser'
      );
    }
  }

  onEvent(_bloc: Bloc<any, any>, _event: any): void {
    return;
  }

  onError(_bloc: BlocBase<any>, _error: Error): void {
    return;
  }

  onCreate(bloc: BlocBase<any>, initialState: any): void {
    if (!this.isDev) return;
    this.addBloc(bloc, initialState);
  }

  onTransition(bloc: Bloc<any, any>, transition: Transition<any, any>): void {
    if (!this.isDev) return;
    const connection = this.connections.get(bloc.name);
    const action = transition.event.name ?? transition.event.constructor.name;
    connection?.update(transition.nextState, action);
  }

  onChange(bloc: BlocBase<any>, change: Change<any>): void {
    if (!this.isDev) return;
    if ((bloc as Bloc<any, any>).isBlocInstance) {
      return;
    }

    const connection = this.connections.get(bloc.name);
    connection?.update(change.nextState);
  }

  onClose(bloc: BlocBase<any>): void {
    if (!this.isDev) return;
    const name = bloc.name;
    const connection = this.connections.get(name);

    connection?.removeBloc();
  }

  onDestroy(): void {
    if (!this.isDev) return;
    this.connections.forEach((connection) => {
      connection.close();
    });
    this.connections.clear();
  }

  private addBloc = (bloc: BlocBase<any>, initialState: any) => {
    const name = bloc.name;

    const connection = this.connections.get(name);
    if (connection) {
      return connection.addBloc(bloc, initialState);
    }
    const mergedOptions = { ...this.options, name };

    const connectionInstance =
      window.__REDUX_DEVTOOLS_EXTENSION__.connect(mergedOptions);
    const devtoolConnection = new DevtoolConnection(
      mergedOptions,
      connectionInstance
    );
    devtoolConnection.addBloc(bloc, initialState);

    this.connections.set(name, devtoolConnection);
  };
}

/**
 * Represents an error that occurs when Redux Devtools is not installed in the environment.
 */
export class DevtoolsError extends Error {
  /**
   * Creates an instance of DevtoolsError.
   *
   * @param message The error message.
   */
  constructor(message: string) {
    super(message);

    Object.setPrototypeOf(this, DevtoolsError.prototype);
  }
}
