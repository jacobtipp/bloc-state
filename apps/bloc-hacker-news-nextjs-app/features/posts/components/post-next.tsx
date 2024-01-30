import { useBlocInstance, usePropListener } from '@jacobtipp/react-bloc';
import { PostBloc } from '../bloc/posts.bloc';
import { useQueryState, parseAsInteger } from 'nuqs';
import { useEffect, useState } from 'react';
export function PostNext() {
  console.log('postNextRendered');
  const [shouldFetch, setShouldFetch] = useState(false);
  const postBloc = useBlocInstance(PostBloc);

  const [id, setId] = useQueryState(
    'id',
    parseAsInteger
      .withOptions({
        history: 'push',
      })
      .withDefault(postBloc.state.data.postId.currentId)
  );

  useEffect(() => {
    if (!shouldFetch) return;
    const id = setInterval(() => setId((id) => id + 1), 100);
    return () => {
      clearInterval(id);
    };
  }, [shouldFetch]);

  usePropListener(
    id,
    {
      listenWhen: (previous, current) => previous !== current,
      listener: (currentId) => {
        postBloc.getPost(currentId);
      },
    },
    [postBloc]
  );

  return (
    <button
      onMouseOver={() => setShouldFetch(!shouldFetch)}
      onClick={() => {
        setId((id) => id + 1);
      }}
    >
      <div>→</div>
    </button>
  );
}
