import { Observable } from 'rxjs';
import { Post } from './model/post';

export abstract class PostClient {
  abstract getPost(id: number): Observable<Post>;
}
