import { Observable, Subscriber } from "rxjs";

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

export function asyncGeneratorToObservable<T>(asyncGenerator: AsyncGenerator<T>): Observable<T> {
  return new Observable<T>((observer) => {
    emitToObserver(observer, asyncGenerator);
  });
}
