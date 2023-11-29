import { RepositoryProvider } from '@jacobtipp/react-bloc';
import { PostRepository } from '../../../packages/post-repository/post-repository';
import { HomePage } from '../../home/view/home';
import './app.css';

type AppProps = {
  postRepository: PostRepository;
};

export default function App({ postRepository }: AppProps) {
  return (
    <RepositoryProvider
      repository={PostRepository}
      create={() => postRepository}
    >
      <HomePage />
    </RepositoryProvider>
  );
}
