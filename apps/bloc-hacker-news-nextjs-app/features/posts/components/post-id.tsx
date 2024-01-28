import { useSpring, a } from '@react-spring/web';
import { useQueryState, parseAsInteger } from 'nuqs';

export function PostId() {
  console.log('postIdRendered');

  const [id] = useQueryState(
    'id',
    parseAsInteger.withOptions({
      history: 'push',
    })
  );

  const newId = id as number;

  const props = useSpring({ from: { newId }, newId, reset: true });

  return <a.h1>{props.newId!.to(Math.round)}</a.h1>;
}
