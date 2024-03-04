# @jacobtipp/bloc

## Introduction

`@jacobtipp/bloc` is an npm package that helps implement the BLoC (Business Logic only Components) pattern.

## Installation

`rxjs` is a peerDependency
</br>
```bash
npm install @jacobtipp/bloc rxjs
```

# Cubit

A cubit is a class that extends `BlocBase` and is a primitive type of `Bloc` that can be extended to manage any type of state.

![Cubit Architecture](https://bloclibrary.dev/assets/cubit_architecture_full.png "Cubit Architecture")

This is similar to stores like `Zustand`. Your Cubit encapsulates state and you have methods of the Cubit that mutate the state by invoking `this.emit`.

## Creating a Cubit

```ts
import { Cubit } from "@jacobtipp/bloc"

export class CounterCubit extends Cubit<number> {
  constructor() {
    super(0); 
  }

  increment(): void {
    this.emit(this.state + 1);
  }

  decrement(): void {
    this.emit(this.state - 1);
  }
}
```

## Using a Cubit

```ts
function main() {
  const counterCubit = new CounterCubit();

  console.log(counterCubit.state); // 0

  counterCubit.increment();

  console.log(counterCubit.state); // 1

  // cubit is closed and disposed, it will no longer emit new state and all observers will be unsubscribed
  cubit.close();
}
```

## Observing a Cubit

When a Cubit emits a new state, a Change occurs. We can observe all changes for a given Cubit by overriding `onChange`.

```ts
import { Cubit } from "@jacobtipp/bloc"

export class CounterCubit extends Cubit<number> {
  constructor() {
    super(0); 
  }

  protected override onChange(change: Change<number>): void {
    console.log(change); // { current: 0, nextState: 1 }
  }
  
  increment(): void {
    this.emit(this.state + 1);
  }

  decrement(): void {
    this.emit(this.state - 1);
  }
}
```


# Bloc

A Bloc is a more advanced class which relies on events to trigger state changes rather than functions. Bloc also extends `BlocBase` which means it has a similar public API as Cubit. However, rather than calling a function on a Bloc and directly emitting a new state, Blocs receive events and convert the incoming events into outgoing states.

![Bloc Architecture](https://bloclibrary.dev/assets/bloc_architecture_full.png "Bloc Architecture")

## Creating a Bloc

```ts
import { Bloc } from "@jacobtipp/bloc"

/// The events which `CounterBloc` will react to.
abstract class CounterEvent {
  protected _!: void
}

class CounterIncrement extends CounterEvent {}

class CounterDecrement extends CounterEvent {}

export class CounterBloc extends Bloc<CounterEvent, number> {
  constructor() {
    super(0);

    this.on(CounterIncrement, (event, emit) => emit(this.state + 1));

    this.on(CounterDecrement, (event, emit) => emit(this.state - 1));
  }
}
```

## Using a Bloc

```ts
async function main() {
  const delay = (n) => new Promise((resolve) => setTimeout(resolve, n));

  const counterBloc = new CounterBloc();

  console.log(counterBloc.state); // 0

  counterBloc.add(new CounterIncrement());

  // wait for next tick in event loop
  await delay(0);

  console.log(counterBloc.state); // 1

  counterBloc.close(); // close the bloc when no longer needed
}
```

## Observing a Bloc

Similar to Cubits, a Bloc can be observed by overriding `onChange`, however, because `Bloc` is event-driven, we are also able to capture information about what triggered the state change.

We can do this by overriding `onTransition`.

The change from one state to another is called a Transition. A Transition consists of the current state, the event, and the next state.

```ts
import { Bloc } from "@jacobtipp/bloc"

export class CounterBloc extends Bloc<CounterEvent, number> {
  constructor() {
    super(0);

    this.on(CounterIncrement, (event, emit) => emit(this.state + 1));

    this.on(CounterDecrement, (event, emit) => emit(this.state - 1));
  }

  protected override onTransition(transition: Transition<CounterEvent, number>): void {
    console.log(transition); // { currentState: 0, event: CounterIncrement, nextState: 1 }
  }
}
```

# Error Handling

Both `Bloc` and `Cubit` have an `addError` and `onError` method. We can indicate that an error has occurred by calling `addError` from anywhere inside our Bloc. We can then react to all errors by overriding onError just as with Cubit.

```ts
import { Bloc } from "@jacobtipp/bloc"

export function assertIsError(error: unknown): asserts error is Error {
  if (!(error instanceof Error)) {
    throw error;
  }
}

export class CounterBloc extends Bloc<CounterEvent, number> {
  constructor(private readonly counterRepo: CounterRepository) {
    super(0);

    this.on(CounterIncrement, this.onIncrement);
  }

  private onIncrement(event: CounterIncrement, emit: Emitter<number>) {
    try {
      await this.counterRepo.increment()
      this.emit(this.state + 1)
    } catch (e: unknown) {
      assertIsError(e);
      addError(e);
    }
  }

  protected override onError(error: Error): void {
    console.log(error: Error) // Error object with stack trace
  }
}
```

# BlocObserver

`BlocObserver` is a class that you can extend to listen to all Blocs/Cubits that exist at runtime. 

This allows you to trace multiple lifecycle events for all Blocs/Cubits.

```ts
// app-bloc-observer.tsx

export class AppBlocObserver extends BlocObserver {
  override onCreate(bloc: BlocBase<any>): void {
    console.log(`onCreate: ${bloc.name}`);
  }

  override onEvent(bloc: Bloc<any, any>, event: any): void {
    console.log(`onEvent: ${bloc.name}`)
  }

  override onError(bloc: BlocBase<any>, error: any): void {
    console.log(`onError: ${bloc.name}`, error);
  }

  override onChange(bloc: BlocBase<any>, change: Change<any>): void {
    console.log(`onChange: ${bloc.name}`, change);
  }

  override onTransition(
    bloc: Bloc<any, any>,
    transition: Transition<any, any>
  ): void {
    console.log(`onTransition: ${bloc.name}`, transition)
  }

  override onClose(bloc: BlocBase<any>): void {
    console.log(`onClose: ${bloc.name}`);
  }
}
```

```ts
// main.tsx
// composition root of your application

BlocObserver.observer = new AppBlocObserver();
```


# Event Transformations

`bloc` has an event sink that allows us to control and transform the incoming flow of events.

For example, if we were building a real-time search, we would probably want to debounce the requests to the backend in order to avoid getting rate-limited as well as to cut down on cost/load on the backend.

With `bloc` we can provide a custom `EventTransformer` to change the way incoming events are processed by the `bloc`.

Event Transformation is only available for `Bloc` and not `Cubit`. 

```ts

import { Bloc, EventMapper, EventTransformer } from '@jacobtipp/bloc';
import { Observable, debounceTime, mergeMap } from 'rxjs';

// A debounce event transformer
export const debounce =
  <Event>(duration: number): EventTransformer<Event> =>
  (events$: Observable<Event>, mapper: EventMapper<Event>): Observable<Event> =>
    events$.pipe(debounceTime(duration), mergeMap(mapper));

export class CounterBloc extends Bloc<CounterEvent, number> {
  constructor() {
    super(0);

    // apply the debounce event transformer to the event handler
    this.on(CounterIncrement, (event, emit) => emit(this.state + 1), debounce(200));
  }
}

```

> ⚠️ **Please refer to the [bloc-concurrency](/bloc-concurrency) package, which has commonly used Event Transformers.**

# Observable
Both `Bloc` and `Cubit` extend `BlocBase` which exposes a `state$` property, which is an `rxjs` observable stream. This can be used to directly subscribe to the state stream.

```ts
function main() {
  const counterCubit = new CounterCubit();

  counterCubit.state$.subscribe((state) => {
    console.log(state); 
  });

  counterCubit.increment();

  cubit.close();
}
```