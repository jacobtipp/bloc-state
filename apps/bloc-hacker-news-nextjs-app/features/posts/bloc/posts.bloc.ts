import { PostRepository } from '../../../packages/post-repository/post-repository';
import { PostState } from './posts.state';
import { Cubit } from '@jacobtipp/bloc';

export class PostBloc extends Cubit<PostState> {
  constructor(
    state: PostState,
    private readonly postRepository: PostRepository
  ) {
    super(state);
  }

  getPost = async (id: number): Promise<void> => {
    const { currentId } = this.state.data.postId;

    this.postRepository.cancelPost(currentId);

    this.emit(
      this.state.loading((draft) => {
        draft.postId.currentId = id;
      })
    );

    try {
      const post = await this.postRepository.getPost(id);
      this.emit(
        this.state.ready((draft) => {
          draft.details = post;
        })
      );
    } catch (e) {
      if (e instanceof Error) {
        this.addError(e);
      }
    }
  };

  override fromJson(json: string): PostState {
    const parsed = JSON.parse(json) as PostState;
    return new PostState(parsed.data, parsed.status);
  }
}
