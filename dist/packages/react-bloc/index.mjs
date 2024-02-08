var Be = Object.defineProperty;
var Ce = (e, t, r) => t in e ? Be(e, t, { enumerable: !0, configurable: !0, writable: !0, value: r }) : e[t] = r;
var oe = (e, t, r) => (Ce(e, typeof t != "symbol" ? t + "" : t, r), r);
import { jsxs as Ve, Fragment as Se, jsx as T } from "react/jsx-runtime";
import { isServer as he, Bloc as _e } from "@jacobtipp/bloc";
import * as L from "react";
import W, { useContext as U, useEffect as Q, useLayoutEffect as Ee, useCallback as X, useDebugValue as Oe, useState as me, useRef as x, useSyncExternalStore as Ae, createContext as ye, createElement as we, useMemo as Y } from "react";
import { startWith as B, distinctUntilChanged as ue, filter as M, map as j, firstValueFrom as We, pairwise as Z, Subject as Me } from "rxjs";
const ge = () => !1, ee = () => !0, Ie = () => !1, je = (e) => e, Ne = () => !0, Le = (e) => {
  const t = U(re);
  if (!t)
    throw new Error("a contextMap does not exist");
  const r = t.get(e.name);
  if (!r)
    throw new Error(`${e.name} does not exist in the context map.`);
  return U(r).instance;
}, C = (e) => Le(e);
function Pe(e) {
  return e && e.__esModule && Object.prototype.hasOwnProperty.call(e, "default") ? e.default : e;
}
var z = { exports: {} }, H = {}, g = { exports: {} }, k = {};
/**
 * @license React
 * use-sync-external-store-shim.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var se;
function Ke() {
  if (se)
    return k;
  se = 1;
  var e = W;
  function t(f, i) {
    return f === i && (f !== 0 || 1 / f === 1 / i) || f !== f && i !== i;
  }
  var r = typeof Object.is == "function" ? Object.is : t, n = e.useState, o = e.useEffect, u = e.useLayoutEffect, s = e.useDebugValue;
  function c(f, i) {
    var h = i(), E = n({ inst: { value: h, getSnapshot: i } }), _ = E[0].inst, O = E[1];
    return u(function() {
      _.value = h, _.getSnapshot = i, a(_) && O({ inst: _ });
    }, [f, h, i]), o(function() {
      return a(_) && O({ inst: _ }), f(function() {
        a(_) && O({ inst: _ });
      });
    }, [f]), s(h), h;
  }
  function a(f) {
    var i = f.getSnapshot;
    f = f.value;
    try {
      var h = i();
      return !r(f, h);
    } catch {
      return !0;
    }
  }
  function d(f, i) {
    return i();
  }
  var l = typeof window > "u" || typeof window.document > "u" || typeof window.document.createElement > "u" ? d : c;
  return k.useSyncExternalStore = e.useSyncExternalStore !== void 0 ? e.useSyncExternalStore : l, k;
}
var q = {};
/**
 * @license React
 * use-sync-external-store-shim.development.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var ce;
function Ge() {
  return ce || (ce = 1, process.env.NODE_ENV !== "production" && function() {
    typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u" && typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStart == "function" && __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStart(new Error());
    var e = W, t = e.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED;
    function r(S) {
      {
        for (var p = arguments.length, y = new Array(p > 1 ? p - 1 : 0), v = 1; v < p; v++)
          y[v - 1] = arguments[v];
        n("error", S, y);
      }
    }
    function n(S, p, y) {
      {
        var v = t.ReactDebugCurrentFrame, m = v.getStackAddendum();
        m !== "" && (p += "%s", y = y.concat([m]));
        var b = y.map(function(w) {
          return String(w);
        });
        b.unshift("Warning: " + p), Function.prototype.apply.call(console[S], console, b);
      }
    }
    function o(S, p) {
      return S === p && (S !== 0 || 1 / S === 1 / p) || S !== S && p !== p;
    }
    var u = typeof Object.is == "function" ? Object.is : o, s = e.useState, c = e.useEffect, a = e.useLayoutEffect, d = e.useDebugValue, l = !1, f = !1;
    function i(S, p, y) {
      l || e.startTransition !== void 0 && (l = !0, r("You are using an outdated, pre-release alpha of React 18 that does not support useSyncExternalStore. The use-sync-external-store shim will not work correctly. Upgrade to a newer pre-release."));
      var v = p();
      if (!f) {
        var m = p();
        u(v, m) || (r("The result of getSnapshot should be cached to avoid an infinite loop"), f = !0);
      }
      var b = s({
        inst: {
          value: v,
          getSnapshot: p
        }
      }), w = b[0].inst, V = b[1];
      return a(function() {
        w.value = v, w.getSnapshot = p, h(w) && V({
          inst: w
        });
      }, [S, v, p]), c(function() {
        h(w) && V({
          inst: w
        });
        var N = function() {
          h(w) && V({
            inst: w
          });
        };
        return S(N);
      }, [S]), d(v), v;
    }
    function h(S) {
      var p = S.getSnapshot, y = S.value;
      try {
        var v = p();
        return !u(y, v);
      } catch {
        return !0;
      }
    }
    function E(S, p, y) {
      return p();
    }
    var _ = typeof window < "u" && typeof window.document < "u" && typeof window.document.createElement < "u", O = !_, R = O ? E : i, D = e.useSyncExternalStore !== void 0 ? e.useSyncExternalStore : R;
    q.useSyncExternalStore = D, typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u" && typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStop == "function" && __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStop(new Error());
  }()), q;
}
var ie;
function be() {
  return ie || (ie = 1, process.env.NODE_ENV === "production" ? g.exports = Ke() : g.exports = Ge()), g.exports;
}
/**
 * @license React
 * use-sync-external-store-shim/with-selector.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var ae;
function Fe() {
  if (ae)
    return H;
  ae = 1;
  var e = W, t = be();
  function r(d, l) {
    return d === l && (d !== 0 || 1 / d === 1 / l) || d !== d && l !== l;
  }
  var n = typeof Object.is == "function" ? Object.is : r, o = t.useSyncExternalStore, u = e.useRef, s = e.useEffect, c = e.useMemo, a = e.useDebugValue;
  return H.useSyncExternalStoreWithSelector = function(d, l, f, i, h) {
    var E = u(null);
    if (E.current === null) {
      var _ = { hasValue: !1, value: null };
      E.current = _;
    } else
      _ = E.current;
    E = c(function() {
      function R(v) {
        if (!D) {
          if (D = !0, S = v, v = i(v), h !== void 0 && _.hasValue) {
            var m = _.value;
            if (h(m, v))
              return p = m;
          }
          return p = v;
        }
        if (m = p, n(S, v))
          return m;
        var b = i(v);
        return h !== void 0 && h(m, b) ? m : (S = v, p = b);
      }
      var D = !1, S, p, y = f === void 0 ? null : f;
      return [function() {
        return R(l());
      }, y === null ? void 0 : function() {
        return R(y());
      }];
    }, [l, f, i, h]);
    var O = o(d, E[0], E[1]);
    return s(function() {
      _.hasValue = !0, _.value = O;
    }, [O]), a(O), O;
  }, H;
}
var $ = {};
/**
 * @license React
 * use-sync-external-store-shim/with-selector.development.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var le;
function He() {
  return le || (le = 1, process.env.NODE_ENV !== "production" && function() {
    typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u" && typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStart == "function" && __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStart(new Error());
    var e = W, t = be();
    function r(l, f) {
      return l === f && (l !== 0 || 1 / l === 1 / f) || l !== l && f !== f;
    }
    var n = typeof Object.is == "function" ? Object.is : r, o = t.useSyncExternalStore, u = e.useRef, s = e.useEffect, c = e.useMemo, a = e.useDebugValue;
    function d(l, f, i, h, E) {
      var _ = u(null), O;
      _.current === null ? (O = {
        hasValue: !1,
        value: null
      }, _.current = O) : O = _.current;
      var R = c(function() {
        var y = !1, v, m, b = function(A) {
          if (!y) {
            y = !0, v = A;
            var P = h(A);
            if (E !== void 0 && O.hasValue) {
              var K = O.value;
              if (E(K, P))
                return m = K, K;
            }
            return m = P, P;
          }
          var Te = v, G = m;
          if (n(Te, A))
            return G;
          var F = h(A);
          return E !== void 0 && E(G, F) ? G : (v = A, m = F, F);
        }, w = i === void 0 ? null : i, V = function() {
          return b(f());
        }, N = w === null ? void 0 : function() {
          return b(w());
        };
        return [V, N];
      }, [f, i, h, E]), D = R[0], S = R[1], p = o(l, D, S);
      return s(function() {
        O.hasValue = !0, O.value = p;
      }, [p]), a(p), p;
    }
    $.useSyncExternalStoreWithSelector = d, typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u" && typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStop == "function" && __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStop(new Error());
  }()), $;
}
process.env.NODE_ENV === "production" ? z.exports = Fe() : z.exports = He();
var ke = z.exports;
const qe = /* @__PURE__ */ Pe(ke), te = (() => (
  /* istanbul ignore next */
  he() ? Q : Ee
))(), $e = W.use || ((e) => {
  if (e.status === "pending")
    throw e;
  if (e.status === "fulfilled")
    return e.value;
  throw e.status === "rejected" ? e.reason : (e.status = "pending", e.then(
    (t) => {
      e.status = "fulfilled", e.value = t;
    },
    (t) => {
      e.status = "rejected", e.reason = t;
    }
  ), e);
}), { useSyncExternalStoreWithSelector: Ue } = qe, Ye = (e, t) => {
  const r = t.suspendWhen, n = t.errorWhen, [{ shouldSuspend: o }, u] = me(() => ({
    shouldSuspend: r(e.state)
  })), s = x(e.state), c = x(null), a = x(null), d = () => We(
    e.state$.pipe(
      B(e.state),
      M((l) => !r(e.state) || !r(l))
    )
  ).then(() => {
    c.current = null, s.current = null;
  }).catch(() => {
    c.current = null, s.current = null;
  });
  if (o && !c.current && s.current && (c.current = d()), te(() => (a.current = e.state$.pipe(B(e.state)).subscribe((l) => {
    r(l) && (s.current = l, u({
      shouldSuspend: !0
    }));
  }), () => {
    var l;
    (l = a.current) == null || l.unsubscribe(), a.current = null;
  }), [e]), n(e.state))
    throw new Je(e.state);
  c.current && $e(c.current);
}, ze = (e, t) => {
  const r = C(e), n = (t == null ? void 0 : t.selector) ?? je, o = (t == null ? void 0 : t.listenWhen) ?? ee, u = (t == null ? void 0 : t.suspendWhen) ?? ge, s = (t == null ? void 0 : t.errorWhen) ?? Ie;
  Ye(r, {
    suspendWhen: u,
    errorWhen: s
  });
  const c = X(
    (d) => {
      const l = r.state$.pipe(
        B(r.state),
        ue(),
        M((f) => o(f)),
        j((f) => n(f)),
        ue()
      ).subscribe(() => setTimeout(() => d(), 0));
      return () => {
        l.unsubscribe();
      };
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [r]
  ), a = Ue(
    c,
    () => r.state,
    () => r.state,
    n
  );
  return Oe(a), a;
};
class Je extends Error {
  constructor(r, n) {
    super("useBlocSelector: errorWhen triggered a new render Error");
    oe(this, "name", "BlocRenderError");
    this.state = r;
  }
}
const ft = (e, t) => {
  const r = ze(e, t), n = C(e);
  return [r, n];
}, Re = (e, { listener: t, listenWhen: r }) => {
  const n = C(e), o = r ?? ee, u = x(null);
  te(() => (u.current = n.state$.pipe(
    B(n.state),
    // Emit the initial state.
    Z(),
    // Emit previous and current state as a pair.
    M(
      ([s, c]) => !_e.ignoreListeners && o(s, c)
    ),
    // Check condition.
    j(([s, c]) => t(n, c))
    // Call listener with current state.
  ).subscribe(), () => {
    var s;
    (s = u.current) == null || s.unsubscribe(), u.current = null;
  }), [n]);
}, dt = (e) => {
  const t = C(e), r = X(
    (o) => {
      const u = t.state$.subscribe(o);
      return () => u.unsubscribe();
    },
    [t]
  ), n = Ae(
    r,
    // The memoized subscription function.
    () => t.state,
    // A function to get the current state synchronously.
    () => t.state
    // A function to get the snapshot for server rendering (optional here).
  );
  return Oe(n), n;
}, pt = (e) => Le(e), vt = (e, { listener: t, listenWhen: r }, n) => {
  const o = r ?? ee, u = x(null), s = x(null);
  Q(() => {
    var c;
    (c = s.current) == null || c.next(e);
  }, [e]), te(() => (s.current = new Me(), u.current = s.current.pipe(
    // Start with the initial prop value.
    B(e),
    // Emit the previous and current value as a pair.
    Z(),
    // Filter the emissions based on the listenWhen condition.
    M(([c, a]) => !_e.ignoreListeners && o(c, a)),
    // Execute the listener function with the current prop value.
    j(([c, a]) => t(a))
  ).subscribe(), () => {
    var c, a;
    (c = u.current) == null || c.unsubscribe(), u.current = null, (a = s.current) == null || a.complete(), s.current = null;
  }), n ?? []);
};
function St({
  bloc: e,
  listener: t,
  listenWhen: r,
  children: n
}) {
  return Re(e, {
    listener: t,
    listenWhen: r
  }), /* @__PURE__ */ Ve(Se, { children: [
    " ",
    n,
    " "
  ] });
}
const Qe = /* @__PURE__ */ new Map(), re = ye(
  void 0
), ht = ({ children: e }) => we(
  re.Provider,
  {
    // Provide a new map for server-side or a shared map for client-side.
    value: he() ? /* @__PURE__ */ new Map() : Qe
  },
  e
);
var ne = () => L.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner.current, fe = /* @__PURE__ */ Symbol.for("react.strict_mode"), Xe = () => {
  if (process.env.NODE_ENV === "production")
    return !1;
  const e = L.useRef(void 0), t = L.useMemo(() => Number(L.version.split(".")[0]), [L.version]);
  if (isNaN(t) || t < 18)
    return !1;
  if (e.current === void 0) {
    let r = ne();
    for (; r && r.return; )
      r = r.return, (r.type === fe || r.elementType === fe) && (e.current = !0);
  }
  return !!e.current;
}, de = /* @__PURE__ */ new WeakSet();
function Ze(e, t) {
  const r = ne();
  L.useEffect(() => {
    if (!de.has(r)) {
      de.add(r), e();
      return;
    }
    return e();
  }, t);
}
var pe = /* @__PURE__ */ new WeakSet();
function et(e, t) {
  return L.useMemo(() => {
    const r = ne();
    return pe.has(r) ? e() : (pe.add(r), null);
  }, t);
}
function tt(e, t) {
  var r;
  const n = Xe() && process.env.NODE_ENV !== "production", o = n ? et : L.useMemo, u = n ? Ze : L.useEffect, [s, c] = (r = o(() => e(), t)) != null ? r : [
    null,
    () => null
  ];
  return u(() => c, t), s;
}
const I = /* @__PURE__ */ new WeakSet(), xe = ({
  children: e,
  classDef: t,
  dependencies: r = [],
  disposeTime: n = 5 * 1e3,
  create: o,
  onMount: u,
  onUnmount: s
}) => {
  const c = typeof o == "function", a = () => {
    const i = c ? o() : o;
    return c && setTimeout(() => {
      I.has(i) || s == null || s(i);
    }, n), i;
  }, d = tt(() => {
    const i = a();
    return [
      i,
      () => {
        s == null || s(i);
      }
    ];
  }, r);
  Q(() => {
    const i = d;
    return u == null || u(i), !I.has(i) && c && I.add(i), () => {
      I.delete(i);
    };
  }, [d]);
  const l = U(re), f = Y(() => {
    let i = l.get(t.name);
    return i || (i = ye({
      instance: d
    }), l.set(t.name, i), i);
  }, []);
  return we(
    f.Provider,
    {
      value: {
        instance: d
      }
    },
    e
  );
}, De = ({
  providers: e,
  children: t
}) => {
  const r = Y(() => e.map((o) => ({ children: u }) => /* @__PURE__ */ T(o, { children: u })), []), n = Y(() => r.reduce(
    (o, u) => ({ children: s }) => /* @__PURE__ */ T(o, { children: /* @__PURE__ */ T(u, { children: s }) }),
    // eslint-disable-next-line react/jsx-no-useless-fragment
    ({ children: o }) => /* @__PURE__ */ T(Se, { children: o })
  ), [r]);
  return /* @__PURE__ */ T(n, { children: t });
}, _t = ({
  bloc: e,
  children: t,
  dependencies: r = [],
  create: n,
  onMount: o
}) => xe({
  classDef: e,
  create: n,
  onMount: o,
  onUnmount: (u) => {
    typeof n == "function" && u.close();
  },
  dependencies: r,
  children: t
}), Et = ({
  providers: e,
  children: t
}) => De({
  providers: e,
  children: t
});
function J(e, t) {
  return J = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function(n, o) {
    return n.__proto__ = o, n;
  }, J(e, t);
}
function rt(e, t) {
  e.prototype = Object.create(t.prototype), e.prototype.constructor = e, J(e, t);
}
var nt = function(t, r) {
  return t === void 0 && (t = []), r === void 0 && (r = []), t.length !== r.length || t.some(function(n, o) {
    return !Object.is(n, r[o]);
  });
}, ve = {
  error: null
}, ot = /* @__PURE__ */ function(e) {
  rt(t, e);
  function t() {
    for (var n, o = arguments.length, u = new Array(o), s = 0; s < o; s++)
      u[s] = arguments[s];
    return n = e.call.apply(e, [this].concat(u)) || this, n.state = ve, n.resetErrorBoundary = function() {
      for (var c, a = arguments.length, d = new Array(a), l = 0; l < a; l++)
        d[l] = arguments[l];
      n.props.onReset == null || (c = n.props).onReset.apply(c, d), n.reset();
    }, n;
  }
  t.getDerivedStateFromError = function(o) {
    return {
      error: o
    };
  };
  var r = t.prototype;
  return r.reset = function() {
    this.setState(ve);
  }, r.componentDidCatch = function(o, u) {
    var s, c;
    (s = (c = this.props).onError) == null || s.call(c, o, u);
  }, r.componentDidUpdate = function(o, u) {
    var s = this.state.error, c = this.props.resetKeys;
    if (s !== null && u.error !== null && nt(o.resetKeys, c)) {
      var a, d;
      (a = (d = this.props).onResetKeysChange) == null || a.call(d, o.resetKeys, c), this.reset();
    }
  }, r.render = function() {
    var o = this.state.error, u = this.props, s = u.fallbackRender, c = u.FallbackComponent, a = u.fallback;
    if (o !== null) {
      var d = {
        error: o,
        resetErrorBoundary: this.resetErrorBoundary
      };
      if (/* @__PURE__ */ L.isValidElement(a))
        return a;
      if (typeof s == "function")
        return s(d);
      if (c)
        return /* @__PURE__ */ L.createElement(c, d);
      throw new Error("react-error-boundary requires either a fallback, fallbackRender, or FallbackComponent prop");
    }
    return this.props.children;
  }, t;
}(L.Component);
const Ot = ({
  bloc: e,
  fallback: t,
  onReset: r,
  children: n
}) => {
  const o = C(e), u = X(() => r(o), [o]);
  return /* @__PURE__ */ T(ot, { FallbackComponent: t, onReset: u, children: n });
}, mt = ({
  repository: e,
  children: t,
  dependencies: r = [],
  create: n,
  onMount: o,
  onUnmount: u
}) => xe({
  classDef: e,
  dependencies: r,
  onMount: o,
  onUnmount: u,
  create: n,
  children: t
}), yt = ({
  providers: e,
  children: t
}) => De({
  providers: e,
  children: t
});
function ut({
  bloc: e,
  builder: t,
  buildWhen: r
}) {
  const n = C(e), o = r ?? Ne, u = x(null), [s, c] = me(() => n.state);
  return Ee(() => (u.current = n.state$.pipe(
    B(s),
    // Start with the initial state.
    Z(),
    // Emit the previous and current state as an array.
    M(([a, d]) => o(a, d)),
    // Filter based on `buildWhen`.
    j(([a, d]) => c(d))
    // Set the new state.
  ).subscribe(), () => {
    var a;
    (a = u.current) == null || a.unsubscribe(), u.current = null;
  }), []), t(s);
}
function wt({
  bloc: e,
  builder: t,
  buildWhen: r,
  listenWhen: n,
  listener: o
}) {
  return Re(e, {
    listener: o,
    listenWhen: n
  }), ut({
    bloc: e,
    builder: t,
    buildWhen: r
  });
}
export {
  ut as BlocBuilder,
  wt as BlocConsumer,
  Ot as BlocErrorBoundary,
  St as BlocListener,
  _t as BlocProvider,
  Je as BlocRenderError,
  Et as MultiBlocProvider,
  De as MultiProvider,
  yt as MultiRepositoryProvider,
  xe as Provider,
  mt as RepositoryProvider,
  ht as RootProvider,
  Qe as clientContextMap,
  re as contextMapContext,
  Ne as defaultBuildWhen,
  Ie as defaultErrorWhen,
  ee as defaultListenWhen,
  je as defaultSelector,
  ge as defaultSuspendWhen,
  $e as use,
  ft as useBloc,
  C as useBlocInstance,
  Re as useBlocListener,
  ze as useBlocSelector,
  dt as useBlocValue,
  te as useIsomorphicLayoutEffect,
  vt as usePropListener,
  Le as useProvider,
  pt as useRepository
};
