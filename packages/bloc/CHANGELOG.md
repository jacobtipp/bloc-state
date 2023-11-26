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
