import { PostClient } from '../post-client/post-client';
import { Post } from '../post-client/model/post';

export class PostFailure extends Error {
  constructor(message: string, cause?: unknown) {
    super(message, { cause });

    Object.setPrototypeOf(this, PostFailure.prototype);
  }
}

export class GetPostFailure extends PostFailure {
  constructor(cause?: unknown) {
    super('GetPostFailure', cause);

    Object.setPrototypeOf(this, GetPostFailure.prototype);
  }
}

export class PostRepository {
  constructor(private postClient: PostClient) {}

  getPost = async (id: number): Promise<Post> => {
    try {
      return await this.postClient.getPostDetails(id);
    } catch (e) {
      throw new GetPostFailure(e);
    }
  };

  cancelPost = (id: number): void => {
    return this.postClient.cancelPost(id);
  };
}
