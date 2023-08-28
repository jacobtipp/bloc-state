import { Bloc } from '@jacobtipp/bloc';
import { State } from '@jacobtipp/state';
import { startWith } from 'rxjs';
import { restartable, sequential, concurrent } from '../src';
import { delay } from './helpers/delay';

describe('transformers', () => {
  abstract class EventTransformerEvent {}
  class EventTransformerSequentialEvent extends EventTransformerEvent {}
  class EventTransformerRestartableEvent extends EventTransformerEvent {
    constructor(public num: number = 1) {
      super();
    }
  }
  class EventTransformerconcurrentEvent extends EventTransformerEvent {}

  class EventTransformerState extends State<number> {}

  class EventTransformerBloc extends Bloc<
    EventTransformerEvent,
    EventTransformerState
  > {
    constructor() {
      super(new EventTransformerState(0));

      this.on(
        EventTransformerSequentialEvent,
        async (_event, emit) => {
          await delay(500);
          emit(this.state.ready(this.state.data + 1));
        },
        sequential()
      );

      this.on(
        EventTransformerRestartableEvent,
        async (event, emit) => {
          await delay(500);
          emit(this.state.ready(event.num));
        },
        restartable()
      );

      this.on(
        EventTransformerconcurrentEvent,
        async (_event, emit) => {
          await delay(500);
          emit(this.state.ready(this.state.data + 1));
        },
        concurrent()
      );
    }
  }

  let transformerBloc: EventTransformerBloc;

  beforeEach(() => {
    transformerBloc = new EventTransformerBloc();
  });

  afterEach(() => {
    transformerBloc.close();
  });

  describe('sequential', () => {
    it('should process each event sequentially, additional events added should be queued while processing current event', async () => {
      expect.assertions(4);
      const states: EventTransformerState[] = [];
      transformerBloc.state$.pipe(startWith(transformerBloc.state)).subscribe({
        next: (state) => {
          states.push(state);
        },
      });

      expect(states.length).toBe(1);
      transformerBloc.add(new EventTransformerSequentialEvent());
      transformerBloc.add(new EventTransformerSequentialEvent());
      transformerBloc.add(new EventTransformerSequentialEvent());
      await delay(600);
      expect(states.length).toBe(2);
      await delay(600);
      expect(states.length).toBe(3);
      await delay(600);
      expect(states.length).toBe(4);
    });
  });

  describe('restartable', () => {
    it('should process each event until completion or until a new event comes in', async () => {
      expect.assertions(5);
      const states: EventTransformerState[] = [];
      transformerBloc.state$.pipe(startWith(transformerBloc.state)).subscribe({
        next: (state) => states.push(state),
      });

      expect(states.length).toBe(1);
      transformerBloc.add(new EventTransformerRestartableEvent());
      transformerBloc.add(new EventTransformerRestartableEvent());
      transformerBloc.add(new EventTransformerRestartableEvent());
      transformerBloc.add(new EventTransformerRestartableEvent());
      transformerBloc.add(new EventTransformerRestartableEvent(2));
      await delay(600);
      const [first, second] = states;
      expect(states.length).toBe(2);
      expect(first.data).toBe(0);
      expect(second.data).toBe(2);
      expect(second.status).toBe('ready');
    });
  });

  describe('concurrent', () => {
    it('should process each event until completion or until a new event comes in', async () => {
      expect.assertions(8);
      const states: EventTransformerState[] = [];
      transformerBloc.state$.pipe(startWith(transformerBloc.state)).subscribe({
        next: (state) => states.push(state),
      });

      expect(states.length).toBe(1);
      transformerBloc.add(new EventTransformerconcurrentEvent());
      transformerBloc.add(new EventTransformerconcurrentEvent());
      transformerBloc.add(new EventTransformerconcurrentEvent());
      transformerBloc.add(new EventTransformerconcurrentEvent());
      transformerBloc.add(new EventTransformerconcurrentEvent());
      await delay(600);
      const [first, second, third, fourth, fifth, sixth] = states;
      expect(states.length).toBe(6);
      expect(first.data).toBe(0);
      expect(second.data).toBe(1);
      expect(third.data).toBe(2);
      expect(fourth.data).toBe(3);
      expect(fifth.data).toBe(4);
      expect(sixth.data).toBe(5);
    });
  });
});
