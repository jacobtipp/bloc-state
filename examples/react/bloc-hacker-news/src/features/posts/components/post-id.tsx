import { useBlocSelector } from '@jacobtipp/react-bloc';
import { useSpring, a } from '@react-spring/web';
import { PostBloc } from '../bloc/posts.bloc';

export function PostId() {
  const postId = useBlocSelector(PostBloc, {
    selector: (state) => state.data.postId.currentId,
  });

  const props = useSpring({ from: { postId }, postId, reset: true });

  return <a.h1>{props.postId.to(Math.round)}</a.h1>;
}
