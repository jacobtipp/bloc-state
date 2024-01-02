import { PostId } from '../components/post-id';
import { PostDetails } from '../components/post-details';
import { PostNext } from '../components/post-next';
import {
  BlocProvider,
  useBlocInstance,
  useBlocListener,
  useRepository,
} from '@jacobtipp/react-bloc';
import { HomeBloc } from '../../home/bloc/home.cubit';
import { PostBloc } from '../bloc/posts.bloc';
import { PostCanceled, PostFetched } from '../bloc/posts.events';
import { PostRepository } from '../../../packages/post-repository/post-repository';
import { Suspense } from 'react';

export function PostPage() {
  const homeBloc = useBlocInstance(HomeBloc);
  const postRepository = useRepository(PostRepository);

  return (
    <BlocProvider
      bloc={PostBloc}
      create={() =>
        new PostBloc(postRepository).add(
          new PostFetched(homeBloc.state.currentId)
        )
      }
    >
      <PostView />
    </BlocProvider>
  );
}

export function PostView() {
  const { add } = useBlocInstance(PostBloc);

  useBlocListener(HomeBloc, {
    listenWhen: (previous, current) => previous !== current,
    listener: (_, state) => {
      if (state.previousId) {
        add(new PostCanceled(state.previousId));
      }
      add(new PostFetched(state.currentId));
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
