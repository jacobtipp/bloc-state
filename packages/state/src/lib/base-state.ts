import produce, { Draft, immerable } from 'immer';

export abstract class BaseState {
  constructor(public readonly name?: string) {
    this.name = name ?? this.constructor.name;
  }

  [immerable] = true;

  copyWith(draft: (state: Draft<this>) => void): this {
    return produce(this, draft);
  }
}
