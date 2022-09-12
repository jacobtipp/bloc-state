import { CounterState } from "./counter/counter.state";

describe("BlocState", () => {
  let state: CounterState;

  describe("BlocState.payload.initializing", () => {
    it("should set state to maked", () => {
      state = CounterState.init(0);
      expect(state).toBeInstanceOf(CounterState);
      expect(state.payload.initial).toBe(true);
      expect(state.payload.hasData).toBe(true);
      expect(state.payload.data).toBe(0);
      expect(state.payload.loading).toBe(false);
      expect(state.payload.hasError).toBe(false);
      expect(state.payload.error).toBeUndefined();
    });
  });

  describe("BlocState.loading", () => {
    it("should set state to loading", () => {
      state = CounterState.loading();
      expect(state.payload.initial).toBe(false);
      expect(state.payload.hasData).toBe(false);
      expect(state.payload.data).toBeUndefined();
      expect(state.payload.loading).toBe(true);
      expect(state.payload.hasError).toBe(false);
      expect(state.payload.error).toBeUndefined();
    });
  });

  describe("BlocState.ready", () => {
    it("should set state to ready without data", () => {
      state = CounterState.ready();
      expect(state.payload.initial).toBe(false);
      expect(state.payload.data).toBeUndefined();
      expect(state.payload.loading).toBe(false);
      expect(state.payload.hasError).toBe(false);
      expect(state.payload.error).toBeUndefined();
      expect(state.payload.hasData).toBe(false);
    });

    it("should set state to ready with data", () => {
      state = CounterState.ready(0);
      expect(state.payload.initial).toBe(false);
      expect(state.payload.data).toBe(0);
      expect(state.payload.loading).toBe(false);
      expect(state.payload.hasError).toBe(false);
      expect(state.payload.error).toBeUndefined();
      expect(state.payload.hasData).toBe(true);
    });
  });

  describe("BlocState.failed", () => {
    it("should set state to failed", () => {
      const error = new Error("Invalid constructor arguments for Bloc State.");
      state = CounterState.failed(error);
      expect(state.payload.initial).toBe(false);
      expect(state.payload.data).toBeUndefined();
      expect(state.payload.loading).toBe(false);
      expect(state.payload.hasError).toBe(true);
      expect(state.payload.hasData).toBe(false);
      expect(state.payload.error?.message).toBe("Invalid constructor arguments for Bloc State.");
    });
  });
});
