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
