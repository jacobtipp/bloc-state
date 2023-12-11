import { PostClient } from '../post-client/post-client';
import { Post } from '../post-client/model/post';
import { QueryClient } from '@jacobtipp/bloc-query';

export class PostRepository {
  constructor(
    private postClient: PostClient,
    private queryClient: QueryClient
  ) {}

  getPost = (id: number): Promise<Post> => {
    const query = this.queryClient.getQuery({
      queryKey: `post/${id}`,
      queryFn: () => this.postClient.getPost(id),
      staleTime: Infinity,
    });

    return this.queryClient.getQueryData(query);
  };
}
