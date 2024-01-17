import {
  GetPostFailure,
  PostRepository,
} from '../../../packages/post-repository/post-repository';
import { PostBloc } from './posts.bloc';
import { MockProxy, mock } from 'jest-mock-extended';
import { PostState } from './posts.state';
import { Subscription } from 'rxjs';
import { PostFetched } from './posts.events';
import { Post } from '../../../packages/post-client/model/post';

const delay = (num: number) =>
  new Promise((resolve) => setTimeout(resolve, num));

describe('PostBloc', () => {
  let instance: PostBloc;
  let subscription: Subscription;
  let states: PostState[];
  let postRepository: MockProxy<PostRepository>;

  const post: Post = {
    by: 'Jack',
    time: 2000,
    type: 'comment',
    text: 'content',
    url: 'http://localhost:3000',
  };

  beforeEach(() => {
    postRepository = mock<PostRepository>();
    instance = new PostBloc(postRepository);
    states = [];
    subscription = instance.state$.subscribe({
      next: (state) => states.push(state),
    });
  });

  afterEach(() => {
    instance.close();
    jest.clearAllMocks();
    subscription.unsubscribe();
  });

  it('instance should be an instanceof PostBloc', () => {
    expect(instance instanceof PostBloc).toBeTruthy();
    expect(instance.state.status).toBe('initial');
  });

  describe('PostCanceled', () => {
    it('should cancel a post being fetched', () => {
      instance.cancelPost(9001);
      expect(postRepository.cancelPost).toBeCalledWith(9001);
    });
  });

  describe('PostFetched', () => {
    it('should emit [loading, ready] state when successful', async () => {
      postRepository.getPost.mockResolvedValue(post);
      instance.add(new PostFetched(9001));

      await delay(1000);
      expect(postRepository.cancelPost).not.toBeCalled();

      const [a, b] = states;

      expect(states.length).toBe(2);
      expect(a?.status).toBe('loading');
      expect(b?.status).toBe('ready');
      expect(b?.data.details).toBe(post);
    });

    it('should emit [loading, failed] state when failure', async () => {
      postRepository.getPost.mockRejectedValue(new GetPostFailure());
      instance.add(new PostFetched(9001));

      await delay(1000);
      expect(postRepository.cancelPost).not.toBeCalled();

      const [a, b] = states;

      expect(states.length).toBe(2);
      expect(a?.status).toBe('loading');
      expect(b?.status).toBe('failed');
      expect(b?.error).toBeInstanceOf(GetPostFailure);
    });
  });

  describe('fromJson', () => {
    it('should deserialize json string to a PostState instance', () => {
      const oldState = new PostState({
        postId: {
          currentId: 9001,
        },
        details: post,
      }).ready();
      const json = JSON.stringify(oldState);
      const state = instance.fromJson(json);
      expect(state).toBeInstanceOf(PostState);
      expect(state.status).toBe('ready');
      expect(state.data.details).toStrictEqual(post);
      expect(state.data.postId).toStrictEqual({ currentId: 9001 });
    });
  });
});
