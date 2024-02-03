import { Post } from '@/lib/post-client/model/post';

export type PostViewModel = {
  postId: {
    currentId: number;
  };
  details: Post;
};
