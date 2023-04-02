import {
  BlocListener,
  BlocProvider,
  useBlocInstance,
  useBlocValue,
  useRepository,
} from '@jacobtipp/react-bloc';
import { PostBloc, PostFetched, PostSubscribed } from '../bloc';
import { PostId } from '../components/post-id';
import { Suspense } from 'react';
import { PostDetails } from '../components/post-details';
import { PostNext } from '../components/post-next';
import { HomeBloc } from '../../home/bloc';
import { PostRepository } from '../../../modules';

export function PostPage() {
  const state = useBlocValue(HomeBloc);
  const { id, transformer } = state.data;

  const postRepository = useRepository(PostRepository);

  return (
    <BlocProvider
      blocs={[
        {
          key: PostBloc,
          create: () =>
            new PostBloc(postRepository).add(
              new PostSubscribed(id, transformer)
            ),
        },
      ]}
      deps={[transformer]}
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
  return (
    <BlocListener
      bloc={HomeBloc}
      listenWhen={(previous, next) => {
        return previous.data.id !== next.data.id;
      }}
      listener={(_, state) => {
        postBloc.add(new PostFetched(state.data.id));
      }}
    >
      <PostId id={id} />
      <div>
        <Suspense fallback={<h2>Loading...</h2>}>
          <PostDetails />
        </Suspense>
      </div>
      <PostNext id={id} />
    </BlocListener>
  );
}
