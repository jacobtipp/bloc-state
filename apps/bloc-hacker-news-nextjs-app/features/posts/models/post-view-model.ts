import { Post } from '@bloc-hn-nextjs-app/lib/post-client/model/post';

export type PostViewModel = {
  postId: {
    currentId: number;
  };
  details: Post;
};
