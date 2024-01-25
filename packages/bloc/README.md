# @jacobtipp/bloc

## Introduction

`@jacobtipp/bloc` is an npm package that helps implement the BLoC (Business Logic only Components) pattern.

## Installation

</br>

```
npm install @jacobtipp/bloc
```

## Creating a Cubit

```ts
export class CounterCubit extends Cubit<number> {
  constructor() {
    super(0); 
  }

  increment() {
    this.emit(this.state + 1);
  }

  decrement() {
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

```ts
export class AppBlocObserver extends BlocObserver {
  override onCreate(bloc: BlocBase<any>): void {
    console.log(`onCreate: ${bloc.name}`);
  }

  override onError(bloc: BlocBase<any>, error: any): void {
    console.log(`onError: ${bloc.name}`, error);
  }

  override onChange(bloc: BlocBase<any>, change: Change<any>): void {
    console.log(`onChange: ${bloc.name}`, change);
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

## Creating a Bloc

```ts
/// The events which `CounterBloc` will react to.
abstract class CounterEvent {
  protected _!: void
}

class CounterIncrementEvent extends CounterEvent {}
class CounterDecrementEvent extends CounterEvent {}

export class CounterBloc extends Bloc<CounterEvent, number> {
  constructor() {
    super(0);

    this.on(CounterIncrementEvent, (event, emit) => emit(this.state + 1));

    this.on(CounterDecrementEvent, (event, emit) => emit(this.state - 1));
  }
}
```

## Using a Bloc

```ts
async function main() {
  const delay = (n) => new Promise((resolve) => setTimeout(resolve, n));

  const counterBloc = new CounterBloc();

  console.log(counterBloc.state); // 0

  counterBloc.add(new CounterIncrementEvent());

  // wait for next tick in event loop
  await delay(0);

  console.log(counterBloc.state); // 1

  counterBloc.close(); // close the bloc when no longer needed
}
```

## Observing a Bloc

```ts
export class AppBlocObserver extends BlocObserver {
  override onCreate(bloc: BlocBase<any>): void {
    console.log(`onCreate: ${bloc.name}`)
  }

  override onEvent(bloc: Bloc<any, any>, event: any): void {
    console.log(`onEvent: ${bloc.name}`)
  }

  override onError(bloc: BlocBase<any>, error: Error): void {
    console.log(`onError: ${bloc.name}`)
  }

  override onChange(bloc: BlocBase<any>, change: Change<any>): void {
    console.log(`onChange: ${bloc.name}`)
  }

  override onTransition(
    bloc: Bloc<any, any>,
    transition: Transition<any, any>
  ): void {
    console.log(`onTransition: ${bloc.name}`)
  }

  override onClose(bloc: BlocBase<any>): void {
    console.log(`onClose: ${bloc.name}`)
  }
}
```