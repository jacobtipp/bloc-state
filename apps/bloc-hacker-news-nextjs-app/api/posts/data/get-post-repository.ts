import { PostRepository } from '../../../packages/post-repository/post-repository';
import { PostApiClient } from '../../../packages/post-client/post-api-client';

export const getPostRepository = () => new PostRepository(new PostApiClient());
