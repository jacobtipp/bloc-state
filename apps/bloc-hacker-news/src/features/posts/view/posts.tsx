import { PostId } from '../components/post-id';
import { PostDetails } from '../components/post-details';
import { PostNext } from '../components/post-next';
import {
  BlocProvider,
  useBlocListener,
  useRepository,
} from '@jacobtipp/react-bloc';
import { PostBloc } from '../bloc/posts.bloc';
import { PostFetched } from '../bloc/posts.events';
import { PostRepository } from '../../../packages/post-repository/post-repository';
import { Suspense } from 'react';

export function PostPage() {
  const postRepository = useRepository(PostRepository);

  return (
    <BlocProvider
      bloc={PostBloc}
      create={() => new PostBloc(postRepository)}
      dependencies={[postRepository]}
      onMount={(postBloc) => {
        const { currentId } = postBloc.state.data.postId;
        postBloc.add(new PostFetched(currentId));
      }}
    >
      <PostView />
    </BlocProvider>
  );
}

export function PostView() {
  useBlocListener(PostBloc, {
    listenWhen: (previous, current) =>
      previous.data.postId.currentId !== current.data.postId.currentId,
    listener: ({ add, cancelPost }, { data: { postId } }) => {
      if (postId.previousId) {
        cancelPost(postId.previousId);
      }

      add(new PostFetched(postId.currentId));
    },
  });

  return (
    <>
      <PostId />
      <div>
        <Suspense fallback={<h2>Loading...</h2>}>
          <PostDetails />
        </Suspense>
      </div>
      <PostNext />
    </>
  );
}
