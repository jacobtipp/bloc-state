import { Observable, mergeMap, of, takeUntil, timer } from 'rxjs';
import { fromFetch } from 'rxjs/fetch';

export abstract class ApiClient {
  protected fetch<S>(path: string, config?: RequestInit): Observable<S> {
    return fromFetch(`${this.baseUrl}${path}`, {
      ...config,
    }).pipe(
      mergeMap((response) => {
        if (response.ok) {
          return response.json();
        } else {
          return of({ error: true, message: `Error ${response.status}` });
        }
      }),
      takeUntil(timer(10e3)) // wait 10 seconds for response or else close the stream, ending the request
    );
  }

  constructor(private baseUrl: string) {}
}
