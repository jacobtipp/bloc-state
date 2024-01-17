export abstract class PostEvent {
  name = 'PostEvent';
  protected _!: void;
}

export class PostFetched extends PostEvent {
  override name = 'PostFetched';
  constructor(public id: number) {
    super();
  }
}

export class PostIncrement extends PostEvent {
  override name = 'PostIncrement';
}
