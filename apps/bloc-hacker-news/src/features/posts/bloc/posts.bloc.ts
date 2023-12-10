import {
  PostEvent,
  PostSubscribed,
} from './posts.events';
import { PostState } from './posts.state';
import { Bloc, Emitter } from '@jacobtipp/bloc';
import { PostRepository } from '../../../packages/post-repository/post-repository';
import { restartable } from "@jacobtipp/bloc-concurrency"

export class PostBloc extends Bloc<PostEvent, PostState> {
  constructor(
    private postRepository: PostRepository,
  ) {
    super(
      new PostState({
        details: {
          by: '',
          time: 0,
          type: 'comment',
        },
      })
    );

    this.on(PostSubscribed, this.onSubscribed, restartable());
  }
  async onSubscribed(event: PostSubscribed, emit: Emitter<PostState>): Promise<void> {
    await emit.onEach(this.postRepository.getPost(event.id), ((query) => {
      if (query.isFetching) {
        emit(this.state.loading())
      }

      if (query.isReady) {
        emit(this.state.ready((data) => {
          data.details = query.data
        }))
      }
    }))
  }

  override fromJson(json: string): PostState {
    const parsed = super.fromJson(json);
    return new PostState(parsed.data, parsed.status);
  }
}
