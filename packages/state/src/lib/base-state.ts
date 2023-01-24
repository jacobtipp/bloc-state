import produce, { Draft, immerable } from "immer"

export abstract class BaseState {
  constructor(_name?: string) {
    this.stateName = _name ?? this.constructor.name
  }

  [immerable] = true

  readonly stateName: string

  copyWith(draft: (state: Draft<this>) => void): this {
    return produce(this, draft)
  }
}
