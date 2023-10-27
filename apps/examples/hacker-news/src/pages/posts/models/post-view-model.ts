import { Post } from '../../../modules/post/domain/model';
import { PostTransformer } from '../../pages-common/post-transformer';

export type PostViewModel = {
  transformer: PostTransformer;
  details: Post;
};
