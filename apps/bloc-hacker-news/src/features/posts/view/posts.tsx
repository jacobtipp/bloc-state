import { PostId } from '../components/post-id';
import { Suspense } from 'react';
import { PostDetails } from '../components/post-details';
import { PostNext } from '../components/post-next';
import {
  BlocProvider,
  useBlocInstance,
  useBlocListener,
  useBlocValue,
  useRepository,
} from '@jacobtipp/react-bloc';
import { HomeBloc } from '../../home/bloc/home.cubit';
import { PostBloc } from '../bloc/posts.bloc';
import { PostSubscribed } from '../bloc/posts.events';
import { PostRepository } from '../../../packages/post-repository/post-repository';

export function PostPage() {
  const id = useBlocValue(HomeBloc);
  const postRepository = useRepository(PostRepository);

  return (
    <BlocProvider
      bloc={PostBloc}
      create={() => new PostBloc(postRepository).add(new PostSubscribed(id))}
    >
      <PostView />
    </BlocProvider>
  );
}

export function PostView() {
  const { add } = useBlocInstance(PostBloc);
  useBlocListener(HomeBloc, {
    listenWhen: (previous, current) => previous !== current,
    listener: (_, state) => add(new PostSubscribed(state)),
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
