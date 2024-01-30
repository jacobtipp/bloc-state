export declare abstract class QueryEvent {
    protected _: void;
    name: string;
}
export declare class QueryFetchEvent extends QueryEvent {
    readonly abortController: AbortController;
    readonly cancel: boolean;
    name: string;
    constructor(abortController: AbortController, cancel?: boolean);
}
export declare class QueryCancelEvent extends QueryEvent {
    name: string;
}
export declare class SetQueryDataEvent extends QueryEvent {
    name: string;
}
export declare class QueryRevalidateEvent extends QueryEvent {
    name: string;
}
export declare class QueryErrorEvent extends QueryEvent {
    error: any;
    name: string;
    constructor(error: any);
}
