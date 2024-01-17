import { useSpring, a } from '@react-spring/web';
import { useBlocSelector } from '@jacobtipp/react-bloc';
import { PostBloc } from '../bloc/posts.bloc';

export function PostId() {
  const id = useBlocSelector(PostBloc, {
    selector: ({ data: { postId } }) => postId.currentId,
  });
  const props = useSpring({ from: { id }, id, reset: true });

  return <a.h1>{props.id.to(Math.round)}</a.h1>;
}
