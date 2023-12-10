
export abstract class PostEvent {
  protected _!: void;
}

export class PostSubscribed extends PostEvent {
  constructor(public id: number) {
    super();
  }
}

