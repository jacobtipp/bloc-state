import { isStateInstance } from '../src';
import { CounterState } from './helpers/counter/counter.state';
import { TodoState } from './helpers/todo/todo.state';

describe('State', () => {
  let state: CounterState;

  beforeEach(() => {
    state = new CounterState(0);
  });

  describe('State creation', () => {
    it('should set state to initial', () => {
      expect.assertions(4);
      expect(state).toBeInstanceOf(CounterState);
      expect(state.status).toBe('initial');
      expect(state.data).toBe(0);
      expect(state.error).toBeUndefined();
    });
  });

  describe('State.ready', () => {
    it('should set state to ready', () => {
      expect.assertions(17);
      const readyState = state.ready(state.data + 3);
      expect(readyState).toBeInstanceOf(CounterState);
      expect(readyState.status).toBe('ready');
      expect(readyState.data).toBe(3);
      expect(readyState === state).toBe(false);

      const readyState2 = readyState.ready();
      expect(readyState2).toBeInstanceOf(CounterState);
      expect(readyState2.status).toBe('ready');
      expect(readyState2.data).toBe(3);
      expect(readyState2 === readyState).toBe(true);

      const referenceTypeState = new TodoState({
        id: 0,
        title: 'go to work',
      });

      expect(referenceTypeState).toBeInstanceOf(TodoState);
      expect(referenceTypeState.data.id).toBe(0);
      expect(referenceTypeState.data.title).toBe('go to work');

      const referenceTypeState2 = referenceTypeState.ready();
      expect(referenceTypeState === referenceTypeState2).toBe(false);
      expect(referenceTypeState2.data === referenceTypeState.data).toBe(true);

      const primitiveState = state.ready(2);
      expect(primitiveState.data).toBe(2);
      expect(primitiveState.status).toBe('ready');
      expect(primitiveState === state).toBe(false);

      const nonPrimitiveWithDraftState = referenceTypeState.ready((todo) => {
        todo.id = 5;
      });

      expect(nonPrimitiveWithDraftState.data !== referenceTypeState.data).toBe(
        true
      );
    });
  });

  describe('State.loading', () => {
    it('should set state to loading', () => {
      expect.assertions(4);
      const loading = state.loading();
      expect(loading).toBeInstanceOf(CounterState);
      expect(loading.status).toBe('loading');
      expect(loading.data).toBe(0);
      expect(loading === state).toBe(false);
    });
  });

  describe('State.failed', () => {
    it('should set state to failed', () => {
      expect.assertions(10);
      const failed = state.failed(new Error('operation has failed'));
      expect(failed).toBeInstanceOf(CounterState);
      expect(failed.error).toBeDefined();
      expect(failed.error?.message).toBe('operation has failed');
      expect(failed.data).toBe(state.data);
      expect(failed === state).toBe(false);

      const failed2 = failed.failed();
      expect(failed2).toBeInstanceOf(CounterState);
      expect(failed2.error).toBeUndefined();
      expect(failed2.error?.message).toBeUndefined();
      expect(failed2.data).toBe(failed.data);
      expect(failed2 === failed).toBe(false);
    });

    it('should set error to undefined when transitioning from failed state with error', () => {
      expect.assertions(7);
      const failed = state.failed(new Error('operation has failed'));
      expect(failed).toBeInstanceOf(CounterState);
      expect(failed.error).toBeDefined();
      expect(failed?.error?.message).toBe('operation has failed');

      const readyState = failed.ready();
      expect(readyState.error).toBeUndefined();
      expect(readyState.data).toBe(0);

      const loadingState = failed.loading();
      expect(loadingState.error).toBeUndefined();
      expect(loadingState.data).toBe(0);
    });
  });

  describe('State.copyWith', () => {
    it('should perform immer produce for the entire state object', () => {
      enum CustomTodoStatus {
        todoLoading,
        todoSuccess,
      }
      class CustomTodoState extends TodoState {
        customStatus = CustomTodoStatus.todoLoading;
      }

      const customState = new CustomTodoState({
        id: 0,
        title: 'custom title',
      });

      expect(customState.status).toBe('initial');
      expect(customState.customStatus).toBe(CustomTodoStatus.todoLoading);

      const customStateLoading = customState.copyWith((state) => {
        state.customStatus = CustomTodoStatus.todoLoading;
      });

      expect(customState === customStateLoading).toBe(true);

      const customStateSuccess = customStateLoading.copyWith((state) => {
        state.customStatus = CustomTodoStatus.todoSuccess;
      });

      expect(customStateSuccess === customStateLoading).toBe(false);
      expect(customStateSuccess.data === customStateLoading.data).toBe(true);

      const customStateSuccessWithNewData = customStateSuccess.copyWith(
        (state) => {
          state.data.id = 2;
        }
      );

      expect(customStateSuccessWithNewData === customStateSuccess).toBe(false);
      expect(
        customStateSuccessWithNewData.data === customStateSuccess.data
      ).toBe(false);
    });
  });

  describe('State.name', () => {
    it('should accept an optional name that can be used instead of constructor name', () => {
      expect.assertions(2);
      const specialState = new CounterState(0, 'SpecialCounterState');
      expect(state.name).toBe('CounterState');
      expect(specialState.name).toBe('SpecialCounterState');
    });
  });

  describe('isStateInstance function', () => {
    it('should return true only if an object is an instance of State', () => {
      expect.assertions(2);
      class Test {}
      const test = new Test();
      expect(isStateInstance(state)).toBe(true);
      expect(isStateInstance(test)).toBe(false);
    });
  });
});
