import { CounterState } from "./counter/counter.state";

describe("BlocState", () => {
  let state: CounterState;

  describe("BlocState.info.initializing", () => {
    it("should set state to maked", () => {
      state = CounterState.init(0);
      expect(state).toBeInstanceOf(CounterState);
      expect(state.info.initial).toBe(true);
      expect(state.info.hasData).toBe(true);
      expect(state.info.data).toBe(0);
      expect(state.info.loading).toBe(false);
      expect(state.info.hasError).toBe(false);
      expect(state.info.error).toBeUndefined();
    });
  });

  describe("BlocState.loading", () => {
    it("should set state to loading", () => {
      state = CounterState.loading();
      expect(state.info.initial).toBe(false);
      expect(state.info.hasData).toBe(false);
      expect(state.info.data).toBeUndefined();
      expect(state.info.loading).toBe(true);
      expect(state.info.hasError).toBe(false);
      expect(state.info.error).toBeUndefined();
    });
  });

  describe("BlocState.ready", () => {
    it("should set state to ready without data", () => {
      state = CounterState.ready();
      expect(state.info.initial).toBe(false);
      expect(state.info.data).toBeUndefined();
      expect(state.info.loading).toBe(false);
      expect(state.info.hasError).toBe(false);
      expect(state.info.error).toBeUndefined();
      expect(state.info.hasData).toBe(false);
    });

    it("should set state to ready with data", () => {
      state = CounterState.ready(0);
      expect(state.info.initial).toBe(false);
      expect(state.info.data).toBe(0);
      expect(state.info.loading).toBe(false);
      expect(state.info.hasError).toBe(false);
      expect(state.info.error).toBeUndefined();
      expect(state.info.hasData).toBe(true);
    });
  });

  describe("BlocState.failed", () => {
    it("should set state to failed", () => {
      const error = new Error("Invalid constructor arguments for Bloc State.");
      state = CounterState.failed(error);
      expect(state.info.initial).toBe(false);
      expect(state.info.data).toBeUndefined();
      expect(state.info.loading).toBe(false);
      expect(state.info.hasError).toBe(true);
      expect(state.info.hasData).toBe(false);
      expect(state.info.error?.message).toBe("Invalid constructor arguments for Bloc State.");
    });
  });
});
