import { BlocEvent, EventTransformer } from '@jacobtipp/bloc';
import { concatMap, mergeMap, switchMap } from 'rxjs';

/**
 * A function that returns a new EventTransformer that uses the `switchMap` operator to transform the input Observable.
 * @typeparam Event The type of events passed to the Observable.
 * @returns A new EventTransformer that applies the `switchMap` operator to the input Observable and maps each event to an Observable using the provided mapper function.
 */
export const restartable =
  <Event extends BlocEvent>(): EventTransformer<Event> =>
  (events$, mapper) =>
    events$.pipe(switchMap(mapper));

/**
 * A function that returns a new EventTransformer that uses the `concatMap` operator to transform the input Observable.
 * @typeparam Event The type of events passed to the Observable.
 * @returns A new EventTransformer that applies the `concatMap` operator to the input Observable and maps each event to an Observable using the provided mapper function.
 */
export const sequential =
  <Event extends BlocEvent>(): EventTransformer<Event> =>
  (events$, mapper) =>
    events$.pipe(concatMap(mapper));

/**
 * A function that returns a new EventTransformer that uses the `mergeMap` operator to transform the input Observable.
 * @typeparam Event The type of events passed to the Observable.
 * @returns A new EventTransformer that applies the `mergeMap` operator to the input Observable and maps each event to an Observable using the provided mapper function.
 */
export const concurrent =
  <Event extends BlocEvent>(): EventTransformer<Event> =>
  (events$, mapper) =>
    events$.pipe(mergeMap(mapper));
