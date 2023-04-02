import { Observable } from 'rxjs';
import { Post, PostRepository } from '../../domain';
import { PostResource } from '../resource';

export class PostRepositoryImpl implements PostRepository {
  constructor(private postResource: PostResource) {}

  getPost = (id: number): Observable<Post> => this.postResource.getPost(id);
}
