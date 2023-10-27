import Parser from 'html-react-parser';
import { useBlocSelector } from '@jacobtipp/react-bloc';
import { PostBloc } from '../bloc';

export function PostDetails() {
  const details = useBlocSelector(PostBloc, {
    selector: (state) => state.data.details,
    suspendWhen: (state) => state.status === 'loading',
  });
  const { by, text, time, title, url } = details;

  return (
    <>
      <h2>{by}</h2>
      <h6>{new Date(time * 1000).toLocaleDateString('en-US')}</h6>
      {title && <h4>{title}</h4>}
      {url && <a href={url}>{url}</a>}
      {text && <div>{Parser(text)}</div>}
    </>
  );
}
