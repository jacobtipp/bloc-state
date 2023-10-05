# @jacobtipp/bloc-concurrency

## Installation

```
npm install @jacobtipp/bloc-concurrency
```

## Event Transformers

`bloc_concurrency` provides an opinionated set of event transformers:

- `concurrent` - process events concurrently
- `sequential` - process events sequentially
- `restartable` - process only the latest event and cancel previous event handlers


## Usage 

```typescript
import { Bloc } from "@jacobtipp/bloc";
import { sequential } from "@jacobtipp/bloc-concurrency"

 abstract class CounterEvent {
  protected _!: void
 }

 class CounterIncrementEvent extends CounterEvent {}

export class CounterBloc extends Bloc<CounterEvent, number> {
  constructor() {
    super(0);

    this.on(
      CounterIncrementEvent,
      (event, emit) => {
        emit(this.state + 1);
      },
      /// Specify a custon event transformer from @jacobtipp/bloc-concurrency
      /// in this case events will be processed sequentially 
      sequential()
    );
  }
}
```
