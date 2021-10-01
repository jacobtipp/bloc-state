import { BlocError } from "../lib/error";
import { CounterState, CounterStateIncrement } from "./examples";

describe("BlocState", () => {
  let state: CounterState;

  describe("BlocState.initializing", () => {
    it("should set state to initialized", () => {
      state = CounterStateIncrement.initialize(0);
      expect(state).toBeInstanceOf(CounterState);
      expect(state.initial).toBe(true);
      expect(state.data).toBe(0);
      expect(state.isLoading).toBe(false);
      expect(state.hasError).toBe(false);
      expect(state.message).toBe("");
      expect(state.error).toBeUndefined();
    });
  });

  describe("BlocState.loading", () => {
    it("should set state to loading", () => {
      state = CounterStateIncrement.loading();
      expect(state.initial).toBe(false);
      expect(state.data).toBeUndefined();
      expect(state.isLoading).toBe(true);
      expect(state.hasError).toBe(false);
      expect(state.message).toBe("");
      expect(state.error).toBeUndefined();
    });

    it("should optionally set a loading message", () => {
      state = CounterStateIncrement.loading("hello world");
      expect(state.initial).toBe(false);
      expect(state.data).toBeUndefined();
      expect(state.isLoading).toBe(true);
      expect(state.hasError).toBe(false);
      expect(state.message).toBe("hello world");
      expect(state.error).toBeUndefined();
    });
  });

  describe("BlocState.ready", () => {
    it("should set state to ready", () => {
      state = CounterStateIncrement.ready();
      expect(state.initial).toBe(false);
      expect(state.data).toBeUndefined();
      expect(state.isLoading).toBe(false);
      expect(state.hasError).toBe(false);
      expect(state.message).toBe("");
      expect(state.error).toBeUndefined();
    });

    it("should optionally set data on ready", () => {
      state = CounterStateIncrement.ready(0);
      expect(state.initial).toBe(false);
      expect(state.data).toBe(0);
      expect(state.isLoading).toBe(false);
      expect(state.hasError).toBe(false);
      expect(state.message).toBe("");
      expect(state.error).toBeUndefined();
    });
  });

  describe("BlocState.failed", () => {
    it("should set state to failed", () => {
      const error = new BlocError("failed bloc state");
      state = CounterStateIncrement.failed(error.message, error);
      expect(state.initial).toBe(false);
      expect(state.data).toBeUndefined();
      expect(state.isLoading).toBe(false);
      expect(state.hasError).toBe(true);
      expect(state.message).toBe("failed bloc state");
      expect(state.error).toBeInstanceOf(BlocError);
    });
  });
});
