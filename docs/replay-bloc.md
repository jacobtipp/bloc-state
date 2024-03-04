# @jacobtipp/replay-bloc

A package that provides mixins which adds automatic undo and redo support and cubit states. Built to work with `@jacobtipp/bloc`.

## Installation

```
npm install @jacobtipp/replay-bloc
```


## Usage

## Creating a `ReplayCubit`

```ts
import { Cubit } from "@jacobtipp/bloc"
import { WithReplayCubit } from "@jacobtipp/replay-bloc"
// 
// Create a base cubit that extends from Cubit
class CounterCubitBase extends Cubit<number> {}
```

```ts
// Wrap your Cubit with WithReplayCubit mixin 
class CounterCubit extends WithReplayCubit(CounterCubitBase) {
  increment = () => this.emit(this.state + 1);
}
```

## Using a `ReplayCubit`

```ts
function main() {
  const cubit = new CounterCubit(0);

  // trigger a state change
  cubit.increment();
  console.log(cubit.state); // 1

  // undo a change
  cubit.undo();
  console.log(cubit.state); // 0

  // redo the change
  cubit.redo();
  console.log(cubit.state) // 1
}
```

If you wish to be able to use a `WithReplayCubit` in conjuction with a different type of mixin like `WithHydratedCubit`, you can compose multiple mixins together.

```ts
import { Cubit } from "@jacobtipp/bloc"
import { WithReplayCubit } from "@jacobtipp/replay-bloc"
import { WithHydratedCubit } from "@jacobtipp/hydrated-bloc"

// Create a base cubit that extends from Cubit
class CounterCubitBase extends Cubit<number> {}

const ReplayAndHydrated = WithHydratedCubit(WithReplayCubit(CounterCubitBase)) 

class CounterCubit extends ReplayAndHydrated {
  constructor(count: number) {
    super(count)
    this.hydrate()
  }

  increment = () => this.emit(this.state + 1)

  undoIncrement = () => this.undo()
}
```


## Creating a `ReplayBloc`

```ts
import { Bloc } from "@jacobtipp/bloc"
import { WithReplayBloc } from "@jacobtipp/replay-bloc"
// events
abstract class CounterEvent extends ReplayEvent {}

class Increment extends CounterEvent {}

// Create a base bloc that extends from Bloc
class CounterBlocBase extends Bloc<CounterEvent, number> {}
```

```ts
// Wrap your Bloc with WithReplayBloc mixin 
class CounterBloc extends WithReplayBloc(CounterBlocBase) {
  constructor(count: number) {
    super(count)

    this.on(Increment, (event, emit) => emit(this.state + 1))
  }
}
```

## Using a `ReplayBloc`

```ts
function main() {
  const bloc = new CounterBloc(0);

  // trigger a state change
  bloc.add(new Increment())
  await delay(1000) // wait for event to be handled
  console.log(bloc.state); // 1

  // undo a change
  bloc.undo();
  console.log(bloc.state); // 0

  // redo the change
  bloc.redo();
  console.log(bloc.state) // 1
}
```

If you wish to be able to use a `WithReplayBloc` in conjuction with a different type of mixin like `WithHydratedBloc`, you can compose multiple mixins together.

```ts
// events
import { Bloc } from "@jacobtipp/bloc"
import { WithReplayBloc } from "@jacobtipp/replay-bloc"
import { WithHydratedBloc } from "@jacobtipp/hydrated-bloc"

abstract class CounterEvent extends ReplayEvent {}

class Increment extends CounterEvent {}

// Create a base bloc that extends from Bloc
class CounterBlocBase extends Bloc<CounterEvent, number> {}

const ReplayAndHydrated = WithHydratedBloc(WithReplayBloc(CounterBlocBase)) 

class CounterBloc extends ReplayAndHydrated {
  constructor(count: number) {
    super(count)
    this.hydrate()
  }

  undoIncrement = () => this.undo()
}
```
