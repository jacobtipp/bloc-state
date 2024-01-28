'use client';

import { PostId } from '../components/post-id';
import { PostDetails } from '../components/post-details';
import { PostNext } from '../components/post-next';
import { BlocProvider, useRepository } from '@jacobtipp/react-bloc';
import { PostBloc } from '../bloc/posts.bloc';
import { PropsWithChildren, Suspense } from 'react';
import { PostViewModel } from '../models/post-view-model';
import { PostState } from '../bloc/posts.state';
import { PostRepository } from '../../../packages/post-repository/post-repository';

export type PostProps = {
  post: PostViewModel;
};

export function PostBlocProvider({
  children,
  post,
}: PropsWithChildren<PostProps>) {
  const postRepository = useRepository(PostRepository);

  return (
    <BlocProvider
      bloc={PostBloc}
      create={() => new PostBloc(new PostState(post), postRepository)}
      dependencies={[postRepository]}
    >
      {children}
    </BlocProvider>
  );
}

export function PostView() {
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
