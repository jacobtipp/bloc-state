## [2.2.1-dev-bloc-query.1](https://github.com/jacobtipp/bloc-state/compare/bloc-query-v2.2.0...bloc-query-v2.2.1-dev-bloc-query.1) (2023-12-14)


### Bug Fixes

* **bloc-query:** 🐛 getQueryData should reject if a query is in a failed state ([a156941](https://github.com/jacobtipp/bloc-state/commit/a156941943f29b46fb3b3754e866f54d03c5f1e9))

## [2.2.0](https://github.com/jacobtipp/bloc-state/compare/bloc-query-v2.1.2...bloc-query-v2.2.0) (2023-12-14)


### Features

* **bloc-query:** ✨ add comparator function option to getQuery ([1c9a90b](https://github.com/jacobtipp/bloc-state/commit/1c9a90b8aceae19d78f64d04f756481ebba4ce4b))
* **bloc-query:** ✨ add retryWhen function option to getQuery ([c85868d](https://github.com/jacobtipp/bloc-state/commit/c85868d6b7bd76b84506e5ba44847d2d6a414c9a))
* **bloc-query:** ✨ add selector option to getQuery ([f81af29](https://github.com/jacobtipp/bloc-state/commit/f81af293d475e9b340946824c22c7bf9dfa1f418))


### Code Refactoring

* **bloc-query:** ♻️ add semantic errors for QueryBloc ([13b4eee](https://github.com/jacobtipp/bloc-state/commit/13b4eee0429d2eb128eab23632f6bccfff5881e6))
* **bloc-query:** ♻️ infer Data generic to firstValueFrom inside getQueryData ([e579d6d](https://github.com/jacobtipp/bloc-state/commit/e579d6ded8ed47ec95a20ecaa3830d972950c90b))
* **bloc-query:** ♻️ prefix all query events with Query ([59690d0](https://github.com/jacobtipp/bloc-state/commit/59690d0a4a42234b8949b50fa45eed827b50f719))
* **bloc-query:** ♻️ query errors are now processed by an ErrorEvent handler ([4ad36ff](https://github.com/jacobtipp/bloc-state/commit/4ad36ff4c4535ee7a1fda177e4d61048eeb6b932))
* **bloc-query:** ♻️ remove filter status option ([5ae414e](https://github.com/jacobtipp/bloc-state/commit/5ae414ebcc2396b293c110e7ba5b0942aa9899da))
* **bloc-query:** ♻️ replace deprecated rxjs retryWhen operator with retry operator ([beaa292](https://github.com/jacobtipp/bloc-state/commit/beaa2921dc38bdf9c19b10cc8fec30e5960b571a))

## [2.2.0-dev-bloc-query.3](https://github.com/jacobtipp/bloc-state/compare/bloc-query-v2.2.0-dev-bloc-query.2...bloc-query-v2.2.0-dev-bloc-query.3) (2023-12-14)


### Features

* **bloc-query:** ✨ add retryWhen function option to getQuery ([5746ccb](https://github.com/jacobtipp/bloc-state/commit/5746ccbdd465c2a6cf86a376ff16d479e6792981))


### Code Refactoring

* **bloc-query:** ♻️ prefix all query events with Query ([7941edf](https://github.com/jacobtipp/bloc-state/commit/7941edfbf4f25226f85b2cc28da624da6236afc9))
* **bloc-query:** ♻️ query errors are now processed by an ErrorEvent handler ([411da18](https://github.com/jacobtipp/bloc-state/commit/411da187db056ce619e19fc7c65c677d3b544692))
* **bloc-query:** ♻️ replace deprecated rxjs retryWhen operator with retry operator ([549ed20](https://github.com/jacobtipp/bloc-state/commit/549ed209e0b9dfcbf0031cb0c13f8db15ca4cc63))

## [2.2.0-dev-bloc-query.2](https://github.com/jacobtipp/bloc-state/compare/bloc-query-v2.2.0-dev-bloc-query.1...bloc-query-v2.2.0-dev-bloc-query.2) (2023-12-13)


### Features

* **bloc-query:** ✨ add comparator function option to getQuery ([9b5f269](https://github.com/jacobtipp/bloc-state/commit/9b5f269cc9d20547126482aae49d9554f31b592b))


### Code Refactoring

* **bloc-query:** ♻️ add semantic errors for QueryBloc ([7dd2c84](https://github.com/jacobtipp/bloc-state/commit/7dd2c8419ab74aea42849d7eb395cadbc74ed6da))
* **bloc-query:** ♻️ remove filter status option ([a177c66](https://github.com/jacobtipp/bloc-state/commit/a177c66b984f28ddaaea229cc9245ce2133a101e))

## [2.2.0-dev-bloc-query.1](https://github.com/jacobtipp/bloc-state/compare/bloc-query-v2.1.2...bloc-query-v2.2.0-dev-bloc-query.1) (2023-12-13)


### Features

* **bloc-query:** ✨ add selector option to getQuery ([5dae7ac](https://github.com/jacobtipp/bloc-state/commit/5dae7ac7b9605d4e64ee74427928711fed4768bc))


### Code Refactoring

* **bloc-query:** ♻️ infer Data generic to firstValueFrom inside getQueryData ([a4d5049](https://github.com/jacobtipp/bloc-state/commit/a4d5049a00298616dd6cfb4422c8fdea2dd8d514))

## [2.1.2](https://github.com/jacobtipp/bloc-state/compare/bloc-query-v2.1.1...bloc-query-v2.1.2) (2023-12-12)


### Code Refactoring

* **bloc:** ♻️ use asObservable when exposing Bloc.state$ ([54dcd4b](https://github.com/jacobtipp/bloc-state/commit/54dcd4bc9f9d3651a0554e08d9a0e464e8c30f20))

## [2.1.1](https://github.com/jacobtipp/bloc-state/compare/bloc-query-v2.1.0...bloc-query-v2.1.1) (2023-12-10)


### Bug Fixes

* **bloc-query:** 🐛 export all content from lib files ([42dc1c5](https://github.com/jacobtipp/bloc-state/commit/42dc1c5dbc6ba7e6bd244072aa12d27addc71c07))

## [2.1.0](https://github.com/jacobtipp/bloc-state/compare/bloc-query-v2.0.0...bloc-query-v2.1.0) (2023-12-08)


### Features

* **bloc-query:** ✨ add cancelQuery with AbortSignal cancellation ([5761e2b](https://github.com/jacobtipp/bloc-state/commit/5761e2b51dacfea8f305d9d0160d776958f5d684))

## [2.0.0](https://github.com/jacobtipp/bloc-state/compare/bloc-query-v1.0.0...bloc-query-v2.0.0) (2023-12-06)


### ⚠ BREAKING CHANGES

* **bloc-query:** getQueryData now returns a Promise

### Features

* **bloc-query:** 💥 ✨ getQueryData accepts a query as an argument ([b376d3e](https://github.com/jacobtipp/bloc-state/commit/b376d3e754b97177a8dab236b1b1ea2b3a6b67f1))

### Code Refactoring

* **bloc-query:** ♻️ setQueryData internally adds a SetQueryEvent for tracing ([ed75cf1](https://github.com/jacobtipp/bloc-state/commit/ed75cf103abd7f636f17f75a2075e42d8e880e82))

## [2.0.0-dev-bloc-query.1](https://github.com/jacobtipp/bloc-state/compare/bloc-query-v1.0.0...bloc-query-v2.0.0-dev-bloc-query.1) (2023-12-06)


### ⚠ BREAKING CHANGES

* **bloc-query:** getQueryData now returns a Promise

### Features

* **bloc-query:** 💥 ✨ getQueryData accepts a query as an argument ([efe88c8](https://github.com/jacobtipp/bloc-state/commit/efe88c8b28158bd59f6c85f600ce8ee1bc7ea04b))


### Code Refactoring

* **bloc-query:** ♻️ setQueryData internally adds a SetQueryEvent for tracing ([b5297c8](https://github.com/jacobtipp/bloc-state/commit/b5297c8d12980b41d8acc563702173c8f3c46b1f))

## 1.0.0 (2023-12-05)

### Features

* **bloc-query:** ✨ add setQueryData method ([16dfc7c](https://github.com/jacobtipp/bloc-state/commit/16dfc7c30d8097d29eea48ed71df6070104eede3))
* **bloc-query:** ✨ initial release for @jacobtipp/bloc-query package ([3145ced](https://github.com/jacobtipp/bloc-state/commit/3145cedad2e40bbf7e7afd8013974c88de2a5f57))


### Bug Fixes

* **bloc-query:** 🐛 use sequential transformer with onSubscription handler ([e75408b](https://github.com/jacobtipp/bloc-state/commit/e75408bcebc19de7b8bc9b264a869de4b7581faa))

### Code Refactoring

* **bloc-query:** ♻️ add name property to QueryBloc events ([2c8be22](https://github.com/jacobtipp/bloc-state/commit/2c8be2257d5b19d5984943be11abe263601cd973))
* **bloc-query:** ♻️ queryFn does not require any arguments ([7fc933c](https://github.com/jacobtipp/bloc-state/commit/7fc933c5c95d2a3f2edb3f7aaeb22e5063ddc6aa))
* **bloc-query:** ♻️ use queryKey if options.name isn't provided to QueryBloc ([47a8c75](https://github.com/jacobtipp/bloc-state/commit/47a8c753597f52f8e2be601ba3067b9d31ed0186))

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
