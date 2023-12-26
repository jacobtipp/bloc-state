export abstract class PostEvent {
  protected _!: void;
}

export class PostFetched extends PostEvent {
  constructor(public id: number) {
    super();
  }
}

export class PostCanceled extends PostEvent {
  constructor(public id: number) {
    super();
  }
}
