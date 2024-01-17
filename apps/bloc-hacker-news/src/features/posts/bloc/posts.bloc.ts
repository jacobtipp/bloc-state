import { PostEvent, PostFetched, PostIncrement } from './posts.events';
import { PostState } from './posts.state';
import { Bloc, Emitter } from '@jacobtipp/bloc';
import { PostRepository } from '../../../packages/post-repository/post-repository';
import { restartable } from '@jacobtipp/bloc-concurrency';

export class PostBloc extends Bloc<PostEvent, PostState> {
  constructor(private postRepository: PostRepository) {
    super(
      new PostState({
        postId: {
          currentId: 9001,
        },
        details: {
          by: '',
          time: 0,
          type: 'comment',
        },
      })
    );

    this.on(PostFetched, this.onFetched, restartable());
    this.on(PostIncrement, this.onIncrement);
  }

  onIncrement(_: PostIncrement, emit: Emitter<PostState>): void {
    emit(
      this.state.ready((draft) => {
        draft.postId.previousId = draft.postId.currentId;
        draft.postId.currentId++;
      })
    );
  }

  cancelPost = (id: number) => {
    this.postRepository.cancelPost(id);
  };

  async onFetched(event: PostFetched, emit: Emitter<PostState>): Promise<void> {
    try {
      emit(this.state.loading());

      const post = await this.postRepository.getPost(event.id);

      emit(
        this.state.ready((draft) => {
          draft.details = post;
        })
      );
    } catch (e) {
      if (e instanceof Error) {
        emit(this.state.failed(e));
        this.addError(e);
      }
    }
  }

  override fromJson(json: string): PostState {
    const parsed = JSON.parse(json) as PostState;
    return new PostState(parsed.data, parsed.status);
  }
}
