# @jacobtipp/react-bloc

## Introduction

React components and hooks for bloc-state

## Installation

</br>

```
npm install @jacobtipp/react-bloc
```

## Components

</br>

### BlocProvider

```ts
const UserPage = () => (
  <BlocProvider
    bloc={[{
      key: UserBloc,
      create: () => new UserBloc()
    }]}
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
      bloc={[{
        key: UserBloc,
        create: () => new UserBloc()
      }]} 
    >
      <BlocListener
        bloc={UserBloc}
        listenWhen={(previous, current) => current.status === "failure"}
        listener={(bloc, state) => snackbar.open(state.error?.message) }
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
      bloc={[{
        key: UserBloc,
        create: () => new UserBloc()
      }]} 
    >
      <>
        <BlocListener
          bloc={UserBloc}
          listenWhen={(previous, current) => !current.data.isAuthenticated}
          listener={(bloc, state) => history.push("/login")}
        />
        <BlocListener
          bloc={UserBloc}
          listenWhen={(previous, current) => previous.data.randomData && !current.data.someOtherData}
          listener={(bloc, state) => openSnackBar(state)} // some other side-effect
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

### useBlocSelector

```ts
type SomeComponentProps = {
  id: number;
};

export const SomeComponent = ({ id }: SomeComponentProps) => {
  const lastName = useBlocSelector(UserBloc, {
    // required: a pure selector function for deriving your state
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
