## [4.0.0-next.3](https://github.com/jacobtipp/bloc-state/compare/react-bloc-v4.0.0-next.2...react-bloc-v4.0.0-next.3) (2024-02-01)


### Build System Dependencies

* **deps:** 📦️ update rxjs peerDep to support minor and patch releases ([bf91636](https://github.com/jacobtipp/bloc-state/commit/bf916369ad11007e4a4361113e5ef8e91c13673e))

## [4.0.0-next.2](https://github.com/jacobtipp/bloc-state/compare/react-bloc-v4.0.0-next.1...react-bloc-v4.0.0-next.2) (2024-01-30)


### Features

* **bloc:** ✨ abstract class types can be used with on method ([bcf6be3](https://github.com/jacobtipp/bloc-state/commit/bcf6be3fdc1a622afd1393a59df50bd43eddaf58))
* **bloc:** ✨ check for ancestors of event types in add method ([3cfa364](https://github.com/jacobtipp/bloc-state/commit/3cfa364993f090d232bb77eb5ce3ea3c34ae0366))

## [4.0.0-next.1](https://github.com/jacobtipp/bloc-state/compare/react-bloc-v3.6.0...react-bloc-v4.0.0-next.1) (2024-01-28)


### ⚠ BREAKING CHANGES

* **bloc:** Bloc.observer is removed

### Features

* **bloc:** ✨ add static Bloc.ignoreListeners property ([fde8991](https://github.com/jacobtipp/bloc-state/commit/fde89917a5df4c889ebf0a8ac81de8cf581bc830))
* **react-bloc:** ✨ add disposeTimer prop for Provider ([d514c1e](https://github.com/jacobtipp/bloc-state/commit/d514c1eb778a3de9c726338ecefd757f8a2c69c2))
* **react-bloc:** ✨ add getServerSnapshot in useBlocValue and useBlocSelector ([4f88272](https://github.com/jacobtipp/bloc-state/commit/4f88272c0082555a321076c78e096c9d80cb2a4a))
* **react-bloc:** ✨ add hydration to Provider and add ContextMapProvider ([16bacee](https://github.com/jacobtipp/bloc-state/commit/16baceee0078a4430b5bd162168ef80a4ef9dfff))
* **react-bloc:** ✨ add usePropListener hook ([fafcb43](https://github.com/jacobtipp/bloc-state/commit/fafcb43d0ec77095dbcf2cfa6c96c3654cdea1b8))
* **react-bloc:** ✨ useBlocListener now checks if Bloc.ignoreListeners is enabled ([a144f37](https://github.com/jacobtipp/bloc-state/commit/a144f378ae3c8ef1dbc3e085d6eec7f7eaf4eee1))


### Bug Fixes

* **bloc:** 💥 🐛 replace Bloc.observer with BlocObserver.observer static property ([394d8d5](https://github.com/jacobtipp/bloc-state/commit/394d8d56dde74f03946c1e25016edf8eb0ec8248))


### Build System Dependencies

* **deps:** 📦️ add @microsoft/use-disposable package and update to [@next](https://github.com/next) v14.1 ([204cf88](https://github.com/jacobtipp/bloc-state/commit/204cf8814bfa5048f4dcf5a1bf8e9b7fca452278))


### Code Refactoring

* **bloc:** ♻️ emit now warns instead of throws if a bloc is closed ([d359cc9](https://github.com/jacobtipp/bloc-state/commit/d359cc9ddd4a84b21e5bc6e053440ee2878d726b))
* **bloc:** ♻️ onTransition and onChange are called before emitting ([9e857a4](https://github.com/jacobtipp/bloc-state/commit/9e857a4e1b904e2abc2782d5a6cfe11a4306c33a))
* **bloc:** ♻️ prevent BlocObserver.observer from being set on the server ([1fa05ed](https://github.com/jacobtipp/bloc-state/commit/1fa05ed0f44b977be8b170c677d2d3c4bcefd406))
* **react-bloc:** ♻️ add experimental React.use hook for handling suspense ([fd22e65](https://github.com/jacobtipp/bloc-state/commit/fd22e6523cb76df6f161ce58e6fae32206fd293b))
* **react-bloc:** ♻️ add useIsomorphicLayoutEffect for SSR ([85b9618](https://github.com/jacobtipp/bloc-state/commit/85b961801674c5179d84344875dee88ae9ff2682))
* **react-bloc:** ♻️ rename ContextMapProvider to RootProvider ([cf88a3b](https://github.com/jacobtipp/bloc-state/commit/cf88a3b27addf4588d600504a19880ddfd005e78))
* **react-bloc:** ♻️ rename file name from app-provider to root-provider ([6e0d5fa](https://github.com/jacobtipp/bloc-state/commit/6e0d5fa776d71c78671ecbffd33bf8929f4273c8))

## [3.6.0](https://github.com/jacobtipp/bloc-state/compare/react-bloc-v3.5.0...react-bloc-v3.6.0) (2024-01-17)


### Features

* **react-bloc:** ✨ add Provider component and useProvider hook ([7984d39](https://github.com/jacobtipp/bloc-state/commit/7984d399813e313a12cdcbab5bb5ca5387a8edf3))
* **react-bloc:** ✨ Providers now have an onMount and onUnmount callback handler ([fe9e87a](https://github.com/jacobtipp/bloc-state/commit/fe9e87a0aa79805ee79a1b928cad0fd520d07f39))


### Bug Fixes

* **react-bloc:** 🐛 useBlocSuspenseOrError should only use a single promise for suspense ([27d7cf6](https://github.com/jacobtipp/bloc-state/commit/27d7cf6789e3f515494c1f5787ff21799b8575c2))


### Code Refactoring

* **react-bloc:** ♻️ add concurrent/SSR support for BlocProvider and RepositoryProvider ([78ae8ea](https://github.com/jacobtipp/bloc-state/commit/78ae8ea01e6d2786fe7a1d458fd8aae6757f1aff))
* **react-bloc:** ♻️ support both Class and Abstract class types in Provider ([67b9b76](https://github.com/jacobtipp/bloc-state/commit/67b9b768149bfbaf4100a5fcd589b12ff290be80))

## [3.5.0](https://github.com/jacobtipp/bloc-state/compare/react-bloc-v3.4.0...react-bloc-v3.5.0) (2024-01-10)


### Features

* **react-bloc:** ✨ add BlocConsumer component ([acfcbfd](https://github.com/jacobtipp/bloc-state/commit/acfcbfdefa24e3c2c73d811b29afb4bd0491be7f))

## [3.4.0](https://github.com/jacobtipp/bloc-state/compare/react-bloc-v3.3.1...react-bloc-v3.4.0) (2024-01-10)


### Features

* **react-bloc:** ✨ add BlocBuilder component ([1a590ce](https://github.com/jacobtipp/bloc-state/commit/1a590ce29d1b92893e34025dd25b9c1600fab30e))


### Documentation

* **readme:** 📚️ add BlocBuilder section to @jacobtipp/react-bloc ([f59085d](https://github.com/jacobtipp/bloc-state/commit/f59085db3a8b920e85dc4059ba5d91b2428a4b9c))

## [3.3.1](https://github.com/jacobtipp/bloc-state/compare/react-bloc-v3.3.0...react-bloc-v3.3.1) (2024-01-10)


### Bug Fixes

* **react-bloc:** 🐛 cache suspense state in useRef before suspending ([f389c04](https://github.com/jacobtipp/bloc-state/commit/f389c04c2899d7d64a2916258aaab05e537c4c7e))

## [3.3.0](https://github.com/jacobtipp/bloc-state/compare/react-bloc-v3.2.5...react-bloc-v3.3.0) (2024-01-04)


### Features

* **bloc:** ✨ add addError method to BlocBase ([84e0781](https://github.com/jacobtipp/bloc-state/commit/84e07811b2255b15aa52fb8af4d1672a401c7097))
* **bloc:** ✨ add isClosed getter property to BlocEmitter ([18fae30](https://github.com/jacobtipp/bloc-state/commit/18fae3060af82913b55553812110f76294654b07))
* **bloc:** ✨ add listenTo method ([06be27c](https://github.com/jacobtipp/bloc-state/commit/06be27c9fc5a6f0d2436e38e13bf8b1c3cb22368))


### Bug Fixes

* **react-bloc:** 🐛 useSuspenseOrError requries useLayoutEffect to prevent memory leak ([100fd02](https://github.com/jacobtipp/bloc-state/commit/100fd02aa166b151056c949a3eb9a2ae0b925e30))


### Code Refactoring

* **react-bloc:** ♻️ subscribe to blocListener stream inside useLayoutEffect ([fee43be](https://github.com/jacobtipp/bloc-state/commit/fee43be94238a92c72d7ee275980d88a60279f99))
* **react-bloc:** ♻️ switch back to useSyncExternalStoreWithSelector ([43aa713](https://github.com/jacobtipp/bloc-state/commit/43aa713b8a2044913ef70e0989b7ce5d8951260b))
* **react-bloc:** ♻️ UseBlocSelectorConfig is now optional ([1c1560e](https://github.com/jacobtipp/bloc-state/commit/1c1560e6754a7e7daca87a0f05a73d97dcdf780b))

## [3.2.5](https://github.com/jacobtipp/bloc-state/compare/react-bloc-v3.2.4...react-bloc-v3.2.5) (2023-12-12)


### Code Refactoring

* **bloc:** ♻️ use asObservable when exposing Bloc.state$ ([54dcd4b](https://github.com/jacobtipp/bloc-state/commit/54dcd4bc9f9d3651a0554e08d9a0e464e8c30f20))

## [3.2.4](https://github.com/jacobtipp/bloc-state/compare/react-bloc-v3.2.3...react-bloc-v3.2.4) (2023-12-11)


### Revert Changes

* **react-bloc:** ♻️ useBlocListener now uses useBloc and useEffect to handle effects ([303a819](https://github.com/jacobtipp/bloc-state/commit/303a81912a2349cf8ce9ddfe7ec3fec061852778))

## [3.2.3](https://github.com/jacobtipp/bloc-state/compare/react-bloc-v3.2.2...react-bloc-v3.2.3) (2023-12-05)


### Revert Changes

* **react-bloc:** ♻️ use bloc.state snapshot directly in useBlocListener ([c79b764](https://github.com/jacobtipp/bloc-state/commit/c79b76444c3824fa98e3826bb22df5ba60caa8f3))


### Code Refactoring

* **react-bloc:** ♻️ queue state emissions for next event loop tick ([9a86536](https://github.com/jacobtipp/bloc-state/commit/9a86536d868de216c69de26d33cf4cf5403a0169))
* **react-bloc:** ♻️ use bloc.state snapshot directly in useBlocListener ([a7eab7a](https://github.com/jacobtipp/bloc-state/commit/a7eab7add5842241137f097dd03a11ac54be6faa))

## [3.2.3-dev-react-bloc.2](https://github.com/jacobtipp/bloc-state/compare/react-bloc-v3.2.3-dev-react-bloc.1...react-bloc-v3.2.3-dev-react-bloc.2) (2023-12-05)


### Revert Changes

* **react-bloc:** ♻️ use bloc.state snapshot directly in useBlocListener ([132b6b4](https://github.com/jacobtipp/bloc-state/commit/132b6b448559b139d14a14aa574046faf6c3ea88))


### Code Refactoring

* **react-bloc:** ♻️ queue state emissions for next event loop tick ([1050002](https://github.com/jacobtipp/bloc-state/commit/105000260def563b76baadaaae20b96f391afd6a))

## [3.2.3-dev-react-bloc.1](https://github.com/jacobtipp/bloc-state/compare/react-bloc-v3.2.2...react-bloc-v3.2.3-dev-react-bloc.1) (2023-12-05)


### Code Refactoring

* **react-bloc:** ♻️ use bloc.state snapshot directly in useBlocListener ([2f302bc](https://github.com/jacobtipp/bloc-state/commit/2f302bc3a065b8f19e0dbfad23cd85bf4b53e421))

## [3.2.2](https://github.com/jacobtipp/bloc-state/compare/react-bloc-v3.2.1...react-bloc-v3.2.2) (2023-12-05)


### Code Refactoring

* **react-bloc:** ♻️ useBlocListener now uses useBloc and useEffect to handle effects ([5cb9a53](https://github.com/jacobtipp/bloc-state/commit/5cb9a533b36a817474c31c1dbf9c0df5de8e108f))
* **react-bloc:** ♻️ useBlocListener uses useLayoutEffect instead of useEffect ([8dbdf46](https://github.com/jacobtipp/bloc-state/commit/8dbdf46ffe9fd1dc07b72d7852aa5e56299b1f2c))


### Revert Changes

* **react-bloc:** ♻️ useBlocListener uses useLayoutEffect instead of useEffect ([ba68a79](https://github.com/jacobtipp/bloc-state/commit/ba68a79e47ccaae52fd3014d11fe521de08cb319))

## [3.2.2-dev-react-bloc.3](https://github.com/jacobtipp/bloc-state/compare/react-bloc-v3.2.2-dev-react-bloc.2...react-bloc-v3.2.2-dev-react-bloc.3) (2023-12-05)


### Revert Changes

* **react-bloc:** ♻️ useBlocListener uses useLayoutEffect instead of useEffect ([f8fe5d9](https://github.com/jacobtipp/bloc-state/commit/f8fe5d90a77fe35cb190e26808c22ff12c0805cf))

## [3.2.2-dev-react-bloc.2](https://github.com/jacobtipp/bloc-state/compare/react-bloc-v3.2.2-dev-react-bloc.1...react-bloc-v3.2.2-dev-react-bloc.2) (2023-12-05)


### Code Refactoring

* **react-bloc:** ♻️ useBlocListener uses useLayoutEffect instead of useEffect ([900327a](https://github.com/jacobtipp/bloc-state/commit/900327ac18c278e37091d393aad4cbc9822e68b8))

## [3.2.2-dev-react-bloc.1](https://github.com/jacobtipp/bloc-state/compare/react-bloc-v3.2.1...react-bloc-v3.2.2-dev-react-bloc.1) (2023-12-04)


### Code Refactoring

* **react-bloc:** ♻️ useBlocListener now uses useBloc and useEffect to handle effects ([3a29e19](https://github.com/jacobtipp/bloc-state/commit/3a29e19556b44599d5499888279c624db83413c1))

## [3.2.1](https://github.com/jacobtipp/bloc-state/compare/react-bloc-v3.2.0...react-bloc-v3.2.1) (2023-12-01)


### Bug Fixes

* **bloc:** 🐛 bloc eventHandler no longer swallows errors ([f955fbb](https://github.com/jacobtipp/bloc-state/commit/f955fbb605a8db36dcc7e3e005fff4c1e1972113))

## [3.2.0](https://github.com/jacobtipp/bloc-state/compare/react-bloc-v3.1.0...react-bloc-v3.2.0) (2023-11-29)


### Features

* **react-bloc:** ✨ add RepositoryProvider/MultiRepositoryProvider ([97a3389](https://github.com/jacobtipp/bloc-state/commit/97a3389586f98645efe2af613daf5bed3ebfc8d4))

## [3.1.0](https://github.com/jacobtipp/bloc-state/compare/react-bloc-v3.0.2...react-bloc-v3.1.0) (2023-11-28)


### Features

* **react-bloc:** ✨ add MultiBlocProvider ([fad3064](https://github.com/jacobtipp/bloc-state/commit/fad306433162ffa672eed810c1112014431e0865))

## [3.0.2](https://github.com/jacobtipp/bloc-state/compare/react-bloc-v3.0.1...react-bloc-v3.0.2) (2023-11-27)


### Bug Fixes

* **react-bloc:** 🐛 resolve current suspense handler before creating a new one ([10eb299](https://github.com/jacobtipp/bloc-state/commit/10eb2997444c1b40e92db46061cc4e142264e2fe))


### Build System Dependencies

* **deps:** 📦️ remove dead types from @jacobtipp/react-bloc package ([aa3e1fe](https://github.com/jacobtipp/bloc-state/commit/aa3e1fe0bc3db2cb52b960c9abda1ef4b32f94e8))

## [3.0.2-dev-react-bloc.1](https://github.com/jacobtipp/bloc-state/compare/react-bloc-v3.0.1...react-bloc-v3.0.2-dev-react-bloc.1) (2023-11-27)


### Build System Dependencies

* **deps:** 📦️ remove dead types from @jacobtipp/react-bloc package ([0f1a58d](https://github.com/jacobtipp/bloc-state/commit/0f1a58dfd82b8906a23f5da5f4fca91a4fb8f443))

## [3.0.1](https://github.com/jacobtipp/bloc-state/compare/react-bloc-v3.0.0...react-bloc-v3.0.1) (2023-11-26)


### Bug Fixes

* **bloc:** 🐛 errors should be rethrown ([d570228](https://github.com/jacobtipp/bloc-state/commit/d570228266c73d56cd8a2b19bc7203c64acc9ccd))

## [3.0.0](https://github.com/jacobtipp/bloc-state/compare/react-bloc-v2.0.7...react-bloc-v3.0.0) (2023-11-13)


### ⚠ BREAKING CHANGES

* **bloc:** BlocObserver.onCreate requires initialState as second required paramter

### Features

* **bloc:** ✨ add fromJson and toJson to cubit/bloc ([86b05d4](https://github.com/jacobtipp/bloc-state/commit/86b05d43446d72909c60e88b3e784a15cbaa3ab1))
* **bloc:** ✨ add public __unsafeEmit__ method to BlocBase ([a785dec](https://github.com/jacobtipp/bloc-state/commit/a785dec8167e272498885b9b0b2328a33189bc00))
* **bloc:** 💥 ✨ add initialState argument to BlocObserver.onCreate ([38a5de7](https://github.com/jacobtipp/bloc-state/commit/38a5de7766a3147c0384ef1564b085da8cdce247))


### Code Refactoring

* **bloc:** ♻️ onChange and onTransition call after state is emitted ([5753e21](https://github.com/jacobtipp/bloc-state/commit/5753e2139cdbe78f5a8fbe12e101f7fe0e63fe78))
* **react-bloc:** ♻️ selectors now use useSyncExternalStore ([aaa3db5](https://github.com/jacobtipp/bloc-state/commit/aaa3db58f61d57b9250bcb6fd8d9d2355aa985cf))

## [2.0.7](https://github.com/jacobtipp/bloc-state/compare/react-bloc-v2.0.6...react-bloc-v2.0.7) (2023-10-26)


### Documentation

* **readme:** 📚️ update introduction for @jacobtipp/bloc ([0774f6e](https://github.com/jacobtipp/bloc-state/commit/0774f6e6b205ebd0e327e98e5e2698167ef7a057))

## [2.0.6](https://github.com/jacobtipp/bloc-state/compare/react-bloc-v2.0.5...react-bloc-v2.0.6) (2023-10-05)


### Documentation

* **readme:** 📚️ update readme for @jacobtipp/bloc [only bloc] ([1159d55](https://github.com/jacobtipp/bloc-state/commit/1159d55aa0ae98353b1c8394e60d2a73a1fc6f53))

## [2.0.5](https://github.com/jacobtipp/bloc-state/compare/react-bloc-v2.0.4...react-bloc-v2.0.5) (2023-10-05)


### Documentation

* **readme:** 📚️ update readme for @jacobtipp/react-bloc ([cbb68d3](https://github.com/jacobtipp/bloc-state/commit/cbb68d3ad9b4afa63da2ae0a2936843b177d327c))

## [2.0.4](https://github.com/jacobtipp/bloc-state/compare/react-bloc-v2.0.3...react-bloc-v2.0.4) (2023-10-01)


### Code Refactoring

* **bloc:** ♻️ export StateType from bloc package instead of react-bloc ([1f463be](https://github.com/jacobtipp/bloc-state/commit/1f463bed0335a0b5291484832ae9e5e59b9984e4))

## [2.0.3](https://github.com/jacobtipp/bloc-state/compare/react-bloc-v2.0.2...react-bloc-v2.0.3) (2023-09-26)


### Build System Dependencies

* **deps:** 📦️ update build type declaration paths ([0814d2b](https://github.com/jacobtipp/bloc-state/commit/0814d2b25b0614c3de1b86d14e4aaf7ffb03c0cf))

## [2.0.2](https://github.com/jacobtipp/bloc-state/compare/react-bloc-v2.0.1...react-bloc-v2.0.2) (2023-09-25)


### Code Refactoring

* **react-bloc:** ♻️ remove observable-hooks dependency ([8d209b0](https://github.com/jacobtipp/bloc-state/commit/8d209b0bbb7372179090aff3dee429f5500e8f88))

## [2.0.1](https://github.com/jacobtipp/bloc-state/compare/react-bloc-v2.0.0...react-bloc-v2.0.1) (2023-09-25)


### Code Refactoring

* **react-bloc:** ♻️ update hooks implementation ([e7e5152](https://github.com/jacobtipp/bloc-state/commit/e7e5152f9a1f4f01c9b5852d6819f13551991473))

## [2.0.0](https://github.com/jacobtipp/bloc-state/compare/react-bloc-v1.1.1...react-bloc-v2.0.0) (2023-09-25)


### ⚠ BREAKING CHANGES

* **bloc:** Bloc events no longer need to extend BlocEvent abstract class

### Features

* **bloc:** 💥 ✨ remove BlocEvent abstract class ([1b80fb0](https://github.com/jacobtipp/bloc-state/commit/1b80fb058b67c1c42bafb37e67db6da4cecfba27))

## [1.1.1](https://github.com/jacobtipp/bloc-state/compare/react-bloc-v1.1.0...react-bloc-v1.1.1) (2023-09-25)


### Revert Changes

* **bloc): "refactor(bloc:** 💥 ✨ remove BlocEvent abstract class" ([d4bb6b1](https://github.com/jacobtipp/bloc-state/commit/d4bb6b11b18ec03a221ec0af9f4c85d4de70343c))

## [1.1.0](https://github.com/jacobtipp/bloc-state/compare/react-bloc-v1.0.7...react-bloc-v1.1.0) (2023-09-25)


### ⚠ BREAKING CHANGES

* **bloc:** Bloc events no longer need to extend BlocEvent abstract class

### Features

* **bloc:** ✨ add optional name property to BlocBase constructor ([1f0321c](https://github.com/jacobtipp/bloc-state/commit/1f0321cc550706cb92e804b688d1661cbda1557c))


### Code Refactoring

* **bloc:** ♻️  add protected subscriptions set to BlocBase ([622446c](https://github.com/jacobtipp/bloc-state/commit/622446c0506d377b60166e80f6c1042e864f3aa3))
* **bloc:** ♻️  remove onCreate method from BlocBase ([fe9cc6c](https://github.com/jacobtipp/bloc-state/commit/fe9cc6cbe71971dfd4803dee4104aa18309698d8))
* **bloc:** ♻️ rename _Emitter class to BlocEmitterImpl ([1996bc4](https://github.com/jacobtipp/bloc-state/commit/1996bc4e34888193a550eb37b68460472553ec5b))
* **bloc:** 💥 ✨ remove BlocEvent abstract class ([5615d0c](https://github.com/jacobtipp/bloc-state/commit/5615d0c523d16ff449de7254245e5a012271b0ff))

## [1.0.7](https://github.com/jacobtipp/bloc-state/compare/react-bloc-v1.0.6...react-bloc-v1.0.7) (2023-04-21)


### Code Refactoring

* **state:** ♻️ add readonly access modifier to data ([#12](https://github.com/jacobtipp/bloc-state/issues/12)) ([e6b924d](https://github.com/jacobtipp/bloc-state/commit/e6b924dc4d8c9727c3faa613d77e753f3c678932))
