var F = Object.defineProperty;
var L = (n, t, e) => t in n ? F(n, t, { enumerable: !0, configurable: !0, writable: !0, value: e }) : n[t] = e;
var s = (n, t, e) => (L(n, typeof t != "symbol" ? t + "" : t, e), e);
import { BlocObserver as l, Transition as h, Bloc as I } from "@jacobtipp/bloc";
import { switchMap as C, retry as K, EMPTY as U, timer as $, Observable as q, startWith as j, filter as x, map as T, distinctUntilChanged as P, Subject as _, firstValueFrom as B, timeout as O, throwError as N } from "rxjs";
class c {
  constructor() {
    s(this, "_");
    s(this, "name", "QueryEvent");
  }
}
class d extends c {
  constructor(e, r = !1) {
    super();
    s(this, "name", "QueryFetchEvent");
    this.abortController = e, this.cancel = r;
  }
}
class V extends c {
  constructor() {
    super(...arguments);
    s(this, "name", "QueryCancelEvent");
  }
}
class Y extends c {
  constructor() {
    super(...arguments);
    s(this, "name", "SetQueryDataEvent");
  }
}
class z extends c {
  constructor() {
    super(...arguments);
    s(this, "name", "QueryRevalidateEvent");
  }
}
class G extends c {
  constructor(e) {
    super();
    s(this, "name", "QueryErrorEvent");
    this.error = e;
  }
}
const H = (n) => new q((t) => (t.next(n), () => {
  n.abortController.abort();
})), J = (n, t) => (e, r) => e.pipe(C(H)).pipe(
  C(
    (i) => r(i).pipe(
      K({
        delay: (a, u) => {
          const f = u, p = {
            maxRetryAttempts: 1,
            retryDuration: 1e3,
            scalingDuration: 1e3
          }, o = n.retryWhen ? n.retryWhen(a, f) : {}, A = (o == null ? void 0 : o.maxRetryAttempts) ?? n.maxRetryAttempts ?? p.maxRetryAttempts, S = (o == null ? void 0 : o.scalingDuration) ?? n.scalingDuration ?? p.scalingDuration, R = (o == null ? void 0 : o.retryDuration) ?? n.retryDuration ?? p.retryDuration;
          if (f > A && !t.isClosed) {
            const w = new G(a);
            l.observer.onEvent(t, w);
            const b = {
              status: "isError",
              lastUpdatedAt: t.state.lastUpdatedAt,
              isInitial: !1,
              isLoading: !1,
              isFetching: !1,
              isCanceled: !1,
              isReady: !1,
              isError: !0,
              data: t.state.data,
              error: a
            };
            return t.__unsafeEmit__(b), l.observer.onTransition(
              t,
              new h(t.state, w, b)
            ), U;
          }
          const M = (o == null ? void 0 : o.retryDuration) ?? n.retryDuration;
          return $(
            M ? R : f * S
          );
        }
      })
    )
  )
);
class D extends I {
  /**
   * Creates a new QueryBloc instance.
   * @param {QueryState<Data>} state - The initial state of the query.
   * @param {QueryBlocOptions<Data>} options - The options for creating the query bloc.
   */
  constructor(e, r, i) {
    const a = `QueryBloc - ${r.name ?? r.queryKey}`;
    super(e, { name: a });
    s(this, "staleTime");
    s(this, "logErrors");
    s(this, "handledInitialLoad", !1);
    s(this, "revertedState");
    /**
     * Gets an observable for the query state.
     * @template Selected - The type of the selected data.
     * @param {(state: Ready<Data>) => Selected} [selector] - A function to select data from the query state.
     * @param {(previous: Selected, current: Selected) => boolean} [comparer] - A function to compare selected data.
     * @returns {Observable<Selected>} - An observable for the selected data.
     * @throws {QueryClosedException} - If the query is closed.
     */
    s(this, "getQuery", (e, r) => {
      if (this.isClosed)
        throw new g("Query is closed");
      return this.state.status === "isLoading" && !this.handledInitialLoad && (this.handledInitialLoad = !0, this.revertedState = this.state, this.add(new d(new AbortController()))), (this.state.isReady && this.isStale || this.state.isCanceled) && this.revalidateQuery(), this.listen().pipe(
        j(this.state),
        x(({ isReady: i, isError: a }) => e ? i || a : !0),
        T((i) => {
          if (i.isError && e)
            throw i.error;
          return e ? e(i) : i;
        }),
        P(r)
      );
    });
    /**
     * Sets new data for the query.
     * @param {((old: Data) => Data) | Data} set - The new data or a function to update the old data.
     */
    s(this, "setQueryData", (e) => {
      let r;
      if (typeof e == "function") {
        if (this.state.data === void 0)
          throw new m(
            "SetQueryData: cannot be set with a callback function if previous data is undefined, invoke setQueryData with data directly or provide initial data for the query"
          );
        r = e(this.state.data);
      } else
        r = e;
      const i = new Y();
      l.observer.onEvent(this, i);
      const a = this.state, u = {
        status: "isReady",
        isInitial: !1,
        lastUpdatedAt: Date.now(),
        isLoading: !1,
        isFetching: !1,
        isReady: !0,
        isCanceled: !1,
        isError: !1,
        data: r
      };
      this.emit(u), l.observer.onTransition(
        this,
        new h(a, i, u)
      );
    });
    s(this, "subscribers", 0);
    s(this, "pendingCloseTimeout", null);
    /**
     * Returns an observable that provides updates of the query state.
     * This method is used to subscribe to the query's state changes.
     * @returns {Observable<QueryState<Data>>} An Observable that emits updates of the query state.
     */
    s(this, "listen", () => new q((e) => {
      this.subscribers++;
      const r = this.state$.subscribe(e);
      return () => {
        var i, a;
        if (this.subscribers--, r.unsubscribe(), this.subscribers <= 0) {
          if (((i = this.options) == null ? void 0 : i.keepAlive) === 1 / 0)
            return;
          this.pendingCloseTimeout && clearTimeout(this.pendingCloseTimeout), this.pendingCloseTimeout = setTimeout(() => {
            this.subscribers <= 0 && this.closeSignal.next(this.options.queryKey);
          }, ((a = this.options) == null ? void 0 : a.keepAlive) ?? 60 * 1e3);
        }
      };
    }));
    /**
     * Cancels the query, aborting the ongoing fetch operation and reverting the state.
     * It emits a 'QueryCancelEvent' and updates the state accordingly.
     */
    s(this, "cancelQuery", () => {
      if (!this.state.isFetching)
        return;
      this.state.isLoading && this.handledInitialLoad && (this.handledInitialLoad = !1), this.add(new d(new AbortController(), !0));
      const e = new V();
      l.observer.onEvent(this, e);
      const r = this.state;
      this.emit({ ...this.revertedState, isCanceled: !0 }), l.observer.onTransition(
        this,
        new h(r, e, this.state)
      );
    });
    /**
     * Revalidates the query, triggering a new fetch operation if the query is stale or canceled.
     * It emits a 'QueryRevalidateEvent' and updates the state to reflect the fetching status.
     */
    s(this, "revalidateQuery", () => {
      this.revertedState = this.state;
      const e = new z();
      l.observer.onEvent(this, e);
      const r = {
        status: "isFetching",
        lastUpdatedAt: this.state.lastUpdatedAt,
        isInitial: !1,
        isLoading: !1,
        isFetching: !0,
        isCanceled: !1,
        isReady: !1,
        isError: !1,
        data: this.state.data
      };
      this.emit(r), l.observer.onTransition(
        this,
        new h(this.revertedState, e, r)
      ), this.add(new d(new AbortController()));
    });
    this.options = r, this.closeSignal = i, this.revertedState = e, this.staleTime = r.staleTime ?? 0, this.logErrors = r.logErrors ?? !1, this.on(
      d,
      this.onQueryFetch,
      J(
        {
          maxRetryAttempts: r.maxRetryAttempts,
          retryDuration: r.retryDuration,
          scalingDuration: r.scalingDuration,
          retryWhen: r.retryWhen
        },
        this
      )
    );
  }
  onError(e) {
    this.logErrors && super.onError(e);
  }
  async onQueryFetch(e, r) {
    if (e.cancel)
      return;
    const i = e.abortController.signal;
    try {
      const a = await this.options.queryFn({
        signal: i
      });
      r({
        status: "isReady",
        lastUpdatedAt: Date.now(),
        isInitial: !1,
        isLoading: !1,
        isFetching: !1,
        isReady: !0,
        isError: !1,
        isCanceled: !1,
        data: a
      });
    } catch (a) {
      if (!i.aborted)
        throw a;
    }
  }
  /**
   * Checks if the query data is stale based on the last update time and stale time.
   * @type {boolean}
   */
  get isStale() {
    const e = Date.now();
    return this.state.lastUpdatedAt + this.staleTime <= e;
  }
}
class m extends Error {
  constructor(e) {
    super(e);
    /**
     * Creates a new SetQueryDataException instance.
     * @param {string} message - The error message.
     */
    s(this, "name", "SetQueryDataException");
    Object.setPrototypeOf(this, m.prototype);
  }
}
class g extends Error {
  constructor(e) {
    super(e);
    /**
     * Creates a new QueryClosedException instance.
     * @param {string} message - The error message.
     */
    s(this, "name", "QueryClosedException");
    Object.setPrototypeOf(this, g.prototype);
  }
}
class k {
  constructor() {
    s(this, "_isClosed", !1);
    s(this, "_closeSignal$", new _());
    /**
     * The map containing the registered queries.
     * @type {Map<string, QueryBloc<any>>}
     * @private
     */
    s(this, "queryMap", /* @__PURE__ */ new Map());
    /**
     * Retrieves an observable for a specified query. If the query does not exist, it creates a new one.
     * @template Data - The type of data returned by the query.
     * @template Selected - The type of the selected data from the query state.
     * @param {GetQueryOptions<Data, Selected>} options - The options for getting or creating the query.
     * @returns {Observable<Selected>} - An observable for the selected data.
     * @throws {QueryClientClosedException} - If the QueryClient is closed.
     */
    s(this, "getQuery", (t) => {
      if (this.isClosed)
        throw new y();
      return this.queryMap.has(t.queryKey) ? this.queryMap.get(t.queryKey).getQuery(t.selector, t.comparator) : this.createQuery(t).getQuery(
        t.selector,
        t.comparator
      );
    });
    /**
     * Retrieves the data for a given query either by its key or an observable.
     * @template Data - The type of the data returned by the query.
     * @param {GetQueryData<Data>} keyOrQuery - The key or the observable of the query.
     * @param {object} [options] - Additional options such as timeout.
     * @returns {Promise<Data>} - A promise resolved with the query data.
     * @throws {QueryNotFoundException} - If the query is not found.
     * @throws {QueryClientClosedException} - If the QueryClient is closed.
     * @throws {QueryCanceledException} - If the query has been canceled.
     * @throws {QueryTimeoutException} - If the query operation exceeds the specified timeout.
     */
    s(this, "getQueryData", async (t, e) => {
      var i;
      if (this.isClosed)
        throw new y();
      const r = typeof t == "string" ? (i = this.queryMap.get(t)) == null ? void 0 : i.getQuery() : t;
      if (r)
        return B(
          r.pipe(
            x(
              (a) => a.isReady || a.isError || a.isCanceled
            ),
            T((a) => {
              if (a.isError)
                throw a.error;
              if (a.isCanceled)
                throw new v();
              return a.data;
            }),
            O({
              each: (e == null ? void 0 : e.timeout) ?? 60 * 1e3,
              with: () => N(() => new Q())
            })
          )
        );
      throw new E(t.toString());
    });
    /**
     * Clears all registered queries and closes them.
     */
    s(this, "clear", () => {
      this.queryMap.forEach((t) => {
        t.close();
      }), this.queryMap.clear();
    });
    /**
     * Removes a specified query from the QueryClient.
     * @param {QueryKey} key - The key of the query to be removed.
     * @returns {boolean} - True if the query was successfully removed, false otherwise.
     */
    s(this, "removeQuery", (t) => {
      if (this.queryMap.has(t)) {
        const e = this.queryMap.get(t);
        return e == null || e.close(), this.queryMap.delete(t);
      }
      return !1;
    });
    /**
     * Gets an array of all query keys registered in the QueryClient.
     * @returns {Array<QueryKey>} - An array of query keys.
     */
    s(this, "getQueryKeys", () => Array.from(this.queryMap.keys()));
    /**
     * Sets new data for a specified query.
     * @template Data - The type of the data returned by the query.
     * @param {string} queryKey - The key of the query to be updated.
     * @param {((old: Data) => Data) | Data} set - The new data or a function to update the old data.
     */
    s(this, "setQueryData", (t, e) => {
      const r = this.queryMap.get(t);
      r && r.setQueryData(e);
    });
    /**
     * Revalidates all or selected queries based on the provided options.
     * @param {RevalidateQueryOptions} [options] - Options to specify which queries to revalidate.
     */
    s(this, "revalidateQueries", (t) => {
      const e = t == null ? void 0 : t.predicate, r = t == null ? void 0 : t.queryKey;
      this.getQueryKeys().forEach((i) => {
        var a, u;
        if (!e && !r)
          return (a = this.queryMap.get(i)) == null ? void 0 : a.revalidateQuery();
        (r && r === i || e && e(i)) && ((u = this.queryMap.get(i)) == null || u.revalidateQuery());
      });
    });
    /**
     * Cancels an ongoing fetch operation for a specified query.
     * @param {string} queryKey - The key of the query to cancel.
     */
    s(this, "cancelQuery", (t) => {
      var e;
      (e = this.queryMap.get(t)) == null || e.cancelQuery();
    });
    /**
     * Closes the QueryClient, clearing all queries and completing the close signal.
     */
    s(this, "close", () => {
      this._isClosed = !0, this.clear(), this._closeSignal$.complete();
    });
    this._closeSignal$.subscribe({
      next: (t) => this.removeQuery(t)
    });
  }
  /**
   * Indicates whether the QueryClient is closed.
   * @returns {boolean} - True if the QueryClient is closed, false otherwise.
   */
  get isClosed() {
    return this._isClosed;
  }
  createQuery(t) {
    if (t.initialData !== void 0) {
      const e = new D(
        {
          status: "isInitial",
          lastUpdatedAt: Date.now(),
          isInitial: !0,
          isFetching: !1,
          isLoading: !1,
          isReady: !0,
          isError: !1,
          isCanceled: !1,
          data: t.initialData
        },
        t,
        this._closeSignal$
      );
      return this.queryMap.set(t.queryKey, e), e;
    } else {
      const e = new D(
        {
          status: "isLoading",
          lastUpdatedAt: Date.now(),
          isInitial: !1,
          isFetching: !0,
          isLoading: !0,
          isReady: !1,
          isError: !1,
          isCanceled: !1
        },
        t,
        this._closeSignal$
      );
      return this.queryMap.set(t.queryKey, e), e;
    }
  }
}
class E extends Error {
  constructor(e, r = `Query ${e} is not found`) {
    super(r);
    /**
     * Creates a new QueryNotFoundException instance.
     * @param {string} key - The key of the query that was not found.
     * @param {string} [message='Query ${key} is not found'] - The error message.
     */
    s(this, "name", "QueryNotFoundException");
    Object.setPrototypeOf(this, E.prototype);
  }
}
class v extends Error {
  constructor(e = "The query has been canceled") {
    super(e);
    /**
     * Creates a new QueryCanceledException instance.
     * @param {string} [message='QueryCanceledException: The query has been canceled'] - The error message.
     */
    s(this, "name", "QueryCanceledException");
    Object.setPrototypeOf(this, v.prototype);
  }
}
class Q extends Error {
  constructor(e = "QueryTimeoutException: The query has timed out") {
    super(e);
    /**
     * Creates a new QueryTimeoutException instance.
     * @param {string} [message='QueryTimeoutException: The query has timed out'] - The error message.
     */
    s(this, "name", "QueryTimeoutException");
    Object.setPrototypeOf(this, Q.prototype);
  }
}
class y extends Error {
  constructor(e = "QueryClient has already been closed") {
    super(e);
    /**
     * Creates a new QueryClientClosedException instance.
     * @param {string} [message='QueryClient has already been closed'] - The error message.
     */
    s(this, "name", "QueryClientClosedException");
    Object.setPrototypeOf(this, y.prototype);
  }
}
export {
  D as QueryBloc,
  V as QueryCancelEvent,
  v as QueryCanceledException,
  k as QueryClient,
  y as QueryClientClosedException,
  g as QueryClosedException,
  G as QueryErrorEvent,
  c as QueryEvent,
  d as QueryFetchEvent,
  E as QueryNotFoundException,
  z as QueryRevalidateEvent,
  Q as QueryTimeoutException,
  Y as SetQueryDataEvent,
  m as SetQueryDataException,
  J as queryFetchTransformer
};
