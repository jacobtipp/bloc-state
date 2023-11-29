import { Observable } from 'rxjs';
import { PostClient } from '../post-client/post-client';
import { Post } from '../post-client/model/post';

export class PostRepository {
  constructor(private postClient: PostClient) {}

  getPost = (id: number): Observable<Post> => this.postClient.getPost(id);
}
