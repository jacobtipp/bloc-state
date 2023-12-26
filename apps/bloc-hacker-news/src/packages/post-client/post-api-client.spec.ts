import { PostClient } from './post-client';
import { HttpStatusCode } from 'axios';
import { MockProxy, mock } from 'jest-mock-extended';
import { QueryClient } from '@jacobtipp/bloc-query';
import {
  PostApiClient,
  PostApiMalformedResponse,
  PostApiRequestFailure,
} from './post-api-client';
import { Post } from './model/post';
import { HttpClient, HttpResponse } from '../http-client/http-client';

describe('PostApiClient', () => {
  let instance: PostClient;
  let queryClient: QueryClient;
  let mockHttpClient: MockProxy<HttpClient>;

  beforeEach(() => {
    mockHttpClient = mock<HttpClient>();
    queryClient = new QueryClient();
    instance = new PostApiClient(queryClient, mockHttpClient);
  });

  afterEach(() => {
    queryClient.clear();
    jest.resetAllMocks();
  });

  const post: Post = {
    by: 'Jack',
    time: 2000,
    type: 'comment',
    text: 'content',
    url: 'http://localhost:3000',
  };

  const createSuccessfulResponse = async () => {
    const axiosResponse: HttpResponse<Post> = {
      data: post,
      status: HttpStatusCode.Ok,
    };

    mockHttpClient.get.mockResolvedValue(axiosResponse);
    const response = await instance.getPost(9001);
    return response;
  };

  const createFailedResponse = async () => {
    const axiosResponse: HttpResponse = {
      data: undefined,
      status: HttpStatusCode.BadRequest,
    };

    mockHttpClient.get.mockResolvedValue(axiosResponse);
    const response = await instance.getPost(9001);
    return response;
  };

  const createMalformedResponse = async () => {
    const brokenPost = {
      ...post,
      by: 2,
    };

    const axiosResponse: HttpResponse<Post> = {
      data: brokenPost as any,
      status: HttpStatusCode.Ok,
    };

    mockHttpClient.get.mockResolvedValue(axiosResponse);
    const response = await instance.getPost(9001);
    return response;
  };

  it('instance should be an instanceof PostApiClient', () => {
    expect(instance instanceof PostApiClient).toBeTruthy();
  });

  describe('getPost', () => {
    it('should return a Post instance if request is successful', async () => {
      const response = await createSuccessfulResponse();
      expect(response).toEqual(post);
    });

    it('should throw a PostApiRequestFailure exception if http status is not ok', async () => {
      try {
        await createFailedResponse();
      } catch (e: unknown) {
        expect(e).toBeInstanceOf(PostApiRequestFailure);
      }
    });

    it('should throw a PostApiMalformedResponse expception if response data is malformed', async () => {
      try {
        await createMalformedResponse();
      } catch (e: unknown) {
        expect(e).toBeInstanceOf(PostApiMalformedResponse);
      }
    });
  });

  describe('cancelPost', () => {
    it('should invoke cancelPost', async () => {
      const mockQueryClient = mock<QueryClient>();
      instance = new PostApiClient(mockQueryClient, mockHttpClient);

      instance.cancelPost(9001);

      expect(mockQueryClient.cancelQuery).toBeCalled();
    });
  });
});
