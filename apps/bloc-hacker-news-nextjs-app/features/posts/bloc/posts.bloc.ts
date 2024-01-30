import {
  GetPostCanceledException,
  PostRepository,
} from '@bloc-hn-nextjs-app/lib/post-repository/post-repository';
import { PostState } from './posts.state';
import { Cubit } from '@jacobtipp/bloc';
import { assertIsError } from '@bloc-hn-nextjs-app/lib/common/assert-is-error';

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
      assertIsError(e);

      this.addError(e);

      if (e instanceof GetPostCanceledException) {
        this.emit(this.state.failed(e));
      }
    }
  };

  override fromJson(json: string): PostState {
    const parsed = JSON.parse(json) as PostState;
    return new PostState(parsed.data, parsed.status);
  }
}
