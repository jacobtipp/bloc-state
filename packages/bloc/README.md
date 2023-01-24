# @bloc-state/bloc

[![npm version](https://badgen.net/npm/v/@bloc-state/bloc?color=black)](https://npm.im/@bloc-state/bloc)
[![Codecov](https://badgen.net/codecov/c/github/bloc-state/bloc?color=black)](https://app.codecov.io/gh/bloc-state/bloc)
[![Codecov](https://badgen.net/npm/license/@bloc-state/bloc?color=black)](https://raw.githubusercontent.com/bloc-state/bloc/main/LICENSE)

## Introduction

`@bloc-state/bloc` is a state management library implementing the BLoC pattern that was first introduced
by google at [DartConf](https://www.youtube.com/watch?v=PLHln7wHgPE) in 2018. This library conforms to the
modern [Dart Bloc library](https://github.com/felangel/bloc/) `v8.x` api.

## Installation

</br>

```
npm install @bloc-state/bloc rxjs
```

## Creating a Cubit

```ts
export class CounterCubit extends Cubit<number> {
  constructor() {
    super(0) // pass initial state to super constructor
  }

  increment() {
    this.emit((state) => state + 1)
  }

  increment() {
    this.emit((state) => state - 1)
  }
}
```

## Using a Cubit

```ts
const counterCubit = new CounterCubit()

console.log(counterCubit.state) // 0

counterCubit.increment()

console.log(counterCubit.state) // 1

// cubit is closed and disposed, it will no longer emit new state and all observers will be unsubscribed
cubit.close()
```

## Observing a Cubit

```ts
export class AppBlocObserver extends BlocObserver {
  override onCreate(bloc: BlocBase<any>): void {
    console.log(`onCreate: ${bloc.constructor.name}`)
  }

  override onError(bloc: BlocBase<any>, error: any): void {
    console.log(`onError: ${bloc.constructor.name}`, error)
  }

  override onChange(bloc: BlocBase<any>, change: Change<any>): void {
    console.log(`onChange: ${bloc.constructor.name}`, change)
  }

  override onClose(bloc: BlocBase<any>): void {
    console.log(`onClose: ${bloc.constructor.name}`)
  }
}
```

```ts
// main.tsx

// composition root of your application
Bloc.observer = AppBlocObserver()
```

## Creating a Bloc

```ts
/// The events which `CounterBloc` will react to.
abstract class CounterEvent extends BlocEvent {}

class CounterIncrementEvent extends CounterEvent {}
class CounterDecrementEvent extends CounterEvent {}

export class CounterBloc extends Bloc<CounterEvent, number> {
  constructor() {
    super(new CounterState(0))

    this.on(CounterIncrementEvent, (event, emit) => emit((state) => state + 1))

    this.on(CounterDecrementEvent, (event, emit) => emit((state) => state - 1))
  }
}
```

## Using a Bloc

```ts
async function main() {
  const delay = (n) => new Promise((resolve) => setTimeout(resolve, n))

  const counterBloc = new CounterBloc()

  console.log(counterBloc.state) // 0

  counterBloc.add(new CounterIncrementEvent())

  // wait for next tick in event loop
  await delay(0)

  console.log(counterBloc.state) // 1

  counterBloc.close() // close the bloc when no longer needed
}
```
