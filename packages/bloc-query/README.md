# @jacobtipp/bloc-query

## Introduction

A simple, react-query inspired, `QueryClient` built with Bloc, using Blocs as queries. This library does not attempt to replace a tool like `@tankstack/react-query`, only provide an alternative client that streams queries via RxJS observables.

> ⚠️ **warning** this package is experimental and may having frequent breaking API changes

Queries can be observered in `redux-devtools/extension` when using `@jacobtipp/bloc-devtools`

## Installation

</br>

```
npm install @jacobtipp/bloc-query
```
## QueryState

A query can be in one or more of the following states.

```ts
[initial, loading, fetching, ready, error, canceled]
```


* `loading` is only true when a query is first created with no initialData
* A query that is provided initialData will be created with the `initial` and `ready` states set to true.
* A query that is not provided initialData will be created with the `loading` and `fetching` set to true.
* A query that is revalidating will be in a `fetching` state set to true.
* A query and its data is ready to be consumed when the `ready` state is set to true.
  

A `QueryState` object has the following properties

```ts
isInitial: boolean;
lastUpdatedAt: number;
isLoading: boolean;
isFetching: boolean;
isReady: boolean;
isError: boolean;
isCanceled: boolean;
status: 'isInitial' | 'isLoading' | 'isReady' | 'isError' | 'isFetching';
data: Data;
```
  

## Methods

### getQuery

Retrieves an observable for a specified query. If the query does not exist, it creates a new one.

```ts
 getQuery = <Data, Selected = QueryState<Data>>(
    options: GetQueryOptions<Data, Selected>
  ): Observable<Selected>
```

**Options**

```ts
export type GetQueryOptions<Data = unknown, Selected = QueryState<Data>> = {
  /** Initial data to be used. Useful for SSR or initial placeholders. */
  initialData?: Data;
  /** Time in milliseconds after which the data is considered stale and may be refetched. */
  staleTime?: number;
  /** Time in milliseconds to keep a query alive when there are no active listeners. Default: 60 seconds */
  keepAlive?: number;
  /** Whether to log errors to the console. */
  logErrors?: boolean;
  /** A unique key to identify the query. */
  queryKey: QueryKey;
  /** A function returning a promise that resolves with the data. */
  queryFn: (options: QueryFnOptions) => Promise<Data>;
  /** Optional selector function to derive a part of the state. */
  selector?: (state: Ready<Data>) => Selected;
  /** Optional comparator function to determine if the selected state has changed. */
  comparator?: (previous: Selected, current: Selected) => boolean;
} 
```

**Example**

```ts
export class PostRepository {
  constructor(
    private readonly postClient: PostClient,
    private readonly queryClient: QueryClient
  ) {}

  getPostQuery = async (id: number): Observable<Post> => {
    return this.queryClient.getQuery({
      queryKey: `posts/${id}`,
      queryFn: ({ signal }) => this.postClient.getPostDetails(id, signal),
      selector: (queryState) => queryState.data
    });
  };
}

class PostBloc extends Cubit<PostState> {
  constructor(private readonly postRepository: PostRepository) {}

  subscribeToPost(id: number) {
    const query = this.postRepository.getPostQuery(id)

    this.listenTo(query, (post: Post) => {
      this.emit({...post})
    })
  }
}
```

### getQueryData

Retrieves the data for a given query either by its key or an observable. It throws an error if the query returns an error state, is canceled, or times out. It returns a Promise with query data if the query is successful.

```ts
getQueryData = async <Data = unknown>(
  keyOrQuery: GetQueryData<Data>,
  options?: {
    timeout?: number;
  }
): Promise<Data> => {
```

**Example**

```ts
export class PostRepository {
  constructor(
    private readonly postClient: PostClient,
    private readonly queryClient: QueryClient
  ) {}

  getPostQuery = async (id: number): Observable<Post> => {
    return this.queryClient.getQuery({
      queryKey: `posts/${id}`,
      queryFn: ({ signal }) => this.postClient.getPostDetails(id, signal),
      selector: (queryState) => queryState.data
    });
  };

  getPostData = (id: number): Promise<Post> => {
    return this.queryClient.getQueryData(`posts/${id}`);
  };
}

class PostBloc extends Cubit<PostState> {
  constructor(private readonly postRepository: PostRepository) {}

  getPost(id: number) {
    try {
      const post = await this.postRepository.getPostData(id)
      this.emit({...post})
    } catch (e: unknown) {
      if (e instanceof Error) {
        this.addError(e)
      }
    }
  }
}
```

### clear

Clears all registered queries and closes them.

**Example**

```ts
const client = new QueryClient()

client.clear() // client can safely be garbage collected
```

### removeQuery

Removes a specified query from the QueryClient.

**Example**

```ts
const client = new QueryClient()

client.removeQuery("posts") // query subscription is completed and query is cleared/removed from memory

```

### getQueryKeys

Gets an array of all query keys registered in the QueryClient.

**Example**

```ts
const client = new QueryClient()

// ....add queries

client.getQueryKeys() // ["posts", "users", "users/1"]

```

### setQueryData

Sets new data for a specified query.

```ts
setQueryData = <Data>(
    queryKey: QueryKey,
    set: ((old: Data) => Data) | Data
  ): void
```

**Example**

```ts
class TodoRepository {
  constructor(private readonly queryClient: QueryClient) {}

  async saveTodo(todo: Todo): Promise<void> {
    const todos = [...(await this.queryClient.getQueryData<Todo[]>('todos'))];
    const id = todo.id;
    const todoIndex = todos.findIndex((todo) => todo.id === id);

    if (todoIndex >= 0) {
      todos[todoIndex] = todo;
    } else {
      todos.push(todo);
    }

    this.queryClient.setQueryData<Todo[]>('todos', todos);
  }
}
  
```

### revalidateQueries

Revalidates all or selected queries based on the provided options. Triggers the queryFunction

**Options**
```ts
export type RevalidateQueryOptions = {
  // specify a queryKey of a query to revalidate
  queryKey?: QueryKey;
  // determines if the selected key should be revalidated
  predicate?: (queryKey: QueryKey) => boolean;
};
```

**Example**

```ts
const client = new QueryClient()

// ....add queries

client.revalidateQueries({
  predicate: (key) => key.includes('post') // revalidate any queries where the queryKey contains `post`. Example that pass: ['posts', 'posts/1', 'posts/2']
}) 

```

### cancelQuery

Cancels an ongoing fetch operation for a specified query.

**Example**
```ts
const client = new QueryClient()

// ....add queries

client.cancelQuery('posts')
```

### close

Closes the QueryClient, clearing all queries and completing the close signal.

**Example**


```ts
const client = new QueryClient()

// ....add queries

client.close()
```
