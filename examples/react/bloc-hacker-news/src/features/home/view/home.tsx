import { HomeDescription } from '../components/home-description';
import { PostPage } from '../../posts/view/posts';
import { BlocProvider } from '@jacobtipp/react-bloc';
import { HomeBloc } from '../bloc/home.cubit';

export const HomePage = () => (
  <BlocProvider bloc={HomeBloc} create={() => new HomeBloc()}>
    <HomeView />
  </BlocProvider>
);

export const HomeView = () => {
  return (
    <>
      <PostPage />
      <HomeDescription />
    </>
  );
};
