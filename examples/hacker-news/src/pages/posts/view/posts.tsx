import { PostBloc, PostFetched, PostSubscribed } from '../bloc';
import { PostId } from '../components/post-id';
import { Suspense } from 'react';
import { PostDetails } from '../components/post-details';
import { PostNext } from '../components/post-next';
import {
  BlocProvider,
  useBlocInstance,
  useBlocListener,
  useBlocValue,
} from '@jacobtipp/react-bloc';
import { HomeBloc } from '../../home/bloc';
import { postRepository } from '../../../modules';

export function PostPage() {
  const state = useBlocValue(HomeBloc);
  const { id, transformer } = state.data;

  return (
    <BlocProvider
      bloc={PostBloc}
      create={() =>
        new PostBloc(postRepository, transformer).add(
          new PostSubscribed(id, transformer)
        )
      }
      dependencies={[transformer]}
    >
      <PostView id={id} />
    </BlocProvider>
  );
}

type PostViewProps = {
  id: number;
};

export function PostView({ id }: PostViewProps) {
  const postBloc = useBlocInstance(PostBloc);

  useBlocListener(HomeBloc, {
    listenWhen(previous, current) {
      return previous.data.id !== current.data.id;
    },
    listener(_bloc, state) {
      postBloc.add(new PostFetched(state.data.id, state.data.transformer));
    },
  });

  return (
    <>
      <PostId id={id} />
      <div>
        <Suspense fallback={<h2>Loading...</h2>}>
          <PostDetails />
        </Suspense>
      </div>
      <PostNext id={id} />
    </>
  );
}
