# @jacobtipp/react-bloc

## Introduction

React components and hooks for bloc-state

## Installation

</br>

```
npm install @jacobtipp/react-bloc
```

## Components

### RootProvider

A root provider component that sets up the context for accessing provider instances. This is required at the root of your application.

**Example**

```html
  <RootProvider>
    <App >
  </RootProvider>
```

### Provider

A Provider component that manages the lifecycle of a provided class instance.

**Props**


```ts
export interface ProviderProps<Class extends AnyClassType> {
  /** The class definition to be used. */
  classDef: Class;
  /** Function to create an instance or an instance of the class. */
  create: (() => InstanceType<Class>) | InstanceType<Class>;
  /** Optional callback executed when the component mounts. */
  onMount?: (instance: InstanceType<Class>) => void;
  /** Optional callback executed when the component unmounts. */
  onUnmount?: (instance: InstanceType<Class>) => void;
  /** Time in milliseconds to wait before disposing of a non-mounted instance. */
  disposeTime?: number;
  /** Child nodes to be rendered. */
  children: ReactNode;
  /** Dependencies to trigger re-creation of the instance. */
  dependencies?: any[];
}
```


**Example**

```ts
class UserRepository {
  getUser() {
    //...code 
  }
} 

const UserRepositoryProvider = ({children}: PropsWithChildren) => {
  return (
    <Provider
      classDef={UserRepository}
      create={() => new UserRepository()}
    >
      {children}
    </Provider>
  )
}
```

### MultiProvider

A component that composes multiple provider components together. The provider array order matters, they should be in order of dependency.

**Example**

```ts
const Providers = () => {
  // Dependency order UserApiClient -> UserRepository -> UserBloc
  return (
    <MultiProvider providers={[
      UserApiClientProvider, 
      UserRepositoryProvider, 
      UserBlocProvider 
    ]}>
  )
}
```



### BlocProvider

A component that provides a Bloc instance to its children, utilizing the generic Provider component

> ⚠️ **If a function is used to `create` a Bloc instance, the `BlocProvider` will close the Bloc instance when it is unmounted. Manually provided instances are never closed by the `BlocProvider`**

**Props**

```ts
export interface BlocProviderProps<Bloc extends ClassType<BlocBase<any>>> {
  /** The Bloc class to be provided. */
  bloc: Bloc;
  /** Function to create an instance of the Bloc or the instance itself. */
  create: (() => InstanceType<Bloc>) | InstanceType<Bloc>;
  /** Optional callback to be executed when the Bloc is mounted. */
  onMount?: (bloc: InstanceType<Bloc>) => void;
  /** ReactNode children to be rendered within the provider. */
  children: ReactNode;
  /** Optional dependencies array to trigger re-creation of the Bloc instance. */
  dependencies?: any[];
}
```

**Example**

```ts

class UserBloc extends Cubit<UserState> {
  constructor(private readonly userRepo: UserRepository)

  getUser = async () => {
    try {
      const user = await this.userRepository.getUser()
      this.emit(user)
    } catch (e) {
      this.addError(e)
    }
  } 
}

const UserBlocProvider = ({children}: PropsWithChildren) => {
  const userRepository = useProvider(UserRepository)

  return (
    <BlocProvider
      bloc={UserBloc}
      create={() => new UserBloc(userRepository)}  
      onMount={(userBloc) => userBloc.getUser()}
    >
      {children}
    </BlocProvider>
  )
}
```

### BlocBuilder

A component that listens to state changes from a Bloc and rebuilds its UI accordingly.


This component uses a provided bloc to listen for state changes and uses the builder function to rebuild the UI based on the current state. An optional buildWhen function can be provided to determine if the UI should rebuild on a state change.

**Props**

```ts
export interface BlocBuilderProps<
  Bloc extends ClassType<BlocBase<any>>,
  State = StateType<InstanceType<Bloc>>
> {
  /** The Bloc class to observe for state changes. */
  bloc: Bloc;
  /** Function to build the UI based on the current state. */
  builder: (state: State) => JSX.Element;
  /** Optional function to determine if the UI should be rebuilt when the state changes. */
  buildWhen?: (previous: State, current: State) => boolean;
}
```

**Example**

```ts

export const UserDetails = () => {
  const userBloc = useBlocInstance(UserBloc);

  return (
    <BlocBuilder
      bloc={UserBloc}
      buildWhen={(previous, current) => previous !== current}
      builder={(state) => {
        if (state.isLoading) {
          return <div>loading...</div>
        }
        return (
          <>
            <p>{state.name}</p>
            <p>{state.info}</p>
          </>
        );
      }}
    />
  );
};
```

### BlocConsumer

A component that combines the functionalities of both BlocBuilder and BlocListener.
It listens to state changes and events from a specified Bloc and rebuilds its children
based on the current state, while also allowing for side-effects based on the same or
different conditions.
  
**Props**

```ts
export type BlocConsumerProps<
 Bloc extends ClassType<BlocBase<any>>,
  State = StateType<InstanceType<Bloc>>
> {
  /** The Bloc class to observe for state changes and to listen for specific events. */
  bloc: Bloc;
  /** Function to be called when the specified conditions are met. */
  listener: (bloc: InstanceType<Bloc>, state: State) => void;
  /** Optional function to determine whether the listener should be called based on state changes. */
  listenWhen?: (previous: State, current: State) => boolean;
  /** Function to build the UI based on the current state. */
  builder: (state: State) => JSX.Element;
  /** Optional function to determine if the UI should be rebuilt when the state changes. */
  buildWhen?: (previous: State, current: State) => boolean;
}
```

**Example**

```ts
export const UserDetails = () => {
  const userBloc = useBlocInstance(UserBloc);
  const router = useRouter()

  return (
    <BlocConsumer
      bloc={UserBloc}
      listenWhen={(previous, current) => previous !== current && !current.isAuthenticated}
      listener={(userBloc, state) => router.push('/login') }
      buildWhen={(previous, current) => previous !== current}
      builder={(state) => {
        if (state.isLoading) {
          return <div>loading...</div>
        }
        return (
          <>
            <p>{state.name}</p>
            <p>{state.info}</p>
          </>
        );
      }}
    />
  );
};
```

### BlocListener
A component that uses the `useBlocListener` hook to perform side effects in response to state
changes in a specified Bloc. It does not render any additional UI elements itself but provides
a mechanism to respond to Bloc state changes while rendering its child components.

> ⚠️ alternatively you can use a `useBlocListener` hook instead of the `BlocListener` component
see [Hooks](#hooks)

```ts
const UserPage = () => {
  const snackbar = useSnackbar()

  return (
    <BlocListener
      bloc={UserBloc}
      listenWhen={(previous, current) => previous !== current && current.hasError}
      listener={(bloc, state) => snackbar.open(state.error?.message) }
    >
      <SomeChildComponent />
    </BlocListener>
  )
}

// if you need multiple bloc listeners, create siblings

const UserPage = () => {
  const router = useRouter()

  return (
    <>
      <BlocListener
        bloc={UserBloc}
        listenWhen={(previous, current) => previous !== current && current.hasError}
        listener={(bloc, state) => snackbar.open(state.error?.message) }
      />
      <BlocListener
        bloc={UserBloc}
        listenWhen={(previous, current) => previous !== current && !current.data.isAuthenticated}
        listener={(bloc, state) => router.push("/login")}
      />
      <SomeChildComponent />
    </>
  )
}
```

### BlocErrorBoundary

A component that wraps its children in an error boundary specific to a Bloc. It uses
a provided Bloc instance to handle errors and define reset behavior, along with a fallback
UI component to display when an error occurs.

> ⚠️`BlocErrorBoundary` can be triggered by supplying an `errorWhen` callback to a `useBloc` or `useBlocSelector` hook
see [Hooks](#hooks)

**Props**
```ts
export type BlocErrorBoundaryProps<Bloc extends ClassType<BlocBase<any>>> = {
  /** The Bloc class for which errors should be caught. */
  bloc: Bloc;
  /** Function to call when attempting to reset the error state, with the bloc instance as an argument. */
  onReset: (bloc: InstanceType<Bloc>) => void;
  /** A React component to render as a fallback UI when an error is caught. */
  fallback: React.ComponentType<FallbackProps>;
} & PropsWithChildren;
```

**Example**

```ts
export const UserErrorBoundary = ({ children}: PropsWithChildren) => (
  <BlocErrorBoundary
    bloc={UserBloc}
    fallback={UserBlocErrorFallback}
    onReset={(userBloc) =>
      userBloc.add(
        new ResetUserEvent())
      )
    }
  >
    {children}
  </BlocErrorBoundary>
);
```

## Hooks

### useProvider

A custom React hook that retrieves an instance of a class from a context map.
This hook is designed to be used within a context provider system where class instances
are stored in a context map by their class names. It facilitates the access to these instances
by other components down the React component tree.

**Example**


```ts
const UserBlocProvider = ({children}: PropsWithChildren) => {
  const userRepository = useProvider(UserRepository)

  return (
    <BlocProvider
      bloc={UserBloc}
      create={() => new UserBloc(userRepository)}  
      onMount={(userBloc) => userBloc.getUser()}
    >
      {children}
    </BlocProvider>
  )
}
```

### useBlocInstance

A custom hook that retrieves an instance of a specified Bloc from the nearest provider up the component tree.
This hook abstracts the logic for accessing Bloc instances, making it easier to consume Blocs within React components.

`useBlocInstance` does not cause any rerenders

```ts
export const UserComponent = () => {
  const bloc = useBlocInstance(UserBloc); // returns the bloc instance from context

  return (
    <>
      <a onClick={() => bloc.add(new UserUpdateProfileEvent()))}></a>
    </>
  );
};
```

### useBlocValue

A custom React hook that subscribes to the state of a specified Bloc and returns its current value.
This hook uses `useSyncExternalStore` to subscribe to Bloc state changes in a way that is compatible
with React's concurrent features, ensuring that the component using this hook re-renders with the latest state.


```ts
export const UserComponent = () => {
  const state = useBlocValue(UserBloc); // returns the current state value from a bloc instance

  return (
    <>
      <p>User: {state.name}</p>
    </>
  );
};
```

### useBlocSelector

Custom hook to select and use a specific piece of state from a Bloc, with support for suspense and error handling.

**Props**

```ts
/**
 * Configuration options for `useBlocSelector` hook to customize behavior for selecting,
 * listening, suspending, and error handling based on the state of a Bloc.
 */
export type UseBlocSelectorConfig<Bloc extends BlocBase<any>, SelectedState> = {
  /**
   * A function that takes the current state of the Bloc and returns a transformed version of it.
   * This allows for selecting a specific part of the state or deriving new values from it.
   */
  selector?: (state: StateType<Bloc>) => SelectedState;

  /**
   * A function that determines whether the listener should be notified of the state change.
   * This can be used to optimize performance by avoiding unnecessary updates and re-renders.
   */
  listenWhen?: (state: StateType<Bloc>) => boolean;

  /**
   * A function that determines whether the component using this hook should trigger React suspense.
   * This is useful for delaying the rendering of the component until certain conditions are met.
   */
  suspendWhen?: (state: StateType<Bloc>) => boolean;

  /**
   * A function that determines whether an error should be thrown based on the current state of the Bloc.
   * This allows for error boundaries to catch and handle errors related to state conditions.
   */
  errorWhen?: (state: StateType<Bloc>) => boolean;
};
```

**Example**

```ts
type UserComponentProps = {
  id: number;
};

export const UserComponent = ({ id }: UserComponentProps) => {
  const lastName = useBlocSelector(UserBloc, {
    selector: (state) => state.name.last,
    listenWhen: (state) => state.id === id,
    suspendWhen: (state) => state.status === 'loading',
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

A custom React hook that combines the functionalities of `useBlocInstance` and `useBlocSelector`.
It provides both the Bloc instance and the selected state, allowing components to easily interact
with a Bloc's state and methods.

**Example**

```ts
export const UserComponent = () => {

  // returns a tuple with the state as first item and the bloc instance as second item
  // optionally takes a useBlocSelector config object, so it can be used to derive state as well as emit events with a bloc instance
  const [id, bloc] = useBloc(UserBloc, {
    selector: (state) => state.id,
  });

  return (
    <>
      <a onClick={() => bloc.add(new UserLoggedOutEvent(id))}></a>
    </>
  );
};
```

### useBlocListener

A custom hook that listens to state changes in a Bloc and triggers a callback function based
on those changes. It provides a mechanism to perform side effects in response to Bloc state updates.

**Props**
```ts
export interface BlocListenerProps<
  Bloc extends ClassType<BlocBase<any>>,
  State = StateType<InstanceType<Bloc>>
> {
  /** Function to be called when the specified conditions are met. */
  listener: (bloc: InstanceType<Bloc>, state: State) => void;
  /** Optional function to determine whether the listener should be called based on state changes. */
  listenWhen?: (previous: State, current: State) => boolean;
}

```

**Example**

```ts
export const UserComponent = () => {
  const router = useRouter()

  useBlocListener(UserBloc, {
    listenWhen(_previous, current) {
      return current.logoutSubmitSuccess;
    },
    listener() {
      router.push('/');
    },
  });
  
  const [id, bloc] = useBloc(UserBloc, {
    selector: (state) => state.id,
  });

  return (
    <>
      <a onClick={() => bloc.add(new UserLoggedOutEvent(id))}></a>
    </>
  );
};
```

### usePropListener

A custom React hook that listens to changes in a prop and executes a callback function when the prop changes, according to optional custom logic defined in a listenWhen function.

**Props**

```ts
export interface PropListener<Prop> {
  listener: (prop: Prop) => void;
  listenWhen?: (previous: Prop, current: Prop) => boolean;
}
```

**Example**

```ts
export function PostNext() {
  const postBloc = useBlocInstance(PostBloc);

  // grab id from search query params
  const [id, setId] = useQueryState(
    'id',
    parseAsInteger
      .withOptions({
        history: 'push',
      })
      .withDefault(postBloc.state.data.postId.currentId)
  );

  // update postBloc with new post when Id changes
  usePropListener(
    id,
    {
      listenWhen: (previous, current) => previous !== current,
      listener: (currentId) => {
        postBloc.getPost(currentId);
      },
    },
    [postBloc]
  );

  return (
    <button
      onClick={() => {
        setId((id) => id + 1);
      }}
    >
      <div>→</div>
    </button>
  );
}

```


