import { EventTransformer } from '@jacobtipp/bloc';
/**
 * A function that returns a new EventTransformer that uses the `switchMap` operator
 * to transform the input Observable.
 *
 * @template Event - The type of events passed to the Observable.
 * @returns {EventTransformer<Event>} A new EventTransformer that applies the `switchMap` operator
 * to the input Observable and maps each event to an Observable using the provided mapper function.
 */
export declare const restartable: <Event_1>() => EventTransformer<Event_1>;
/**
 * A function that returns a new EventTransformer that uses the `concatMap` operator
 * to transform the input Observable.
 *
 * @template Event - The type of events passed to the Observable.
 * @returns {EventTransformer<Event>} A new EventTransformer that applies the `concatMap` operator
 * to the input Observable and maps each event to an Observable using the provided mapper function.
 */
export declare const sequential: <Event_1>() => EventTransformer<Event_1>;
/**
 * Creates a function that concurrently transforms an observable stream
 * by applying the provided mapper to each event without waiting for completion.
 *
 * @template Event - The type of events in the observable stream.
 * @returns {EventTransformer<Event>} A function that concurrently transforms the observable stream.
 */
export declare const concurrent: <Event_1>() => EventTransformer<Event_1>;
