export type initial<Data> = {
  isInitial: true;
  lastUpdatedAt: number;
  isLoading: false;
  isFetching: false;
  isReady: true;
  isError: false;
  status: 'isInitial';
  data: Data;
};

export type loading<Data> = {
  isInitial: false;
  lastUpdatedAt: number;
  isLoading: true;
  isFetching: true;
  isReady: false;
  isError: false;
  status: 'isLoading';
  data?: Data;
};

export type fetching<Data> = {
  isInitial: false;
  lastUpdatedAt: number;
  isLoading: false;
  isFetching: true;
  isReady: false;
  isError: false;
  status: 'isFetching';
  data?: Data;
};

export type ready<Data> = {
  isInitial: false;
  lastUpdatedAt: number;
  isLoading: false;
  isFetching: false;
  isReady: true;
  isError: false;
  status: 'isReady';
  data: Data;
};

export type failed<Data> = {
  isInitial: false;
  lastUpdatedAt: number;
  isLoading: false;
  isFetching: false;
  isReady: false;
  isError: true;
  status: 'isError';
  data?: Data;
  error: Error;
};

export type QueryState<Data> =
  | initial<Data>
  | loading<Data>
  | fetching<Data>
  | ready<Data>
  | failed<Data>;
