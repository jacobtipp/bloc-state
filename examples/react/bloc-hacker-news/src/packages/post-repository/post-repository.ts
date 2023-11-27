import { Observable } from 'rxjs';
import { PostClient } from '../post-client/post-client';
import { Post } from '../post-client/model/post';
import { restPostClient } from '../post-client/rest-post-client';

export class PostRepository {
  constructor(private postClient: PostClient) {}

  getPost = (id: number): Observable<Post> => this.postClient.getPost(id);
}

export const postRepository = new PostRepository(restPostClient);
