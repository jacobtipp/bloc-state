import { useBlocInstance, usePropListener } from '@jacobtipp/react-bloc';
import { PostBloc } from '../bloc/posts.bloc';
import { useQueryState, parseAsInteger } from 'nuqs';
export function PostNext() {
  console.log('postNextRendered');
  const postBloc = useBlocInstance(PostBloc);

  const [id, setId] = useQueryState(
    'id',
    parseAsInteger
      .withOptions({
        history: 'push',
      })
      .withDefault(postBloc.state.data.postId.currentId)
  );

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
      onClick={() => {
        setId((id) => id + 1);
      }}
    >
      <div>→</div>
    </button>
  );
}
