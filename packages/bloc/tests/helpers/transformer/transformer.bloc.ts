import { switchMap } from 'rxjs/operators';
import { Bloc, EventTransformer } from '../../../src';
import { delay } from '../delay';
import {
  EventTransformerEvent,
  EventTransformerRestartableEvent,
  SecondEventTransformerRestartableEvent,
} from './transformer.event';

export const restartable =
  <Event>(): EventTransformer<Event> =>
  (events$, mapper) =>
    events$.pipe(switchMap(mapper));

export class EventTransformerBloc extends Bloc<EventTransformerEvent, number> {
  constructor() {
    super(0);

    this.on(
      EventTransformerRestartableEvent,
      async (event, emit) => {
        await delay(500);
        emit(event.num);
      },
      restartable()
    );
  }
}

export class GlobalEventTransformerBloc extends Bloc<
  EventTransformerEvent,
  number
> {
  constructor() {
    super(0, { transformer: restartable() });

    this.on(EventTransformerRestartableEvent, async (event, emit) => {
      await delay(500);
      emit(event.num);
    });
    this.on(SecondEventTransformerRestartableEvent, async (event, emit) => {
      await delay(500);
      emit(-event.num);
    });
  }
}
