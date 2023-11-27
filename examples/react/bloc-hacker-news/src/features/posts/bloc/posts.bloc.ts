import {
  concurrent,
  restartable,
  sequential,
} from '@jacobtipp/bloc-concurrency';
import {
  PostConcurrent,
  PostEvent,
  PostFetched,
  PostRestartable,
  PostSequential,
  PostSubscribed,
} from './posts.events';
import { PostState } from './posts.state';
import { PostTransformer } from '../../common/post-transformer';
import { Bloc, Emitter } from '@jacobtipp/bloc';
import { PostRepository } from '../../../packages/post-repository/post-repository';

export class PostBloc extends Bloc<PostEvent, PostState> {
  constructor(
    private postRepository: PostRepository,
    private transformer: PostTransformer
  ) {
    super(
      new PostState({
        transformer: 'concurrent',
        details: {
          by: '',
          time: 0,
          type: 'comment',
        },
      })
    );

    this.on(PostRestartable, this.getPost, restartable());
    this.on(PostConcurrent, this.getPost, concurrent());
    this.on(PostSequential, this.getPost, sequential());
    this.on(PostFetched, this.onFetched);
    this.on(PostSubscribed, this.onSubscribed);
  }

  private onFetched(
    event: PostFetched,
    emit: Emitter<PostState>
  ): void | Promise<void> {
    emit(this.state.loading());
    if (this.transformer === 'concurrent') {
      this.add(new PostConcurrent(event.id));
    }

    if (this.transformer === 'restartable') {
      this.add(new PostRestartable(event.id));
    }

    if (this.transformer === 'sequential') {
      this.add(new PostSequential(event.id));
    }
  }

  override fromJson(json: string): PostState {
    const parsed = super.fromJson(json);
    return new PostState(parsed.data, parsed.status);
  }

  private async getPost(event: PostRestartable, emit: Emitter<PostState>) {
    await emit.forEach(this.postRepository.getPost(event.id), (post) =>
      this.state.ready((data) => {
        data.details = post;
      })
    );
  }

  private onSubscribed = (event: PostSubscribed, _emit: Emitter<PostState>) => {
    this.add(new PostFetched(event.id, event.transformer));
  };
}
