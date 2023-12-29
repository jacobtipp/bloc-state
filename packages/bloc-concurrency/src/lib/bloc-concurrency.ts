import { EventMapper, EventTransformer } from '@jacobtipp/bloc';
import { concatMap, Observable, mergeMap, switchMap } from 'rxjs';

/**
 * A function that returns a new EventTransformer that uses the `switchMap` operator
 * to transform the input Observable.
 *
 * @template Event - The type of events passed to the Observable.
 * @returns {EventTransformer<Event>} A new EventTransformer that applies the `switchMap` operator
 * to the input Observable and maps each event to an Observable using the provided mapper function.
 */
export const restartable =
  <Event>(): EventTransformer<Event> =>
  /**
   * Transforms the input observable stream using the `switchMap` operator,
   * applying the provided mapper function to each event.
   *
   * @param {Observable<Event>} events$ - The input observable stream.
   * @param {EventMapper<Event>} mapper - A function to map events.
   * @returns {Observable<Event>} The transformed observable stream.
   */
  (events$: Observable<Event>, mapper: EventMapper<Event>): Observable<Event> =>
    events$.pipe(switchMap(mapper));

/**
 * A function that returns a new EventTransformer that uses the `concatMap` operator
 * to transform the input Observable.
 *
 * @template Event - The type of events passed to the Observable.
 * @returns {EventTransformer<Event>} A new EventTransformer that applies the `concatMap` operator
 * to the input Observable and maps each event to an Observable using the provided mapper function.
 */
export const sequential =
  <Event>(): EventTransformer<Event> =>
  /**
   * Transforms the input observable stream using the `concatMap` operator,
   * applying the provided mapper function to each event.
   *
   * @param {Observable<Event>} events$ - The input observable stream.
   * @param {EventMapper<Event>} mapper - A function to map events.
   * @returns {Observable<Event>} The transformed observable stream.
   */
  (events$: Observable<Event>, mapper: EventMapper<Event>): Observable<Event> =>
    events$.pipe(concatMap(mapper));

/**
 * Creates a function that concurrently transforms an observable stream
 * by applying the provided mapper to each event without waiting for completion.
 *
 * @template Event - The type of events in the observable stream.
 * @returns {EventTransformer<Event>} A function that concurrently transforms the observable stream.
 */
export const concurrent =
  <Event>(): EventTransformer<Event> =>
  /**
   * Concurrently transforms the input observable stream by applying the
   * provided mapper to each event without waiting for completion.
   *
   * @param {Observable<Event>} events$ - The input observable stream.
   * @param {EventMapper<Event>} mapper - A function to map events.
   * @returns {Observable<Event>} The transformed observable stream.
   */
  (events$: Observable<Event>, mapper: EventMapper<Event>): Observable<Event> =>
    events$.pipe(mergeMap(mapper));
