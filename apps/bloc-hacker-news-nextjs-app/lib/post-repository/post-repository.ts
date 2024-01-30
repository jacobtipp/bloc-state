import { Post } from '../../lib/post-client/model/post';
import { PostClient } from '../../lib/post-client/post-client';
import { PostCanceledException } from '../post-client/post-api-client';
import { assertIsError } from '../common/assert-is-error';

export class PostFailure extends Error {
  override name = 'PostFailure';
  constructor(message: string, cause?: unknown) {
    super(message, { cause });

    Object.setPrototypeOf(this, PostFailure.prototype);
  }
}

export class GetPostFailure extends PostFailure {
  override name = 'GetPostFailure';
  constructor(message: string, cause?: Error) {
    super(message, cause);

    Object.setPrototypeOf(this, GetPostFailure.prototype);
  }
}

export class GetPostCanceledException extends GetPostFailure {
  override name = 'GetPostCanceledException';
  constructor(message: string, cause: PostCanceledException) {
    super(message, cause);

    Object.setPrototypeOf(this, GetPostCanceledException.prototype);
  }
}

export class PostRepository {
  constructor(private postClient: PostClient) {}

  getPost = async (id: number): Promise<Post> => {
    try {
      return await this.postClient.getPostDetails(id);
    } catch (e: unknown) {
      assertIsError(e);

      if (e instanceof PostCanceledException) {
        throw new GetPostCanceledException(e.message, e);
      }

      throw new GetPostFailure(e.message, e);
    }
  };

  cancelPost = (id: number): void => {
    return this.postClient.cancelPost(id);
  };
}
