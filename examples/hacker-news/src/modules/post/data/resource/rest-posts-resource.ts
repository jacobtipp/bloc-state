import { Observable, delay, map } from 'rxjs';
import { RestResource } from '../../../modules-common/rest-resource';
import { Post } from '../../domain';
import { PostResource } from './post-resource';
import { plainToClass } from 'class-transformer';

const HN_BASE_API = 'https://hacker-news.firebaseio.com/v0';

export class RestPostResource extends RestResource implements PostResource {
  constructor() {
    super(HN_BASE_API);
  }
  getPost = (id: number): Observable<Post> => {
    return this.fetch<Post>(`/item/${id}.json`).pipe(
      delay(1000), // simulate network delay
      map((response) => {
        return plainToClass(Post, response);
      })
    );
  };
}

export class PostNotFoundException extends Error {
  constructor(post: number) {
    super(`Post: with id ${post} was not found`);
  }
}

export const restPostResource = new RestPostResource();
