import { PostViewModel } from '../models/post-view-model';

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

export class PostRehydrate extends PostEvent {
  override name = 'PostRehydrate';
  constructor(public post: PostViewModel) {
    super();
  }
}
