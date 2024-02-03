import { PostApiClient } from '@/lib/post-client/post-api-client';
import { cache } from 'react';

export const getPostRepository = cache(() => {
  const { getPostDetails } = new PostApiClient();
  return {
    getPostDetails,
  };
});
