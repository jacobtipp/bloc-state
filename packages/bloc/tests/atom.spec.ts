import { StateError, bloc } from '../src/lib';
import { delay } from './helpers/delay';

describe('AtomBloc', () => {
  abstract class CounterEvent {}

  class IncrementEvent extends CounterEvent {}
  class DecrementEvent extends CounterEvent {}

  it('should work with actions', () => {
    expect.assertions(4);

    const atom = bloc(0)({
      name: 'CounterBloc',
      actions: (set) => ({
        increment: () => set((state) => state + 1),
        decrement: () => set((state) => state - 1),
        setFive: () => set(5),
      }),
    });

    expect(atom.state).toBe(0);
    atom.increment();
    expect(atom.state).toBe(1);
    atom.decrement();
    expect(atom.state).toBe(0);
    atom.setFive();
    expect(atom.state).toBe(5);

    atom.close();
  });

  it('should have bound actions', () => {
    expect.assertions(4);

    const atom = bloc(0)({
      name: 'CounterBloc',
      actions: (set) => ({
        decrement: () => {
          set((state) => state - 1);
        },
        increment() {
          set((state) => state + 1);
        },
      }),
    });

    const { increment, decrement } = atom;

    expect(atom.state).toBe(0);
    increment();
    expect(atom.state).toBe(1);
    increment();
    expect(atom.state).toBe(2);
    decrement();
    expect(atom.state).toBe(1);
    atom.close();
  });

  it('should have invokable actions within other actions', () => {
    expect.assertions(2);

    const atom = bloc(0)({
      name: 'CounterBloc',
      actions: (set) => ({
        incrementTwice() {
          this.increment().increment();
        },
        increment() {
          set(this.state + 1);
          return this;
        },
      }),
    });

    const { incrementTwice } = atom;

    expect(atom.state).toBe(0);
    incrementTwice();
    expect(atom.state).toBe(2);
    atom.close();
  });

  it('should work with async actions', async () => {
    expect.assertions(4);

    const atom = bloc(0)({
      name: 'CounterBloc',
      actions: (set) => ({
        decrement: async () => {
          await delay(3000);
          set((state) => state - 1);
        },
        increment() {
          set((state) => state + 1);
        },
      }),
    });

    const { increment, decrement } = atom;

    expect(atom.state).toBe(0);
    increment();
    expect(atom.state).toBe(1);
    increment();
    expect(atom.state).toBe(2);
    await decrement();
    expect(atom.state).toBe(1);
    atom.close();
  });

  it('should work with events', () => {
    expect.assertions(3);

    const atom = bloc<CounterEvent, number>(0)({
      name: 'CounterBloc',
    });

    atom.on(IncrementEvent, function (_event, emit) {
      emit(this.state + 1);
    });

    atom.on(DecrementEvent, function (_event, emit) {
      emit(this.state - 1);
    });

    expect(atom.state).toBe(0);

    atom.add(new IncrementEvent());

    expect(atom.state).toBe(1);

    atom.add(new DecrementEvent());

    expect(atom.state).toBe(0);
    atom.close();
  });

  it('should handle errors', () => {
    expect.assertions(2);

    const errorAtom = bloc(0)({
      name: 'ParentCounterBloc',
      actions: (set) => ({
        increment: () => set((state) => state + 1),
      }),
      onError(error) {
        expect(error instanceof StateError).toBe(true);
      },
    });

    errorAtom.close();
    expect(() => {
      errorAtom.increment();
    }).toThrowError(StateError);
  });

  it('should derive state from other blocs', () => {
    expect.assertions(5);

    const parentAtom = bloc(0)({
      name: 'ParentCounterBloc',
      actions: (set) => ({
        increment: () => set((state) => state + 1),
      }),
    });

    const childAtom = bloc<CounterEvent, number>((get) => get(parentAtom) + 1)({
      name: 'ChildCounterBloc',
    });

    const grandChild = bloc((get) => get(childAtom))({
      name: 'GrandChildCounterBloc',
    });

    expect(parentAtom.state).toBe(0);
    expect(childAtom.state).toBe(1);

    parentAtom.increment();
    expect(parentAtom.state).toBe(1);
    expect(childAtom.state).toBe(2);
    expect(grandChild.state).toBe(2);

    parentAtom.close();
    childAtom.close();
  });

  it('should handle all tracing callbacks (onError, onChange, onTransition, onClose', () => {
    expect.assertions(4);
    const atom = bloc<CounterEvent, number>(0)({
      name: 'CounterBloc',
      onChange(change) {
        expect(change.nextState).toBe(1);
      },
      onClose() {
        const hit = true;
        expect(hit).toBe(true);
      },
      onEvent(event) {
        expect(event).toBeInstanceOf(IncrementEvent);
      },
      onTransition(transition) {
        expect(transition.event).toBeInstanceOf(IncrementEvent);
      },
    });

    atom.on(IncrementEvent, function (_event, emit) {
      emit(this.state + 1);
    });

    atom.add(new IncrementEvent());

    atom.close();
  });
});
