import { PostApiClient } from '@bloc-hn-nextjs-app/lib/post-client/post-api-client';
import { cache } from 'react';

export const getPostRepository = cache(() => {
  const client = new PostApiClient();
  return {
    getPostDetails: (id: number) => client.getPostDetails(id),
  };
});
