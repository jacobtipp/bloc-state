# @jacobtipp/react-bloc

## Introduction

React components and hooks for bloc-state

## Installation

</br>

```
npm install @jacobtipp/react-bloc@beta
```

## Components

</br>

### BlocProvider

```ts
const UserPage = () => (
  <BlocProvider
    bloc={[UserBloc]} // pass blocs to a provider
    onCreate={(get) => get(UserBloc).add(new UserInitializedEvent())}
  >
    <SomeChildComponent />
  </BlocProvider>
);
```

### BlocListener

```ts
const UserPage = () => {
  const history = useHistory()
  const snackbar = useSnackbar()

  return (
    <BlocProvider
      bloc={[ UserBloc ]}
      onCreate={(get) => {
        get(UserBloc).add(new UserInitializedEvent())
      }
    >
      <BlocListener
        bloc={UserBloc}
        listenWhen={(previous, current) => current.status === "failure"}
        listener={(get, state) => snackbar.open(state.error?.message) }
      >
        <SomeChildComponent />
      </BlocListener>
    </BlocProvider>
  )
}

// or if you need multiple bloc listeners, create siblings

const UserPage = () => {
  const history = useHistory()

  return (
    <BlocProvider
      bloc={[ UserBloc ]} // pass N number of bloc classes
      onCreate={(get) =>
        get(UserBloc).add(new UserInitializedEvent())
      }
    >
      <>
        <BlocListener
          bloc={UserBloc}
          listenWhen={(previous, current) => !current.data.isAuthenticated}
          listener={(get, state) => history.push("/login")}
        />
        <BlocListener
          bloc={UserBloc}
          listenWhen={(previous, current) => previous.data.randomeData && !current.data.someOtherData}
          listener={(get, state) => openSnackBar(state)} // some other side-effect
        />
        <SomeChildComponent />
      </>
    </BlocProvider>
  )
}

```

## Hooks

### useBlocInstance

```ts
export const SomeComponent = () => {
  const bloc = useBlocInstance(UserBloc); // returns the bloc instance from context

  return (
    <>
      <a onClick={() => bloc.add(new UserClickedEvent())}></a>
    </>
  );
};
```

### useBlocValue

```ts
export const SomeComponent = () => {
  const state = useBlocValue(UserBloc); // returns the current state value from a bloc instance

  return (
    <>
      <p>User: {state.name}</p>
    </>
  );
};
```

### useSetBloc

```ts
export const SomeComponent = () => {
  const emit = useSetValue(CounterCubit); // returns the emitter method from a bloc/cubit

  // should only be used with cubits, blocs use events to change state in a bloc

  return (
    <>
      <a onClick={() => emit((count) => count + 1)}></a>
    </>
  );
};
```

### useBlocSelector

```ts
type SomeComponentProps = {
  id: number;
};

export const SomeComponent = ({ id }: SomeComponentProps) => {
  const lastName = useBlocSelector(UserBloc, {
    // required: a pure selector function for narrowing your state
    selector: (state) => state.name.last,

    // optional: decide which state changes a component should react to
    // it will rerender for all state changes by default
    listenWhen: (state) => state.id === id,

    // optional: decide when a component should suspend based on current state
    suspendWhen: (state) => state.status === 'loading',

    // optional: decide when a component should trigger error boundary based on current state

    errorWhen: (state) => state.error != null,
  });

  return (
    <>
      <p>{lastName}</p>
    </>
  );
};
```

### useBloc

```ts
export const SomeComponent = () => {
  // returns a tuple with the state as first index and the bloc instance as second index
  // optionally takes a useBlocSelector config object, so it can be used to read as well as emit events with bloc instance

  const [id, bloc] = useBloc(UserBloc, {
    selector: (state) => state.data.id,
  });

  return (
    <>
      <a onClick={() => bloc.add(new UserLoggedOutEvent(id))}></a>
    </>
  );
};
```
