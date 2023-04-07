import { BlocProvider, RepositoryProvider } from '@jacobtipp/react-bloc';
import { HomeBloc } from '../bloc';
import {
  PostRepository,
  restPostResource,
  PostRepositoryImpl,
} from '../../../modules';
import { HomeDescription } from '../components/home-description';
import { PostPage } from '../../posts/view/posts';

export const HomePage = () => (
  <BlocProvider
    blocs={[
      {
        key: HomeBloc,
        create: () => new HomeBloc(),
      },
    ]}
  >
    <HomeView />
  </BlocProvider>
);

export const HomeView = () => {
  return (
    <RepositoryProvider
      repositories={[
        {
          key: PostRepository,
          create: () => new PostRepositoryImpl(restPostResource),
        },
      ]}
    >
      <PostPage />
      <HomeDescription />
    </RepositoryProvider>
  );
};
