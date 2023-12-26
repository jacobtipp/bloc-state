import { Post } from '../post-client/model/post';
import { PostApiRequestFailure } from '../post-client/post-api-client';
import { PostClient } from '../post-client/post-client';
import { GetPostFailure, PostRepository } from './post-repository';
import { MockProxy, mock } from 'jest-mock-extended';

describe('PostRepository', () => {
  let instance: PostRepository;
  let mockPostClient: MockProxy<PostClient>;

  beforeEach(() => {
    mockPostClient = mock<PostClient>();
    instance = new PostRepository(mockPostClient);
  });

  const post: Post = {
    by: 'Jack',
    time: 2000,
    type: 'comment',
    text: 'content',
    url: 'http://localhost:3000',
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('instance should be an instanceof PostRepository', () => {
    expect(instance instanceof PostRepository).toBeTruthy();
  });

  describe('getPost', () => {
    it('should return a post', async () => {
      mockPostClient.getPost.mockResolvedValue(post);

      const result = await instance.getPost(9001);
      expect(result).toBe(post);
    });

    it('should throw a GetPostFailure exception if postClient.getPost throws', async () => {
      mockPostClient.getPost.mockRejectedValue(
        new PostApiRequestFailure({
          status: 401,
          body: {},
        })
      );

      try {
        await instance.getPost(9001);
      } catch (e) {
        expect(e).toBeInstanceOf(GetPostFailure);
      }
    });
  });

  describe('cancelPost', () => {
    it('should have a method cancelPost()', () => {
      mockPostClient.cancelPost.mockImplementation(() => Promise.resolve());

      instance.cancelPost(9001);
      expect(mockPostClient.cancelPost).toBeCalled();
    });
  });
});
