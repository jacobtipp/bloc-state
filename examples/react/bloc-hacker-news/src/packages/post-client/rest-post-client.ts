import { Observable, delay, map } from 'rxjs';
import { plainToClass } from 'class-transformer';
import { ApiClient } from '../api-client/api-client';
import { PostClient } from './post-client';
import { Post } from './model/post';

const HN_BASE_API = 'https://hacker-news.firebaseio.com/v0';

export class RestPostClient extends ApiClient implements PostClient {
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
