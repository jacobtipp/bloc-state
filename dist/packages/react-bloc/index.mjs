import { jsx as B, Fragment as ie, jsxs as Ee } from "react/jsx-runtime";
import * as U from "react";
import C, { useState as J, useRef as w, useMemo as $, createContext as Oe, useEffect as ce, createElement as me, useContext as ye, useCallback as g, useDebugValue as ae, useLayoutEffect as Q, useSyncExternalStore as Le } from "react";
import { startWith as T, distinctUntilChanged as ee, filter as I, map as X, firstValueFrom as be, pairwise as le } from "rxjs";
const Re = () => !1, fe = () => !0, we = () => !1, xe = (e) => e, Be = () => !0, k = /* @__PURE__ */ new Map(), de = ({
  children: e,
  classDef: r,
  dependencies: n = [],
  create: t,
  onMount: o,
  onUnmount: u
}) => {
  const [c, a] = J(!1), s = w(null);
  s.current === null && (s.current = t());
  const l = $(() => {
    let i = k.get(r.name);
    return i || (i = Oe({
      initialized: c,
      instance: s
    }), k.set(r.name, i), i);
  }, []);
  return ce(() => (s.current === null && (s.current = t(), a(!c)), o && o(s.current), () => {
    u && u(s.current), s.current = null;
  }), n), me(
    l.Provider,
    {
      value: {
        initialized: c,
        instance: s
      }
    },
    e
  );
}, pe = ({
  providers: e,
  children: r
}) => {
  const n = $(() => e.map((o) => ({ children: u }) => /* @__PURE__ */ B(o, { children: u })), []), t = $(() => n.reduce(
    (o, u) => ({ children: c }) => /* @__PURE__ */ B(o, { children: /* @__PURE__ */ B(u, { children: c }) }),
    // eslint-disable-next-line react/jsx-no-useless-fragment
    ({ children: o }) => /* @__PURE__ */ B(ie, { children: o })
  ), [n]);
  return /* @__PURE__ */ B(t, { children: r });
}, ve = (e) => {
  const r = k.get(e.name);
  if (!r)
    throw new Error(`${e.name} does not exist in the context map.`);
  return ye(r).instance.current;
}, D = (e) => ve(e);
function De(e) {
  return e && e.__esModule && Object.prototype.hasOwnProperty.call(e, "default") ? e.default : e;
}
var z = { exports: {} }, H = {}, W = { exports: {} }, F = {};
/**
 * @license React
 * use-sync-external-store-shim.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var re;
function Ve() {
  if (re)
    return F;
  re = 1;
  var e = C;
  function r(f, v) {
    return f === v && (f !== 0 || 1 / f === 1 / v) || f !== f && v !== v;
  }
  var n = typeof Object.is == "function" ? Object.is : r, t = e.useState, o = e.useEffect, u = e.useLayoutEffect, c = e.useDebugValue;
  function a(f, v) {
    var h = v(), E = t({ inst: { value: h, getSnapshot: v } }), _ = E[0].inst, O = E[1];
    return u(function() {
      _.value = h, _.getSnapshot = v, s(_) && O({ inst: _ });
    }, [f, h, v]), o(function() {
      return s(_) && O({ inst: _ }), f(function() {
        s(_) && O({ inst: _ });
      });
    }, [f]), c(h), h;
  }
  function s(f) {
    var v = f.getSnapshot;
    f = f.value;
    try {
      var h = v();
      return !n(f, h);
    } catch {
      return !0;
    }
  }
  function l(f, v) {
    return v();
  }
  var i = typeof window > "u" || typeof window.document > "u" || typeof window.document.createElement > "u" ? l : a;
  return F.useSyncExternalStore = e.useSyncExternalStore !== void 0 ? e.useSyncExternalStore : i, F;
}
var N = {};
/**
 * @license React
 * use-sync-external-store-shim.development.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var te;
function Ae() {
  return te || (te = 1, process.env.NODE_ENV !== "production" && function() {
    typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u" && typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStart == "function" && __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStart(new Error());
    var e = C, r = e.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED;
    function n(S) {
      {
        for (var d = arguments.length, y = new Array(d > 1 ? d - 1 : 0), p = 1; p < d; p++)
          y[p - 1] = arguments[p];
        t("error", S, y);
      }
    }
    function t(S, d, y) {
      {
        var p = r.ReactDebugCurrentFrame, m = p.getStackAddendum();
        m !== "" && (d += "%s", y = y.concat([m]));
        var b = y.map(function(L) {
          return String(L);
        });
        b.unshift("Warning: " + d), Function.prototype.apply.call(console[S], console, b);
      }
    }
    function o(S, d) {
      return S === d && (S !== 0 || 1 / S === 1 / d) || S !== S && d !== d;
    }
    var u = typeof Object.is == "function" ? Object.is : o, c = e.useState, a = e.useEffect, s = e.useLayoutEffect, l = e.useDebugValue, i = !1, f = !1;
    function v(S, d, y) {
      i || e.startTransition !== void 0 && (i = !0, n("You are using an outdated, pre-release alpha of React 18 that does not support useSyncExternalStore. The use-sync-external-store shim will not work correctly. Upgrade to a newer pre-release."));
      var p = d();
      if (!f) {
        var m = d();
        u(p, m) || (n("The result of getSnapshot should be cached to avoid an infinite loop"), f = !0);
      }
      var b = c({
        inst: {
          value: p,
          getSnapshot: d
        }
      }), L = b[0].inst, V = b[1];
      return s(function() {
        L.value = p, L.getSnapshot = d, h(L) && V({
          inst: L
        });
      }, [S, p, d]), a(function() {
        h(L) && V({
          inst: L
        });
        var M = function() {
          h(L) && V({
            inst: L
          });
        };
        return S(M);
      }, [S]), l(p), p;
    }
    function h(S) {
      var d = S.getSnapshot, y = S.value;
      try {
        var p = d();
        return !u(y, p);
      } catch {
        return !0;
      }
    }
    function E(S, d, y) {
      return d();
    }
    var _ = typeof window < "u" && typeof window.document < "u" && typeof window.document.createElement < "u", O = !_, R = O ? E : v, x = e.useSyncExternalStore !== void 0 ? e.useSyncExternalStore : R;
    N.useSyncExternalStore = x, typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u" && typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStop == "function" && __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStop(new Error());
  }()), N;
}
var ne;
function Se() {
  return ne || (ne = 1, process.env.NODE_ENV === "production" ? W.exports = Ve() : W.exports = Ae()), W.exports;
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
var oe;
function Te() {
  if (oe)
    return H;
  oe = 1;
  var e = C, r = Se();
  function n(l, i) {
    return l === i && (l !== 0 || 1 / l === 1 / i) || l !== l && i !== i;
  }
  var t = typeof Object.is == "function" ? Object.is : n, o = r.useSyncExternalStore, u = e.useRef, c = e.useEffect, a = e.useMemo, s = e.useDebugValue;
  return H.useSyncExternalStoreWithSelector = function(l, i, f, v, h) {
    var E = u(null);
    if (E.current === null) {
      var _ = { hasValue: !1, value: null };
      E.current = _;
    } else
      _ = E.current;
    E = a(function() {
      function R(p) {
        if (!x) {
          if (x = !0, S = p, p = v(p), h !== void 0 && _.hasValue) {
            var m = _.value;
            if (h(m, p))
              return d = m;
          }
          return d = p;
        }
        if (m = d, t(S, p))
          return m;
        var b = v(p);
        return h !== void 0 && h(m, b) ? m : (S = p, d = b);
      }
      var x = !1, S, d, y = f === void 0 ? null : f;
      return [function() {
        return R(i());
      }, y === null ? void 0 : function() {
        return R(y());
      }];
    }, [i, f, v, h]);
    var O = o(l, E[0], E[1]);
    return c(function() {
      _.hasValue = !0, _.value = O;
    }, [O]), s(O), O;
  }, H;
}
var q = {};
/**
 * @license React
 * use-sync-external-store-shim/with-selector.development.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var ue;
function We() {
  return ue || (ue = 1, process.env.NODE_ENV !== "production" && function() {
    typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u" && typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStart == "function" && __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStart(new Error());
    var e = C, r = Se();
    function n(i, f) {
      return i === f && (i !== 0 || 1 / i === 1 / f) || i !== i && f !== f;
    }
    var t = typeof Object.is == "function" ? Object.is : n, o = r.useSyncExternalStore, u = e.useRef, c = e.useEffect, a = e.useMemo, s = e.useDebugValue;
    function l(i, f, v, h, E) {
      var _ = u(null), O;
      _.current === null ? (O = {
        hasValue: !1,
        value: null
      }, _.current = O) : O = _.current;
      var R = a(function() {
        var y = !1, p, m, b = function(A) {
          if (!y) {
            y = !0, p = A;
            var j = h(A);
            if (E !== void 0 && O.hasValue) {
              var K = O.value;
              if (E(K, j))
                return m = K, K;
            }
            return m = j, j;
          }
          var _e = p, G = m;
          if (t(_e, A))
            return G;
          var P = h(A);
          return E !== void 0 && E(G, P) ? G : (p = A, m = P, P);
        }, L = v === void 0 ? null : v, V = function() {
          return b(f());
        }, M = L === null ? void 0 : function() {
          return b(L());
        };
        return [V, M];
      }, [f, v, h, E]), x = R[0], S = R[1], d = o(i, x, S);
      return c(function() {
        O.hasValue = !0, O.value = d;
      }, [d]), s(d), d;
    }
    q.useSyncExternalStoreWithSelector = l, typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u" && typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStop == "function" && __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStop(new Error());
  }()), q;
}
process.env.NODE_ENV === "production" ? z.exports = Te() : z.exports = We();
var Ce = z.exports;
const ge = /* @__PURE__ */ De(Ce), { useSyncExternalStoreWithSelector: Ie } = ge;
function Me() {
  const e = w(!1);
  return ce(() => (e.current = !0, () => {
    e.current = !1;
  }), []), g(() => e.current, []);
}
const je = (e, r) => {
  const n = Me(), t = r.suspendWhen, o = r.errorWhen, [u, c] = J(() => t(e.state)), a = w(null), s = w(e.state), l = w(null);
  if (Q(() => (l.current = e.state$.pipe(T(e.state)).subscribe((i) => {
    t(i) && (s.current = i, c(!0));
  }), () => {
    var i;
    (i = l.current) == null || i.unsubscribe(), l.current = null;
  }), [e]), o(e.state))
    throw new Z(e.state);
  if ((u || a.current) && (a.current === null && s.current !== null && (a.current = be(
    e.state$.pipe(
      T(s.current),
      I((i) => !t(i))
    )
  ).then(() => {
    a.current = null, s.current = null, n() && c(!1);
  })), a.current))
    throw a.current;
}, Ke = (e, r) => {
  const n = D(e), t = (r == null ? void 0 : r.selector) ?? xe, o = (r == null ? void 0 : r.listenWhen) ?? fe, u = (r == null ? void 0 : r.suspendWhen) ?? Re, c = (r == null ? void 0 : r.errorWhen) ?? we;
  je(n, {
    suspendWhen: u,
    errorWhen: c
  });
  const a = g(
    (l) => {
      const i = n.state$.pipe(
        T(n.state),
        ee(),
        I((f) => o(f)),
        X((f) => t(f)),
        ee()
      ).subscribe(() => setTimeout(() => l(), 0));
      return () => {
        i.unsubscribe();
      };
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [n]
  ), s = Ie(
    a,
    () => n.state,
    null,
    t
  );
  return ae(s), s;
};
class Z extends Error {
  constructor(r, n) {
    super("useBlocSelector: errorWhen triggered a new render Error"), this.state = r, Object.setPrototypeOf(this, Z.prototype);
  }
}
const $e = (e, r) => {
  const n = Ke(e, r), t = D(e);
  return [n, t];
}, he = (e, { listener: r, listenWhen: n }) => {
  const t = D(e), o = n ?? fe, u = w(null);
  Q(() => (u.current = t.state$.pipe(
    T(t.state),
    le(),
    I(([c, a]) => o(c, a)),
    X(([c, a]) => r(t, a))
  ).subscribe(), () => {
    var c;
    (c = u.current) == null || c.unsubscribe(), u.current = null;
  }), [t]);
}, ke = (e) => {
  const r = D(e), n = g(
    (o) => {
      const u = r.state$.subscribe(o);
      return () => u.unsubscribe();
    },
    [r]
  ), t = Le(
    // Use the memoized subscription function here.
    n,
    () => r.state
  );
  return ae(t), t;
}, ze = (e) => ve(e);
function Ye({
  bloc: e,
  listener: r,
  listenWhen: n,
  children: t
}) {
  return he(e, {
    listener: r,
    listenWhen: n
  }), /* @__PURE__ */ Ee(ie, { children: [
    " ",
    t,
    " "
  ] });
}
const Je = ({
  bloc: e,
  children: r,
  dependencies: n = [],
  create: t,
  onMount: o
}) => de({
  classDef: e,
  create: t,
  onMount: o,
  onUnmount: (u) => u.close(),
  dependencies: n,
  children: r
}), Qe = ({
  providers: e,
  children: r
}) => pe({
  providers: e,
  children: r
});
function Y(e, r) {
  return Y = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function(t, o) {
    return t.__proto__ = o, t;
  }, Y(e, r);
}
function Ge(e, r) {
  e.prototype = Object.create(r.prototype), e.prototype.constructor = e, Y(e, r);
}
var Pe = function(r, n) {
  return r === void 0 && (r = []), n === void 0 && (n = []), r.length !== n.length || r.some(function(t, o) {
    return !Object.is(t, n[o]);
  });
}, se = {
  error: null
}, Ue = /* @__PURE__ */ function(e) {
  Ge(r, e);
  function r() {
    for (var t, o = arguments.length, u = new Array(o), c = 0; c < o; c++)
      u[c] = arguments[c];
    return t = e.call.apply(e, [this].concat(u)) || this, t.state = se, t.resetErrorBoundary = function() {
      for (var a, s = arguments.length, l = new Array(s), i = 0; i < s; i++)
        l[i] = arguments[i];
      t.props.onReset == null || (a = t.props).onReset.apply(a, l), t.reset();
    }, t;
  }
  r.getDerivedStateFromError = function(o) {
    return {
      error: o
    };
  };
  var n = r.prototype;
  return n.reset = function() {
    this.setState(se);
  }, n.componentDidCatch = function(o, u) {
    var c, a;
    (c = (a = this.props).onError) == null || c.call(a, o, u);
  }, n.componentDidUpdate = function(o, u) {
    var c = this.state.error, a = this.props.resetKeys;
    if (c !== null && u.error !== null && Pe(o.resetKeys, a)) {
      var s, l;
      (s = (l = this.props).onResetKeysChange) == null || s.call(l, o.resetKeys, a), this.reset();
    }
  }, n.render = function() {
    var o = this.state.error, u = this.props, c = u.fallbackRender, a = u.FallbackComponent, s = u.fallback;
    if (o !== null) {
      var l = {
        error: o,
        resetErrorBoundary: this.resetErrorBoundary
      };
      if (/* @__PURE__ */ U.isValidElement(s))
        return s;
      if (typeof c == "function")
        return c(l);
      if (a)
        return /* @__PURE__ */ U.createElement(a, l);
      throw new Error("react-error-boundary requires either a fallback, fallbackRender, or FallbackComponent prop");
    }
    return this.props.children;
  }, r;
}(U.Component);
const Xe = ({
  bloc: e,
  fallback: r,
  onReset: n,
  children: t
}) => {
  const o = D(e), u = g(() => n(o), [o]);
  return /* @__PURE__ */ B(Ue, { FallbackComponent: r, onReset: u, children: t });
}, Ze = ({
  repository: e,
  children: r,
  dependencies: n = [],
  create: t,
  onMount: o,
  onUnmount: u
}) => de({
  classDef: e,
  dependencies: n,
  onMount: o,
  onUnmount: u,
  create: t,
  children: r
}), er = ({
  providers: e,
  children: r
}) => pe({
  providers: e,
  children: r
});
function He({
  bloc: e,
  builder: r,
  buildWhen: n
}) {
  const t = D(e), o = n ?? Be, u = w(null), [c, a] = J(() => t.state);
  return Q(() => (u.current = t.state$.pipe(
    T(c),
    le(),
    I(([s, l]) => o(s, l)),
    X(([s, l]) => {
      a(l);
    })
  ).subscribe(), () => {
    var s;
    (s = u.current) == null || s.unsubscribe(), u.current = null;
  }), []), r(c);
}
function rr({
  bloc: e,
  builder: r,
  buildWhen: n,
  listenWhen: t,
  listener: o
}) {
  return he(e, {
    listener: o,
    listenWhen: t
  }), He({
    bloc: e,
    builder: r,
    buildWhen: n
  });
}
export {
  He as BlocBuilder,
  rr as BlocConsumer,
  Xe as BlocErrorBoundary,
  Ye as BlocListener,
  Je as BlocProvider,
  Z as BlocRenderError,
  Qe as MultiBlocProvider,
  pe as MultiProvider,
  er as MultiRepositoryProvider,
  de as Provider,
  Ze as RepositoryProvider,
  Be as defaultBuildWhen,
  we as defaultErrorWhen,
  fe as defaultListenWhen,
  xe as defaultSelector,
  Re as defaultSuspendWhen,
  k as providerContextMap,
  $e as useBloc,
  D as useBlocInstance,
  he as useBlocListener,
  Ke as useBlocSelector,
  ke as useBlocValue,
  Me as useIsMounted,
  ve as useProvider,
  ze as useRepository
};
