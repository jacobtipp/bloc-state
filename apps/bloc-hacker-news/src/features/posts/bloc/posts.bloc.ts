import { PostCanceled, PostEvent, PostFetched } from './posts.events';
import { PostState } from './posts.state';
import { Bloc, Emitter } from '@jacobtipp/bloc';
import { PostRepository } from '../../../packages/post-repository/post-repository';
import { restartable } from '@jacobtipp/bloc-concurrency';

export class PostBloc extends Bloc<PostEvent, PostState> {
  constructor(private postRepository: PostRepository) {
    super(
      new PostState({
        details: {
          by: '',
          time: 0,
          type: 'comment',
        },
      })
    );

    this.on(PostFetched, this.onFetched, restartable());
    this.on(PostCanceled, (event, emit) => this.onCanceled(event, emit));
  }

  onCanceled(event: PostCanceled, _emit: Emitter<PostState>): void {
    this.postRepository.cancelPost(event.id);
  }

  async onFetched(event: PostFetched, emit: Emitter<PostState>): Promise<void> {
    try {
      emit(this.state.loading());

      const post = await this.postRepository.getPost(event.id);

      emit(
        this.state.ready((data) => {
          data.details = post;
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
    return PostState.fromJson(json);
  }
}
