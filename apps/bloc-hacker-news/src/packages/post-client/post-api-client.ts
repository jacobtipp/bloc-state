import { PostClient } from './post-client';
import { Post, PostSchema } from './model/post';
import { HttpStatusCode } from 'axios';
import { safeParse } from 'valibot';
import { QueryClient } from '@jacobtipp/bloc-query';
import { HttpClient } from '../http-client/http-client';
import { AxiosHttpClient } from '../http-client/axios-http-client';

type RequestFailure = {
  message?: string;
  status: number;
  body: Record<string, any>;
};

export class PostApiRequestFailure extends Error {
  constructor(public readonly failure: RequestFailure) {
    super(failure.message);

    Object.setPrototypeOf(this, PostApiRequestFailure.prototype);
  }
}

export class PostApiMalformedResponse extends Error {
  constructor(message: string, cause?: unknown) {
    super(message, { cause });

    Object.setPrototypeOf(this, PostApiMalformedResponse.prototype);
  }
}

export class PostApiClient extends PostClient {
  constructor(
    private readonly queryClient: QueryClient,
    private readonly httpClient: HttpClient = new AxiosHttpClient({
      baseURL: 'https://hacker-news.firebaseio.com/v0/',
    })
  ) {
    super()
  }

  getPost(id: number): Promise<Post> {
    const query = this.queryClient.getQuery({
      queryKey: `post/${id}`,
      queryFn: ({ signal }) => this._getPost(id, signal),
    });

    return this.queryClient.getQueryData<Post>(query);
  }

  cancelPost(id: number) {
    this.queryClient.cancelQuery(`post/${id}`);
  }

  private async _getPost(id: number, signal: AbortSignal): Promise<Post> {
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

    return result.data;
  }
}
