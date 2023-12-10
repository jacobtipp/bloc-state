import { plainToClass } from 'class-transformer';
import { PostClient } from './post-client';
import { Post } from './model/post';
import { AxiosInstance, HttpStatusCode } from 'axios';

type RequestFailure = {
  message?: string
  status: number
  body: Record<string, any>
}

export class PostApiRequestFailure extends Error {
  constructor(public readonly failure: RequestFailure ) {
    super();
    Object.setPrototypeOf(this, PostApiRequestFailure.prototype);
  }
}

export class PostApiClient implements PostClient {
  constructor(private readonly httpClient: AxiosInstance) {}
  getPost = async (id: number, signal: AbortSignal): Promise<Post> => {
    const response = await this.httpClient.get<Post>(`item/${id}.json`, { signal });

    if (response.status !== HttpStatusCode.Ok) {
      throw new PostApiRequestFailure({
        status: response.status,
        body: response,

      })
    }

    return plainToClass(Post, response.data);
  }
}

