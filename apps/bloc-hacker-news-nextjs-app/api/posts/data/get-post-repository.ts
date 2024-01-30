import { PostApiClient } from '@bloc-hn-nextjs-app/lib/post-client/post-api-client';
import { PostRepository } from '@bloc-hn-nextjs-app/lib/post-repository/post-repository';

export const getPostRepository = () => new PostRepository(new PostApiClient());
