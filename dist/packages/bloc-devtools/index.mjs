var h = Object.defineProperty;
var p = (r, t, n) => t in r ? h(r, t, { enumerable: !0, configurable: !0, writable: !0, value: n }) : r[t] = n;
var c = (r, t, n) => (p(r, typeof t != "symbol" ? t + "" : t, n), n);
class u {
  constructor(t, n) {
    c(this, "lock", !1);
    c(this, "bloc");
    c(this, "initialState");
    c(this, "connectionUnsubscribe");
    c(this, "update", (t, n = "onChange") => {
      var i, s, a;
      if (this.lock) {
        this.lock = !1;
        return;
      }
      const e = `[${this.options.name}] - ${n}`;
      (i = this.options) != null && i.logTrace && (console.groupCollapsed(e, t), console.trace(), console.groupEnd()), (a = (s = this.options) == null ? void 0 : s.preAction) == null || a.call(s), this.send({ type: e }, t);
    });
    c(this, "send", (t, n) => {
      this.connectionInstance.send(t, n);
    });
    this.options = t, this.connectionInstance = n, this.connectionUnsubscribe = this.connectionInstance.subscribe(
      (o) => {
        var e, i;
        if (o.type === "DISPATCH") {
          const s = o.payload.type;
          if (s === "COMMIT" && this.bloc) {
            this.connectionInstance.init((e = this.bloc) == null ? void 0 : e.state);
            return;
          }
          if (s === "RESET" && this.bloc) {
            this.lock = !0, this.bloc.__unsafeEmit__(this.initialState), this.connectionInstance.init((i = this.bloc) == null ? void 0 : i.state);
            return;
          }
          (s === "JUMP_TO_STATE" || s === "JUMP_TO_ACTION") && this.bloc && (this.lock = !0, this.bloc.__unsafeEmit__(this.bloc.fromJson(o.state)));
        }
      }
    );
  }
  close() {
    this.connectionInstance.unsubscribe(), this.connectionUnsubscribe();
  }
  addBloc(t, n) {
    var e, i, s;
    this.bloc = t, this.initialState = n;
    const o = `[${this.options.name}] - @Init`;
    (e = this.options) != null && e.logTrace && (console.groupCollapsed(o, n), console.trace(), console.groupEnd()), (s = (i = this.options) == null ? void 0 : i.preAction) == null || s.call(i), this.send({ type: o }, n);
  }
  removeBloc() {
    var n;
    const t = this.options.name;
    this.send({ type: `[${t}] - onClose` }, (n = this.bloc) == null ? void 0 : n.state), this.bloc = void 0;
  }
}
class _ {
  constructor(t) {
    c(this, "connections", /* @__PURE__ */ new Map());
    c(this, "isDev", process.env.NODE_ENV !== "production");
    c(this, "options");
    c(this, "addBloc", (t, n) => {
      const o = t.name, e = this.connections.get(o);
      if (e)
        return e.addBloc(t, n);
      const i = { ...this.options, name: o }, s = window.__REDUX_DEVTOOLS_EXTENSION__.connect(i), a = new u(
        i,
        s
      );
      a.addBloc(t, n), this.connections.set(o, a);
    });
    const n = {
      name: document.title,
      logTrace: !1
    };
    if (this.options = { ...n, ...t }, this.isDev && !window.__REDUX_DEVTOOLS_EXTENSION__)
      throw new l(
        "DevtoolsObserver only works with Redux Devtools Extension installed in your web browser"
      );
  }
  onEvent(t, n) {
  }
  onError(t, n) {
  }
  onCreate(t, n) {
    this.isDev && this.addBloc(t, n);
  }
  onTransition(t, n) {
    if (!this.isDev)
      return;
    const o = this.connections.get(t.name), e = n.event.name ?? n.event.constructor.name;
    o == null || o.update(n.nextState, e);
  }
  onChange(t, n) {
    if (!this.isDev || t.isBlocInstance)
      return;
    const o = this.connections.get(t.name);
    o == null || o.update(n.nextState);
  }
  onClose(t) {
    if (!this.isDev)
      return;
    const n = t.name, o = this.connections.get(n);
    o == null || o.removeBloc();
  }
  onDestroy() {
    this.isDev && (this.connections.forEach((t) => {
      t.close();
    }), this.connections.clear());
  }
}
class l extends Error {
  /**
   * Creates an instance of DevtoolsError.
   *
   * @param message The error message.
   */
  constructor(t) {
    super(t), Object.setPrototypeOf(this, l.prototype);
  }
}
export {
  l as DevtoolsError,
  _ as DevtoolsObserver
};
