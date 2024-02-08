var u = Object.defineProperty;
var d = (n, o, s) => o in n ? u(n, o, { enumerable: !0, configurable: !0, writable: !0, value: s }) : n[o] = s;
var h = (n, o, s) => (d(n, typeof o != "symbol" ? o + "" : o, s), s);
const y = (n) => class extends n {
  constructor(...t) {
    super(...t);
    h(this, "_cachedState", null);
    this.clear = this.clear.bind(this), this.fromJson = this.fromJson.bind(this), this.toJson = this.toJson.bind(this), this.hydrate = this.hydrate.bind(this);
  }
  get id() {
    return "";
  }
  get storagePrefix() {
    return this.name;
  }
  get storageToken() {
    return `${this.storagePrefix}-${this.id}`;
  }
  async clear() {
    await i.storage.delete(this.storageToken);
  }
  get state() {
    const t = i.storage;
    if (this._cachedState !== null)
      return this._cachedState;
    try {
      const e = t.read(this.storageToken);
      if (e === null)
        return this._cachedState = super.state, super.state;
      const a = this.fromJson(e);
      return this._cachedState = a, a;
    } catch (e) {
      return e instanceof Error && this.onError(e), this._cachedState = super.state, super.state;
    }
  }
  onChange(t) {
    super.onChange(t);
    const e = i.storage, a = t.nextState;
    try {
      const r = this.toJson(a);
      r !== null && e.write(this.storageToken, r);
    } catch (r) {
      if (r instanceof Error)
        throw this.onError(r), r;
    }
    this._cachedState = a;
  }
  hydrate() {
    try {
      const t = i.storage, e = this.toJson(this.state);
      e != null && t.write(this.storageToken, e);
    } catch (t) {
      if (t instanceof Error && this.onError(t), t instanceof l)
        throw t;
    }
  }
}, _ = (n) => class extends n {
  constructor(...t) {
    super(...t);
    h(this, "_cachedState", null);
    this.clear = this.clear.bind(this), this.fromJson = this.fromJson.bind(this), this.toJson = this.toJson.bind(this), this.hydrate = this.hydrate.bind(this);
  }
  get id() {
    return "";
  }
  get storagePrefix() {
    return this.name;
  }
  get storageToken() {
    return `${this.storagePrefix}-${this.id}`;
  }
  async clear() {
    await i.storage.delete(this.storageToken);
  }
  get state() {
    const t = i.storage;
    if (this._cachedState !== null)
      return this._cachedState;
    try {
      const e = t.read(this.storageToken);
      if (e === null)
        return this._cachedState = super.state, super.state;
      const a = this.fromJson(e);
      return this._cachedState = a, a;
    } catch (e) {
      return e instanceof Error && this.onError(e), this._cachedState = super.state, super.state;
    }
  }
  onChange(t) {
    super.onChange(t);
    const e = i.storage, a = t.nextState;
    try {
      const r = this.toJson(a);
      r !== null && e.write(this.storageToken, r);
    } catch (r) {
      if (r instanceof Error)
        throw this.onError(r), r;
    }
    this._cachedState = a;
  }
  hydrate() {
    try {
      const t = i.storage, e = this.toJson(this.state);
      e != null && t.write(this.storageToken, e);
    } catch (t) {
      if (t instanceof Error && this.onError(t), t instanceof l)
        throw t;
    }
  }
};
class g {
}
const f = typeof window > "u", c = class c {
  static get storage() {
    if (c._storage === null)
      throw new l("Storage not found!");
    return c._storage;
  }
  static set storage(o) {
    f || (c._storage = o);
  }
};
h(c, "_storage", null);
let i = c;
class l extends Error {
  constructor(o) {
    super(o), Object.setPrototypeOf(this, l.prototype);
  }
}
class p extends g {
  constructor() {
    super(...arguments);
    h(this, "_closed", !1);
  }
  read(s) {
    return this._closed ? null : localStorage.getItem(s) ?? null;
  }
  write(s, t) {
    return this._closed ? Promise.resolve() : new Promise((e, a) => {
      try {
        localStorage.setItem(s, t), e();
      } catch (r) {
        r instanceof Error && a(r);
      }
    });
  }
  delete(s) {
    return this._closed ? Promise.resolve() : new Promise((t) => {
      localStorage.removeItem(s), t();
    });
  }
  clear() {
    return this._closed ? Promise.resolve() : new Promise((s) => {
      localStorage.clear(), s();
    });
  }
  async close() {
    this._closed = !0;
  }
}
export {
  p as HydratedLocalStorage,
  i as HydratedStorage,
  g as Storage,
  l as StorageNotFound,
  y as WithHydratedBloc,
  _ as WithHydratedCubit
};
