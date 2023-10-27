import { useSpring, a } from '@react-spring/web';

type PostIdProps = {
  id: number;
};

export function PostId({ id }: PostIdProps) {
  const props = useSpring({ from: { id }, id, reset: true });

  return <a.h1>{props.id.to(Math.round)}</a.h1>;
}
