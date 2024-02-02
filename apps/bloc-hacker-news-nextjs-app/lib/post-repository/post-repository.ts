import { Post } from '../../lib/post-client/model/post';
import { PostClient } from '../../lib/post-client/post-client';
import { assertIsError } from '../common/assert-is-error';
import { QueryCanceledException, QueryClient } from '@jacobtipp/bloc-query';

export class PostFailure extends Error {
  override name = 'PostFailure';
  constructor(message: string, cause?: unknown) {
    super(message, { cause });
  }
}

export class GetPostFailure extends PostFailure {
  override name = 'GetPostFailure';
}

export class GetPostCanceledException extends GetPostFailure {
  override name = 'GetPostCanceledException';
}

export class PostRepository {
  constructor(
    private readonly postClient: PostClient,
    private readonly queryClient: QueryClient
  ) {}

  getPost = async (id: number): Promise<Post> => {
    const query = this.queryClient.getQuery({
      queryKey: `post/${id}`,
      queryFn: ({ signal }) => this.postClient.getPostDetails(id, signal),
      staleTime: Infinity,
    });

    try {
      return await this.queryClient.getQueryData<Post>(query);
    } catch (e) {
      assertIsError(e);

      if (e instanceof QueryCanceledException) {
        throw new GetPostCanceledException(
          `Post with id [${id}] has been canceled`,
          e
        );
      }

      throw e;
    }
  };

  cancelPost = (id: number): void => {
    return this.queryClient.cancelQuery(`post/${id}`);
  };
}
