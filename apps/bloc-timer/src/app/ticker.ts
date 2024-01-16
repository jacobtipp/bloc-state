import { timer, scan, takeWhile } from 'rxjs';

export class Ticker {
  tick(duration: number) {
    return timer(0, 1000).pipe(
      scan((acc) => --acc, duration),
      takeWhile((x) => x >= 0)
    );
  }
}
