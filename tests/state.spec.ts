import { BlocError, InvalidConstructorArgumentsError } from "../lib/error";
import { CounterState } from "./examples/counter";

describe("BlocState", () => {
  let state: CounterState;

  describe("BlocState.initializing", () => {
    it("should set state to initialized", () => {
      state = CounterState.initialize(0);
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
      state = CounterState.loading();
      expect(state.initial).toBe(false);
      expect(state.data).toBeUndefined();
      expect(state.isLoading).toBe(true);
      expect(state.hasError).toBe(false);
      expect(state.message).toBe("");
      expect(state.error).toBeUndefined();
    });

    it("should optionally set a loading message", () => {
      state = CounterState.loading("hello world");
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
      state = CounterState.ready();
      expect(state.initial).toBe(false);
      expect(state.data).toBeUndefined();
      expect(state.isLoading).toBe(false);
      expect(state.hasError).toBe(false);
      expect(state.message).toBe("");
      expect(state.error).toBeUndefined();
    });

    it("should optionally set data on ready", () => {
      state = CounterState.ready(0);
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
      const error = new InvalidConstructorArgumentsError()
      state = CounterState.failed(error.message, error);
      expect(state.initial).toBe(false);
      expect(state.data).toBeUndefined();
      expect(state.isLoading).toBe(false);
      expect(state.hasError).toBe(true);
      expect(state.message).toBe("Invalid constructor arguments for Bloc State.");
      expect(state.error).toBeInstanceOf(BlocError);
    });
  });
});
