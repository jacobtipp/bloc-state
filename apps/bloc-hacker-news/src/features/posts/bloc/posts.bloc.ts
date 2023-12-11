import { PostEvent, PostSubscribed } from './posts.events';
import { PostState } from './posts.state';
import { Bloc, Emitter } from '@jacobtipp/bloc';
import { PostRepository } from '../../../packages/post-repository/post-repository';

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

    this.on(PostSubscribed, this.onSubscribed);
  }

  async onSubscribed(
    event: PostSubscribed,
    emit: Emitter<PostState>
  ): Promise<void> {
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
      }
    }
  }

  override fromJson(json: string): PostState {
    const parsed = super.fromJson(json);
    return new PostState(parsed.data, parsed.status);
  }
}
