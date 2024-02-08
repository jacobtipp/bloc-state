var j = Object.defineProperty;
var T = (a, e, t) => e in a ? j(a, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : a[e] = t;
var n = (a, e, t) => (T(a, typeof e != "symbol" ? e + "" : e, t), t);
import { Subject as v, mergeMap as x, filter as M, Observable as O } from "rxjs";
class A {
  /**
   * Creates a new instance of the Change class.
   *
   * @param current - The current state.
   * @param nextState - The next state.
   */
  constructor(e, t) {
    this.current = e, this.nextState = t;
  }
}
const m = class m {
  static get observer() {
    return m._observer;
  }
  static set observer(e) {
    $() || (m._observer = e);
  }
  /**
   * Called when a new Bloc is created.
   * @param _bloc The newly created Bloc object.
   */
  onCreate(e, t) {
  }
  /**
   * Called when an event is added to a Bloc.
   * @param _bloc The Bloc object that received the event.
   * @param _event The event that was added.
   */
  onEvent(e, t) {
  }
  /**
   * Called when a transition occurs in a Bloc.
   * @param _bloc The Bloc object where the transition occurred.
   * @param _transition The transition object that was made.
   */
  onTransition(e, t) {
  }
  /**
   * Called when an error occurs during the execution of a Bloc.
   * @param _bloc The Bloc object where the error occurred.
   * @param _error The error object that was thrown.
   */
  onError(e, t) {
  }
  /**
   * Called when a change occurs in the state of a Bloc.
   * @param _bloc The Bloc object whose state changed.
   * @param _change The change object that describes the state change.
   */
  onChange(e, t) {
  }
  /**
   * Called when a Bloc object is closed and its state is cleared.
   * @param _bloc The Bloc object that was closed.
   */
  onClose(e) {
  }
};
n(m, "_observer", new m());
let u = m;
class C {
  /**
   * Initializes a new instance of the `BlocBase` class.
   *
   * @param state - The initial state of the BLoC.
   */
  constructor(e, t) {
    /**
     * The name of the BLoC instance.
     */
    n(this, "name");
    /**
     * A read-only observable stream of the state maintained by the BLoC.
     */
    n(this, "state$");
    /** A set of stream subscriptions that a bloc has subscribed to. */
    n(this, "subscriptions", /* @__PURE__ */ new Set());
    /**
     * Whether or not the BLoC instance has been closed.
     */
    n(this, "_isClosed", !1);
    /**
     * Whether or not the current state has been emitted.
     */
    n(this, "_emitted", !1);
    /**
     * The current state of the BLoC.
     */
    n(this, "_state");
    /**
     * The subject that publishes changes in the state of the BLoC.
     */
    n(this, "_stateSubject$");
    this._state = e, this._stateSubject$ = new v(), this.state$ = this._stateSubject$.asObservable(), this.name = t ?? this.constructor.name, this.subscriptions.add(this.state$.subscribe()), u.observer.onCreate(this, this._state);
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
  onError(e) {
    u.observer.onError(this, e);
  }
  /**
   * Executes when the state of the BLoC changes.
   *
   * @param change - Information about the change in state of the BLoC.
   */
  onChange(e) {
    u.observer.onChange(this, e);
  }
  /**
   * Executes when the BLoC instance is closed.
   */
  onClose() {
    u.observer.onClose(this);
  }
  /**
   * Reports an error which triggers onError
   *
   * @param error - An error that has been thrown within a Bloc's execution
   */
  addError(e) {
    this.onError(e);
  }
  /**
   * Listens to an observable and manages the subscription internally.
   *
   * @template T - The type emitted by the Observable.
   * @param {Observable<T>} observable - The Observable to listen to.
   * @param {Partial<Observer<T>> | NextFunction<T>} observerOrNext - Either an observer object or a callback function for next events.
   * @returns {{ unsubscribe: () => void; isClosed: boolean }} An object with an `unsubscribe` method to detach the subscription
   * and an `isClosed` property indicating whether the subscription is closed.
   */
  listenTo(e, t) {
    let s;
    typeof t == "function" ? s = { next: t } : s = t;
    const r = {
      next: (i) => {
        var c;
        (c = s.next) == null || c.call(this, i);
      },
      error: (i) => {
        var c;
        (c = s.error) == null || c.call(this, i);
      },
      complete: () => {
        var i;
        (i = s.complete) == null || i.call(this);
      }
    }, h = e.subscribe(r);
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
  __unsafeEmit__(e) {
    return this.emit(e);
  }
  /**
   * Emits a new state for the BLoC.
   *
   * @param newState - The new state of the BLoC.
   */
  emit(e) {
    try {
      if (this._isClosed && console.warn("Cannot emit new states after calling close"), e == this._state && this._emitted)
        return;
      const t = this.state;
      this._state = e, this.onChange(new A(t, e)), this._stateSubject$.next(e), this._emitted = !0;
    } catch (t) {
      throw this.onError(t), t;
    }
  }
  fromJson(e) {
    return JSON.parse(e);
  }
  toJson(e) {
    return JSON.stringify(e);
  }
  /**
   * Closes the BLoC instance.
   */
  close() {
    this._isClosed = !0, this._stateSubject$.complete(), this.subscriptions.forEach((e) => e.unsubscribe()), this.subscriptions.clear(), this.onClose();
  }
}
class B {
  /**
   * Initializes a new instance of `_Emitter`.
   *
   * @param _emit - The function to use when emitting new states.
   */
  constructor(e) {
    /** A list of subscriptions that have been registered with this emitter. */
    n(this, "_disposables", []);
    this._emit = e;
  }
  /**
   * Emits the provided state.
   *
   * @param state - The new state to emit.
   */
  call(e) {
    return this._emit(e);
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
  onEach(e, t, s) {
    return new Promise((r, h) => {
      const i = e.subscribe({
        next: t,
        error: (c) => {
          s ? (s(c), r()) : h();
        },
        complete: r
      });
      this._disposables.push(i);
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
  forEach(e, t, s) {
    return this.onEach(
      e,
      (r) => this._emit(t(r)),
      s ? (r) => this._emit(s(r)) : void 0
    );
  }
  /** Cancels all subscriptions registered with this emitter. */
  close() {
    this._disposables.forEach((e) => e.unsubscribe()), this._disposables = [];
  }
}
class g extends Error {
  /**
   * Creates an instance of StateError.
   *
   * @param message The error message.
   */
  constructor(e) {
    super(e), Object.setPrototypeOf(this, g.prototype);
  }
}
class I {
  /**
   * Creates a new instance of the `Transition` class.
   *
   * @param currentState The current state.
   * @param event The event that caused the transition.
   * @param nextState The next state.
   */
  constructor(e, t, s) {
    this.currentState = e, this.event = t, this.nextState = s;
  }
}
const _ = class _ extends C {
  /**
   * Creates a new instance of the Bloc class.
   *
   * @param state - The initial state of the BLoC.
   */
  constructor(t, s) {
    super(t, s == null ? void 0 : s.name);
    /** An observable stream of BLoC events. */
    n(this, "_eventSubject$", new v());
    /** A mapping of registered events to their corresponding handler. */
    n(this, "_eventMap", /* @__PURE__ */ new WeakSet());
    /** A collection of stateMappers with their respective filters for each registerered handler. */
    n(this, "_eventStateMappers", new Array());
    /** An event transformer to be applied to stream of all BloC events. */
    n(this, "_globalTransformer");
    /** A set of emitters for the state. */
    n(this, "_emitters", /* @__PURE__ */ new Set());
    /** Indicates whether this is an instance of Bloc. */
    n(this, "isBlocInstance", !0);
    if (this.on = this.on.bind(this), this.add = this.add.bind(this), this.emit = this.emit.bind(this), this._globalTransformer = s == null ? void 0 : s.transformer, this._globalTransformer) {
      const h = this._globalTransformer(
        this._eventSubject$,
        (i) => this._eventStateMappers.find((c) => c.filter(i)).mapper(i)
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
    return (t, s) => t.pipe(x(s));
  }
  /**
   * Handles errors that occur during the BLoC's lifecycle.
   *
   * @param error - The error that occurred.
   */
  onError(t) {
    u.observer.onError(this, t);
  }
  /**
   * Handles transitions between BLoC states.
   *
   * @param transition - The transition that occurred.
   */
  onTransition(t) {
    u.observer.onTransition(this, t);
  }
  /**
   * Handles BLoC events.
   *
   * @param event - The event that occurred.
   */
  onEvent(t) {
    u.observer.onEvent(this, t);
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
  on(t, s, r) {
    if (this._eventMap.has(t))
      throw new S(`${t.name} can only have one EventHandler`);
    if (this._globalTransformer && r)
      throw new Error(
        "Can't provide a transformer for invididuals events along with a bloc-level event transformer"
      );
    if (this.hasAncestor(t, !0))
      throw new S(
        `${t.name} can only have one EventHandler per hierarchy`
      );
    this._eventMap.add(t);
    const h = (i) => {
      const c = new v();
      let d = !1;
      const p = (o) => {
        if (!d && !(this.state === o && this._emitted))
          try {
            const l = this.state;
            this.onTransition(new I(l, i, o)), c.next(o);
          } catch (l) {
            throw this.onError(l), l;
          }
      }, b = new B(p.bind(this)), f = (o) => b.call(o);
      Object.defineProperty(
        f,
        "isClosed",
        {
          get: () => d
        }
      ), f.onEach = (o, l, E) => b.onEach(o, l, E), f.forEach = (o, l, E) => b.forEach(o, l, E);
      const y = async () => {
        try {
          this._emitters.add(b), await s.call(this, i, f);
        } catch (o) {
          throw this.onError(o), o;
        }
      };
      return new O((o) => (c.subscribe(this.emit), y().then(() => o.complete()).catch((l) => o.error(l)), () => {
        d = !0, b.close(), this._emitters.delete(b), c.complete();
      }));
    };
    if (this._globalTransformer)
      this._eventStateMappers.push({
        filter: (i) => i instanceof t,
        mapper: h
      });
    else {
      const d = (r ?? _.transformer())(
        this._eventSubject$.pipe(
          M((p) => p instanceof t)
        ),
        h
      ).subscribe();
      this.subscriptions.add(d);
    }
  }
  hasAncestor(t, s = !1) {
    let r = Object.getPrototypeOf(t);
    return s || (r = r.constructor), this._eventMap.has(r) ? !0 : r === null ? !1 : this.hasAncestor(r, !0);
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
  add(t) {
    if (!this.hasAncestor(t))
      throw new g(`
        add(${t}) was called without a registered event handler.
        Make sure to register a handler via on(${t}, (event, emit) {...})
      `);
    try {
      this.onEvent(t), this._eventSubject$.next(t);
    } catch (s) {
      throw this.onError(s), s;
    }
    return this;
  }
  /** Closes all the emitters */
  close() {
    this._emitters.forEach((t) => t.close()), this._emitters.clear(), this._eventSubject$.complete(), super.close();
  }
};
/** This should only be used by devtools as signal to prevent BlocListeners from performing side-effects during time travel */
n(_, "ignoreListeners", !1);
let w = _;
const k = (a) => a instanceof w || !!a.isBlocInstance;
class S extends Error {
  constructor() {
    super(...arguments);
    n(this, "name", "BlocError");
  }
}
class H extends C {
  /**
   * Creates an instance of Cubit.
   *
   * @param {State} state - The initial state of the Cubit.
   */
  constructor(e, t) {
    super(e, t);
  }
}
const $ = () => typeof window > "u", L = () => !$();
export {
  w as Bloc,
  C as BlocBase,
  u as BlocObserver,
  A as Change,
  H as Cubit,
  B as EmitterImpl,
  g as StateError,
  I as Transition,
  k as isBlocInstance,
  L as isClient,
  $ as isServer
};
