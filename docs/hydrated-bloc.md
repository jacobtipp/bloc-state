# @jacobtipp/hydrated-bloc

A package that provides mixins to persist and restore bloc and cubit states. Built to work with `@jacobtipp/bloc` 

## Installation

```
npm install @jacobtipp/hydrated-bloc
```

## Setup

```ts
import { HydratedStorage, HydratedLocalStorage } from "@jacobtipp/hydrated-bloc"

HydratedStorage.storage = new HydratedLocalStorage()

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
```

## HydratedCubit

```ts
import { Cubit } from "@jacobtipp/bloc"
import { WithHydratedCubit } from "@jacobtipp/hydrated-bloc"

// Create a base cubit that extends from Cubit
class CounterCubitBase extends Cubit<number> {}
```

```ts
// Wrap your Cubit with WithHydratedCubit mixin 
class CounterCubit extends WithHydratedCubit(CounterCubitBase) {
  constructor(state: number) {
    super(state);

    // populate the internal state storage with latest state
    // must be called in constructor when using mixin
    this.hydrate();
  }

  increment = () => this.emit(this.state + 1);

  // optionally serialize your state to JSON by overriding toJson
  override toJson(state: number): string {
    return super.toJson(state)
  }

  // optionally deserialize your JSON to state by overriding fromJson
  override fromJson(json: string): number {
    return super.fromJson(json)
  }
}
```

## HydratedBloc

```ts
import { Bloc } from "@jacobtipp/bloc"
import { WithHydratedBloc } from "@jacobtipp/hydrated-bloc"

abstract class CounterEvent {}

class Increment extends CounterEvent {}

// Create a base bloc that extends from Bloc
class CounterBlocBase extends Bloc<CounterEvent, number> {}
```

```ts
// Wrap your Bloc with WithHydratedBloc mixin 
class CounterBloc extends WithHydratedBloc(CounterBlocBase) {
  constructor(state: number) {
    super(state);

    // populate the internal state storage with latest state
    // must be called in constructor when using mixin
    this.hydrate();

    this.on(Increment, (_event, emit) => {
      emit(this.state + 1);
    });
  }

  // optionally serialize your state to JSON by overriding toJson
  override toJson(state: number): string {
    return super.toJson(state)
  }

  // optionally deserialize your JSON to state by overriding fromJson
  override fromJson(json: string): number {
    return super.fromJson(json)
  }
}
```

Now the `CounterCubit` and `CounterBloc` will automatically persist/restore their state. We can increment the counter value, refresh the browser, and the previous state will be retained.

## HydratedMixin

blocs that extend a `WithHydratedCubit` or  `WithHydratedBloc` inherit the the following properties and methods

```ts
interface HydratedMixin<State> {
  id: string;
  storagePrefix: string;
  storageToken: string;
  clear(): Promise<void>;
  fromJson(json: string): State;
  toJson(state: State): string;
  hydrate(): void;
}
```

## Custom Hydrated Storage
If the default `HydratedLocalStorage` doesn't meet your needs, you can always implement a custom `Storage` by simply implementing the `Storage` interface and initializing `HydratedStorage` with the custom `Storage``.

```ts
import { Storage } from "@jacobtipp/hydrated-bloc"

class MyHydratedStorage implements Storage {
  override read(key: string) {
    throw new Error('Method not implemented.');
  }
  override write(key: string, value: any): Promise<void> {
    throw new Error('Method not implemented.');
  }
  override delete(key: string): Promise<void> {
    throw new Error('Method not implemented.');
  }
  override clear(): Promise<void> {
    throw new Error('Method not implemented.');
  }
  override close(): Promise<void> {
    throw new Error('Method not implemented.');
  }
}
```
```ts
HydratedStorage.storage = new MyHydratedStorage()
```
