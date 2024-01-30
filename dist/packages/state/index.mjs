var a = Object.defineProperty;
var u = (r, s, t) => s in r ? a(r, s, { enumerable: !0, configurable: !0, writable: !0, value: t }) : r[s] = t;
var n = (r, s, t) => (u(r, typeof s != "symbol" ? s + "" : s, t), t);
import o, { immerable as c } from "immer";
var d;
class h {
  constructor() {
    /**
     * Property that makes the object compatible with Immer.
     */
    n(this, d, !0);
    /**
     * The name of the state, which is the same as the name of the
     * constructor function.
     */
    n(this, "name", this.constructor.name);
  }
  /**
   * Returns a new instance of the state object by applying the specified
   * mutations to it.
   * @param draft A callback function that allows modifying the draft state.
   *              Must return void.
   * @returns A new instance of the state object with the applied mutations.
   */
  copyWith(s) {
    return o(this, s);
  }
}
d = c;
class l extends h {
  /**
   * Constructs a new instance of the state object.
   * @param data Initial data for the state object.
   * @param status Initial status for the state object. Defaults to "initial".
   * @param error Initial error for the state object. Defaults to undefined.
   */
  constructor(t, i, e) {
    super();
    /** The current status of the state object. */
    n(this, "status");
    /** The current error of the state object. */
    n(this, "error");
    /** A flag indicating whether the object is an instance of State. */
    n(this, "isStateInstance", !0);
    /** The data in the state object. */
    n(this, "data");
    this.data = t, this.status = i ?? "initial", this.error = e;
  }
  /**
   * Produces a new instance of the state object with the specified mutations
   * applied to its data and status.
   * @param status The new status for the state object.
   * @param data Optional callback or value to modify the data in the state object.
   *             Can be a function that produces a draft using Immer, or a new value.
   * @returns A new instance of the state object with the applied mutations.
   */
  produceWithData(t, i) {
    return i == null ? o(this, (e) => {
      e.status = t, e.error = void 0;
    }) : typeof i == "function" ? o(this, (e) => {
      e.status = t, e.error = void 0, e.data = o(e.data, i);
    }) : o(this, (e) => {
      e.error = void 0, e.status = t, e.data = o(e.data, () => i);
    });
  }
  /**
   * Produces a new instance of the state object with the status set to "loading".
   * @returns A new instance of the state object with the status set to "loading".
   */
  loading() {
    return o(this, (t) => {
      t.status = "loading", t.error = void 0;
    });
  }
  /**
   * Produces a new instance of the state object with the specified mutations
   * applied to its data and status. The status is set to "ready".
   * @param data Optional callback or value to modify the data in the state object.
   *             Can be a function that produces a draft using Immer, or a new value.
   * @returns A new instance of the state object with the applied mutations.
   */
  ready(t) {
    return this.produceWithData("ready", t);
  }
  /**
   * Produces a new instance of the state object with the specified error and
   * status set to "failed".
   * @param error Optional error object to be set in the state object.
   * @returns A new instance of the state object with the specified error and status.
   */
  failed(t) {
    return o(this, (i) => {
      i.status = "failed", i.error = t;
    });
  }
}
const S = (r) => r instanceof l || !!r.isStateInstance;
export {
  h as BaseState,
  l as State,
  S as isStateInstance
};
