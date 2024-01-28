## [2.0.0-next.1](https://github.com/jacobtipp/bloc-state/compare/bloc-devtools-v1.1.0...bloc-devtools-v2.0.0-next.1) (2024-01-28)


### ⚠ BREAKING CHANGES

* **bloc:** Bloc.observer is removed

### Features

* **bloc:** ✨ add static Bloc.ignoreListeners property ([fde8991](https://github.com/jacobtipp/bloc-state/commit/fde89917a5df4c889ebf0a8ac81de8cf581bc830))


### Bug Fixes

* **bloc-devtools:** 🐛 add guards for server environments ([8ce6683](https://github.com/jacobtipp/bloc-state/commit/8ce6683014c01fc9a3a83523ec1ecd166eb3d352))
* **bloc:** 💥 🐛 replace Bloc.observer with BlocObserver.observer static property ([394d8d5](https://github.com/jacobtipp/bloc-state/commit/394d8d56dde74f03946c1e25016edf8eb0ec8248))


### Code Refactoring

* **bloc:** ♻️ emit now warns instead of throws if a bloc is closed ([d359cc9](https://github.com/jacobtipp/bloc-state/commit/d359cc9ddd4a84b21e5bc6e053440ee2878d726b))
* **bloc:** ♻️ onTransition and onChange are called before emitting ([9e857a4](https://github.com/jacobtipp/bloc-state/commit/9e857a4e1b904e2abc2782d5a6cfe11a4306c33a))
* **bloc:** ♻️ prevent BlocObserver.observer from being set on the server ([1fa05ed](https://github.com/jacobtipp/bloc-state/commit/1fa05ed0f44b977be8b170c677d2d3c4bcefd406))

## [1.1.0](https://github.com/jacobtipp/bloc-state/compare/bloc-devtools-v1.0.6...bloc-devtools-v1.1.0) (2024-01-04)


### Features

* **bloc:** ✨ add addError method to BlocBase ([84e0781](https://github.com/jacobtipp/bloc-state/commit/84e07811b2255b15aa52fb8af4d1672a401c7097))
* **bloc:** ✨ add isClosed getter property to BlocEmitter ([18fae30](https://github.com/jacobtipp/bloc-state/commit/18fae3060af82913b55553812110f76294654b07))
* **bloc:** ✨ add listenTo method ([06be27c](https://github.com/jacobtipp/bloc-state/commit/06be27c9fc5a6f0d2436e38e13bf8b1c3cb22368))

## [1.0.6](https://github.com/jacobtipp/bloc-state/compare/bloc-devtools-v1.0.5...bloc-devtools-v1.0.6) (2023-12-12)


### Bug Fixes

* **bloc-devtools:** 🐛 devtools should only work in development ([cf1a22f](https://github.com/jacobtipp/bloc-state/commit/cf1a22f4ead54ce749a7145521d8318aecb2a0b0))


### Code Refactoring

* **bloc-devtools:** ♻️ merge default options ([cb5651a](https://github.com/jacobtipp/bloc-state/commit/cb5651a1dc3ae2181ed637fa2f3aa7cc5156598d))

## [1.0.5](https://github.com/jacobtipp/bloc-state/compare/bloc-devtools-v1.0.4...bloc-devtools-v1.0.5) (2023-12-12)


### Code Refactoring

* **bloc:** ♻️ use asObservable when exposing Bloc.state$ ([54dcd4b](https://github.com/jacobtipp/bloc-state/commit/54dcd4bc9f9d3651a0554e08d9a0e464e8c30f20))

## [1.0.4](https://github.com/jacobtipp/bloc-state/compare/bloc-devtools-v1.0.3...bloc-devtools-v1.0.4) (2023-12-06)


### Code Refactoring

* **bloc-devtools:** ♻️ check bloc.isBlocInstance property in onChange ([5121c39](https://github.com/jacobtipp/bloc-state/commit/5121c3939aeb723d4fe10b699586b7d52c47e372))

## [1.0.3](https://github.com/jacobtipp/bloc-state/compare/bloc-devtools-v1.0.2...bloc-devtools-v1.0.3) (2023-12-01)


### Bug Fixes

* **bloc:** 🐛 bloc eventHandler no longer swallows errors ([f955fbb](https://github.com/jacobtipp/bloc-state/commit/f955fbb605a8db36dcc7e3e005fff4c1e1972113))

## [1.0.2](https://github.com/jacobtipp/bloc-state/compare/bloc-devtools-v1.0.1...bloc-devtools-v1.0.2) (2023-11-26)


### Bug Fixes

* **bloc:** 🐛 errors should be rethrown ([d570228](https://github.com/jacobtipp/bloc-state/commit/d570228266c73d56cd8a2b19bc7203c64acc9ccd))

## [1.0.1](https://github.com/jacobtipp/bloc-state/compare/bloc-devtools-v1.0.0...bloc-devtools-v1.0.1) (2023-11-14)


### Build System Dependencies

* **deps:** 📦️ add @jacobtipp/bloc as external dependency to @jacobtipp/bloc-devtools ([9fb4187](https://github.com/jacobtipp/bloc-state/commit/9fb4187a8905af59964eadaa22c97d6bceea56df))

## 1.0.0 (2023-11-13)


### ⚠ BREAKING CHANGES

* **bloc:** BlocObserver.onCreate requires initialState as second required paramter
* **bloc:** Bloc events no longer need to extend BlocEvent abstract class
* **bloc:** Bloc events no longer need to extend BlocEvent abstract class

### Features

* ✨ initial release ([ac300a3](https://github.com/jacobtipp/bloc-state/commit/ac300a3723fccf5a9ba406e2646cde029e75acb6))
* **bloc-devtools:** ✨ add @jacobtipp/bloc-devtools package ([b927aea](https://github.com/jacobtipp/bloc-state/commit/b927aeaaae5d4e42003644246f1a36279f0ffe7b))
* **bloc:** ✨ add fromJson and toJson to cubit/bloc ([86b05d4](https://github.com/jacobtipp/bloc-state/commit/86b05d43446d72909c60e88b3e784a15cbaa3ab1))
* **bloc:** ✨ add optional name property to BlocBase constructor ([1f0321c](https://github.com/jacobtipp/bloc-state/commit/1f0321cc550706cb92e804b688d1661cbda1557c))
* **bloc:** ✨ add public __unsafeEmit__ method to BlocBase ([a785dec](https://github.com/jacobtipp/bloc-state/commit/a785dec8167e272498885b9b0b2328a33189bc00))
* **bloc:** 💥 ✨ add initialState argument to BlocObserver.onCreate ([38a5de7](https://github.com/jacobtipp/bloc-state/commit/38a5de7766a3147c0384ef1564b085da8cdce247))
* **bloc:** 💥 ✨ remove BlocEvent abstract class ([1b80fb0](https://github.com/jacobtipp/bloc-state/commit/1b80fb058b67c1c42bafb37e67db6da4cecfba27))
* initial commit [skip-ci] ([904a867](https://github.com/jacobtipp/bloc-state/commit/904a867b4ded298c6dd9741a546bb97978680b39))


### Bug Fixes

* **bloc:** 🐛 updated BlocEvent with overridable name property ([9bc3b45](https://github.com/jacobtipp/bloc-state/commit/9bc3b45c5dceb197faf98c73cf1c4dac672baae1))


### Revert Changes

* **bloc): "refactor(bloc:** 💥 ✨ remove BlocEvent abstract class" ([d4bb6b1](https://github.com/jacobtipp/bloc-state/commit/d4bb6b11b18ec03a221ec0af9f4c85d4de70343c))


### Documentation

* **readme:** 📚️ update introduction for @jacobtipp/bloc ([0774f6e](https://github.com/jacobtipp/bloc-state/commit/0774f6e6b205ebd0e327e98e5e2698167ef7a057))
* **readme:** 📚️ update readme for @jacobtipp/bloc [only bloc] ([1159d55](https://github.com/jacobtipp/bloc-state/commit/1159d55aa0ae98353b1c8394e60d2a73a1fc6f53))
* **readme:** 📚️ update to publish with readme ([c1232ce](https://github.com/jacobtipp/bloc-state/commit/c1232cec2283b24087415cd3f2ee76f0057d3b6a))


### Code Refactoring

* **bloc:** ♻️  add protected subscriptions set to BlocBase ([622446c](https://github.com/jacobtipp/bloc-state/commit/622446c0506d377b60166e80f6c1042e864f3aa3))
* **bloc:** ♻️  remove onCreate method from BlocBase ([fe9cc6c](https://github.com/jacobtipp/bloc-state/commit/fe9cc6cbe71971dfd4803dee4104aa18309698d8))
* **bloc:** ♻️ export StateType from bloc package instead of react-bloc ([1f463be](https://github.com/jacobtipp/bloc-state/commit/1f463bed0335a0b5291484832ae9e5e59b9984e4))
* **bloc:** ♻️ onChange and onTransition call after state is emitted ([5753e21](https://github.com/jacobtipp/bloc-state/commit/5753e2139cdbe78f5a8fbe12e101f7fe0e63fe78))
* **bloc:** ♻️ rename _Emitter class to BlocEmitterImpl ([1996bc4](https://github.com/jacobtipp/bloc-state/commit/1996bc4e34888193a550eb37b68460472553ec5b))
* **bloc:** 💥 ✨ remove BlocEvent abstract class ([5615d0c](https://github.com/jacobtipp/bloc-state/commit/5615d0c523d16ff449de7254245e5a012271b0ff))
* **react-bloc:** ♻️ remove observable-hooks dependency ([8d209b0](https://github.com/jacobtipp/bloc-state/commit/8d209b0bbb7372179090aff3dee429f5500e8f88))
