var b = Object.defineProperty;
var F = (i, e, t) => e in i ? b(i, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : i[e] = t;
var s = (i, e, t) => (F(i, typeof e != "symbol" ? e + "" : e, t), t);
import { Bloc as o, Transition as d } from "@jacobtipp/bloc";
import { switchMap as p, retry as C, EMPTY as L, timer as T, Observable as I, startWith as S, filter as D, map as q, distinctUntilChanged as U, firstValueFrom as K } from "rxjs";
class c {
  constructor() {
    s(this, "_");
    s(this, "name", "QueryEvent");
  }
}
class y extends c {
  constructor(t, r = !1) {
    super();
    s(this, "name", "QueryFetchEvent");
    this.abortController = t, this.cancel = r;
  }
}
class B extends c {
  constructor() {
    super(...arguments);
    s(this, "name", "QueryCancelEvent");
  }
}
class P extends c {
  constructor() {
    super(...arguments);
    s(this, "name", "SetQueryDataEvent");
  }
}
class j extends c {
  constructor() {
    super(...arguments);
    s(this, "name", "QueryRevalidateEvent");
  }
}
class $ extends c {
  constructor(t) {
    super();
    s(this, "name", "QueryErrorEvent");
    this.error = t;
  }
}
const _ = (i) => new I((e) => (e.next(i), () => {
  i.abortController.abort();
})), N = (i, e) => (t, r) => t.pipe(p(_)).pipe(
  p(
    (a) => r(a).pipe(
      C({
        delay: (n, l) => {
          const h = l, f = {
            maxRetryAttempts: 1,
            retryDuration: 1e3,
            scalingDuration: 1e3
          }, u = i.retryWhen ? i.retryWhen(n, h) : {}, A = (u == null ? void 0 : u.maxRetryAttempts) ?? i.maxRetryAttempts ?? f.maxRetryAttempts, R = (u == null ? void 0 : u.scalingDuration) ?? i.scalingDuration ?? f.scalingDuration, x = (u == null ? void 0 : u.retryDuration) ?? i.retryDuration ?? f.retryDuration;
          if (h > A && !e.isClosed) {
            const m = new $(n);
            o.observer.onEvent(e, m);
            const Q = {
              status: "isError",
              lastUpdatedAt: e.state.lastUpdatedAt,
              isInitial: !1,
              isLoading: !1,
              isFetching: !1,
              isReady: !1,
              isError: !0,
              data: e.state.data,
              error: n
            };
            return e.__unsafeEmit__(Q), o.observer.onTransition(
              e,
              new d(e.state, m, Q)
            ), L;
          }
          const M = (u == null ? void 0 : u.retryDuration) ?? i.retryDuration;
          return T(
            M ? x : h * R
          );
        }
      })
    )
  )
);
class w extends o {
  /**
   * Creates a new QueryBloc instance.
   * @param {QueryState<Data>} state - The initial state of the query.
   * @param {QueryBlocOptions<Data>} options - The options for creating the query bloc.
   */
  constructor(t, r) {
    const a = `QueryBloc - ${r.name ?? r.queryKey}`;
    super(t, { name: a });
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
    s(this, "getQuery", (t, r) => {
      if (this.isClosed)
        throw new E("Query is closed");
      return this.state.status === "isLoading" && !this.handledInitialLoad && (this.handledInitialLoad = !0, this.revertedState = this.state, this.add(new y(new AbortController()))), this.state.isReady && this.isStale && this.revalidateQuery(), this.state$.pipe(
        S(this.state),
        D(({ isReady: a, isError: n }) => t ? a || n : !0),
        q((a) => {
          if (a.isError && t)
            throw a.error;
          return t ? t(a) : a;
        }),
        U(r)
      );
    });
    /**
     * Sets new data for the query.
     * @param {((old: Data) => Data) | Data} set - The new data or a function to update the old data.
     */
    s(this, "setQueryData", (t) => {
      let r;
      if (typeof t == "function") {
        if (this.state.data === void 0)
          throw new v(
            "SetQueryData: cannot be set with a callback function if previous data is undefined, invoke setQueryData with data directly or provide initial data for the query"
          );
        r = t(this.state.data);
      } else
        r = t;
      const a = new P();
      o.observer.onEvent(this, a);
      const n = this.state, l = {
        status: "isReady",
        isInitial: !1,
        lastUpdatedAt: Date.now(),
        isLoading: !1,
        isFetching: !1,
        isReady: !0,
        isError: !1,
        data: r
      };
      this.emit(l), o.observer.onTransition(
        this,
        new d(n, a, l)
      );
    });
    /**
     * Cancels the query, aborting the ongoing fetch operation.
     */
    s(this, "cancelQuery", () => {
      if (!this.state.isFetching)
        return;
      this.state.isLoading && this.handledInitialLoad && (this.handledInitialLoad = !1), this.add(new y(new AbortController(), !0));
      const t = new B();
      o.observer.onEvent(this, t);
      const r = this.state;
      this.emit(this.revertedState), o.observer.onTransition(
        this,
        new d(r, t, this.state)
      );
    });
    /**
     * Revalidates the query, triggering a new fetch operation.
     */
    s(this, "revalidateQuery", () => {
      this.cancelQuery(), this.revertedState = this.state;
      const t = new j();
      o.observer.onEvent(this, t);
      const r = {
        status: "isFetching",
        lastUpdatedAt: this.state.lastUpdatedAt,
        isInitial: !1,
        isLoading: !1,
        isFetching: !0,
        isReady: !1,
        isError: !1,
        data: this.state.data
      };
      this.emit(r), o.observer.onTransition(
        this,
        new d(this.revertedState, t, r)
      ), this.add(new y(new AbortController()));
    });
    this.options = r, this.revertedState = t, this.staleTime = r.staleTime ?? 0, this.logErrors = r.logErrors ?? !1, this.on(
      y,
      this.onQueryFetch,
      N(
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
  onError(t) {
    this.logErrors && super.onError(t);
  }
  async onQueryFetch(t, r) {
    if (t.cancel)
      return;
    const a = t.abortController.signal;
    try {
      const n = await this.options.queryFn({
        signal: a
      });
      r({
        status: "isReady",
        lastUpdatedAt: Date.now(),
        isInitial: !1,
        isLoading: !1,
        isFetching: !1,
        isReady: !0,
        isError: !1,
        data: n
      });
    } catch (n) {
      if (!a.aborted)
        throw n;
    }
  }
  /**
   * Checks if the query data is stale based on the last update time and stale time.
   * @type {boolean}
   */
  get isStale() {
    const t = Date.now();
    return this.state.lastUpdatedAt + this.staleTime <= t;
  }
}
class v extends Error {
  /**
   * Creates a new SetQueryDataException instance.
   * @param {string} message - The error message.
   */
  constructor(e) {
    super(e), Object.setPrototypeOf(this, v.prototype);
  }
}
class E extends Error {
  /**
   * Creates a new QueryClosedException instance.
   * @param {string} message - The error message.
   */
  constructor(e) {
    super(e), Object.setPrototypeOf(this, E.prototype);
  }
}
class G {
  constructor() {
    /**
     * The map containing the registered queries.
     * @type {Map<string, QueryBloc<any>>}
     * @private
     */
    s(this, "queryMap", /* @__PURE__ */ new Map());
    /**
     * Gets the observable for a query or creates a new query if it doesn't exist.
     * @template Data - The type of the data returned by the query.
     * @template Selected - The type of the selected data.
     * @param {GetQueryOptions<Data, Selected>} options - The options for the query.
     * @returns {Observable<Selected>} - An observable for the selected data.
     */
    s(this, "getQuery", (e) => this.queryMap.has(e.queryKey) ? this.queryMap.get(e.queryKey).getQuery(e.selector, e.comparator) : this.createQuery(e).getQuery(
      e.selector,
      e.comparator
    ));
    /**
     * Gets the data for a query.
     * @template Data - The type of the data returned by the query.
     * @param {string | Observable<QueryState<Data>>} keyOrQuery - The key or observable of the query.
     * @returns {Promise<Data>} - A promise that resolves to the query data.
     * @throws {QueryNotFoundException} - If the query does not exist in the QueryClient.
     */
    s(this, "getQueryData", async (e) => {
      var r;
      const t = typeof e == "string" ? (r = this.queryMap.get(e)) == null ? void 0 : r.getQuery() : e;
      if (t)
        return K(
          t.pipe(
            D(
              (a) => a.isReady || a.isError
            ),
            q((a) => {
              if (a.isError)
                throw a.error;
              return a.data;
            })
          )
        );
      throw new g(
        `QueryNotFoundException: query ${e} does not exist in the QueryClient.`
      );
    });
    /**
     * Clears all registered queries and closes them.
     */
    s(this, "clear", () => {
      this.queryMap.forEach((e) => {
        e.close();
      }), this.queryMap.clear();
    });
    /**
     * Removes a query from the QueryClient.
     * @param {QueryKey} key - The key of the query to be removed.
     * @returns {boolean} - Returns true if the query was successfully removed, false otherwise.
     */
    s(this, "removeQuery", (e) => {
      if (this.queryMap.has(e)) {
        const t = this.queryMap.get(e);
        return t == null || t.close(), this.queryMap.delete(e);
      }
      return !1;
    });
    /**
     * Gets an array of all query keys registered in the QueryClient.
     * @returns {Array<QueryKey>} - An array of query keys.
     */
    s(this, "getQueryKeys", () => Array.from(this.queryMap.keys()));
    /**
     * Sets new data for a query.
     * @template Data - The type of the data returned by the query.
     * @param {string} queryKey - The key of the query to update.
     * @param {((old: Data) => Data) | Data} set - The new data or a function to update the old data.
     */
    s(this, "setQueryData", (e, t) => {
      const r = this.queryMap.get(e);
      r && r.setQueryData(t);
    });
    /**
     * Revalidates all or selected queries.
     * @param {RevalidateQueryOptions} [options] - Options for revalidating queries.
     */
    s(this, "revalidateQueries", (e) => {
      const t = e == null ? void 0 : e.predicate, r = e == null ? void 0 : e.queryKey;
      this.getQueryKeys().forEach((a) => {
        var n, l;
        if (!t && !r)
          return (n = this.queryMap.get(a)) == null ? void 0 : n.revalidateQuery();
        (r && r === a || t && t(a)) && ((l = this.queryMap.get(a)) == null || l.revalidateQuery());
      });
    });
    /**
     * Cancels an ongoing fetch operation for a query.
     * @param {string} queryKey - The key of the query to cancel.
     */
    s(this, "cancelQuery", (e) => {
      var t;
      (t = this.queryMap.get(e)) == null || t.cancelQuery();
    });
  }
  createQuery(e) {
    if (e.initialData !== void 0) {
      const t = new w(
        {
          status: "isInitial",
          lastUpdatedAt: Date.now(),
          isInitial: !0,
          isFetching: !1,
          isLoading: !1,
          isReady: !0,
          isError: !1,
          data: e.initialData
        },
        e
      );
      return this.queryMap.set(e.queryKey, t), t;
    } else {
      const t = new w(
        {
          status: "isLoading",
          lastUpdatedAt: Date.now(),
          isInitial: !1,
          isFetching: !0,
          isLoading: !0,
          isReady: !1,
          isError: !1
        },
        e
      );
      return this.queryMap.set(e.queryKey, t), t;
    }
  }
}
class g extends Error {
  /**
   * Creates a new QueryNotFoundException instance.
   * @param {string} message - The error message.
   */
  constructor(e) {
    super(e), Object.setPrototypeOf(this, g.prototype);
  }
}
export {
  w as QueryBloc,
  B as QueryCancelEvent,
  G as QueryClient,
  E as QueryClosedException,
  $ as QueryErrorEvent,
  c as QueryEvent,
  y as QueryFetchEvent,
  g as QueryNotFoundException,
  j as QueryRevalidateEvent,
  P as SetQueryDataEvent,
  v as SetQueryDataException,
  N as queryFetchTransformer
};
