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
