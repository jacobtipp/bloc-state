var u = Object.defineProperty;
var l = (i, t, e) => t in i ? u(i, t, { enumerable: !0, configurable: !0, writable: !0, value: e }) : i[t] = e;
var h = (i, t, e) => (l(i, typeof t != "symbol" ? t + "" : t, e), e);
import { Transition as r } from "@jacobtipp/bloc";
class a {
  constructor(t, e) {
    h(this, "_history", []);
    h(this, "_redos", []);
    this._shouldReplay = t, this.limit = e;
  }
  get canRedo() {
    return this._redos.some((t) => this._shouldReplay(t.newValue));
  }
  get canUndo() {
    return this._history.some((t) => this._shouldReplay(t.oldValue));
  }
  add(t) {
    this.limit !== void 0 && this.limit === 0 || (this._history.push(t), this._redos = [], this.limit !== void 0 && this._history.length > this.limit && this.limit > 0 && this._history.shift());
  }
  clear() {
    this._history = [], this._redos = [];
  }
  redo() {
    if (this.canRedo) {
      const t = this._redos.shift();
      if (t)
        return this._history.push(t), this._shouldReplay(t.newValue) ? t.execute() : this.redo();
    }
  }
  undo() {
    if (this.canUndo) {
      const t = this._history.pop();
      if (t)
        return this._redos.unshift(t), this._shouldReplay(t.oldValue) ? t.undo() : this.undo();
    }
  }
}
class c {
  constructor(t, e, s, n) {
    h(this, "execute", () => this._execute());
    h(this, "undo", () => this._undo(this.oldValue));
    this.oldValue = t, this.newValue = e, this._execute = s, this._undo = n;
  }
}
class d {
  constructor() {
    h(this, "_");
  }
}
class _ extends d {
}
class p extends d {
}
const m = (i) => class extends i {
  constructor(...s) {
    super(...s);
    h(this, "_changeStack", new a(
      this.shouldReplay.bind(this)
    ));
    this.undo = this.undo.bind(this), this.redo = this.redo.bind(this), this.clearHistory = this.clearHistory.bind(this);
  }
  onTransition(s) {
    super.onTransition(s);
  }
  onEvent(s) {
    super.onEvent(s);
  }
  emit(s) {
    this._changeStack.add(
      new c(
        this.state,
        s,
        () => {
          const n = new _();
          this.onEvent(n), this.onTransition(new r(this.state, n, s)), super.emit(s);
        },
        (n) => {
          const o = new p();
          this.onEvent(o), this.onTransition(new r(this.state, o, n)), super.emit(n);
        }
      )
    ), super.emit(s);
  }
  undo() {
    this._changeStack.undo();
  }
  redo() {
    this._changeStack.redo();
  }
  get canUndo() {
    return this._changeStack.canUndo;
  }
  get canRedo() {
    return this._changeStack.canRedo;
  }
  clearHistory() {
    return this._changeStack.clear();
  }
  set limit(s) {
    this._changeStack.limit = s;
  }
  shouldReplay(s) {
    return !0;
  }
}, k = (i) => class extends i {
  constructor(...s) {
    super(...s);
    h(this, "_changeStack", new a(
      this.shouldReplay.bind(this)
    ));
    this.undo = this.undo.bind(this), this.redo = this.redo.bind(this), this.clearHistory = this.clearHistory.bind(this);
  }
  emit(s) {
    this._changeStack.add(
      new c(
        this.state,
        s,
        () => super.emit(s),
        (n) => super.emit(n)
      )
    ), super.emit(s);
  }
  undo() {
    this._changeStack.undo();
  }
  redo() {
    this._changeStack.redo();
  }
  get canUndo() {
    return this._changeStack.canUndo;
  }
  get canRedo() {
    return this._changeStack.canRedo;
  }
  clearHistory() {
    return this._changeStack.clear();
  }
  set limit(s) {
    this._changeStack.limit = s;
  }
  shouldReplay(s) {
    return !0;
  }
};
export {
  c as Change,
  a as ChangeStack,
  _ as RedoEvent,
  d as ReplayEvent,
  p as UndoEvent,
  m as WithReplayBloc,
  k as WithReplayCubit
};
