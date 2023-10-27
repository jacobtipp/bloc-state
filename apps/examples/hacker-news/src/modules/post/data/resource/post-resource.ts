import { Observable } from 'rxjs';
import { Post } from '../../domain/model/post';

export abstract class PostResource {
  abstract getPost(id: number): Observable<Post>;
}
