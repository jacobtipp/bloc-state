import { Observable } from 'rxjs';
import { Post, PostRepository } from '../../domain';
import { PostResource, restPostResource } from '../resource';

export class PostRepositoryImpl implements PostRepository {
  constructor(private postResource: PostResource) {}

  getPost = (id: number): Observable<Post> => this.postResource.getPost(id);
}

export const postRepository = new PostRepositoryImpl(restPostResource);
