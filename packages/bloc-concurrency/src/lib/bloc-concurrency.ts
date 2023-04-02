import { BlocEvent, EventTransformer } from '@jacobtipp/bloc';
import { concatMap, mergeMap, switchMap } from 'rxjs';

export const restartable =
  <E extends BlocEvent>(): EventTransformer<E> =>
  (events$, mapper) =>
    events$.pipe(switchMap(mapper));

export const sequential =
  <E extends BlocEvent>(): EventTransformer<E> =>
  (events$, mapper) =>
    events$.pipe(concatMap(mapper));

export const concurrent =
  <E extends BlocEvent>(): EventTransformer<E> =>
  (events$, mapper) =>
    events$.pipe(mergeMap(mapper));
