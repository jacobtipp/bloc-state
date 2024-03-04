## [4.0.3](https://github.com/jacobtipp/bloc-state/compare/bloc-v4.0.2...bloc-v4.0.3) (2024-03-04)


### Build System Dependencies

* **deps:** 📦️ update @jacobtipp/bloc exports to support moduleResolution bundler ([00b052d](https://github.com/jacobtipp/bloc-state/commit/00b052da2c0db76a28e71c67940593724ef30af3))

## [4.0.3-next.1](https://github.com/jacobtipp/bloc-state/compare/bloc-v4.0.2...bloc-v4.0.3-next.1) (2024-03-04)


### Build System Dependencies

* **deps:** 📦️ update @jacobtipp/bloc exports to support moduleResolution bundler ([cab1294](https://github.com/jacobtipp/bloc-state/commit/cab12943e6053e44643fb4a270a869b8b18455e3))

## [4.0.2](https://github.com/jacobtipp/bloc-state/compare/bloc-v4.0.1...bloc-v4.0.2) (2024-03-04)


### Documentation

* **readme:** 📚️ add docsify docs ([9f71573](https://github.com/jacobtipp/bloc-state/commit/9f71573d34a54ce74aaf563b9132b71cfdaf5554))

## [4.0.1](https://github.com/jacobtipp/bloc-state/compare/bloc-v4.0.0...bloc-v4.0.1) (2024-02-04)


### Bug Fixes

* **bloc:** 🐛 BlocBase.listenTo should infer its observable type ([d61187a](https://github.com/jacobtipp/bloc-state/commit/d61187ae2926c8bad95615853ccc77f3709928c5))

## [4.0.0](https://github.com/jacobtipp/bloc-state/compare/bloc-v3.1.0...bloc-v4.0.0) (2024-02-03)


### ⚠ BREAKING CHANGES

* **bloc:** Bloc.observer is removed

### Features

* **bloc:** ✨ abstract class types can be used with on method ([49c1c5b](https://github.com/jacobtipp/bloc-state/commit/49c1c5bf4b748eb463b1973b4a8a0c0097be2646))
* **bloc:** ✨ add isServer and isClient methods ([0e850dc](https://github.com/jacobtipp/bloc-state/commit/0e850dce97eb28c341e02373facbbfd600bea654))
* **bloc:** ✨ add static Bloc.ignoreListeners property ([46dc707](https://github.com/jacobtipp/bloc-state/commit/46dc707fc015c1c4d1295b355abc6b43eb103dde))
* **bloc:** ✨ check for ancestors of event types in add method ([f9d91ad](https://github.com/jacobtipp/bloc-state/commit/f9d91adf7d70434c3726e8163c9501910b0a6d30))


### Bug Fixes

* **bloc:** 💥 🐛 replace Bloc.observer with BlocObserver.observer static property ([acb5511](https://github.com/jacobtipp/bloc-state/commit/acb5511a31181addb22fa08396c1c076cc42fb3a))


### Build System Dependencies

* **deps:** 📦️ update rxjs peerDep to support minor and patch releases ([79d58f5](https://github.com/jacobtipp/bloc-state/commit/79d58f594ddc80ed6a4f087f4b06ad6c10da1135))


### Code Refactoring

* **bloc:** ♻️ check ancestor event hierarchy in on method ([123ef1b](https://github.com/jacobtipp/bloc-state/commit/123ef1b9e83ad1d6bfb57962f5bb6787c88279ba))
* **bloc:** ♻️ emit now warns instead of throws if a bloc is closed ([5fb68b6](https://github.com/jacobtipp/bloc-state/commit/5fb68b63734097d654830954867c4e748d9a419f))
* **bloc:** ♻️ onTransition and onChange are called before emitting ([c56918d](https://github.com/jacobtipp/bloc-state/commit/c56918d2eab538749fa37732c9c25d5883dbd42d))
* **bloc:** ♻️ prevent BlocObserver.observer from being set on the server ([3d93074](https://github.com/jacobtipp/bloc-state/commit/3d93074db5450fd5e6c6d7559fe9c25d85c909de))

## [4.0.0-next.4](https://github.com/jacobtipp/bloc-state/compare/bloc-v4.0.0-next.3...bloc-v4.0.0-next.4) (2024-02-03)


### Features

* **bloc:** ✨ add isServer and isClient methods ([52f74dd](https://github.com/jacobtipp/bloc-state/commit/52f74ddaa14b9b98a1fba30dd94cd76ee9592363))


### Code Refactoring

* **bloc:** ♻️ check ancestor event hierarchy in on method ([5b19aa5](https://github.com/jacobtipp/bloc-state/commit/5b19aa5f38b1267e3f36b35851e3001ead6e021c))

## [4.0.0-next.3](https://github.com/jacobtipp/bloc-state/compare/bloc-v4.0.0-next.2...bloc-v4.0.0-next.3) (2024-02-01)


### Build System Dependencies

* **deps:** 📦️ update rxjs peerDep to support minor and patch releases ([bf91636](https://github.com/jacobtipp/bloc-state/commit/bf916369ad11007e4a4361113e5ef8e91c13673e))

## [4.0.0-next.2](https://github.com/jacobtipp/bloc-state/compare/bloc-v4.0.0-next.1...bloc-v4.0.0-next.2) (2024-01-30)


### Features

* **bloc:** ✨ abstract class types can be used with on method ([bcf6be3](https://github.com/jacobtipp/bloc-state/commit/bcf6be3fdc1a622afd1393a59df50bd43eddaf58))
* **bloc:** ✨ check for ancestors of event types in add method ([3cfa364](https://github.com/jacobtipp/bloc-state/commit/3cfa364993f090d232bb77eb5ce3ea3c34ae0366))

## [4.0.0-next.1](https://github.com/jacobtipp/bloc-state/compare/bloc-v3.1.0...bloc-v4.0.0-next.1) (2024-01-28)


### ⚠ BREAKING CHANGES

* **bloc:** Bloc.observer is removed

### Features

* **bloc:** ✨ add static Bloc.ignoreListeners property ([fde8991](https://github.com/jacobtipp/bloc-state/commit/fde89917a5df4c889ebf0a8ac81de8cf581bc830))


### Bug Fixes

* **bloc:** 💥 🐛 replace Bloc.observer with BlocObserver.observer static property ([394d8d5](https://github.com/jacobtipp/bloc-state/commit/394d8d56dde74f03946c1e25016edf8eb0ec8248))


### Code Refactoring

* **bloc:** ♻️ emit now warns instead of throws if a bloc is closed ([d359cc9](https://github.com/jacobtipp/bloc-state/commit/d359cc9ddd4a84b21e5bc6e053440ee2878d726b))
* **bloc:** ♻️ onTransition and onChange are called before emitting ([9e857a4](https://github.com/jacobtipp/bloc-state/commit/9e857a4e1b904e2abc2782d5a6cfe11a4306c33a))
* **bloc:** ♻️ prevent BlocObserver.observer from being set on the server ([1fa05ed](https://github.com/jacobtipp/bloc-state/commit/1fa05ed0f44b977be8b170c677d2d3c4bcefd406))

## [3.1.0](https://github.com/jacobtipp/bloc-state/compare/bloc-v3.0.3...bloc-v3.1.0) (2024-01-04)


### Features

* **bloc:** ✨ add addError method to BlocBase ([84e0781](https://github.com/jacobtipp/bloc-state/commit/84e07811b2255b15aa52fb8af4d1672a401c7097))
* **bloc:** ✨ add isClosed getter property to BlocEmitter ([18fae30](https://github.com/jacobtipp/bloc-state/commit/18fae3060af82913b55553812110f76294654b07))
* **bloc:** ✨ add listenTo method ([06be27c](https://github.com/jacobtipp/bloc-state/commit/06be27c9fc5a6f0d2436e38e13bf8b1c3cb22368))

## [3.0.3](https://github.com/jacobtipp/bloc-state/compare/bloc-v3.0.2...bloc-v3.0.3) (2023-12-12)


### Code Refactoring

* **bloc:** ♻️ use asObservable when exposing Bloc.state$ ([54dcd4b](https://github.com/jacobtipp/bloc-state/commit/54dcd4bc9f9d3651a0554e08d9a0e464e8c30f20))

## [3.0.2](https://github.com/jacobtipp/bloc-state/compare/bloc-v3.0.1...bloc-v3.0.2) (2023-12-01)


### Bug Fixes

* **bloc:** 🐛 bloc eventHandler no longer swallows errors ([f955fbb](https://github.com/jacobtipp/bloc-state/commit/f955fbb605a8db36dcc7e3e005fff4c1e1972113))

## [3.0.1](https://github.com/jacobtipp/bloc-state/compare/bloc-v3.0.0...bloc-v3.0.1) (2023-11-26)


### Bug Fixes

* **bloc:** 🐛 errors should be rethrown ([d570228](https://github.com/jacobtipp/bloc-state/commit/d570228266c73d56cd8a2b19bc7203c64acc9ccd))

## [3.0.0](https://github.com/jacobtipp/bloc-state/compare/bloc-v2.0.4...bloc-v3.0.0) (2023-11-13)


### ⚠ BREAKING CHANGES

* **bloc:** BlocObserver.onCreate requires initialState as second required paramter

### Features

* **bloc:** ✨ add fromJson and toJson to cubit/bloc ([86b05d4](https://github.com/jacobtipp/bloc-state/commit/86b05d43446d72909c60e88b3e784a15cbaa3ab1))
* **bloc:** ✨ add public __unsafeEmit__ method to BlocBase ([a785dec](https://github.com/jacobtipp/bloc-state/commit/a785dec8167e272498885b9b0b2328a33189bc00))
* **bloc:** 💥 ✨ add initialState argument to BlocObserver.onCreate ([38a5de7](https://github.com/jacobtipp/bloc-state/commit/38a5de7766a3147c0384ef1564b085da8cdce247))


### Code Refactoring

* **bloc:** ♻️ onChange and onTransition call after state is emitted ([5753e21](https://github.com/jacobtipp/bloc-state/commit/5753e2139cdbe78f5a8fbe12e101f7fe0e63fe78))

## [3.0.0-dev-bloc.1](https://github.com/jacobtipp/bloc-state/compare/bloc-v2.1.0-dev-bloc.2...bloc-v3.0.0-dev-bloc.1) (2023-11-13)


### ⚠ BREAKING CHANGES

* **bloc:** BlocObserver.onCreate requires initialState as second required paramter

### Features

* **bloc:** 💥 ✨ add initialState argument to BlocObserver.onCreate ([eb06afa](https://github.com/jacobtipp/bloc-state/commit/eb06afadb83ad81e7345b88699bae1fb8d4e52d2))

## [2.1.0-dev-bloc.2](https://github.com/jacobtipp/bloc-state/compare/bloc-v2.1.0-dev-bloc.1...bloc-v2.1.0-dev-bloc.2) (2023-11-12)


### Features

* **bloc:** ✨ add public __unsafeEmit__ method to BlocBase ([dd31d9b](https://github.com/jacobtipp/bloc-state/commit/dd31d9bc7ca3003bfff713a0dbddffa4bc408cf2))

## [2.1.0-dev-bloc.1](https://github.com/jacobtipp/bloc-state/compare/bloc-v2.0.5-dev-bloc.1...bloc-v2.1.0-dev-bloc.1) (2023-11-11)


### Features

* **bloc:** ✨ add fromJson and toJson to cubit/bloc ([0aa0870](https://github.com/jacobtipp/bloc-state/commit/0aa087033f8f51cc84015584cd02935a72c4d020))

## [2.0.5-dev-bloc.1](https://github.com/jacobtipp/bloc-state/compare/bloc-v2.0.4...bloc-v2.0.5-dev-bloc.1) (2023-11-11)


### Code Refactoring

* **bloc:** ♻️ onChange and onTransition call after state is emitted ([e65206d](https://github.com/jacobtipp/bloc-state/commit/e65206d4165364028cf54bc8f54d36a223009ae8))

## [2.0.4](https://github.com/jacobtipp/bloc-state/compare/bloc-v2.0.3...bloc-v2.0.4) (2023-10-26)


### Documentation

* **readme:** 📚️ update introduction for @jacobtipp/bloc ([0774f6e](https://github.com/jacobtipp/bloc-state/commit/0774f6e6b205ebd0e327e98e5e2698167ef7a057))

## [2.0.3](https://github.com/jacobtipp/bloc-state/compare/bloc-v2.0.2...bloc-v2.0.3) (2023-10-05)


### Documentation

* **readme:** 📚️ update readme for @jacobtipp/bloc [only bloc] ([1159d55](https://github.com/jacobtipp/bloc-state/commit/1159d55aa0ae98353b1c8394e60d2a73a1fc6f53))

## [2.0.2](https://github.com/jacobtipp/bloc-state/compare/bloc-v2.0.1...bloc-v2.0.2) (2023-10-01)


### Code Refactoring

* **bloc:** ♻️ export StateType from bloc package instead of react-bloc ([1f463be](https://github.com/jacobtipp/bloc-state/commit/1f463bed0335a0b5291484832ae9e5e59b9984e4))

## [2.0.1](https://github.com/jacobtipp/bloc-state/compare/bloc-v2.0.0...bloc-v2.0.1) (2023-09-25)


### Code Refactoring

* **react-bloc:** ♻️ remove observable-hooks dependency ([8d209b0](https://github.com/jacobtipp/bloc-state/commit/8d209b0bbb7372179090aff3dee429f5500e8f88))

## [2.0.0](https://github.com/jacobtipp/bloc-state/compare/bloc-v1.1.1...bloc-v2.0.0) (2023-09-25)


### ⚠ BREAKING CHANGES

* **bloc:** Bloc events no longer need to extend BlocEvent abstract class

### Features

* **bloc:** 💥 ✨ remove BlocEvent abstract class ([1b80fb0](https://github.com/jacobtipp/bloc-state/commit/1b80fb058b67c1c42bafb37e67db6da4cecfba27))

## [1.1.1](https://github.com/jacobtipp/bloc-state/compare/bloc-v1.1.0...bloc-v1.1.1) (2023-09-25)


### Revert Changes

* **bloc): "refactor(bloc:** 💥 ✨ remove BlocEvent abstract class" ([d4bb6b1](https://github.com/jacobtipp/bloc-state/commit/d4bb6b11b18ec03a221ec0af9f4c85d4de70343c))

## [1.1.0](https://github.com/jacobtipp/bloc-state/compare/bloc-v1.0.4...bloc-v1.1.0) (2023-09-25)


### ⚠ BREAKING CHANGES

* **bloc:** Bloc events no longer need to extend BlocEvent abstract class

### Features

* **bloc:** ✨ add optional name property to BlocBase constructor ([1f0321c](https://github.com/jacobtipp/bloc-state/commit/1f0321cc550706cb92e804b688d1661cbda1557c))


### Code Refactoring

* **bloc:** ♻️  add protected subscriptions set to BlocBase ([622446c](https://github.com/jacobtipp/bloc-state/commit/622446c0506d377b60166e80f6c1042e864f3aa3))
* **bloc:** ♻️  remove onCreate method from BlocBase ([fe9cc6c](https://github.com/jacobtipp/bloc-state/commit/fe9cc6cbe71971dfd4803dee4104aa18309698d8))
* **bloc:** ♻️ rename _Emitter class to BlocEmitterImpl ([1996bc4](https://github.com/jacobtipp/bloc-state/commit/1996bc4e34888193a550eb37b68460472553ec5b))
* **bloc:** 💥 ✨ remove BlocEvent abstract class ([5615d0c](https://github.com/jacobtipp/bloc-state/commit/5615d0c523d16ff449de7254245e5a012271b0ff))

## [1.0.4](https://github.com/jacobtipp/bloc-state/compare/bloc-v1.0.3...bloc-v1.0.4) (2023-04-21)


### Code Refactoring

* **state:** ♻️ add readonly access modifier to data ([#12](https://github.com/jacobtipp/bloc-state/issues/12)) ([e6b924d](https://github.com/jacobtipp/bloc-state/commit/e6b924dc4d8c9727c3faa613d77e753f3c678932))
