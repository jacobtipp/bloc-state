import produce, { Draft, immerable } from "immer"
import { StateStatus } from "./types"
import { BaseState } from "./base-state"

export abstract class State<Data = unknown> extends BaseState {
  constructor(
    data: Data,
    name?: string,
    status = "initial" as const,
    error?: Error,
  ) {
    super(name)
    this.data = data
    this.status = status
    this.error = error
  }

  [immerable] = true

  readonly status: StateStatus

  readonly error: Error | undefined

  readonly isStateInstance = true

  data: Data

  private produceWithData(
    status: StateStatus,
    data?: Data | ((data: Draft<Data>) => void),
  ): this {
    if (data == null) {
      return produce(this, (draft) => {
        draft.status = status
        draft.error = undefined
      })
    } else if (typeof data === "function") {
      const _data = data as (data: Draft<Data>) => void
      return produce(this, (draft) => {
        draft.status = status
        draft.error = undefined
        draft.data = produce(draft.data, _data)
      })
    } else {
      const _data = data as Draft<Data>
      return produce(this, (draft) => {
        draft.error = undefined
        draft.status = status
        draft.data = _data
      })
    }
  }

  loading(): this {
    return produce(this, (draft) => {
      draft.status = "loading"
      draft.error = undefined
    })
  }

  ready(data?: Data | ((data: Draft<Data>) => void)): this {
    return this.produceWithData("ready", data)
  }

  failed(error?: Error): this {
    return produce(this, (draft) => {
      draft.status = "failed"
      draft.error = error
    })
  }
}

export const isStateInstance = (state: unknown): state is State => {
  return state instanceof State || Boolean((state as State).isStateInstance)
}
