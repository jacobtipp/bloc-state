## [3.0.3](https://github.com/jacobtipp/bloc-state/compare/bloc-query-v3.0.2...bloc-query-v3.0.3) (2024-03-04)


### Build System Dependencies

* **deps:** 📦️ fix types path for bloc packages ([d02b578](https://github.com/jacobtipp/bloc-state/commit/d02b578b1bb72e728e1dd18c757df871e273d7db))
* **deps:** 📦️ update @jacobtipp/bloc exports to support moduleResolution bundler ([00b052d](https://github.com/jacobtipp/bloc-state/commit/00b052da2c0db76a28e71c67940593724ef30af3))
* **deps:** 📦️ update @jacobtipp/bloc-query exports to support moduleResolution bundler ([61e8318](https://github.com/jacobtipp/bloc-state/commit/61e83180656cb1bb1554d841a1f89ed65685e006))

## [3.0.3-next.3](https://github.com/jacobtipp/bloc-state/compare/bloc-query-v3.0.3-next.2...bloc-query-v3.0.3-next.3) (2024-03-04)


### Build System Dependencies

* **deps:** 📦️ fix types path for bloc packages ([d9c3120](https://github.com/jacobtipp/bloc-state/commit/d9c312074ec89d63284777a806e57e07abdb754b))

## [3.0.3-next.2](https://github.com/jacobtipp/bloc-state/compare/bloc-query-v3.0.3-next.1...bloc-query-v3.0.3-next.2) (2024-03-04)


### Build System Dependencies

* **deps:** 📦️ update @jacobtipp/bloc-query exports to support moduleResolution bundler ([fd274a5](https://github.com/jacobtipp/bloc-state/commit/fd274a51b0b6f07e1ff99c1faafca523ae3aa3d9))

## [3.0.3-next.1](https://github.com/jacobtipp/bloc-state/compare/bloc-query-v3.0.2...bloc-query-v3.0.3-next.1) (2024-03-04)


### Build System Dependencies

* **deps:** 📦️ update @jacobtipp/bloc exports to support moduleResolution bundler ([cab1294](https://github.com/jacobtipp/bloc-state/commit/cab12943e6053e44643fb4a270a869b8b18455e3))

## [3.0.2](https://github.com/jacobtipp/bloc-state/compare/bloc-query-v3.0.1...bloc-query-v3.0.2) (2024-03-04)


### Documentation

* **readme:** 📚️ add docsify docs ([9f71573](https://github.com/jacobtipp/bloc-state/commit/9f71573d34a54ce74aaf563b9132b71cfdaf5554))

## [3.0.1](https://github.com/jacobtipp/bloc-state/compare/bloc-query-v3.0.0...bloc-query-v3.0.1) (2024-02-04)


### Bug Fixes

* **bloc:** 🐛 BlocBase.listenTo should infer its observable type ([d61187a](https://github.com/jacobtipp/bloc-state/commit/d61187ae2926c8bad95615853ccc77f3709928c5))

## [3.0.0](https://github.com/jacobtipp/bloc-state/compare/bloc-query-v2.4.0...bloc-query-v3.0.0) (2024-02-03)


### ⚠ BREAKING CHANGES

* **bloc:** Bloc.observer is removed

### Features

* **bloc-query:** ✨ add close method with isClosed property to QueryClient ([c23a80d](https://github.com/jacobtipp/bloc-state/commit/c23a80d6010a32273d1bc1e9089cfe382f4fd51a))
* **bloc-query:** ✨ add QueryTimeoutException to QueryClient.getQueryData ([f4f31db](https://github.com/jacobtipp/bloc-state/commit/f4f31dbe70b55bbfa4c21d3332277055bc5a018d))
* **bloc:** ✨ abstract class types can be used with on method ([49c1c5b](https://github.com/jacobtipp/bloc-state/commit/49c1c5bf4b748eb463b1973b4a8a0c0097be2646))
* **bloc:** ✨ add isServer and isClient methods ([0e850dc](https://github.com/jacobtipp/bloc-state/commit/0e850dce97eb28c341e02373facbbfd600bea654))
* **bloc:** ✨ add static Bloc.ignoreListeners property ([46dc707](https://github.com/jacobtipp/bloc-state/commit/46dc707fc015c1c4d1295b355abc6b43eb103dde))
* **bloc:** ✨ check for ancestors of event types in add method ([f9d91ad](https://github.com/jacobtipp/bloc-state/commit/f9d91adf7d70434c3726e8163c9501910b0a6d30))
* **react-bloc:** ✨ query subscriptions are now tracked with QueryBloc.listen ([0d0cbe1](https://github.com/jacobtipp/bloc-state/commit/0d0cbe1955f25f4ab10c59e10fed2d6839fef30d))


### Bug Fixes

* **bloc:** 💥 🐛 replace Bloc.observer with BlocObserver.observer static property ([acb5511](https://github.com/jacobtipp/bloc-state/commit/acb5511a31181addb22fa08396c1c076cc42fb3a))


### Build System Dependencies

* **deps:** 📦️ update rxjs peerDep to support minor and patch releases ([79d58f5](https://github.com/jacobtipp/bloc-state/commit/79d58f594ddc80ed6a4f087f4b06ad6c10da1135))


### Code Refactoring

* **bloc-query:** ♻️ update QueryCanceledException message ([d9f227c](https://github.com/jacobtipp/bloc-state/commit/d9f227c17154255fcd3e31297f27514bf541777e))
* **bloc:** ♻️ check ancestor event hierarchy in on method ([123ef1b](https://github.com/jacobtipp/bloc-state/commit/123ef1b9e83ad1d6bfb57962f5bb6787c88279ba))
* **bloc:** ♻️ emit now warns instead of throws if a bloc is closed ([5fb68b6](https://github.com/jacobtipp/bloc-state/commit/5fb68b63734097d654830954867c4e748d9a419f))
* **bloc:** ♻️ onTransition and onChange are called before emitting ([c56918d](https://github.com/jacobtipp/bloc-state/commit/c56918d2eab538749fa37732c9c25d5883dbd42d))
* **bloc:** ♻️ prevent BlocObserver.observer from being set on the server ([3d93074](https://github.com/jacobtipp/bloc-state/commit/3d93074db5450fd5e6c6d7559fe9c25d85c909de))


### Documentation

* **readme:** 📚️ update docs for @jacobtipp/bloc-query ([82d0c98](https://github.com/jacobtipp/bloc-state/commit/82d0c980e5b9535b047e0e28f55632ce69ae46e1))

## [3.0.0-next.5](https://github.com/jacobtipp/bloc-state/compare/bloc-query-v3.0.0-next.4...bloc-query-v3.0.0-next.5) (2024-02-03)


### Features

* **bloc:** ✨ add isServer and isClient methods ([52f74dd](https://github.com/jacobtipp/bloc-state/commit/52f74ddaa14b9b98a1fba30dd94cd76ee9592363))


### Code Refactoring

* **bloc-query:** ♻️ update QueryCanceledException message ([1b27ed4](https://github.com/jacobtipp/bloc-state/commit/1b27ed4ff12464c234cf344ff780fbea26a6d3d3))
* **bloc:** ♻️ check ancestor event hierarchy in on method ([5b19aa5](https://github.com/jacobtipp/bloc-state/commit/5b19aa5f38b1267e3f36b35851e3001ead6e021c))


### Documentation

* **readme:** 📚️ update docs for @jacobtipp/bloc-query ([13478be](https://github.com/jacobtipp/bloc-state/commit/13478beca1e9d77f969e7036723056fc81729ff1))

## [3.0.0-next.4](https://github.com/jacobtipp/bloc-state/compare/bloc-query-v3.0.0-next.3...bloc-query-v3.0.0-next.4) (2024-02-01)


### Build System Dependencies

* **deps:** 📦️ update rxjs peerDep to support minor and patch releases ([bf91636](https://github.com/jacobtipp/bloc-state/commit/bf916369ad11007e4a4361113e5ef8e91c13673e))

## [3.0.0-next.3](https://github.com/jacobtipp/bloc-state/compare/bloc-query-v3.0.0-next.2...bloc-query-v3.0.0-next.3) (2024-01-30)


### Features

* **bloc:** ✨ abstract class types can be used with on method ([bcf6be3](https://github.com/jacobtipp/bloc-state/commit/bcf6be3fdc1a622afd1393a59df50bd43eddaf58))
* **bloc:** ✨ check for ancestors of event types in add method ([3cfa364](https://github.com/jacobtipp/bloc-state/commit/3cfa364993f090d232bb77eb5ce3ea3c34ae0366))

## [3.0.0-next.2](https://github.com/jacobtipp/bloc-state/compare/bloc-query-v3.0.0-next.1...bloc-query-v3.0.0-next.2) (2024-01-30)


### Features

* **bloc-query:** ✨ add QueryTimeoutException to QueryClient.getQueryData ([4a6ba77](https://github.com/jacobtipp/bloc-state/commit/4a6ba7799c8216e186f7c4cb11d98e1cdb1a7cd4))

## [3.0.0-next.1](https://github.com/jacobtipp/bloc-state/compare/bloc-query-v2.4.0...bloc-query-v3.0.0-next.1) (2024-01-28)


### ⚠ BREAKING CHANGES

* **bloc:** Bloc.observer is removed

### Features

* **bloc-query:** ✨ add close method with isClosed property to QueryClient ([cb03693](https://github.com/jacobtipp/bloc-state/commit/cb03693b1e5ae967009ee04957dc8ac528f1e941))
* **bloc:** ✨ add static Bloc.ignoreListeners property ([fde8991](https://github.com/jacobtipp/bloc-state/commit/fde89917a5df4c889ebf0a8ac81de8cf581bc830))
* **react-bloc:** ✨ query subscriptions are now tracked with QueryBloc.listen ([34cd884](https://github.com/jacobtipp/bloc-state/commit/34cd884963a4ee464e853ac8c747b57d499a5b84))


### Bug Fixes

* **bloc:** 💥 🐛 replace Bloc.observer with BlocObserver.observer static property ([394d8d5](https://github.com/jacobtipp/bloc-state/commit/394d8d56dde74f03946c1e25016edf8eb0ec8248))


### Code Refactoring

* **bloc:** ♻️ emit now warns instead of throws if a bloc is closed ([d359cc9](https://github.com/jacobtipp/bloc-state/commit/d359cc9ddd4a84b21e5bc6e053440ee2878d726b))
* **bloc:** ♻️ onTransition and onChange are called before emitting ([9e857a4](https://github.com/jacobtipp/bloc-state/commit/9e857a4e1b904e2abc2782d5a6cfe11a4306c33a))
* **bloc:** ♻️ prevent BlocObserver.observer from being set on the server ([1fa05ed](https://github.com/jacobtipp/bloc-state/commit/1fa05ed0f44b977be8b170c677d2d3c4bcefd406))

## [2.4.0](https://github.com/jacobtipp/bloc-state/compare/bloc-query-v2.3.0...bloc-query-v2.4.0) (2024-01-04)


### Features

* **bloc-query:** ✨ add optional logErrors QueryBloc option ([da18a21](https://github.com/jacobtipp/bloc-state/commit/da18a21a9ed1e27d39e99a278f1c7b9b156b6721))


### Code Refactoring

* **bloc-query:** ♻️ queries with selectors throw errors when Failed state is returned ([4021a9c](https://github.com/jacobtipp/bloc-state/commit/4021a9c64625bda180d0f588f12ce6ad59ab6856))
* **bloc-query:** ♻️ remove QuerySubscriptionEvent ([9f476e0](https://github.com/jacobtipp/bloc-state/commit/9f476e0e4a7b86b5835a17ea85c0a2883f73bc57))

## [2.3.0](https://github.com/jacobtipp/bloc-state/compare/bloc-query-v2.2.2...bloc-query-v2.3.0) (2024-01-04)


### Features

* **bloc-query:** ✨ cancelQuery sends a QueryCancelEvent to BlocObserver ([1b98465](https://github.com/jacobtipp/bloc-state/commit/1b98465085ade1d6b3387aaad02bbeb79f0ade2b))
* **bloc-query:** ✨ setQueryData sends a SetQueryDataEvent to BlocObserver ([8607c6d](https://github.com/jacobtipp/bloc-state/commit/8607c6d4fefeebb7d24007ca712122ca0dcba95c))
* **bloc:** ✨ add addError method to BlocBase ([84e0781](https://github.com/jacobtipp/bloc-state/commit/84e07811b2255b15aa52fb8af4d1672a401c7097))
* **bloc:** ✨ add isClosed getter property to BlocEmitter ([18fae30](https://github.com/jacobtipp/bloc-state/commit/18fae3060af82913b55553812110f76294654b07))
* **bloc:** ✨ add listenTo method ([06be27c](https://github.com/jacobtipp/bloc-state/commit/06be27c9fc5a6f0d2436e38e13bf8b1c3cb22368))


### Bug Fixes

* **bloc-query:** 🐛 cancel query before revalidating ([79e2ca5](https://github.com/jacobtipp/bloc-state/commit/79e2ca5cc545da6fdace69281cb5d12982b2795b))
* **bloc-query:** 🐛 cancelQuery should revert state synchronously ([ca97225](https://github.com/jacobtipp/bloc-state/commit/ca97225a7d3a9236ea84dc85d27390206d5016a2))
* **bloc-query:** 🐛 handledInitialLoad is reset if a query is cancelled before loading ([6f29744](https://github.com/jacobtipp/bloc-state/commit/6f29744f38494caf5d88cd4aff094640e9f0f659))


### Code Refactoring

* **bloc-query:** ♻️ QuerySubscriptionEvent should be synchronous ([62ca1e2](https://github.com/jacobtipp/bloc-state/commit/62ca1e2b76d7e9a52a151a3224288536362daf82))
* **bloc-query:** ♻️ revalidateQuery should be synchronous ([e0ee668](https://github.com/jacobtipp/bloc-state/commit/e0ee668311c45856811c3da7304d70cf4638d48c))
* **bloc-query:** ♻️ revert to previous state when cancelling a query ([26202fd](https://github.com/jacobtipp/bloc-state/commit/26202fdd71695ffc9ab8d2350a56fcacb1fabc5e))
* **bloc-query:** ♻️ setQueryData should be synchronous ([ac16434](https://github.com/jacobtipp/bloc-state/commit/ac16434411e960a2980bd80a699721c1209a4889))

## [2.2.2](https://github.com/jacobtipp/bloc-state/compare/bloc-query-v2.2.1...bloc-query-v2.2.2) (2023-12-15)


### Code Refactoring

* **bloc-query:** ♻️ customize name property for QueryBloc to match queryKey or name ([509ca7b](https://github.com/jacobtipp/bloc-state/commit/509ca7b02f20b96c5147bd52a1e5f5e0e2221b85))

## [2.2.1](https://github.com/jacobtipp/bloc-state/compare/bloc-query-v2.2.0...bloc-query-v2.2.1) (2023-12-15)


### Bug Fixes

* **bloc-query:** 🐛 getQueryData should reject if a query is in a failed state ([a22e948](https://github.com/jacobtipp/bloc-state/commit/a22e94887578ab9f01c07214d454c011a07af526))


### Code Refactoring

* **bloc-query:** ♻️ add private QueryBloc event handler methods ([de85940](https://github.com/jacobtipp/bloc-state/commit/de85940805e666848559867f125379a40f601fc6))

## [2.2.1-dev-bloc-query.2](https://github.com/jacobtipp/bloc-state/compare/bloc-query-v2.2.1-dev-bloc-query.1...bloc-query-v2.2.1-dev-bloc-query.2) (2023-12-15)


### Code Refactoring

* **bloc-query:** ♻️ add private QueryBloc event handler methods ([c8047d0](https://github.com/jacobtipp/bloc-state/commit/c8047d0244b36dfac17bdd7ec1128b197656ab5c))

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
