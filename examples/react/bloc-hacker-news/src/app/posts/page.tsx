import { PostBlocProvider, PostView } from '@/features/posts/view/posts';
import { getPostUseCase } from '@/api/posts/get-post-usecase';

type PostPageProps = {
  searchParams?: {
    id: string;
  };
};

export default async function PostPage({ searchParams }: PostPageProps) {
  const post = await getPostUseCase(searchParams?.id);

  return (
    <PostBlocProvider post={post}>
      <PostView />
    </PostBlocProvider>
  );
}
