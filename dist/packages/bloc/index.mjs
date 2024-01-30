var C = Object.defineProperty;
var S = (o, t, e) => t in o ? C(o, t, { enumerable: !0, configurable: !0, writable: !0, value: e }) : o[t] = e;
var i = (o, t, e) => (S(o, typeof t != "symbol" ? t + "" : t, e), e);
import { Subject as v, mergeMap as $, filter as T, Observable as j } from "rxjs";
class y {
  /**
   * Creates a new instance of the Change class.
   *
   * @param current - The current state.
   * @param nextState - The next state.
   */
  constructor(t, e) {
    this.current = t, this.nextState = e;
  }
}
class f extends Error {
  /**
   * Creates an instance of StateError.
   *
   * @param message The error message.
   */
  constructor(t) {
    super(t), Object.setPrototypeOf(this, f.prototype);
  }
}
class w {
  /**
   * Initializes a new instance of the `BlocBase` class.
   *
   * @param state - The initial state of the BLoC.
   */
  constructor(t, e) {
    /**
     * The name of the BLoC instance.
     */
    i(this, "name");
    /**
     * A read-only observable stream of the state maintained by the BLoC.
     */
    i(this, "state$");
    /** A set of stream subscriptions that a bloc has subscribed to. */
    i(this, "subscriptions", /* @__PURE__ */ new Set());
    /**
     * Whether or not the BLoC instance has been closed.
     */
    i(this, "_isClosed", !1);
    /**
     * Whether or not the current state has been emitted.
     */
    i(this, "_emitted", !1);
    /**
     * The current state of the BLoC.
     */
    i(this, "_state");
    /**
     * The subject that publishes changes in the state of the BLoC.
     */
    i(this, "_stateSubject$");
    this._state = t, this._stateSubject$ = new v(), this.state$ = this._stateSubject$.asObservable(), this.name = e ?? this.constructor.name, this.subscriptions.add(this.state$.subscribe()), b.observer.onCreate(this, this._state);
  }
  /**
   * Returns the current state of the BLoC.
   *
   * @returns The current state of the BLoC.
   */
  get state() {
    return this._state;
  }
  /**
   * Returns whether or not the BLoC instance has been closed.
   *
   * @returns Whether or not the BLoC instance has been closed.
   */
  get isClosed() {
    return this._isClosed;
  }
  /**
   * Executes when the BLoC encounters an error.
   *
   * @param error - The error encountered by the BLoC.
   */
  onError(t) {
    b.observer.onError(this, t);
  }
  /**
   * Executes when the state of the BLoC changes.
   *
   * @param change - Information about the change in state of the BLoC.
   */
  onChange(t) {
    b.observer.onChange(this, t);
  }
  /**
   * Executes when the BLoC instance is closed.
   */
  onClose() {
    b.observer.onClose(this);
  }
  /**
   * Reports an error which triggers onError
   *
   * @param error - An error that has been thrown within a Bloc's execution
   */
  addError(t) {
    this.onError(t);
  }
  /**
   * Listens to an observable and manages the subscription internally.
   *
   * @param {Observable<State>} observable - The observable to subscribe to.
   * @param {Partial<Observer<State>> | NextFunction<State>} observerOrNext -
   * An observer object or a function to be used as the next callback.
   * @returns {{ unsubscribe: () => void, isClosed: boolean }} An object with an unsubscribe method
   * to stop the subscription and a boolean indicating whether the subscription is closed.
   *
   * @template State - The type of the state maintained by the observable.
   */
  listenTo(t, e) {
    let s;
    typeof e == "function" ? s = { next: e } : s = e;
    const c = {
      next: (r) => {
        var a;
        (a = s.next) == null || a.call(this, r);
      },
      error: (r) => {
        var a;
        (a = s.error) == null || a.call(this, r);
      },
      complete: () => {
        var r;
        (r = s.complete) == null || r.call(this);
      }
    }, h = t.subscribe(c);
    return this.subscriptions.add(h), {
      unsubscribe: () => {
        h.unsubscribe(), this.subscriptions.delete(h);
      },
      get isClosed() {
        return h.closed;
      }
    };
  }
  /**
   * Emits new BLoC state, this should only be used internally by other libraries or for testing.
   */
  __unsafeEmit__(t) {
    return this.emit(t);
  }
  /**
   * Emits a new state for the BLoC.
   *
   * @param newState - The new state of the BLoC.
   */
  emit(t) {
    try {
      if (this._isClosed)
        throw new f("Cannot emit new states after calling close");
      if (t == this._state && this._emitted)
        return;
      const e = this.state;
      this._state = t, this._stateSubject$.next(t), this.onChange(new y(e, t)), this._emitted = !0;
    } catch (e) {
      throw this.onError(e), e;
    }
  }
  fromJson(t) {
    return JSON.parse(t);
  }
  toJson(t) {
    return JSON.stringify(t);
  }
  /**
   * Closes the BLoC instance.
   */
  close() {
    this._isClosed = !0, this._stateSubject$.complete(), this.subscriptions.forEach((t) => t.unsubscribe()), this.subscriptions.clear(), this.onClose();
  }
}
class M {
  /**
   * Called when a new Bloc is created.
   * @param _bloc The newly created Bloc object.
   */
  onCreate(t, e) {
  }
  /**
   * Called when an event is added to a Bloc.
   * @param _bloc The Bloc object that received the event.
   * @param _event The event that was added.
   */
  onEvent(t, e) {
  }
  /**
   * Called when a transition occurs in a Bloc.
   * @param _bloc The Bloc object where the transition occurred.
   * @param _transition The transition object that was made.
   */
  onTransition(t, e) {
  }
  /**
   * Called when an error occurs during the execution of a Bloc.
   * @param _bloc The Bloc object where the error occurred.
   * @param _error The error object that was thrown.
   */
  onError(t, e) {
  }
  /**
   * Called when a change occurs in the state of a Bloc.
   * @param _bloc The Bloc object whose state changed.
   * @param _change The change object that describes the state change.
   */
  onChange(t, e) {
  }
  /**
   * Called when a Bloc object is closed and its state is cleared.
   * @param _bloc The Bloc object that was closed.
   */
  onClose(t) {
  }
}
class x {
  /**
   * Initializes a new instance of `_Emitter`.
   *
   * @param _emit - The function to use when emitting new states.
   */
  constructor(t) {
    /** A list of subscriptions that have been registered with this emitter. */
    i(this, "_disposables", []);
    this._emit = t;
  }
  /**
   * Emits the provided state.
   *
   * @param state - The new state to emit.
   */
  call(t) {
    return this._emit(t);
  }
  /**
   * Registers listeners for events on a provided `Observable<T>` stream.
   *
   * @param stream$ - The stream to listen to.
   * @param onData - The function to execute when new data is emitted.
   * @param onError - The function to execute if an error is encountered.
   *
   * @returns A promise that resolves when the subscription completes or rejects if there was an error.
   */
  onEach(t, e, s) {
    return new Promise((c, h) => {
      const r = t.subscribe({
        next: e,
        error: (a) => {
          s ? (s(a), c()) : h();
        },
        complete: c
      });
      this._disposables.push(r);
    });
  }
  /**
   * Registers listeners for events on a provided `Observable<T>` stream and maps emitted data to new states to emit.
   *
   * @param stream$ - The stream to listen to.
   * @param onData - The function to execute when new data is emitted, that maps the emitted data to a new state to emit.
   * @param onError - The function to execute if an error is encountered, that maps the error to a new state to emit.
   *
   * @returns A promise that resolves when the subscription completes or rejects if there was an error.
   */
  forEach(t, e, s) {
    return this.onEach(
      t,
      (c) => this._emit(e(c)),
      s ? (c) => this._emit(s(c)) : void 0
    );
  }
  /** Cancels all subscriptions registered with this emitter. */
  close() {
    this._disposables.forEach((t) => t.unsubscribe()), this._disposables = [];
  }
}
class O {
  /**
   * Creates a new instance of the `Transition` class.
   *
   * @param currentState The current state.
   * @param event The event that caused the transition.
   * @param nextState The next state.
   */
  constructor(t, e, s) {
    this.currentState = t, this.event = e, this.nextState = s;
  }
}
const u = class u extends w {
  /**
   * Creates a new instance of the Bloc class.
   *
   * @param state - The initial state of the BLoC.
   */
  constructor(e, s) {
    super(e, s == null ? void 0 : s.name);
    /** An observable stream of BLoC events. */
    i(this, "_eventSubject$", new v());
    /** A mapping of registered events to their corresponding handler. */
    i(this, "_eventMap", /* @__PURE__ */ new WeakMap());
    /** A collection of stateMappers with their respective filters for each registerered handler. */
    i(this, "_eventStateMappers", new Array());
    /** An event transformer to be applied to stream of all BloC events. */
    i(this, "_globalTransformer");
    /** A set of emitters for the state. */
    i(this, "_emitters", /* @__PURE__ */ new Set());
    /** Indicates whether this is an instance of Bloc. */
    i(this, "isBlocInstance", !0);
    if (this.on = this.on.bind(this), this.add = this.add.bind(this), this.emit = this.emit.bind(this), this._globalTransformer = s == null ? void 0 : s.transformer, this._globalTransformer) {
      const h = this._globalTransformer(
        this._eventSubject$,
        (r) => this._eventStateMappers.find((a) => a.filter(r)).mapper(r)
      ).subscribe();
      this.subscriptions.add(h);
    }
  }
  /**
   * Returns an event transformer.
   *
   * @template T - The generic type of the input and output event sequence.
   */
  static transformer() {
    return (e, s) => e.pipe($(s));
  }
  /**
   * Handles errors that occur during the BLoC's lifecycle.
   *
   * @param error - The error that occurred.
   */
  onError(e) {
    u.observer.onError(this, e);
  }
  /**
   * Handles transitions between BLoC states.
   *
   * @param transition - The transition that occurred.
   */
  onTransition(e) {
    u.observer.onTransition(this, e);
  }
  /**
   * Handles BLoC events.
   *
   * @param event - The event that occurred.
   */
  onEvent(e) {
    u.observer.onEvent(this, e);
  }
  /**
   * Registers an event handler for a given event.
   *
   * @param event - The event to register the handler for.
   * @param eventHandler - The handler function.
   * @param transformer - An optional event transformer to use. If none is provided, a default transformer will be used.
   *
   * @throws if there is already an event handler registered for the given event.
   */
  on(e, s, c) {
    if (this._eventMap.has(e))
      throw new Error(`${e.name} can only have one EventHandler`);
    if (this._globalTransformer && c)
      throw new Error(
        "Can't provide a transformer for invididuals events along with a bloc-level event transformer"
      );
    this._eventMap.set(e, 1);
    const h = (r) => {
      const a = new v();
      let d = !1;
      const p = (n) => {
        if (!d && !(this.state === n && this._emitted))
          try {
            const l = this.state;
            a.next(n), this.onTransition(new O(l, r, n));
          } catch (l) {
            throw this.onError(l), l;
          }
      }, m = new x(p.bind(this)), _ = (n) => m.call(n);
      Object.defineProperty(
        _,
        "isClosed",
        {
          get: () => d
        }
      ), _.onEach = (n, l, E) => m.onEach(n, l, E), _.forEach = (n, l, E) => m.forEach(n, l, E);
      const g = async () => {
        try {
          this._emitters.add(m), await s.call(this, r, _);
        } catch (n) {
          throw this.onError(n), n;
        }
      };
      return new j((n) => (a.subscribe(this.emit), g().then(() => n.complete()).catch((l) => n.error(l)), () => {
        d = !0, m.close(), this._emitters.delete(m), a.complete();
      }));
    };
    if (this._globalTransformer)
      this._eventStateMappers.push({
        filter: (r) => r instanceof e,
        mapper: h
      });
    else {
      const d = (c ?? u.transformer())(
        this._eventSubject$.pipe(
          T((p) => p instanceof e)
        ),
        h
      ).subscribe();
      this.subscriptions.add(d);
    }
  }
  /**
   * Adds an event to the BLoC's stream of events.
   *
   * @param event - The event to add.
   *
   * @throws if there is no registered event handler for the given event.
   *
   * @returns The instance of the Bloc.
   */
  add(e) {
    if (!this._eventMap.has(Object.getPrototypeOf(e).constructor))
      throw new f(`
        add(${e}) was called without a registered event handler.
        Make sure to register a handler via on(${e}, (event, emit) {...})
      `);
    try {
      this.onEvent(e), this._eventSubject$.next(e);
    } catch (s) {
      throw this.onError(s), s;
    }
    return this;
  }
  /** Closes all the emitters */
  close() {
    this._emitters.forEach((e) => e.close()), this._emitters.clear(), super.close();
  }
};
/** An instance of the BlocObserver class. */
i(u, "observer", new M());
let b = u;
const J = (o) => o instanceof b || !!o.isBlocInstance;
class P extends w {
  /**
   * Creates an instance of Cubit.
   *
   * @param {State} state - The initial state of the Cubit.
   */
  constructor(t, e) {
    super(t, e);
  }
}
export {
  b as Bloc,
  w as BlocBase,
  M as BlocObserver,
  y as Change,
  P as Cubit,
  x as EmitterImpl,
  f as StateError,
  O as Transition,
  J as isBlocInstance
};
