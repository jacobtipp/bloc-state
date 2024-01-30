import { PostClient } from './post-client';
import { Post, PostSchema } from './model/post';
import { HttpStatusCode } from 'axios';
import { safeParse } from 'valibot';
import { QueryCanceledException, QueryClient } from '@jacobtipp/bloc-query';
import { HttpClient } from '@bloc-hn-nextjs-app/lib/http-client/http-client';
import { AxiosHttpClient } from '@bloc-hn-nextjs-app/lib/http-client/axios-http-client';
import { assertIsError } from '../common/assert-is-error';

type RequestFailure = {
  message?: string;
  status: number;
  body: Record<string, any>;
};

export class PostApiFailure extends Error {
  override name = 'PostApiFailure';
  constructor(message: string, cause?: unknown) {
    super(message, { cause });

    Object.setPrototypeOf(this, PostApiFailure.prototype);
  }
}

export class PostApiRequestFailure extends PostApiFailure {
  override name = 'PostApiRequestFailure';
  constructor(public readonly failure: RequestFailure) {
    super(failure.message ?? '');

    Object.setPrototypeOf(this, PostApiRequestFailure.prototype);
  }
}

export class PostApiMalformedResponse extends PostApiFailure {
  override name = 'PostApiMalformedResponse';
  constructor(message: string, cause?: unknown) {
    super(message, { cause });

    Object.setPrototypeOf(this, PostApiMalformedResponse.prototype);
  }
}

export class PostCanceledException extends PostApiFailure {
  override name = 'PostCanceledException';
  constructor(id: string) {
    super(`Post with id ${id} has been canceled`);

    Object.setPrototypeOf(this, PostCanceledException.prototype);
  }
}

export class PostApiClient extends PostClient {
  constructor(
    private readonly queryClient: QueryClient = new QueryClient(),
    private readonly httpClient: HttpClient = new AxiosHttpClient({
      baseURL: 'https://hacker-news.firebaseio.com/v0/',
    })
  ) {
    super();
  }

  getPostDetails = async (id: number): Promise<Post> => {
    const query = this.queryClient.getQuery({
      queryKey: `post/${id}`,
      queryFn: ({ signal }) => this._getPostDetails(id, signal),
      staleTime: Infinity,
    });

    try {
      return await this.queryClient.getQueryData<Post>(query);
    } catch (e) {
      assertIsError(e);

      if (e instanceof QueryCanceledException) {
        throw new PostCanceledException(`${id}`);
      }

      throw e;
    }
  };

  cancelPost = (id: number) => {
    this.queryClient.cancelQuery(`post/${id}`);
  };

  private async _getPostDetails(
    id: number,
    signal: AbortSignal
  ): Promise<Post> {
    const response = await this.httpClient.get<Post>(
      `item/${id}.json`,
      {},
      signal
    );

    if (response.status !== HttpStatusCode.Ok) {
      throw new PostApiRequestFailure({
        status: response.status,
        body: response,
      });
    }

    const result = safeParse(PostSchema, response.data);

    if (!result.success) {
      throw new PostApiMalformedResponse(result.error.message, result.error);
    }

    return result.output;
  }
}
