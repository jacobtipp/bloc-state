import { Bloc } from '@jacobtipp/bloc';
import { State } from '@jacobtipp/state';
import { startWith } from 'rxjs';
import { restartable, sequential, concurrent } from '../src';
import { delay } from './helpers/delay';

describe('transformers', () => {
  abstract class TransformerEvent {}
  class SequentialEvent extends TransformerEvent {}
  class RestartableEvent extends TransformerEvent {
    constructor(public num: number = 1) {
      super();
    }
  }
  class ConcurrentEvent extends TransformerEvent {}

  class TransformerState extends State<number> {}

  class EventTransformerBloc extends Bloc<TransformerEvent, TransformerState> {
    constructor() {
      super(new TransformerState(0));

      this.on(
        SequentialEvent,
        async (_event, emit) => {
          await delay(500);
          emit(this.state.ready(this.state.data + 1));
        },
        sequential()
      );

      this.on(
        RestartableEvent,
        async (event, emit) => {
          await delay(500);
          emit(this.state.ready(event.num));
        },
        restartable()
      );

      this.on(
        ConcurrentEvent,
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
      const states: TransformerState[] = [];
      transformerBloc.state$.pipe(startWith(transformerBloc.state)).subscribe({
        next: (state) => {
          states.push(state);
        },
      });

      expect(states.length).toBe(1);
      transformerBloc.add(new SequentialEvent());
      transformerBloc.add(new SequentialEvent());
      transformerBloc.add(new SequentialEvent());
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
      const states: TransformerState[] = [];
      transformerBloc.state$.pipe(startWith(transformerBloc.state)).subscribe({
        next: (state) => states.push(state),
      });

      expect(states.length).toBe(1);
      transformerBloc.add(new RestartableEvent());
      transformerBloc.add(new RestartableEvent());
      transformerBloc.add(new RestartableEvent());
      transformerBloc.add(new RestartableEvent());
      transformerBloc.add(new RestartableEvent(2));
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
      const states: TransformerState[] = [];
      transformerBloc.state$.pipe(startWith(transformerBloc.state)).subscribe({
        next: (state) => states.push(state),
      });

      expect(states.length).toBe(1);
      transformerBloc.add(new ConcurrentEvent());
      transformerBloc.add(new ConcurrentEvent());
      transformerBloc.add(new ConcurrentEvent());
      transformerBloc.add(new ConcurrentEvent());
      transformerBloc.add(new ConcurrentEvent());
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
