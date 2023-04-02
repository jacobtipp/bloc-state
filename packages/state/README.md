# @jacobtipp/state

## Introduction

`@jacobtipp/state` is a Typescript library for creating immutable objects with loadable finite states.

If you're coming from Dart, it is similar to using the copyWith pattern.

Under the hood state is powered by immer.

## Installation

```
npm install @jacobtipp/state@beta
```

## Quickstart

```typescript
import { State } from '@jacobtipp/state';

class CounterState extends State<number> {} // class declaration for our state

// by default state has a status property to handle async state (intiial, loading, ready, failed)

// newly created instances of state have intitial status

const initialCounterState = new CounterState(0);

intialCounterState.status === 'initial'; // true
initialCounterState.data === 0; // true

// transition to a loading state while waiting for new data (usually async operation)

const loadingState = initialCounterState.loading();

loadingState.status === 'loading'; // true

// data is always copied over from previous states
loadingState.data === 0; // true

// transition to a ready state with new data

const readyState = loadingState.ready(1);

readyState.status === 'ready'; // true
readyState.data === 1; // true
```

### copyWith

```js
// State also comes with a copyWith method that can be used instead

type ProfileViewModel = {
  id: number
  name: string
  email: string
  followers: string[]
}

enum ProfileFollowersStatus {
  loading,
  success,
  failure,
}

class ProfileState extends State<ProfileViewModel> {
  followerStatus = ProfileFollowersStatus.loading

  constructor() {
    super({
      id: 0,
      name: "",
      email: "",
      followers: [],
    })
  }
}

const profileState = new ProfileState()

console.log(profileState)

/*
 ProfileState {
    stateName: 'ProfileState',
    isStateInstance: true,
    data: { id: 0, name: '', email: '', followers: [] },
    status: 'initial',
    error: undefined,
    followerStatus: 0,
    [Symbol(immer-draftable)]: true
  }
  */

const followersSuccessState = profileState.copyWith(
  (state: WritableDraft<ProfileState>) => {
    state.followerStatus = ProfileFollowersStatus.success
    state.data.followers = ["Jill", "Bobby", "Nancy"]
  },
)

console.log(followersSuccessState)

/*
 ProfileState {
    stateName: 'ProfileState',
    isStateInstance: true,
    data: {
      id: 0,
      name: '',
      email: '',
      followers: [ 'Jill', 'Bobby', 'Nancy' ]
    },
    status: 'initial',
    error: undefined,
    followerStatus: 1,
    [Symbol(immer-draftable)]: true
  }
 */

```

## License

The MIT License.
