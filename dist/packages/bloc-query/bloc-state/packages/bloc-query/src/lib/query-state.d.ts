export type Initial<Data> = {
    isInitial: true;
    lastUpdatedAt: number;
    isLoading: false;
    isFetching: false;
    isReady: true;
    isError: false;
    isCanceled: boolean;
    status: 'isInitial';
    data: Data;
};
export type Loading<Data> = {
    isInitial: false;
    lastUpdatedAt: number;
    isLoading: true;
    isFetching: true;
    isReady: false;
    isError: false;
    isCanceled: boolean;
    status: 'isLoading';
    data?: Data;
};
export type Fetching<Data> = {
    isInitial: false;
    lastUpdatedAt: number;
    isLoading: false;
    isFetching: true;
    isReady: false;
    isError: false;
    isCanceled: boolean;
    status: 'isFetching';
    data?: Data;
};
export type Ready<Data> = {
    isInitial: false;
    lastUpdatedAt: number;
    isLoading: false;
    isFetching: false;
    isReady: true;
    isError: false;
    isCanceled: boolean;
    status: 'isReady';
    data: Data;
};
export type Failed<Data> = {
    isInitial: false;
    lastUpdatedAt: number;
    isLoading: false;
    isFetching: false;
    isReady: false;
    isError: true;
    isCanceled: boolean;
    status: 'isError';
    data?: Data;
    error: Error;
};
export type QueryState<Data> = Initial<Data> | Loading<Data> | Fetching<Data> | Ready<Data> | Failed<Data>;
