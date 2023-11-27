import { Post } from '../../../packages/post-client/model/post';
import { PostTransformer } from '../../common/post-transformer';

export type PostViewModel = {
  transformer: PostTransformer;
  details: Post;
};
