import { PostClient } from './post-client';
import { Post, PostSchema } from './model/post';
import { HttpStatusCode } from 'axios';
import { safeParse } from 'valibot';
import { HttpClient } from '@/lib/http-client/http-client';
import { AxiosHttpClient } from '@/lib/http-client/axios-http-client';

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

export class PostApiClient extends PostClient {
  constructor(
    private readonly httpClient: HttpClient = new AxiosHttpClient({
      baseURL: 'https://hacker-news.firebaseio.com/v0/',
    })
  ) {
    super();
  }

  getPostDetails = async (id: number, signal?: AbortSignal): Promise<Post> => {
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
  };
}
