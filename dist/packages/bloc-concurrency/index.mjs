import { switchMap as t, concatMap as c, mergeMap as o } from "rxjs";
const a = () => (
  /**
   * Transforms the input observable stream using the `switchMap` operator,
   * applying the provided mapper function to each event.
   *
   * @param {Observable<Event>} events$ - The input observable stream.
   * @param {EventMapper<Event>} mapper - A function to map events.
   * @returns {Observable<Event>} The transformed observable stream.
   */
  (e, p) => e.pipe(t(p))
), n = () => (
  /**
   * Transforms the input observable stream using the `concatMap` operator,
   * applying the provided mapper function to each event.
   *
   * @param {Observable<Event>} events$ - The input observable stream.
   * @param {EventMapper<Event>} mapper - A function to map events.
   * @returns {Observable<Event>} The transformed observable stream.
   */
  (e, p) => e.pipe(c(p))
), i = () => (
  /**
   * Concurrently transforms the input observable stream by applying the
   * provided mapper to each event without waiting for completion.
   *
   * @param {Observable<Event>} events$ - The input observable stream.
   * @param {EventMapper<Event>} mapper - A function to map events.
   * @returns {Observable<Event>} The transformed observable stream.
   */
  (e, p) => e.pipe(o(p))
);
export {
  i as concurrent,
  a as restartable,
  n as sequential
};
