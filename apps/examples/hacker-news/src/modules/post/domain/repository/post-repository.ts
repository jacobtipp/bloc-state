import { Observable } from 'rxjs';
import { Post } from '../model';

export abstract class PostRepository {
  abstract getPost(id: number): Observable<Post>;
}
