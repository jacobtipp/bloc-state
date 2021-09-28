import { Observable, Observer, Subscriber } from "rxjs";

/**
 * * Safely process all items of the async iterator and emit them to observers
 * @param {Subscriber<T>} observer
 * @param {AsyncGenerator<T>} iterator
 * @returns {Promise<void>}
 */
const emitToObserver = async <T>(
  observer: Subscriber<T>,
  iterator: AsyncGenerator<T>
): Promise<void> => {
  try {
    for await (let item of iterator) {
      if (observer.closed) return;
      observer.next(item);
    }
    observer.complete();
  } catch (e) {
    observer.error(e);
  }
};

/**
 * * Take an AsyncGenerator instance and return an Observable that emits each value from the async iterator
 * @param  {AsyncGenerator<T>} asyncGenerator 
 * @returns {Observable<T>}
 */
export function asyncGeneratorToObservable<T>(asyncGenerator: AsyncGenerator<T>): Observable<T> {
  return new Observable<T>((observer) => {
    emitToObserver(observer, asyncGenerator);
  });
}

