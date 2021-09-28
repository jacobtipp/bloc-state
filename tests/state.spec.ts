import { CounterState } from "./helper";

describe("BlocState", () => {
  it("should create a new State object with default values", () => {
    let state = new CounterState();

    expect(state.data).toBeNull();
    expect(state.error).toBeNull();
    expect(state.isLoading).toBeFalsy();
    expect(state.hasError).toBeFalsy();
    expect(state.initial).toBeTruthy();
    expect(state.message).toBe("");
  });

  it("should create a new State object with initial data values", () => {
    let state = new CounterState({ value: 1 });
    let state2 = new CounterState({ value: 20 });

    expect(state.data?.value).toBe(1);
    expect(state2.data?.value).toBe(20);
  });

  it("should set correct state when ready", () => {
    let state = new CounterState();
    state.ready({ value: 1 });

    expect(state.hasData).toBeTruthy();
    expect(state.data?.value).toBe(1);
    expect(state.isLoading).toBeFalsy();
    expect(state.hasError).toBeFalsy();
    expect(state.initial).toBeFalsy();
    expect(state.message).toBe("");
    expect(state.isReady).toBeTruthy();
  });

  it("should set correct state when loading", () => {
    let state = new CounterState();
    state.loading();

    expect(state.data).toBeNull();
    expect(state.isLoading).toBeTruthy();
    expect(state.hasError).toBeFalsy();
    expect(state.initial).toBeFalsy();
    expect(state.message).toBe("");
  });

  it("should set correct state when failed", () => {
    let state = new CounterState();
		const errorMessage = "Something bad happened!"
    state.failed(errorMessage, new Error (errorMessage));

		expect(state.isReady).toBeFalsy()
    expect(state.data).toBeNull();
    expect(state.isLoading).toBeFalsy();
    expect(state.hasError).toBeTruthy();
    expect(state.initial).toBeFalsy();
    expect(state.message).toBe(errorMessage);
  });

	it("should only be ready when ready is invoked", () => {
		let state = new CounterState()
		expect(state.isReady).toBeFalsy()
		state.ready({ value: 1 })
		expect(state.isReady).toBeTruthy()
		state.loading()
		expect(state.isReady).toBeFalsy()
	})
});
