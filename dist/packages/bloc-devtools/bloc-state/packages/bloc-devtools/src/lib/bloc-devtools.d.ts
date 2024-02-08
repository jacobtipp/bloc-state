import { BlocBase, BlocObserver, Bloc, Transition, Change } from '@jacobtipp/bloc';
import { Observable } from 'rxjs';
type Action = {
    type: string;
} & Record<string, any>;
type ActionsDispatcher = Observable<Action>;
interface DevtoolsOptions {
    maxAge?: number;
    name?: string;
    preAction?: () => void;
    actionsDispatcher?: ActionsDispatcher;
    logTrace?: boolean;
}
type Connection = {
    send(data: {
        type: string;
    } & Record<string, any>, state: any): void;
    init(state: any): void;
    unsubscribe(): void;
    subscribe(cb: (message: {
        type: string;
        payload: {
            type: string;
        };
        state: string;
    }) => void): () => void;
};
type Extension = {
    connect(options?: DevtoolsOptions): Connection;
};
declare global {
    interface Window {
        __REDUX_DEVTOOLS_EXTENSION__: Extension;
    }
}
declare class DevtoolConnection {
    private options;
    private connectionInstance;
    private lock;
    private bloc;
    private initialState;
    private connectionUnsubscribe;
    private isClosed;
    constructor(options: DevtoolsOptions, connectionInstance: Connection);
    update: (state: any, action?: string) => void;
    private send;
    close(): void;
    addBloc(bloc: BlocBase<any>, initialState: any): void;
    private removeBloc;
}
export declare class DevtoolsObserver implements BlocObserver {
    static connections: WeakMap<BlocBase<any>, DevtoolConnection>;
    private isDev;
    private isServer;
    private options;
    constructor(options?: DevtoolsOptions);
    onEvent(_bloc: Bloc<any, any>, _event: any): void;
    onError(_bloc: BlocBase<any>, _error: Error): void;
    onCreate(bloc: BlocBase<any>, initialState: any): void;
    onTransition(bloc: Bloc<any, any>, transition: Transition<any, any>): void;
    onChange(bloc: BlocBase<any>, change: Change<any>): void;
    onClose(bloc: BlocBase<any>): void;
    onDestroy(): void;
    private addBloc;
}
/**
 * Represents an error that occurs when Redux Devtools is not installed in the environment.
 */
export declare class DevtoolsError extends Error {
    /**
     * Creates an instance of DevtoolsError.
     *
     * @param message The error message.
     */
    constructor(message: string);
}
export {};
