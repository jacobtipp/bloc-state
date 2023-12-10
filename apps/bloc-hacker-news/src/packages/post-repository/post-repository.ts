import { PostClient } from '../post-client/post-client';
import { Post } from '../post-client/model/post';
import { QueryClient, QueryState } from '@jacobtipp/bloc-query';
import { Observable } from 'rxjs';

export class PostRepository {
  constructor(private postClient: PostClient, private queryClient: QueryClient) {}

  getPost = (id: number): Observable<QueryState<Post>> => this.queryClient.getQuery({
    queryKey: `post/${id}`,
    queryFn: ({ signal }) => this.postClient.getPost(id, signal),
    staleTime: Infinity
  });
}
