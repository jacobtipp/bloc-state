import { useBlocInstance } from '@jacobtipp/react-bloc';
import { PostBloc } from '../bloc/posts.bloc';
import { PostIncrement } from '../bloc/posts.events';

export function PostNext() {
  const { add } = useBlocInstance(PostBloc);
  return (
    <button onClick={() => add(new PostIncrement())}>
      <div>→</div>
    </button>
  );
}
