# @jacobtipp/state

## Introduction

`@jacobtipp/state` is a Typescript library for creating immutable classes using immer

## Installation

`immer` is a peerDependency
```
npm install @jacobtipp/state immer
```

## BaseState
Imagine we have a todo application, where a todo item may be fetched from the server,
we can define our state for a todo item by extending the `BaseState` class like so:
```typescript
import { BaseState } from '@jacobtipp/state';

type TodoItemStatus = "initial" | "loading" | "ready" | "failed"

class TodoItemState extends BaseState {
  constructor(
    public id: number, 
    public message: string, 
    public status: TodoItemStatus) {
    super()
  }
}

const todoState = new TodoItemState(0, "", "initial")

// our todoState is initialized but has an empty message, we can set the status to loading while we fetch data from the server
const loadingState = todoState.copyWith((state) => {
  state.status = "loading"
})

loadingState !== todoState // true
loadingState.status === "loading" // true

// after the todo item has been fetched we can now update our state with the message
const readyState = loadingState.copyWith((state) => {
  state.status = "ready"
  state.message = "some message"
})
```

## State

Defining finite status types is a common practice when dealing with async data, by extending
the `State<Data>` class, we get utility methods and a constructor that makes this easier

Here we will extend `State` using the todo item example above:

```typescript
import { State } from '@jacobtipp/state';

type TodoItem = {
  id: number
  message: string
}

class TodoItemState extends State<TodoItem> {}

const todoState = new TodoItemState({ id: 0, message: ""})

// the State class automatically provides us with a status property that may have the following values: "initial" | "loading" | "ready" | "failed" 

// newly instantiated state objects have an "initial" state by default
todoState.status === "initial" // true

// data is accessed by the "data" property, in this case our TodoItem data
todoState.data.id === 0 // true
todoState.data.message === "" // true

// transitioning between different statuses, we can use the following factory methods: "loading()" | "ready(data: Data)" | "failed(error?: Error)" 
const loadingState = todoState.loading()

loadingState.status === "loading" // true

const readyState = loadingState.ready((todoItem) => {
  todoItem.message = "some message"
})

readyState.status === "ready" // true

// you can also use the copyWith method, as State inherits from BaseState
const failedState = readyState.copyWith((state) => {
  state.status = "failed"
  state.error = new TodoItemError()
})
```