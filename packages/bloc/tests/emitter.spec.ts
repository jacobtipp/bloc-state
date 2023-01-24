import { State } from "@bloc-state/state"
import { Observable, interval, take } from "rxjs"
import { Bloc, BlocEvent } from "../src/lib"
import { delay } from "./helpers/counter/delay"

describe("emitter", () => {
  abstract class IntervalEvent extends BlocEvent {}
  class IntervalOnEachEvent extends IntervalEvent {}
  class IntervalForEachEvent extends IntervalEvent {}
  class IntervalNoEmitOnCloseEvent extends IntervalEvent {}

  class IntervalState extends State<number> {}

  class IntervalBloc extends Bloc<IntervalEvent, IntervalState> {
    constructor(stream$: Observable<number>) {
      super(new IntervalState(10)) // initial state is 10 to differentiate from state emitted from a stream

      this.on(IntervalNoEmitOnCloseEvent, async (_event, emit) => {
        await emit.forEach(stream$, (data) => {
          return this.state.ready(data)
        })
        emit.close()
        await delay(1000)
        emit(this.state.ready(10))
      })

      this.on(IntervalForEachEvent, async (_event, emit) => {
        await emit.forEach(
          stream$,
          (data) => this.state.ready(data),
          (error) => this.state.failed(error),
        )
      })

      this.on(IntervalOnEachEvent, async (_event, emit) => {
        await emit.onEach(
          stream$,
          (data) => {
            emit(this.state.ready(data))
          },
          (error) => {
            emit(this.state.failed(error))
          },
        )
        emit(this.state.loading()) // set loading to trigger completion
      })
    }
  }

  let interval$: Observable<number>
  let intervalBloc: IntervalBloc

  beforeEach(() => {
    interval$ = interval().pipe(take(3))
    intervalBloc = new IntervalBloc(interval$)
  })

  describe("emitter.onEach", () => {
    it("should emit values from a stream", (done) => {
      expect.assertions(1)
      const states: number[] = []
      intervalBloc.state$.subscribe({
        next: (state) => {
          if (state.status === "loading") {
            intervalBloc.close()
          } else {
            states.push(state.data)
          }
        },
        complete: () => {
          expect(states.length).toBe(4)
          done()
        },
      })

      intervalBloc.add(new IntervalOnEachEvent())
    })

    it("should invoke onError if an error is thrown from onEach stream", (done) => {
      expect.assertions(4)
      const states: IntervalState[] = []
      const errorStream$ = new Observable<number>((subscriber) => {
        subscriber.next(1)

        setTimeout(() => {
          subscriber.error(new Error("stream error"))
        }, 0)
      })

      const bloc = new IntervalBloc(errorStream$)

      bloc.state$.subscribe({
        next: (state) => {
          if (state.status === "loading") {
            bloc.close()
          } else {
            states.push(state)
          }
        },
        complete: () => {
          const [a, b, c] = states
          expect(states.length).toBe(3)
          expect(a.data).toBe(10)
          expect(b.data).toBe(1)
          expect(c.error?.message).toBe("stream error")
          done()
        },
      })

      bloc.add(new IntervalOnEachEvent())
    })
  })

  describe("emitter.forEach", () => {
    it("should emit state returned from onData", async () => {
      expect.assertions(1)
      const states: number[] = []
      intervalBloc.state$.subscribe({
        next: (state) => {
          states.push(state.data)
        },
        complete: () => {
          expect(states.length).toBe(4)
        },
      })

      intervalBloc.add(new IntervalForEachEvent())
      await delay(5000)
      intervalBloc.close()
    }, 10000)

    it("should not emit after an emitter has been closed", async () => {
      expect.assertions(1)
      const states: number[] = []
      intervalBloc.state$.subscribe({
        next: (state) => {
          states.push(state.data)
        },
        complete: () => {
          expect(states.length).toBe(4)
        },
      })

      intervalBloc.add(new IntervalNoEmitOnCloseEvent())
      await delay(6000)
      intervalBloc.close()
    }, 10000)

    it("should emit state returned from onError when an error is thrown", (done) => {
      expect.assertions(4)
      const states: IntervalState[] = []
      const errorStream$ = new Observable<number>((subscriber) => {
        subscriber.next(1)

        setTimeout(() => {
          subscriber.error(new Error("stream error"))
        }, 0)
      })

      const bloc = new IntervalBloc(errorStream$)

      bloc.state$.subscribe({
        next: (state) => {
          states.push(state)
        },
        complete: () => {
          const [a, b, c] = states
          expect(states.length).toBe(3)
          expect(a.data).toBe(10)
          expect(b.data).toBe(1)
          expect(c.error?.message).toBe("stream error")
          done()
        },
      })

      bloc.add(new IntervalForEachEvent())
      delay(1000).then(() => bloc.close())
    })
  })
})
