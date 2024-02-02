import { safeParse } from 'valibot';
import { Post, PostIdSchema } from './model/post';
import { getPostRepository } from './data/get-post-repository';

export const getPostUseCase = async (searchId?: string): Promise<Post> => {
  const paramsResult = safeParse(PostIdSchema, searchId);

  if (!paramsResult.success) {
    throw new Error('Invalid search params!');
  }

  const id = paramsResult.output;
  const { getPostDetails } = getPostRepository();
  const details = await getPostDetails(id);

  return {
    postId: {
      currentId: id,
    },
    details,
  };
};
