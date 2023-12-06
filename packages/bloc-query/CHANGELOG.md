## [2.0.0-dev-bloc-query.1](https://github.com/jacobtipp/bloc-state/compare/bloc-query-v1.0.0...bloc-query-v2.0.0-dev-bloc-query.1) (2023-12-06)


### ⚠ BREAKING CHANGES

* **bloc-query:** getQueryData now returns a Promise

### Features

* **bloc-query:** 💥 ✨ getQueryData accepts a query as an argument ([efe88c8](https://github.com/jacobtipp/bloc-state/commit/efe88c8b28158bd59f6c85f600ce8ee1bc7ea04b))


### Code Refactoring

* **bloc-query:** ♻️ setQueryData internally adds a SetQueryEvent for tracing ([b5297c8](https://github.com/jacobtipp/bloc-state/commit/b5297c8d12980b41d8acc563702173c8f3c46b1f))

## 1.0.0 (2023-12-05)


### ⚠ BREAKING CHANGES

* **bloc:** BlocObserver.onCreate requires initialState as second required paramter
* **bloc:** Bloc events no longer need to extend BlocEvent abstract class
* **bloc:** Bloc events no longer need to extend BlocEvent abstract class

### Features

* ✨ initial release ([ac300a3](https://github.com/jacobtipp/bloc-state/commit/ac300a3723fccf5a9ba406e2646cde029e75acb6))
* **bloc-query:** ✨ add setQueryData method ([16dfc7c](https://github.com/jacobtipp/bloc-state/commit/16dfc7c30d8097d29eea48ed71df6070104eede3))
* **bloc-query:** ✨ initial release for @jacobtipp/bloc-query package ([3145ced](https://github.com/jacobtipp/bloc-state/commit/3145cedad2e40bbf7e7afd8013974c88de2a5f57))
* **bloc:** ✨ add fromJson and toJson to cubit/bloc ([86b05d4](https://github.com/jacobtipp/bloc-state/commit/86b05d43446d72909c60e88b3e784a15cbaa3ab1))
* **bloc:** ✨ add optional name property to BlocBase constructor ([1f0321c](https://github.com/jacobtipp/bloc-state/commit/1f0321cc550706cb92e804b688d1661cbda1557c))
* **bloc:** ✨ add public __unsafeEmit__ method to BlocBase ([a785dec](https://github.com/jacobtipp/bloc-state/commit/a785dec8167e272498885b9b0b2328a33189bc00))
* **bloc:** 💥 ✨ add initialState argument to BlocObserver.onCreate ([38a5de7](https://github.com/jacobtipp/bloc-state/commit/38a5de7766a3147c0384ef1564b085da8cdce247))
* **bloc:** 💥 ✨ remove BlocEvent abstract class ([1b80fb0](https://github.com/jacobtipp/bloc-state/commit/1b80fb058b67c1c42bafb37e67db6da4cecfba27))
* initial commit [skip-ci] ([904a867](https://github.com/jacobtipp/bloc-state/commit/904a867b4ded298c6dd9741a546bb97978680b39))


### Bug Fixes

* **bloc-query:** 🐛 use sequential transformer with onSubscription handler ([e75408b](https://github.com/jacobtipp/bloc-state/commit/e75408bcebc19de7b8bc9b264a869de4b7581faa))
* **bloc:** 🐛 bloc eventHandler no longer swallows errors ([f955fbb](https://github.com/jacobtipp/bloc-state/commit/f955fbb605a8db36dcc7e3e005fff4c1e1972113))
* **bloc:** 🐛 errors should be rethrown ([d570228](https://github.com/jacobtipp/bloc-state/commit/d570228266c73d56cd8a2b19bc7203c64acc9ccd))
* **bloc:** 🐛 updated BlocEvent with overridable name property ([9bc3b45](https://github.com/jacobtipp/bloc-state/commit/9bc3b45c5dceb197faf98c73cf1c4dac672baae1))


### Revert Changes

* **bloc): "refactor(bloc:** 💥 ✨ remove BlocEvent abstract class" ([d4bb6b1](https://github.com/jacobtipp/bloc-state/commit/d4bb6b11b18ec03a221ec0af9f4c85d4de70343c))


### Documentation

* **readme:** 📚️ update introduction for @jacobtipp/bloc ([0774f6e](https://github.com/jacobtipp/bloc-state/commit/0774f6e6b205ebd0e327e98e5e2698167ef7a057))
* **readme:** 📚️ update readme for @jacobtipp/bloc [only bloc] ([1159d55](https://github.com/jacobtipp/bloc-state/commit/1159d55aa0ae98353b1c8394e60d2a73a1fc6f53))
* **readme:** 📚️ update to publish with readme ([c1232ce](https://github.com/jacobtipp/bloc-state/commit/c1232cec2283b24087415cd3f2ee76f0057d3b6a))


### Code Refactoring

* **bloc-query:** ♻️ add name property to QueryBloc events ([2c8be22](https://github.com/jacobtipp/bloc-state/commit/2c8be2257d5b19d5984943be11abe263601cd973))
* **bloc-query:** ♻️ queryFn does not require any arguments ([7fc933c](https://github.com/jacobtipp/bloc-state/commit/7fc933c5c95d2a3f2edb3f7aaeb22e5063ddc6aa))
* **bloc-query:** ♻️ use queryKey if options.name isn't provided to QueryBloc ([47a8c75](https://github.com/jacobtipp/bloc-state/commit/47a8c753597f52f8e2be601ba3067b9d31ed0186))
* **bloc:** ♻️  add protected subscriptions set to BlocBase ([622446c](https://github.com/jacobtipp/bloc-state/commit/622446c0506d377b60166e80f6c1042e864f3aa3))
* **bloc:** ♻️  remove onCreate method from BlocBase ([fe9cc6c](https://github.com/jacobtipp/bloc-state/commit/fe9cc6cbe71971dfd4803dee4104aa18309698d8))
* **bloc:** ♻️ export StateType from bloc package instead of react-bloc ([1f463be](https://github.com/jacobtipp/bloc-state/commit/1f463bed0335a0b5291484832ae9e5e59b9984e4))
* **bloc:** ♻️ onChange and onTransition call after state is emitted ([5753e21](https://github.com/jacobtipp/bloc-state/commit/5753e2139cdbe78f5a8fbe12e101f7fe0e63fe78))
* **bloc:** ♻️ rename _Emitter class to BlocEmitterImpl ([1996bc4](https://github.com/jacobtipp/bloc-state/commit/1996bc4e34888193a550eb37b68460472553ec5b))
* **bloc:** 💥 ✨ remove BlocEvent abstract class ([5615d0c](https://github.com/jacobtipp/bloc-state/commit/5615d0c523d16ff449de7254245e5a012271b0ff))
* **react-bloc:** ♻️ remove observable-hooks dependency ([8d209b0](https://github.com/jacobtipp/bloc-state/commit/8d209b0bbb7372179090aff3dee429f5500e8f88))

## [1.0.0-dev-bloc-query.6](https://github.com/jacobtipp/bloc-state/compare/bloc-query-v1.0.0-dev-bloc-query.5...bloc-query-v1.0.0-dev-bloc-query.6) (2023-12-03)


### Code Refactoring

* **bloc-query:** ♻️ add name property to QueryBloc events ([786ab9f](https://github.com/jacobtipp/bloc-state/commit/786ab9faedad8b3c542aa4721b2ed2744753f6b4))

## [1.0.0-dev-bloc-query.5](https://github.com/jacobtipp/bloc-state/compare/bloc-query-v1.0.0-dev-bloc-query.4...bloc-query-v1.0.0-dev-bloc-query.5) (2023-12-03)


### Code Refactoring

* **bloc-query:** ♻️ use queryKey if options.name isn't provided to QueryBloc ([581757d](https://github.com/jacobtipp/bloc-state/commit/581757dbef0a6731759c47a263aa5747f294f219))

## [1.0.0-dev-bloc-query.4](https://github.com/jacobtipp/bloc-state/compare/bloc-query-v1.0.0-dev-bloc-query.3...bloc-query-v1.0.0-dev-bloc-query.4) (2023-12-03)


### Features

* **bloc-query:** ✨ add setQueryData method ([66eb948](https://github.com/jacobtipp/bloc-state/commit/66eb948ea98080933f2a075ae5a56c298b98070a))

## [1.0.0-dev-bloc-query.3](https://github.com/jacobtipp/bloc-state/compare/bloc-query-v1.0.0-dev-bloc-query.2...bloc-query-v1.0.0-dev-bloc-query.3) (2023-12-02)


### Code Refactoring

* **bloc-query:** ♻️ queryFn does not require any arguments ([0e6ae34](https://github.com/jacobtipp/bloc-state/commit/0e6ae343e28ebe5ead5292470a660bf79b78f0b2))

## [1.0.0-dev-bloc-query.2](https://github.com/jacobtipp/bloc-state/compare/bloc-query-v1.0.0-dev-bloc-query.1...bloc-query-v1.0.0-dev-bloc-query.2) (2023-12-02)


### Bug Fixes

* **bloc-query:** 🐛 use sequential transformer with onSubscription handler ([8a4a595](https://github.com/jacobtipp/bloc-state/commit/8a4a5952c56353d4dcf7786fbcb9db46ba6e6970))

## 1.0.0-dev-bloc-query.1 (2023-12-01)

### Features

* **bloc-query:** ✨ initial release for @jacobtipp/bloc-query package ([ff9f1fe](https://github.com/jacobtipp/bloc-state/commit/ff9f1fe9cda850c89071fae0b8e9f4f5ca98ca13))
