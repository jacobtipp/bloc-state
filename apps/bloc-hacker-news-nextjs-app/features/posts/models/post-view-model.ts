import { Post } from '../../../packages/post-client/model/post';

export type PostViewModel = {
  postId: {
    previousId?: number;
    currentId: number;
  };
  details: Post;
};
