# Bloc Todos

This example is a clone of the [flutter_todos](https://github.com/felangel/bloc/tree/master/examples/flutter_todos) example. 

Concepts used in this example:

* layered architecture separating presentation, domain, and data layers.
* usage of `@jacobtipp/hydrated-bloc` to maintain persistence of state between page refresh in the `TodosOverview` page.
* usage of `useBlocListener` to perform side effects such as performaing dynamic navigation and showcasing a snackbar when certain states are emitted.

## install
`pnpm i`

## run 
`pnpm dev`
