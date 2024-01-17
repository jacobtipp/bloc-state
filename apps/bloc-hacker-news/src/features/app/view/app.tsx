import './app.css';
import { PostPage } from '../../posts/view/posts';
import { Providers } from './providers';

export default function App() {
  return (
    <Providers>
      <PostPage />
    </Providers>
  );
}
