export abstract class QueryEvent {
  protected _!: void;
  name = 'QueryEvent';
}

export class QueryFetchEvent extends QueryEvent {
  override name = 'QueryFetchEvent';
  constructor(
    public readonly abortController: AbortController,
    public readonly cancel = false
  ) {
    super();
  }
}

export class QueryCancelEvent extends QueryEvent {
  override name = 'QueryCancelEvent';
}

export class SetQueryDataEvent extends QueryEvent {
  override name = 'SetQueryDataEvent';
}

export class QueryRevalidateEvent extends QueryEvent {
  override name = 'QueryRevalidateEvent';
}

export class QueryErrorEvent extends QueryEvent {
  override name = 'QueryErrorEvent';
  constructor(public error: any) {
    super();
  }
}
