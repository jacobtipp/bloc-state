export abstract class QueryEvent {
  protected _!: void;
  name = 'QueryEvent';
}

export class FetchEvent extends QueryEvent {
  override name = 'FetchEvent';
  constructor(
    public readonly abortController: AbortController,
    public readonly cancel = false
  ) {
    super();
  }
}

export class RevalidateEvent extends QueryEvent {
  override name = 'RevalidateEvent';
}

export class SubscriptionEvent extends QueryEvent {
  override name = 'SubscriptionEvent';
}

export class ErrorEvent extends QueryEvent {
  override name = 'ErrorEvent';
  constructor(public error: any) {
    super();
  }
}

export class SetQueryDataEvent<Data = unknown> extends QueryEvent {
  override name = 'SetQueryDataEvent';
  constructor(public readonly set: ((old: Data) => Data) | Data) {
    super();
  }
}
