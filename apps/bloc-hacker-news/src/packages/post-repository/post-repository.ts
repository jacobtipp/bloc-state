import { PostClient } from '../post-client/post-client';
import { Post } from '../post-client/model/post';

export class PostRepository {
  constructor(private postClient: PostClient) {}

  getPost = (id: number): Promise<Post> => {
    return this.postClient.getPost(id);
  };
}
