# @jacobtipp/bloc-devtools

## Installation

```
npm install @jacobtipp/bloc-devtools
```

## Usage 

```typescript
// main.tsx
import { DevtoolsObserver  } from "@jacobtipp/bloc-devtools";

class MyBlocObserver extends DevtoolsObserver {
  // BlocObserver methods
}

BlocObserver.observer = new MyBlocObserver()
 
```
