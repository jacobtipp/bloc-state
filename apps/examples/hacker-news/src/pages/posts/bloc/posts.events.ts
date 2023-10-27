import { PostTransformer } from '../../pages-common/post-transformer';

export abstract class PostEvent {
  protected _!: void;
}

export class PostSubscribed extends PostEvent {
  constructor(public id: number, public transformer: PostTransformer) {
    super();
  }
}

export abstract class PostTransformerEvent extends PostEvent {
  constructor(public id: number) {
    super();
  }
}

export class PostFetched extends PostTransformerEvent {
  constructor(public override id: number, public transformer: PostTransformer) {
    super(id);
  }
}

export class PostSequential extends PostTransformerEvent {}

export class PostConcurrent extends PostTransformerEvent {}

export class PostRestartable extends PostTransformerEvent {}
